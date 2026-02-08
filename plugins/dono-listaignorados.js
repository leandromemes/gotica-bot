/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix }) => {
    let users = global.db.data.users
    let ignorados = []

    for (let jid in users) {
        if (users[jid].banned) {
            ignorados.push(jid)
        }
    }

    if (ignorados.length === 0) {
        return m.reply('*✅ Não há nenhum usuário na lista de ignorados no momento.*')
    }

    let texto = `*🚫 LISTA DE USUÁRIOS IGNORADOS (BANIDOS) 🚫*\n\n`
    texto += `*Total:* ${ignorados.length}\n\n`
    
    for (let i = 0; i < ignorados.length; i++) {
        let jid = ignorados[i]
        let nome = conn.getName(jid) || 'Usuário desconhecido'
        texto += `*${i + 1}.* @${jid.split('@')[0]} (${nome})\n`
    }

    texto += `\n*Para remover alguém, use:* ${usedPrefix}atender @tag`

    await conn.reply(m.chat, texto, m, { mentions: ignorados })
}

handler.help = ['listaignorados']
handler.tags = ['dono']
handler.command = ['listaignorados', 'banlist', 'ignorados']
handler.rowner = true // Exclusivo para o Soberano

export default handler