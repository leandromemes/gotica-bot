/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix, command, args, isAdmin, isOwner }) => {
    const isSoberano = isOwner || m.sender.includes('240041947357401')
    if (!(isAdmin || isSoberano)) return global.dfail('admin', m, conn)

    let chat = global.db.data.chats[m.chat]
    let state = args[0] ? args[0].toLowerCase() : ''

    if (state === 'on' || state === '1') {
        chat.modoreal = true
        m.reply(`✅ *MODO REAL ATIVADO!*\n*A economia está liberada neste grupo, dev Leandro.* 🍷`)
    } else if (state === 'off' || state === '0') {
        chat.modoreal = false
        m.reply(`⚠️ *MODO REAL DESATIVADO!*\n*A farra do dinheiro acabou.* 🍷`)
    } else {
        m.reply(`*Soberano, use ${usedPrefix + command} on ou off.*`)
    }
}

handler.help = ['modoreal']
handler.tags = ['admin']
handler.command = ['modoreal']
handler.group = true

export default handler