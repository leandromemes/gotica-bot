/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot - ANTI-CRASH & PERFORMANCE
 */

import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'

const isNumber = x => typeof x === 'number' && !isNaN(x)

// Cache global para evitar consultas repetitivas ao WhatsApp (Erro 429)
if (!global.groupCache) global.groupCache = {}

// Verifica se o remetente é dono, comparando contra TODAS as entradas de
// global.owner (não só a primeira), cobrindo tanto formato de número
// (@s.whatsapp.net) quanto LID (@lid).
function checkIsSoberano(sender, senderNum, m) {
    if (m.fromMe) return true
    if (!sender) return false

    const ownerList = Array.isArray(global.owner) ? global.owner : []

    for (const entry of ownerList) {
        const ownerId = String(entry[0] || '').trim()
        if (!ownerId) continue

        // Comparação direta com o sender completo (cobre "25886472585277@lid")
        if (sender === ownerId) return true

        // Comparação só pelos dígitos (cobre "5574991940377" vs "557491940377"
        // e o mesmo número com/sem sufixo @s.whatsapp.net ou @lid)
        const ownerDigits = ownerId.replace(/[^0-9]/g, '')
        if (ownerDigits && senderNum && ownerDigits === senderNum) return true
    }

    return false
}

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return
    
    let rawM = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!rawM) return;
    if (rawM.key && rawM.key.remoteJid === 'status@broadcast') return 

    if (global.db.data == null) await global.loadDatabase()

    // ── CAPTURA DO CLIQUE DE BOTÃO ANTES DO smsg() ──────────────────────────
    // O smsg() reconstrói a mensagem via proto.WebMessageInfo.fromObject(),
    // que usa o schema protobuf embutido na lib baileys instalada. Se esse
    // schema for de uma versão mais antiga (comum em forks/aliases como
    // "npm:angularsockets"), o campo interactiveResponseMessage (usado nos
    // cliques de botão) não existe no schema e é descartado silenciosamente
    // na conversão. Por isso capturamos o botão AQUI, direto do objeto cru,
    // antes que ele passe pelo smsg().
    let rawBtnId = null
    try {
        const rawInteractive = rawM.message?.interactiveResponseMessage
        if (rawInteractive?.nativeFlowResponseMessage?.paramsJson) {
            rawBtnId = JSON.parse(rawInteractive.nativeFlowResponseMessage.paramsJson)?.id || null
        } else if (rawM.message?.templateButtonReplyMessage?.selectedId) {
            rawBtnId = rawM.message.templateButtonReplyMessage.selectedId
        } else if (rawM.message?.buttonsResponseMessage?.selectedButtonId) {
            rawBtnId = rawM.message.buttonsResponseMessage.selectedButtonId
        } else if (rawM.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
            rawBtnId = rawM.message.listResponseMessage.singleSelectReply.selectedRowId
        }
    } catch (captureErr) {
        console.error('[BTN-CAPTURE] Erro ao capturar clique de botão:', captureErr)
    }

    try {
        let m = smsg(this, rawM) || rawM
        if (!m) return

        // Se capturamos um botão no objeto cru, ele tem prioridade sobre
        // qualquer texto que o smsg() tenha (ou não) preservado.
        let bodyText = rawBtnId || m.text || ''

        if (!rawBtnId && m.message) {
            const btnId = m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson 
                ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id
                : null
            
            if (btnId) {
                bodyText = btnId
            } else if (m.message.templateButtonReplyMessage?.selectedId) {
                bodyText = m.message.templateButtonReplyMessage.selectedId
            } else if (m.message.buttonsResponseMessage?.selectedButtonId) {
                bodyText = m.message.buttonsResponseMessage.selectedButtonId
            }
        }

        const botId = this.user.jid.split('@')[0];
        const sender = m.sender;
        const senderNum = sender?.split('@')[0] || '';
        
        // Identificação prioritária do Šoberano (Dono) — comparando contra
        // TODAS as entradas de global.owner, cobrindo LID e número.
        const isSoberano = checkIsSoberano(sender, senderNum, m) || senderNum === botId

        if (sender) {
            // CORREÇÃO ANTI-CRASH (users): garante que o objeto do usuário exista
            // antes de ler propriedades.
            let user = global.db.data.users[sender]
            if (typeof user !== 'object') global.db.data.users[sender] = {}
            
            // Verifica banimento com segurança para não dar erro de 'undefined'
            if (global.db.data.users[sender]?.banned && !isSoberano) return
        }

        if (m.chat) {
            // CORREÇÃO ANTI-CRASH (chats): garante que o objeto do chat exista
            // antes de qualquer plugin tentar ler/escrever propriedades nele
            // (ex: chat.modoreal, chat.welcome, chat.antilink, etc). Sem isso,
            // qualquer plugin que faça "chat.algumaCoisa = valor" quebra com
            // "Cannot set properties of undefined" no primeiro uso em um chat
            // ainda não registrado no banco.
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        }

        let _prefix = global.prefix || '/'
        let usedPrefix
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let match = new RegExp(str2Regex(_prefix)).exec(bodyText)

        if (match && (usedPrefix = match[0])) {
            let noPrefix = bodyText.replace(usedPrefix, '').trim()
            let [command] = noPrefix.split` `.filter(v => v)
            command = (command || '').toLowerCase()
            const args = noPrefix.split` `.slice(1)
            const text = args.join(' ')

            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin || plugin.disabled) continue

                let isAccept = Array.isArray(plugin.command) 
                    ? plugin.command.includes(command) 
                    : plugin.command instanceof RegExp 
                        ? plugin.command.test(command) 
                        : plugin.command === command

                if (!isAccept) continue

                // EXECUÇÃO ASYNC PARA NÃO TRAVAR O BOT
                (async () => {
                    try {
                        // Cooldown inteligente para evitar Rate-Limit do WhatsApp
                        const isEcon = ['apostar', 'cassino', 'vadiar', 'trabalhar', 'salario', 'roubar'].includes(command);
                        this.cooldown = this.cooldown || {}
                        let cdTime = isEcon ? 2500 : 1000; 

                        if (!isSoberano && (Date.now() - (this.cooldown[sender] || 0)) < cdTime) return
                        this.cooldown[sender] = Date.now()

                        // Log de comando no console
                        console.log(chalk.black(chalk.bgCyan(` BOT ${botId} `)), chalk.black(chalk.bgWhite(` ${command} `)), `de ${chalk.green(m.pushName || senderNum)}`)

                        // Gerenciamento de Metadata com Cache de 5 minutos (Evita Erro 429 - Many Requests)
                        let groupMetadata = {}
                        if (m.isGroup) {
                            const agora = Date.now()
                            if (global.groupCache[m.chat] && (agora - global.groupCache[m.chat].lastUpdate < 300000)) {
                                groupMetadata = global.groupCache[m.chat].metadata
                            } else {
                                groupMetadata = await this.groupMetadata(m.chat).catch(() => ({}))
                                if (groupMetadata.id) {
                                    global.groupCache[m.chat] = { metadata: groupMetadata, lastUpdate: agora }
                                }
                            }
                        }

                        let participants = groupMetadata.participants || []
                        let isAdmin = m.isGroup ? participants.find(u => (u.id || u.jid) === sender)?.admin : false
                        let isBotAdmin = m.isGroup ? participants.find(u => (u.id || u.jid) === this.user.jid)?.admin : false

                        // Verificações de Permissão
                        if (plugin.owner && !isSoberano) return m.reply(global.dfail('owner'))
                        if (plugin.group && !m.isGroup) return m.reply(global.dfail('group'))
                        if (plugin.admin && !isAdmin && !isSoberano) return m.reply(global.dfail('admin'))

                        // Executa diretamente sem delay desnecessário
                        // usedPrefix e isOwner são repassados para os plugins usarem.
                        await plugin.call(this, m, { 
                            conn: this, args, command, text, usedPrefix,
                            participants, groupMetadata, isSoberano, isOwner: isSoberano,
                            isAdmin, isBotAdmin
                        })
                    } catch (err) {
                        if (err.message?.includes('rate-overlimit')) {
                            console.log(chalk.bgRed.white(` [!] LIMITE DE REQUISIÇÕES ATINGIDO: ${command} `))
                        } else {
                            console.error(err)
                        }
                    }
                })()
                break 
            }
        }
    } catch (e) {
        console.error(e)
    }
}

// Mensagens padrão de falha
global.dfail = (type) => {
    return {
        owner: '༄ Đev Šoberano ×͜× | Comando exclusivo do meu mestre!',
        admin: '༄ Đev Šoberano ×͜× | Você precisa ser ADM para usar isso.',
        group: '༄ Đev Šoberano ×͜× | Este comando só funciona em grupos.'
    }[type]
};

// Auto-Reload do Handler ao salvar o arquivo
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
    unwatchFile(file);
    console.log(chalk.bold.greenBright(`[HANDLER UPDATED] - ༄ Đev Šoberano ×͜×`));
});