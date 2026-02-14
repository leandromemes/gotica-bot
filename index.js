/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║  ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './settings.js'
import { watchFile, unwatchFile, readdirSync, unlinkSync, existsSync, mkdirSync, readFileSync } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import yargs from 'yargs'
import lodash from 'lodash'
import chalk from 'chalk'
import pino from 'pino' 
import path, { join } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import readline from 'readline'
import NodeCache from 'node-cache'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason, jidNormalizedUser } from '@whiskeysockets/baileys'

const msgRetryCounterCache = new NodeCache()

process.on('uncaughtException', (err) => {
    if (err.message.includes('ETIMEDOUT') || err.message.includes('127.0.0.1') || err.message.includes('ECONNRESET')) return
    console.error('Erro Crítico:', err)
})

const { chain } = lodash
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!global.opts['db']) global.opts['db'] = './src/database/database.json'

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; 
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}; 

const __dirname = global.__dirname(import.meta.url)
const sessionPath = join(__dirname, global.GoticaSession || 'session')
if (!existsSync(sessionPath)) mkdirSync(sessionPath, { recursive: true })

const dbPath = join(__dirname, 'src', 'database')
if (!existsSync(dbPath)) mkdirSync(dbPath, { recursive: true })
const databaseFile = join(dbPath, 'database.json')

global.db = new Low(new JSONFile(databaseFile))
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return
    await global.db.read().catch(console.error)
    global.db.data = { 
        users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {}, 
        ...(global.db.data || {}) 
    }
    global.db.chain = lodash.chain(global.db.data)
}
await global.loadDatabase()

if (global.db.data) {
    setInterval(async () => {
        if (global.db.data) await global.db.write().catch(() => {})
    }, 30 * 1000)
}

console.clear()
cfonts.say('Gotica Bot', { font: 'chrome', align: 'center', gradient: ['#ff4fcb', '#ff77ff'] })
cfonts.say('dev: leandro rocha', { font: 'console', align: 'center', colors: ['blueBright'] })

const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
const { version } = await fetchLatestBaileysVersion();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    syncFullHistory: false,
    msgRetryCounterCache,
    version,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
}

global.conn = makeWASocket(connectionOptions);

if (!conn.authState.creds.registered) {
    console.log(chalk.bold.cyan("\n[!] SISTEMA DE CÓDIGO DE PAREAMENTO INICIADO..."))
    let phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`\n✦ Digite o número:\n---> `)))
    phoneNumber = phoneNumber.replace(/\D/g, '')
    try {
        let code = await conn.requestPairingCode(phoneNumber)
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ SEU CÓDIGO DE 8 DÍGITOS ✧`)), chalk.bold.white(code))
    } catch (e) { console.log(chalk.red("\n[❌] Erro ao gerar código.")) }
}

async function connectionUpdate(update) {
    const { connection, lastDisconnect } = update;
    if (connection == 'open') {
        console.log(chalk.bold.green('\n[SUCCESS] ☾ Gótica Bot Conectada! ☽'))
    }
    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
        if (reason !== DisconnectReason.loggedOut) {
            global.reloadHandler(true)
        } else {
            process.exit()
        }
    }
}

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
    if (restatConn) {
        try { 
            global.conn.ws.close() 
            global.conn.ev.removeAllListeners() 
        } catch { }
        global.conn = makeWASocket(connectionOptions)
        isInit = true
    }
    
    if (!isInit) {
        global.conn.ev.off('messages.upsert', global.conn.handler)
        global.conn.ev.off('group-participants.update', global.conn.onParticipantsUpdate) // Remove ouvinte antigo
        global.conn.ev.off('connection.update', global.conn.connectionUpdate)
        global.conn.ev.off('creds.update', global.conn.credsUpdate)
    }

    // --- [ HANDLER DE MENSAGENS AJUSTADO ] --- 💋⭐
    global.conn.handler = async (chatUpdate) => {
        try {
            let m = chatUpdate.messages[chatUpdate.messages.length - 1]
            if (!m) return
            // Se for StubType (evento de sistema), ele NÃO terá .message, mas precisamos processar! ✨
            await handler.handler.call(global.conn, chatUpdate)
        } catch (e) { console.error(e) }
    }

    // --- [ NOVO: OUVER EVENTOS DE GRUPO ] --- 🖤💫
    global.conn.onParticipantsUpdate = async (anu) => {
        try {
            // Converte o evento de participante em um formato que o handler entenda
            const m = {
                key: { remoteJid: anu.id },
                messageStubType: anu.action === 'add' ? 27 : 32,
                messageStubParameters: anu.participants,
                isGroup: true
            }
            await handler.handler.call(global.conn, { messages: [m], type: 'append' })
        } catch (e) { console.error(e) }
    }

    global.conn.connectionUpdate = connectionUpdate.bind(global.conn)
    global.conn.credsUpdate = saveCreds.bind(global.conn)

    global.conn.ev.on('messages.upsert', global.conn.handler)
    global.conn.ev.on('group-participants.update', global.conn.onParticipantsUpdate) // LIGA O WELCOME 💋
    global.conn.ev.on('connection.update', global.conn.connectionUpdate)
    global.conn.ev.on('creds.update', global.conn.credsUpdate)
    
    isInit = false
    return true
};

const pluginFolder = join(__dirname, 'plugins')
global.plugins = {}

async function loadPlugins() {
    for (const filename of readdirSync(pluginFolder).filter(f => f.endsWith('.js'))) {
        const file = join(pluginFolder, filename)
        try {
            const module = await import(pathToFileURL(file).href + '?update=' + Date.now())
            global.plugins[filename] = module.default || module
        } catch (e) { console.error(`Erro em ${filename}:`, e) }

        unwatchFile(file) 
        watchFile(file, () => {
            console.log(chalk.bold.greenBright(`\n[ RESTARTING ] → `) + chalk.white(`${filename} atualizado!`))
            loadPlugins()
        })
    }
}

const handlerPath = join(__dirname, 'handler.js')
unwatchFile(handlerPath)
watchFile(handlerPath, async () => {
    console.log(chalk.bold.greenBright(`\n[ RESTARTING ] → `) + chalk.white(`handler.js atualizado!`))
    try {
        const m = await import(`./handler.js?update=${Date.now()}`)
        handler = m
        await global.reloadHandler()
    } catch (e) { console.error(e) }
})

await loadPlugins()
await global.reloadHandler()