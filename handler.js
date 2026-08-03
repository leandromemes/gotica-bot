/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗     ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣     ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩     ╚═╝ ╚═╝  ╩ 
 * @author ༄ Đev Šoberano ×͜×
 * @link https://github.com/leandromemes
 * @project Gotica Bot - ANTI-CRASH & PERFORMANCE
 */
import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { unwatchFile, watchFile, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import path, { join } from 'path'
import chalk from 'chalk'
import { WAMessageStubType } from '@whiskeysockets/baileys'

const isNumber = x => typeof x === 'number' && !isNaN(x)
if (!global.groupCache) global.groupCache = {}
if (!global.afkCooldown) global.afkCooldown = {}
if (!global.floodStore) global.floodStore = {}

const NkPetrov = (texto, mentions = [], senderJid, groupJid) => {
    return {
        requestPaymentMessage: {
            currencyCodeIso4217: 'BRL',
            amount1000: '0',
            requestFrom: senderJid || 'nobody@s.whatsapp.net',
            noteMessage: { 
                extendedTextMessage: { 
                    text: texto,
                    contextInfo: {
                        mentionedJid: mentions,
                        statusJidList: [groupJid]
                    }
                } 
            },
            amount: { value: '0', offset: 1000, currencyCode: 'BRL' },
            expiryTimestamp: Math.floor(Date.now() / 1000) + 86400
        }
    }
}

function msToTime(ms) {
    let seg = Math.floor(ms / 1000)
    let min = Math.floor(seg / 60)
    let hr = Math.floor(min / 60)
    let dia = Math.floor(hr / 24)
    let ano = Math.floor(dia / 365)
    seg %= 60
    min %= 60
    hr %= 24
    dia %= 365
    let partes = []
    if (ano) partes.push(`${ano} ano${ano > 1 ? 's' : ''}`)
    if (dia) partes.push(`${dia} dia${dia > 1 ? 's' : ''}`)
    if (hr) partes.push(`${hr} hora${hr > 1 ? 's' : ''}`)
    if (min) partes.push(`${min} minuto${min > 1 ? 's' : ''}`)
    if (seg) partes.push(`${seg} segundo${seg > 1 ? 's' : ''}`)
    return partes.length ? partes.join(', ').replace(/,([^,]*)$/, ' e$1') : 'agora há pouco'
}

export function setGp(chatJid, dataGp) {
    try {
        if (!chatJid || !chatJid.endsWith('@g.us')) return
        const cleanFrom = chatJid.split('@')[0] + '@g.us'
        const dbDir = join(process.cwd(), 'src', 'database', 'grupos')
        if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true })
        
        const filePath = join(dbDir, `${cleanFrom}.json`)
        const payload = Array.isArray(dataGp) ? dataGp : [dataGp]
        writeFileSync(filePath, JSON.stringify(payload, null, 2))
        
        if (!global.groupCache[cleanFrom]) {
            global.groupCache[cleanFrom] = {}
        }
        global.groupCache[cleanFrom].config = payload[0]
    } catch (e) {
        console.error('[SETGP ERROR]', e)
    }
}

function checkIsSoberano(sender, senderNum, m) {
    if (m.fromMe) return true
    if (!sender) return false
    const ownerList = Array.isArray(global.owner) ? global.owner : []
    for (const entry of ownerList) {
        const ownerId = String(entry[0] || '').trim()
        if (!ownerId) continue
        if (sender === ownerId) return true
        const ownerDigits = ownerId.replace(/[^0-9]/g, '')
        if (ownerDigits && senderNum && ownerDigits === senderNum) return true
    }
    return false
}

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return

    // ── CAPTURA E PROCESSAMENTO DE EVENTOS DE PARTICIPANTES (ENTRADA / SAÍDA) ──
    if (chatUpdate.id && chatUpdate.participants && chatUpdate.action) {
        const groupJid = chatUpdate.id
        const action = chatUpdate.action 
        let stubType = null
        
        if (action === 'add') stubType = WAMessageStubType.GROUP_PARTICIPANT_ADD
        else if (action === 'remove' || action === 'leave') stubType = WAMessageStubType.GROUP_PARTICIPANT_LEAVE

        for (let participant of chatUpdate.participants) {
            const fakeM = {
                chat: groupJid,
                from: groupJid,
                isGroup: true,
                messageStubType: stubType || WAMessageStubType.GROUP_PARTICIPANT_ADD,
                messageStubParameters: [participant],
                participants: [participant],
                sender: participant,
                text: '',
                body: '',
                caption: '',
                mentionedJid: [participant],
                key: { remoteJid: groupJid, participant }
            }

            try {
                let groupMetadata = await this.groupMetadata(groupJid).catch(() => ({}))
                for (let name in global.plugins) {
                    let plugin = global.plugins[name]
                    if (!plugin || plugin.disabled) continue
                    if (typeof plugin.before === 'function') {
                        await plugin.before.call(this, fakeM, { conn: this, groupMetadata })
                    }
                }
            } catch (errEvents) {
                console.error('[PARTICIPANT-EVENT ERROR]', errEvents)
            }
        }
        return
    }

    let rawM = chatUpdate.messages ? chatUpdate.messages[chatUpdate.messages.length - 1] : null
    if (!rawM) return;
    if (rawM.key && rawM.key.remoteJid === 'status@broadcast') return 
    if (global.db.data == null) await global.loadDatabase()

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

        // ── DISPARADOR DE plugin.before() PARA MENSAGENS COMUNS ──
        try {
            let beforeGroupMetadata = null
            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin || plugin.disabled) continue
                const beforeFn = typeof plugin.before === 'function' ? plugin.before : null
                if (!beforeFn) continue

                if (m.isGroup && beforeGroupMetadata === null) {
                    beforeGroupMetadata = await this.groupMetadata(m.chat).catch(() => ({}))
                }

                try {
                    await beforeFn.call(this, m, { conn: this, groupMetadata: beforeGroupMetadata || {} })
                } catch (beforeErr) {
                    console.error(`[BEFORE-PLUGIN ERROR] ${name}:`, beforeErr)
                }
            }
        } catch (beforeLoopErr) {
            console.error('[BEFORE-DISPATCH ERROR]', beforeLoopErr)
        }

        if (m.quoted) {
            if (!m.quoted.sender && m.quoted.participant) {
                m.quoted.sender = m.quoted.participant
            }
            if (!m.quoted.sender && m.quoted.key && m.quoted.key.participant) {
                m.quoted.sender = m.quoted.key.participant
            }
            if (!m.quoted.sender && m.chat && !m.isGroup) {
                m.quoted.sender = m.chat
            }
        }
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

        const rawBotJid = this.user?.id || this.user?.jid || ''
        const cleanBotJid = rawBotJid.split(':')[0].split('@')[0]
        const botId = cleanBotJid.replace(/[^0-9]/g, '')
        const botLid = (this.user?.lid || '').split(':')[0].split('@')[0]
        
        const sender = m.sender;
        const senderNum = sender?.replace(/[^0-9]/g, '') || '';
        
        const isSoberano = checkIsSoberano(sender, senderNum, m) || senderNum === botId

        if (sender) {
            let user = global.db.data.users[sender]
            if (typeof user !== 'object') global.db.data.users[sender] = {}
            
            if (m.pushName) {
                global.db.data.users[sender].name = m.pushName
                global.db.data.users[sender].pushName = m.pushName
                
                if (this.chats && this.chats[sender]) {
                    this.chats[sender].name = m.pushName
                    this.chats[sender].vname = m.pushName
                }
            }
            if (global.db.data.users[sender]?.banned && !isSoberano) return
        }
        if (m.quoted && m.quoted.sender) {
            let qSender = m.quoted.sender
            if (!global.db.data.users[qSender]) global.db.data.users[qSender] = {}
            if (m.quoted.pushName) {
                global.db.data.users[qSender].name = m.quoted.pushName
                global.db.data.users[qSender].pushName = m.quoted.pushName
                if (this.chats && this.chats[qSender]) {
                    this.chats[qSender].name = m.quoted.pushName
                    this.chats[qSender].vname = m.quoted.pushName
                }
            }
        }

        if (!global.db.data.chats) global.db.data.chats = {}
        if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
        let chatDb = global.db.data.chats[m.chat]

        let _prefix = global.prefix || '!'
        const escapedPrefix = _prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const prefixRegex = new RegExp(`^${escapedPrefix}`)
        let match = prefixRegex.exec(bodyText)
        let isEnableCmd = false
        if (match) {
            let noPref = bodyText.slice(match[0].length).trim()
            let [cmdCheck] = noPref.split` `.filter(v => v)
            if (/^(on|ligar|ativarbot|onbot)$/i.test(cmdCheck)) {
                isEnableCmd = true
            }
        }
        if (chatDb.bannedBots && chatDb.bannedBots.includes(this.user.jid) && !isEnableCmd && !isSoberano) {
            return
        }

        if (m.isGroup && !m.fromMe) {
            const cleanFrom = m.chat.split('@')[0] + '@g.us'
            const filePath = join(process.cwd(), 'src', 'database', 'grupos', `${cleanFrom}.json`)
            let dataGp = [{ ausentes: [] }]
            if (existsSync(filePath)) {
                try {
                    dataGp = JSON.parse(readFileSync(filePath, 'utf-8'))
                    if (!Array.isArray(dataGp) || dataGp.length === 0) {
                        dataGp = [{ ausentes: [] }]
                    }
                } catch (e) {
                    dataGp = [{ ausentes: [] }]
                }
            }
            if (!dataGp[0].ausentes) dataGp[0].ausentes = []
            let isAfkCommand = false
            if (match) {
                let noPref = bodyText.slice(match[0].length).trim()
                let [cmdCheck] = noPref.split` `.filter(v => v)
                if (/^(afk|ausente|off)$/i.test(cmdCheck)) {
                    isAfkCommand = true
                }
            }
            if (dataGp[0].ausentes.length > 0) {
                let afkList = dataGp[0].ausentes;
                let menc_jid2 = []
                if (m.mentionedJid && m.mentionedJid.length > 0) menc_jid2.push(...m.mentionedJid)
                if (m.quoted && m.quoted.sender) menc_jid2.push(m.quoted.sender)
                if (menc_jid2.length > 0 && !isAfkCommand) {
                    for (let targetJid of menc_jid2) {
                        if (targetJid === sender || targetJid.includes(botId)) continue
                        let afkUser = afkList.find(x => x.id === targetJid);
                        if (afkUser) {
                            const cdKey = `${m.chat}_${targetJid}`
                            const agora = Date.now()
                            if (global.afkCooldown[cdKey] && (agora - global.afkCooldown[cdKey]) < 30000) {
                                continue
                            }
                            global.afkCooldown[cdKey] = agora
                            let tempo = msToTime(agora - afkUser.hora);
                            let msgAviso = `*┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆*\n`
                            msgAviso += `*⚠️ USUÁRIO AUSENTE*\n`
                            msgAviso += `*─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🖤❈┉━━━━─*\n`
                            msgAviso += `*┇┆👤 Usuário:* @${targetJid.split('@')[0]}\n`
                            msgAviso += `*┇┆📝 Motivo:* ${afkUser.msg}\n`
                            msgAviso += `*┇┆⏱️ Ausente há:* ${tempo}\n`
                            msgAviso += `*┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ*\n`
                            await this.sendMessage(m.chat, {
                                text: msgAviso,
                                mentions: [targetJid]
                            }, { quoted: m })
                            break
                        }
                    }
                }
                let eu_afk = afkList.find(x => x.id === sender);
                if (eu_afk && !isAfkCommand) {
                    let tempo = msToTime(Date.now() - eu_afk.hora);
                    dataGp[0].ausentes = afkList.filter(x => x.id !== sender);
                    setGp(m.chat, dataGp);
                    let msgVolta = `*┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆*\n`
                    msgVolta += `*👋 BEM-VINDO(A) DE VOLTA!*\n`
                    msgVolta += `*─━━━━┉❈⏤͟͟͞͞★꙲⃝͟✨❈┉━━━━─*\n`
                    msgVolta += `*┇┆Você não está mais em modo AFK neste grupo.*\n`
                    msgVolta += `*┇┆⏱️ Tempo fora:* ${tempo}\n`
                    msgVolta += `*┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ*\n`
                    await this.sendMessage(m.chat, {
                        text: msgVolta,
                        mentions: [sender]
                    }, { quoted: m })
                }
            }
        }

        // ── LÓGICA DE ANTI-FLOOD INTEGRADAS SEM QUEBRAR O SISTEMA ──
        if (m.isGroup && chatDb.antiflood && !isSoberano) {
            let groupMetadata = await this.groupMetadata(m.chat).catch(() => ({}))
            let participants = groupMetadata.participants || []
            const checkUserAdmin = (u) => u.admin === 'admin' || u.admin === 'superadmin' || u.admin === true
            let isAdmin = !!participants.find(u => {
                const uJid = (u.id || u.jid || '')
                const uClean = uJid.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
                return (uClean === senderNum || uJid === sender) && checkUserAdmin(u)
            })

            if (!isAdmin) {
                const floodKey = `${m.chat}_${sender}`
                const now = Date.now()
                if (!global.floodStore[floodKey]) {
                    global.floodStore[floodKey] = { count: 1, lastMsgTime: now }
                } else {
                    if (now - global.floodStore[floodKey].lastMsgTime < 3000) { // Janela de 3 segundos
                        global.floodStore[floodKey].count += 1
                    } else {
                        global.floodStore[floodKey].count = 1
                    }
                    global.floodStore[floodKey].lastMsgTime = now
                }

                if (global.floodStore[floodKey].count >= 5) { // 5 mensagens seguidas
                    delete global.floodStore[floodKey]
                    let isBotAdmin = !!participants.find(u => {
                        const uJid = (u.id || u.jid || '')
                        const uClean = uJid.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
                        return (uClean === botId || uJid === rawBotJid) && checkUserAdmin(u)
                    })

                    let floodWarn = `*⚠️ ANTI-FLOOD DETECTADO*\n\n`
                    floodWarn += `@${senderNum}, evite enviar mensagens muito rápido para manter a ordem do grupo!`
                    await this.sendMessage(m.chat, { text: floodWarn, mentions: [sender] }, { quoted: m })

                    if (isBotAdmin) {
                        await this.groupParticipantsUpdate(m.chat, [sender], 'remove').catch(() => {})
                    }
                    return
                }
            }
        }

        if (match) {
            let usedPrefix = match[0]
            let noPrefix = bodyText.slice(usedPrefix.length).trim()
            let [command] = noPrefix.split` `.filter(v => v)
            command = (command || '').toLowerCase()
            const args = noPrefix.split` `.slice(1)
            const text = args.join(' ')

            let groupMetadata = {}
            if (m.isGroup) {
                groupMetadata = await this.groupMetadata(m.chat).catch(() => ({}))
            }
            let participants = groupMetadata.participants || []
            const checkUserAdmin = (u) => {
                return u.admin === 'admin' || u.admin === 'superadmin' || u.admin === true
            }
            let isAdmin = m.isGroup ? !!participants.find(u => {
                const uJid = (u.id || u.jid || '')
                const uClean = uJid.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
                return (uClean === senderNum || uJid === sender) && checkUserAdmin(u)
            }) : false
            let isBotAdmin = m.isGroup ? !!participants.find(u => {
                const uJid = (u.id || u.jid || '')
                const uClean = uJid.split(':')[0].split('@')[0].replace(/[^0-9]/g, '')
                const isMatch = uClean === botId || 
                                uJid === rawBotJid || 
                                (botLid && uJid.includes(botLid)) ||
                                (cleanBotJid && uJid.includes(cleanBotJid))
                return isMatch && checkUserAdmin(u)
            }) : false

            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin || plugin.disabled) continue
                let isAccept = false
                if (Array.isArray(plugin.command)) {
                    isAccept = plugin.command.includes(command)
                } else if (plugin.command instanceof RegExp) {
                    isAccept = plugin.command.test(command)
                } else if (typeof plugin.command === 'string') {
                    isAccept = plugin.command === command
                }
                if (!isAccept) continue
                (async () => {
                    try {
                        const isEcon = ['apostar', 'cassino', 'vadiar', 'trabalhar', 'salario', 'roubar'].includes(command);
                        this.cooldown = this.cooldown || {}
                        let cdTime = isEcon ? 2500 : 1000; 
                        if (!isSoberano && (Date.now() - (this.cooldown[sender] || 0)) < cdTime) return
                        this.cooldown[sender] = Date.now()
                        console.log(chalk.black(chalk.bgCyan(` BOT ${botId} `)), chalk.black(chalk.bgWhite(` ${command} `)), `de ${chalk.green(m.pushName || senderNum)}`)
                        const isROwner = isSoberano;
                        if ((plugin.owner || plugin.rowner) && !isSoberano) return m.reply(global.dfail('owner'))
                        if (plugin.group && !m.isGroup) return m.reply(global.dfail('group'))
                        if (plugin.admin && !isAdmin && !isSoberano) return m.reply(global.dfail('admin'))
                        if (plugin.botAdmin && !isBotAdmin) return m.reply(global.dfail('botAdmin'))
                        await plugin.call(this, m, { 
                            conn: this, args, command, text, usedPrefix,
                            participants, groupMetadata, isSoberano, isOwner: isSoberano,
                            isAdmin, isBotAdmin, isROwner
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

global.dfail = (type) => {
    return {
        owner: '༄ Đev Šoberano ×͜× | Comando exclusivo do meu mestre!',
        admin: '༄ Đev Šoberano ×͜× | Você precisa ser ADM para usar isso.',
        botAdmin: '༄ Đev Šoberano ×͜× | Preciso ser Admin para executar essa função.',
        group: '༄ Đev Šoberano ×͜× | Este comando só funciona em grupos.'
    }[type]
};

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
    unwatchFile(file);
    console.log(chalk.bold.greenBright(`[HANDLER UPDATED] - ༄ Đev Šoberano ×͜×`));
});