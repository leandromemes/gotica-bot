/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    global.db.data.msgs = global.db.data.msgs || {}
    let msgs = global.db.data.msgs
    
    if (!text) throw `*「 💡 COMO USAR O SETMSG 」*\n\nVocê precisa dar um nome ao gatilho respondendo a uma mídia (áudio, foto, texto).\n\n*Exemplo:* \n1. Responda a um áudio com: *${usedPrefix + command} bomdia*\n2. Quando alguém digitar *bomdia*, eu enviarei o áudio!\n\n*Nota:* Use nomes simples e sem espaços.`

    let q = m.quoted ? m.quoted : m
    msgs[text] = q.fakeObj ? q.fakeObj : q
    
    conn.reply(m.chat, `*「 ✅ GATILHO CONFIGURADO 」*\n\nO nome *${text}* agora é uma resposta automática!\n\n*Dica:* Digite *${usedPrefix}listmsg* para ver todos os seus gatilhos.`, m)
}

handler.help = ['setmsg']
handler.tags = ['admin']
handler.command = ['setmsg', 'vmsg', 'addmsg']
handler.admin = true // Liberado para ADMs e para o Soberano

export default handler