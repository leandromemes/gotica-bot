/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║    ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @project Gotica Bot 💋⭐✨💫🌙🖤
 */

let handler = async (m, { conn }) => {
    // 🔍 Buscando no cache de conversas apenas o que termina com @newsletter
    let newsletters = Object.values(conn.chats).filter(chat => chat.id && chat.id.endsWith('@newsletter'))

    if (newsletters.length === 0) {
        return m.reply('❌ *Nenhum canal (newsletter) encontrado no cache do bot.* Tente enviar uma mensagem no canal ou entrar nele pelo bot primeiro.')
    }

    let texto = `📢 *CANAIS IDENTIFICADOS (NEWSLETTERS)* 📢\n\n`
    
    newsletters.forEach((chat, i) => {
        texto += `*${i + 1}.* ${chat.name || 'Sem Nome'}\n`
        texto += `🆔 *JID:* ${chat.id}\n\n`
    })

    texto += `> *Gótica Bot - Auditoria de Canais* 💋`
    
    m.reply(texto)
}

handler.help = ['listarnews']
handler.tags = ['owner']
handler.command = /^(listarnews|canais|news)$/i
handler.owner = true

export default handler