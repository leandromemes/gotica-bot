/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, command, text, isAdmin, isOwner }) => {
    // 1. Identifica o alvo
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    
    if (!who || !who.includes('@s.whatsapp.net')) return m.reply('⭐ *Hey!* Mencione ou responda alguém para mutar/desmutar. 💋')

    // 2. Proteções (Dono, Bot e Admins)
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupOwner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const botNumber = conn.user.jid
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === who)?.admin

    if (who === botNumber) return m.reply('⭐ *Erro:* Eu não posso me mutar. 💋')
    if (who === groupOwner) return m.reply('⭐ *Erro:* Não posso mutar o dono do grupo. 💋')
    if (isTargetAdmin && (command === 'mute' || command === 'mutar')) return m.reply('⭐ *Erro:* Admins não podem ser mutados. 💋')

    // 3. Lógica de Mute/Unmute
    if (command === 'mute' || command === 'mutar') {
        if (global.db.data.users[who].muto) return m.reply('⭐ Este usuário já está no silêncio. 💋')
        global.db.data.users[who].muto = true
        await m.react("🤫") // Reação solicitada
        await conn.reply(m.chat, `*𝗨𝘀𝘂𝗮́𝗿𝗶𝗼 𝗠𝘂𝘁𝗮𝗱𝗼* ⭐\n\nAs mensagens de @${who.split('@')[0]} serão apagadas agora. 💋`, m, { mentions: [who] })
    }

    if (command === 'unmute' || command === 'desmutar') {
        if (!global.db.data.users[who].muto) return m.reply('⭐ Este usuário não está mutado. 💋')
        global.db.data.users[who].muto = false
        await m.react("🔊") // Reação relacionada
        await conn.reply(m.chat, `*𝗨𝘀𝘂𝗮́𝗿𝗶𝗼 𝗗𝗲𝘀𝗺𝘂𝘁𝗮𝗱𝗼* ⭐\n\nA voz de @${who.split('@')[0]} foi devolvida. 💋`, m, { mentions: [who] })
    }
}

handler.help = ['mutar', 'desmutar']
handler.tags = ['admin']
handler.command = ['mute', 'unmute', 'mutar', 'desmutar'] // Adicionado 'mutar' aqui
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = false 

export default handler