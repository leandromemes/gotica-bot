/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
    // Esculacho para quem não é ADM ou Soberano
    if (!isAdmin && !isOwner) return m.reply('🤔 Quem você pensa que é? Você não passa de um inseto insignificante nesse grupo. Só o Soberano ou os ADMs têm o direito de notificar a todos!')

    if (!m.quoted && !text) return m.reply('*🦇 Erro:* Você precisa enviar um texto ou responder a uma mídia para notificar todos.')

    try {
        let users = participants.map(u => conn.decodeJid(u.id))
        let q = m.quoted ? m.quoted : m
        let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender
        
        // Mensagem invisível que marca todos
        let msg = conn.cMod(m.chat, generateWAMessageFromContent(m.chat, { 
            [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: text || '' }
        }, { quoted: null, userJid: conn.user.id }), text || q.text, conn.user.jid, { mentions: users })
        
        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } catch (e) {
        // Backup caso o relayMessage falhe (Método Tradicional)
        let users = participants.map(u => conn.decodeJid(u.id))
        let quoted = m.quoted ? m.quoted : m
        let mime = (quoted.msg || quoted).mimetype || ''
        let isMedia = /image|video|sticker|audio/.test(mime)
        let htextos = `${text ? text : "*Atenção todos!!*"}`

        if (isMedia && quoted.mtype === 'imageMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'videoMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'audioMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `notificar.mp3` }, { quoted: null })
        } else if (isMedia && quoted.mtype === 'stickerMessage') {
            let mediax = await quoted.download?.()
            conn.sendMessage(m.chat, { sticker: mediax, mentions: users }, { quoted: null })
        } else {
            // Apenas texto com menção oculta
            conn.sendMessage(m.chat, { text: htextos, mentions: users }, { quoted: m })
        }
    }
}

handler.help = ['notificar']
handler.tags = ['admin']
handler.command = ['citar', 'tag', 'aviso', 'hidetag'] // Handlers em português
handler.group = true
handler.admin = true
handler.register = false 

export default handler