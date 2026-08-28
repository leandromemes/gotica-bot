/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, isOwner, isROwner }) => {
    // Verificação de elite: Apenas o Soberano Leandro
    const isSoberano = isOwner || isROwner || m.sender.includes('192380913328157')
    if (!isSoberano) return m.reply('*Apenas o Soberano Leandro tem autoridade para resetar a economia do grupo.* 🍷')

    let chat = global.db.data.chats[m.chat]
    
    if (!chat.users || Object.keys(chat.users).length === 0) {
        return m.reply('*Não há registros financeiros neste grupo para resetar.*')
    }

    // Pega todos os IDs de usuários que estão no banco deste grupo
    let users = Object.keys(chat.users)

    // Loop para zerar todo mundo
    users.forEach(jid => {
        chat.users[jid].coin = 0
        chat.users[jid].bank = 0
    })
    
    // Salva a limpeza no banco de dados
    if (global.db.write) await global.db.write()

    let texto = `
╭─〔 ⚔️ 𝙍𝙀𝙎𝙀𝙏 𝙂𝙀𝙍𝘼𝙇 𝘿𝙀𝘾𝙍𝙀𝙏𝘼𝘿𝙊 🍷 〕
│ 🏛️ *Grupo:* ${await conn.getName(m.chat)}
│ 👥 *Usuários afetados:* ${users.length}
│ 💸 *Saldo de todos:* R$ 0,00
│ 🏦 *Banco de todos:* R$ 0,00
╰─────────────────────
> O Soberano Leandro passou a régua! Todo mundo ficou pobre neste grupo.`.trim()

    await m.react('🧹')
    await conn.reply(m.chat, texto, m)
}

handler.help = ['resetargrana']
handler.tags = ['owner']
handler.command = ['resetgrana', 'limpargrana', 'zerar', 'resetargrana', 'zerartudo']
handler.group = true // Comando para ser usado em grupos
handler.rowner = true 

export default handler