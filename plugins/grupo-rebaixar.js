/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let number;

    if (isNaN(text) && !text.match(/@/g)) {
        // Texto inválido
    } else if (isNaN(text)) {
        number = text.split`@`[1]
    } else if (!isNaN(text)) {
        number = text
    }

    if (!text && !m.quoted) return conn.reply(m.chat, `✨ *por favor, mencione ou responda à mensagem de um administrador para rebaixá-lo.* 💋`, m)
    
    if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) {
        return conn.reply(m.chat, `✨ *Erro! O número mencionado não é válido.* 💋`, m)
    }

    try {
        let user;
        if (m.quoted) {
            user = m.quoted.sender
        } else if (number) {
            user = number + '@s.whatsapp.net'
        } else if (m.mentionedJid[0]) {
            user = m.mentionedJid[0]
        }

        if (!user) return conn.reply(m.chat, `✨ *Não foi possível encontrar o usuário.* 💋`, m)

        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        conn.reply(m.chat, `✅ *O usuário foi removido do cargo de administrador com sucesso.* 🖤`, m)

    } catch (e) {
        conn.reply(m.chat, `❌ *Ocorreu um erro ao tentar rebaixar o usuário.*`, m)
    }
}

handler.help = ['rebaixar @tag']
handler.tags = ['admin']
handler.command = ['demote', 'rebaixar', 'degradar']

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler