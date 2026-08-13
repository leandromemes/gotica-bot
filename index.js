/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author ༄ Đev Šoberano ×͜×
 * @link https://github.com/leandromemes
 * @project ༄ Đev Šoberano ×͜× - ANTI-CRASH SYSTEM
 */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './settings.js'
import { watchFile, unwatchFile, readdirSync, existsSync, mkdirSync, readFileSync } from 'fs'
import cfonts from 'cfonts'
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
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } from '@whiskeysockets/baileys'
import qrcodeTerminal from 'qrcode-terminal'

// Cache de duplicidade para eventos de boas-vindas / saída
const welcomeEventCache = new Set()

// --- [ CONFIGURAÇÃO FIREBASE ] ---
import admin from 'firebase-admin'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let dbFirebase = { ref: () => ({ on: () => {}, update: () => {} }) }; 
try {
    const serviceAccount = require("./serviceAccountKey.json");
    if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://cybersoberano-default-rtdb.firebaseio.com" 
        })
    }
    dbFirebase = admin.database()
} catch (e) {
    console.log(chalk.red.bold("\n[⚠️] FIREBASE: Erro nas credenciais."))
}
const msgRetryCounterCache = new NodeCache()
const { chain } = lodash
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!global.opts['db']) global.opts['db'] = './src/database/database.json'
if (!global.isProtoInitialized) {
    try {
        protoType()
        serialize()
        global.isProtoInitialized = true
    } catch (e) {}
}
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
console.clear()
cfonts.say('Gotica Bot', { font: 'chrome', align: 'center', gradient: ['#ff4fcb', '#ff77ff'] })
cfonts.say('feito por: Dev Soberano', { font: 'console', align: 'center', colors: ['cyan'] })
const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
const { version } = await fetchLatestBaileysVersion();
console.log(chalk.cyan(`📱 Usando versão do WhatsApp: ${version.join('.')}`))
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
let usePairingCode = false 
if (!state.creds.registered) {
    const opcao = await question(chalk.bold.cyan("\n[?] Escolha o método de conexão:\n1. QR Code (Terminal)\n2. Código de Pareamento (Número)\n---> "))
    usePairingCode = opcao === '2'
}
const connectionOptions = {
    logger: pino({ level: 'silent' }),
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    syncFullHistory: false,
    msgRetryCounterCache,
    version,
    defaultQueryTimeoutMs: 60000, 
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
    retryRequestDelayMs: 2500,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
            message.buttonsMessage ||
            message.templateMessage ||
            message.listMessage
        );
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    },
}
global.conn = makeWASocket(connectionOptions);
if (usePairingCode && !conn.authState.creds.registered) {
    let phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`\n✦ Digite o número com DDD:\n---> `)))
    phoneNumber = phoneNumber.replace(/\D/g, '')
    try {
        let code = await conn.requestPairingCode(phoneNumber)
        code = code?.match(/.{1,4}/g)?.join("-") || code
        console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ SEU CÓDIGO É: ${code} ✧`)))
    } catch (e) { console.log(chalk.red("\n[❌] Erro ao solicitar código.")) }
}
let handler = await import('./handler.js')
let isReconnecting = false
let reconnectAttempts = 0
let reconnectTimer = null
const RECONNECT_BASE_DELAY_MS = 2000
const RECONNECT_MAX_DELAY_MS = 30000
function scheduleReconnect() {
    if (reconnectTimer) return
    const delay = Math.min(
        RECONNECT_BASE_DELAY_MS * Math.pow(2, reconnectAttempts),
        RECONNECT_MAX_DELAY_MS
    )
    reconnectAttempts++
    console.log(chalk.yellow(`[!] Reconectando em ${Math.round(delay / 1000)}s (tentativa ${reconnectAttempts})...`))
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        global.reloadHandler(true)
    }, delay)
}

const getGroupAdmins = (participants) => {
    return participants ? participants.filter(v => v.admin !== null).map(v => v.jid || v.id) : [];
};

global.reloadHandler = async function (restatConn) {
    if (restatConn) {
        if (isReconnecting) {
            console.log(chalk.yellow("[!] Reconexão já em andamento, ignorando pedido duplicado."))
            return true
        }
        isReconnecting = true
        try { global.conn.ws.close() } catch { }
        global.conn = makeWASocket(connectionOptions)
    }
    
    if (typeof global.conn.handler === 'function') {
        global.conn.ev.off('messages.upsert', global.conn.handler)
    }
    if (typeof global.conn.participantsUpdate === 'function') {
        global.conn.ev.off('group-participants.update', global.conn.participantsUpdate)
    }
    if (typeof global.conn.connectionUpdate === 'function') {
        global.conn.ev.off('connection.update', global.conn.connectionUpdate)
    }
    if (typeof global.conn.credsUpdate === 'function') {
        global.conn.ev.off('creds.update', global.conn.credsUpdate)
    }

    global.conn.ws.removeAllListeners('encrypted-message');

    // --- [ SISTEMA ANTI-FLOOD INVISÍVEL (WEBSOCKET) ] ---
    global.conn.ws.on('encrypted-message', async ({ from, sender, detection }) => {
        const temSufixoDevice = /:[0-9]+@lid/.test(sender || '');
        if (!from?.endsWith('@g.us') || !sender || !detection?.hasSkmsg || !temSufixoDevice) return;
        try {
            const caminhoAntigo = `./DADOS DO YUTA/grupos/ATIVAÇÕES-YUTA/${from}.json`;
            const caminhoGotica = `./src/database/grupos/${from}.json`;
            let caminho = existsSync(caminhoGotica) ? caminhoGotica : caminhoAntigo;
            if (!existsSync(caminho)) return;
            const jsonGp = JSON.parse(readFileSync(caminho));
            const config = Array.isArray(jsonGp) ? jsonGp[0] : jsonGp;

            if (!config?.antilinkgp && !config?.antiflood && !config?.antifloodgp) return;

            let grpmdt;
            try { grpmdt = await global.conn.groupMetadata(from) } catch { return }
            if (!grpmdt?.id.endsWith('@g.us')) return;
            const membros_ = grpmdt.participants;
            const groupAdmins_ = getGroupAdmins(membros_);
            const normalizar = alvo => {
                if (!alvo) return alvo;
                if (alvo.includes('@lid') && membros_) {
                    const lidBase = alvo.split(':')[0] + '@lid';
                    const encontrado = membros_.find(v => v.lid === lidBase)?.jid;
                    return encontrado || alvo;
                }
                return alvo;
            };
            const participante = normalizar(sender);
            const NumeroDoBot = global.conn.user.id.split(':')[0];
            if (participante.startsWith(NumeroDoBot)) return;
            if (groupAdmins_.includes(participante)) return;
            const botMembro = membros_.find(v => (v.jid || v.id)?.startsWith(NumeroDoBot));
            const botJid = botMembro?.jid || botMembro?.id;
            if (!botJid || !groupAdmins_.includes(botJid)) return;

            console.log(`[ANTI-FLOOD] Removendo ${participante} de ${from}...`);
            await global.conn.groupParticipantsUpdate(from, [participante], 'remove');
            const numeroBanido = participante.split('@')[0];
            await global.conn.sendMessage(from, {
                text: `🤨 *SISTEMA DE SEGURANÇA* \n\n@${numeroBanido} foi removido do grupo por *envio de mensagens invisíveis/sistema ativado*.`,
                mentions: [participante]
            });
        } catch (e) {
            console.log('Erro no detector do WebSocket:', e);
        }
    });

    // Remove listener antigo antes de registrar, evitando duplicação em
    // reconexões/reloads sucessivos.
    if (global.conn.antiRouboHandler) {
        global.conn.ev.off('group-participants.update', global.conn.antiRouboHandler);
    }

    // --- [ SISTEMA ANTI-ROUBO DE GRUPO ] ---
    global.conn.antiRouboHandler = async (event) => {
        try {
            const { id: chatId, participants, action, author } = event;
            if (!chatId?.endsWith('@g.us')) return;
            if (action !== 'promote' && action !== 'demote') return;
            if (!author) return;

            const caminhoAntigo = `./DADOS DO YUTA/grupos/ATIVAÇÕES-YUTA/${chatId}.json`;
            const caminhoGotica = `./src/database/grupos/${chatId}.json`;
            let caminho = existsSync(caminhoGotica) ? caminhoGotica : caminhoAntigo;
            if (!existsSync(caminho)) return;

            const jsonGp = JSON.parse(readFileSync(caminho));
            const config = Array.isArray(jsonGp) ? jsonGp[0] : jsonGp;
            if (!config?.antiroubo || !config.antiroubo.active) return;

            let grpmdt;
            try { grpmdt = await global.conn.groupMetadata(chatId) } catch { return }
            if (!grpmdt?.id.endsWith('@g.us')) return;

            const membros_ = grpmdt.participants || [];

            const extrairId = (p) => {
                if (!p) return null;
                if (typeof p === 'string') return p;
                if (typeof p === 'object') return p.id || p.jid || p.phoneNumber || null;
                return null;
            };
            const normalizar = (alvo) => {
                if (!alvo || typeof alvo !== 'string') return alvo;
                if (alvo.includes('@lid') && membros_) {
                    const lidBase = alvo.split(':')[0] + '@lid';
                    const encontrado = membros_.find(v => v.lid === lidBase)?.jid || membros_.find(v => v.lid === lidBase)?.id;
                    return encontrado || alvo;
                }
                return alvo;
            };

            const alvoRaw = extrairId(participants?.[0]);
            const alvo = normalizar(alvoRaw);
            const quemExecutou = normalizar(extrairId(author) || author);

            if (!alvo || !quemExecutou) return;

            const botNum = global.conn.user?.id?.split(':')[0]?.split('@')[0];
            const selfIds = new Set();
            if (botNum) {
                for (const p of membros_) {
                    const candidatos = [p.id, p.jid, p.lid, p.phoneNumber].filter(Boolean);
                    const bate = candidatos.some(c => String(c).split(':')[0].split('@')[0] === botNum);
                    if (bate) candidatos.forEach(c => selfIds.add(c));
                }
            }
            const ehSelf = (id) => {
                if (!id) return false;
                if (selfIds.has(id)) return true;
                const numOnly = String(id).split(':')[0].split('@')[0];
                for (const s of selfIds) {
                    if (String(s).split(':')[0].split('@')[0] === numOnly) return true;
                }
                return false;
            };

            if (ehSelf(quemExecutou) || ehSelf(alvo)) return;

            const permitidos = config.antiroubo.permitidos || [];
            const donosNumeros = (Array.isArray(global.owner) ? global.owner : [])
                .map(o => String(o[0] || '').replace(/\D/g, ''))
                .filter(Boolean);

            const quemExecutouNum = quemExecutou.split(':')[0].split('@')[0].replace(/\D/g, '');
            const isPermitido =
                donosNumeros.includes(quemExecutouNum) ||
                permitidos.includes(quemExecutou) ||
                permitidos.includes(quemExecutouNum);

            if (isPermitido) return;

            if (/:[0-9]+@lid$/.test(alvo) || /:[0-9]+@lid$/.test(quemExecutou)) {
                console.log('[ANTI-ROUBO] JID não resolvido corretamente, ignorando ação para evitar erro.');
                return;
            }

            const acaoTexto = action === 'promote' ? 'promover' : 'rebaixar';
            const acaoRevertida = action === 'promote' ? 'promovido' : 'rebaixado';

            let sucessoAlvo = false;
            let sucessoExecutor = false;
            try {
                const acaoReverter = action === 'promote' ? 'demote' : 'promote';
                await global.conn.groupParticipantsUpdate(chatId, [alvo], acaoReverter);
                sucessoAlvo = true;
            } catch (e) {
                console.log('[ANTI-ROUBO] Falha ao reverter alvo:', e.message);
            }

            await new Promise(r => setTimeout(r, 1200));

            try {
                await global.conn.groupParticipantsUpdate(chatId, [quemExecutou], 'demote');
                sucessoExecutor = true;
            } catch (e) {
                console.log('[ANTI-ROUBO] Falha ao punir executor:', e.message);
            }

            const avisoFalha = (!sucessoAlvo || !sucessoExecutor)
                ? '\n\n⚠️ Uma das ações de correção falhou (verifique se ainda sou admin do grupo).'
                : '';

            const msgAlerta = `*🔒 𝐀𝐍𝐓𝐈-𝐑𝐎𝐔𝐁𝐎 𝐃𝐄 𝐆𝐑𝐔𝐏𝐎 🔒*\n*ᴀᴄ̧ᴀ̃ᴏ ʙʟᴏǫᴜᴇᴀᴅᴀ!*\n*ᴏ ᴀᴅᴍ @${quemExecutou.split('@')[0]} ᴛᴇɴᴛᴏᴜ ${acaoTexto} @${alvo.split('@')[0]} sᴇᴍ ᴘᴇʀᴍɪssᴀ̃ᴏ.*\n*ᴀᴄᴀᴏ: ${acaoRevertida} ʀᴇᴠᴇʀᴛɪᴅᴏ ᴇ ᴇxᴇᴄᴜᴛᴏʀ ʀᴇʙᴀɪxᴀᴅᴏ.*${avisoFalha}\n> _Apenas admins autorizados podem promover/rebaixar neste grupo._`;

            await global.conn.sendMessage(chatId, {
                text: msgAlerta,
                mentions: [quemExecutou, alvo]
            }).catch(() => {});

        } catch (e) {
            console.log('[ANTI-ROUBO] Erro geral:', e);
        }
    };

    global.conn.ev.on('group-participants.update', global.conn.antiRouboHandler);

    const currentHandler = handler.handler || handler.default?.handler || handler.default || handler;
    global.conn.handler = async (chatUpdate) => {
        try { 
            await currentHandler.call(global.conn, chatUpdate) 
        } catch (e) { 
            console.error(e) 
        }
    }
    

    // --- [ MANIPULADOR DIRETO DE ENTRADA E SAÍDA COM BOTÃO DE CANAL / NEWSLETTER ] ---
    global.conn.participantsUpdate = async (update) => {
        try {
            const { id: grupoId, participants, action } = update
            if (!grupoId || !grupoId.endsWith('@g.us') || !participants || !participants.length) return
            if (action !== 'add' && action !== 'remove' && action !== 'leave') return

            const cleanFrom = grupoId.split('@')[0] + '@g.us'
            const caminhoGotica = join(process.cwd(), 'src', 'database', 'grupos', `${cleanFrom}.json`)
            const caminhoYuta = join(process.cwd(), 'DADOS DO YUTA', 'grupos', 'ATIVAÇÕES-YUTA', `${cleanFrom}.json`)
            
            let filePath = existsSync(caminhoGotica) ? caminhoGotica : (existsSync(caminhoYuta) ? caminhoYuta : null)
            let jsonGp = {}

            if (filePath) {
                try {
                    const rawData = JSON.parse(readFileSync(filePath, 'utf-8'))
                    jsonGp = Array.isArray(rawData) ? (rawData[0] || {}) : rawData
                } catch (e) {}
            }

            const wl0 = Array.isArray(jsonGp.wellcome) ? jsonGp.wellcome[0] : (jsonGp.wellcome || {})

            const isWelcomeEnabled = jsonGp.bemvindo === true || wl0.bemvindo1 === true || wl0.wellcome === true || jsonGp.welcome === true
            const isExitEnabled = jsonGp.exit?.enabled === true || jsonGp.bemvindo === true || wl0.bemvindo1 === true || wl0.legendasaiu != null || jsonGp.legendasaida != null || jsonGp.exit?.text != null

            if (action === 'add' && !isWelcomeEnabled) return
            if ((action === 'remove' || action === 'leave') && !isExitEnabled) return

            let mdata = await global.conn.groupMetadata(grupoId).catch(() => ({}))
            const subject = mdata.subject || 'Grupo'
            const desc = mdata.desc || ''

            for (let participante of participants) {
                // CORREÇÃO: Garante que participante é processado como string de JID
                let rawId = typeof participante === 'string' ? participante : (participante?.id || participante?.jid);
                if (!rawId) continue;

                const userJid = rawId.includes('@') ? rawId : rawId + '@s.whatsapp.net'
                const userNumber = userJid.split('@')[0]

                const cacheKey = `${grupoId}_${userJid}_${action}`
                if (welcomeEventCache.has(cacheKey)) continue
                welcomeEventCache.add(cacheKey)
                setTimeout(() => welcomeEventCache.delete(cacheKey), 5000)

                const formatMessageText = (txt) => {
                    if (!txt) return ''
                    return txt
                        .replace(/#nomedogp#/g, subject)
                        .replace(/#numerodele#/g, `@${userNumber}`)
                        .replace(/#descrição#/g, desc)
                        .replace(/@user/g, `@${userNumber}`)
                        .replace(/@subject/g, subject)
                }

                const isWelcome = action === 'add';

                const defaultText = isWelcome ?
                    (jsonGp.textbv || wl0.legendabv ? (jsonGp.textbv || wl0.legendabv) : "✨ Seja bem-vindo(a), #numerodele#\n\nApresente-se com:\n\n📝 *Nome:*\n📸 *Foto:*\n🎂 *Idade:*\n\nSiga as regras para não ser banido! 👑") :
                    (jsonGp.exit && jsonGp.exit.text ? jsonGp.exit.text : (wl0.legendasaiu || "╭━⊱ 👋 *ATÉ LOGO!* 👋 ⊱━╮\n│\n│ 👤 #numerodele#\n│\n│ 🚪 Saiu do grupo\n│ *#nomedogp#*\n│\n╰━━━━━━━━━━━━━━━━━━╯"));

                const text = formatMessageText(defaultText);

                let profilePicUrl = 'https://raw.githubusercontent.com/nazuninha/uploads/main/outros/1747053564257_bzswae.bin';
                try {
                    const pp = await global.conn.profilePictureUrl(userJid, 'image');
                    if (pp) profilePicUrl = pp;
                } catch {
                    const fallbackLocalPath = join(process.cwd(), 'media', 'neutra.jpg');
                    if (existsSync(fallbackLocalPath)) {
                        profilePicUrl = fallbackLocalPath;
                    }
                }

                const mentions = [userJid];

                let msgObject = {
                    image: profilePicUrl.startsWith('http') ? { url: profilePicUrl } : readFileSync(profilePicUrl),
                    caption: text,
                    mentions: mentions,
                    contextInfo: {
                        mentionedJid: mentions,
                        isForwarded: true,
                        forwardingScore: 1,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363424960344776@newsletter',
                            newsletterName: '༄ Đev Šoberano ×͜×',
                            serverMessageId: 0
                        }
                    }
                };

                await global.conn.sendMessage(grupoId, msgObject).catch(async (e) => {
                    console.error('[ERRO AO ENVIAR WELCOME/EXIT]:', e);
                });
            }
        } catch (e) {
            console.error('[PARTICIPANTS UPDATE ERROR]:', e)
        }
    }
    
    global.conn.connectionUpdate = async (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr && !usePairingCode) {
            console.log(chalk.bold.yellow("\n[!] Escaneie o QR Code abaixo para conectar:"))
            try {
                qrcodeTerminal.generate(qr, { small: true })
            } catch (err) {
                console.log(chalk.gray(`QR Data: ${qr}`))
            }
        }
        if (connection == 'open') {
            console.log(chalk.bold.green('\n[SUCCESS] ༄ Đev Šoberano ×͜× | Bot Online!'))
            isReconnecting = false
            reconnectAttempts = 0
        }
        
        if (connection === 'close') {
            const boomError = new Boom(lastDisconnect?.error)
            const reason = boomError?.output?.statusCode
            console.log(chalk.red(`\n[!] Conexão fechada. Razão: ${reason}`))
            isReconnecting = false
            
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.bgRed.white(" [!] SESSÃO DESLOGADA. Apague a pasta de sessão e escaneie novamente. "))
                return
            }
            scheduleReconnect()
        }
    }
    
    global.conn.credsUpdate = saveCreds.bind(global.conn)
    global.conn.ev.on('messages.upsert', global.conn.handler)
    global.conn.ev.on('group-participants.update', global.conn.participantsUpdate)
    global.conn.ev.on('connection.update', global.conn.connectionUpdate)
    global.conn.ev.on('creds.update', global.conn.credsUpdate)
    return true
};

process.on('uncaughtException', function (err) {
    if (err.message?.includes('Cannot redefine property')) return;
    if (err.message?.includes('Connection Closed') || err.message?.includes('428')) return;
    console.error('ERRO CRÍTICO NO SISTEMA:', err);
});

const pluginFolder = join(__dirname, 'plugins')
global.plugins = {}
async function loadPlugins() {
    for (const filename of readdirSync(pluginFolder).filter(f => f.endsWith('.js'))) {
        const file = join(pluginFolder, filename)
        try {
            const fileUrl = pathToFileURL(file).href
            const module = await import(fileUrl + '?update=' + Date.now())
            global.plugins[filename] = module.default || module
        } catch (e) { }
        unwatchFile(file) 
        watchFile(file, async () => {
            try {
                const fileUrl = pathToFileURL(file).href
                const module = await import(fileUrl + '?update=' + Date.now())
                global.plugins[filename] = module.default || module
            } catch (e) { }
        })
    }
}

const handlerPath = join(__dirname, 'handler.js')
unwatchFile(handlerPath)
watchFile(handlerPath, async () => {
    try {
        const freshHandler = await import(`./handler.js?update=${Date.now()}`)
        handler = freshHandler
        await global.reloadHandler()
    } catch (e) { }
})

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Atualizado 'index.js'"))
    import(pathToFileURL(file).href + `?update=${Date.now()}`)
})

await loadPlugins()
await global.reloadHandler()