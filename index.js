process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './settings.js'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import fs, { existsSync, mkdirSync, readdirSync } from 'fs'
import yargs from 'yargs'
import lodash from 'lodash'
import chalk from 'chalk'
import pino from 'pino' 
import path, { join } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import readline from 'readline'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } from '@whiskeysockets/baileys'

const { chain } = lodash

// --- CONFIGURAÇÃO ---
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!global.opts['db']) global.opts['db'] = './database.json'

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; 
global.__dirname = function dirname(pathURL) {
    return path.dirname(global.__filename(pathURL, true))
}; 

const __dirname = global.__dirname(import.meta.url)
const sessionPath = join(__dirname, global.Rubysessions || 'session')
if (!existsSync(sessionPath)) mkdirSync(sessionPath, { recursive: true })

// --- DATABASE ---
const dbPath = join(__dirname, 'src', 'database')
if (!existsSync(dbPath)) mkdirSync(dbPath, { recursive: true })
global.db = new Low(new JSONFile(join(dbPath, 'database.json')))
global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return
    await global.db.read().catch(console.error)
    global.db.data = { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {}, ...(global.db.data || {}) }
}
loadDatabase()

// --- INTERFACE ---
console.clear()
cfonts.say('Gotica Bot', { font: 'chrome', align: 'center', gradient: ['#ff4fcb', '#ff77ff'] })
cfonts.say('dev: leandro rocha', { font: 'console', align: 'center', colors: ['blueBright'] })

const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
const { version } = await fetchLatestBaileysVersion();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // DESATIVADO QR CODE
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    version,
}

global.conn = makeWASocket(connectionOptions);

// --- LÓGICA DE CÓDIGO DE 8 DÍGITOS ---
if (!conn.authState.creds.registered) {
    console.log(chalk.bold.cyan("\n[!] SISTEMA DE CÓDIGO DE PAREAMENTO INICIADO..."))
    
    let phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`\n✦ Digite o número do WhatsApp (ex: 553891176144):\n---> `)))
    phoneNumber = phoneNumber.replace(/\D/g, '')

    // Delay de segurança para o socket estabilizar
    await new Promise(resolve => setTimeout(resolve, 5000))

    try {
        let code = await conn.requestPairingCode(phoneNumber)
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ SEU CÓDIGO DE 8 DÍGITOS ✧`)), chalk.bold.white(code))
    } catch (e) {
        console.log(chalk.red("\n[❌] Erro ao gerar código. Verifique se o número está correto e tente novamente."))
    }
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
        }
    }
}

let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
    if (restatConn) {
        try { global.conn.ws.close() } catch { }
        global.conn = makeWASocket(connectionOptions)
    }
    conn.ev.on('messages.upsert', handler.handler.bind(conn))
    conn.ev.on('connection.update', connectionUpdate.bind(conn))
    conn.ev.on('creds.update', saveCreds.bind(conn))
};

const pluginFolder = join(__dirname, 'plugins')
global.plugins = {}
async function loadPlugins() {
    for (const filename of readdirSync(pluginFolder).filter(f => f.endsWith('.js'))) {
        try {
            const file = join(pluginFolder, filename)
            const module = await import(pathToFileURL(file).href)
            global.plugins[filename] = module.default || module
        } catch (e) {
            console.error(e)
        }
    }
}

await loadPlugins()
await global.reloadHandler()