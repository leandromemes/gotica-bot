/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // VERIFICAÇÃO DE DONO (Soberano)
    const DONO_OFICIAL = '5574991940377@s.whatsapp.net'
    const TARGET_LID_DONO = '25886472585277@lid'
    
    const isOwner = m.sender === DONO_OFICIAL || m.sender === TARGET_LID_DONO || m.isOwner

    if (!isOwner) {
        return m.reply(`✨ 🚫 *Quem você pensa que é?* Esse comando é só para meu dono *Leandro, aquele gostoso* 😎🔥`)
    }

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`✨ ⚠️ *Você deve mencionar ou responder a mensagem da pessoa.*`)

    let valor = parseInt(args[0])
    if (isNaN(valor) || valor <= 0) return m.reply(`✨ ❌ *Valor inválido.* Use: ${usedPrefix + command} 100 @membro`)

    let chat = global.db.data.chats[m.chat]
    
    // Inicializa o usuário no banco de dados do grupo
    if (!chat.users) chat.users = {}
    if (!chat.users[who]) chat.users[who] = { coin: 0, bank: 0 }

    // Adiciona o saldo
    chat.users[who].coin += valor

    let formatarReal = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    let texto = `
┏━━⏤͟͟͞͞★꙲⃝͟👑 *PODER DO DONO*
┃
┃ 💰 *Valor Adicionado:* ${formatarReal(valor)}
┃ 🎯 *Destinatário:* @${who.split('@')[0]}
┃ 📈 *Novo Saldo:* ${formatarReal(chat.users[who].coin)}
┃
┗━━━━━⏤͟͟͞͞★꙲⃝͟✨❈┉━━━━┛`.trim()

    await m.react('💸')
    await conn.reply(m.chat, texto, m, { mentions: [who] })
}

handler.help = ['dardinheiro <valor> @user']
handler.tags = ['owner']
handler.command = ['dardinheiro','addmoney', 'gerar']
handler.rowner = true // Reforço para garantir que só o dono use

export default handler