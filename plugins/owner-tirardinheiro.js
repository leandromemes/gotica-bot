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
    const DONO_OFICIAL = '556392922319@s.whatsapp.net'
    const TARGET_LID_DONO = '30314567069795@lid'
    
    const isOwner = m.sender === DONO_OFICIAL || m.sender === TARGET_LID_DONO || m.isOwner

    if (!isOwner) {
        return m.reply(`✨ 🚫 *Acesso negado!* Apenas o Soberano Leandro pode confiscar bens. 🍷`)
    }

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`✨ ⚠️ *Soberano, você precisa mencionar ou responder a mensagem do "criminoso".*`)

    let valor = parseInt(args[0])
    if (isNaN(valor) || valor <= 0) return m.reply(`✨ ❌ *Valor inválido.* Use: ${usedPrefix + command} 100 @membro`)

    let chat = global.db.data.chats[m.chat]
    
    // Inicializa o usuário no banco de dados do grupo se não existir
    if (!chat.users) chat.users = {}
    if (!chat.users[who]) chat.users[who] = { coin: 0, bank: 0 }

    // Remove o saldo (Garante que não fique negativo se você não quiser, mas aqui vamos deixar tirar o que ele tem)
    if (chat.users[who].coin < valor) {
        chat.users[who].coin = 0 // Se ele tiver menos que o valor, zera a carteira
    } else {
        chat.users[who].coin -= valor
    }

    let formatarReal = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    let texto = `
┏━━⏤͟͟͞͞★꙲⃝͟📉 *CONFISCO REAL*
┃
┃ 📉 *Valor Removido:* ${formatarReal(valor)}
┃ 🎯 *Alvo:* @${who.split('@')[0]}
┃ 📉 *Saldo Restante:* ${formatarReal(chat.users[who].coin)}
┃
┗━━━━━⏤͟͟͞͞★꙲⃝͟💸❈┉━━━━┛`.trim()

    await m.react('📉')
    await conn.reply(m.chat, texto, m, { mentions: [who] })
}

handler.help = ['tirardinheiro <valor> @user']
handler.tags = ['owner']
handler.command = ['tirardinheiro', 'removergrana', 'confiscar']
handler.rowner = true 

export default handler