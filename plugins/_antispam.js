/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const userSpamData = {}
let handler = m => m

handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems}) {
  if (!m.isGroup) return !1
  
  const chat = global.db.data.chats[m.chat] || {}
  const situacao = chat.antiSpam || chat.antispam || false
  if (!situacao) return !1
  
  if (isOwner || isROwner || isAdmin || isPrems || m.fromMe) return !1
  
  const sender = m.sender
  const currentTime = Date.now()
  const user = global.db.data.users[sender]
  
  // --- CONFIGURAÇÃO EQUILIBRADA ---
  const timeWindow = 7000 // Janela de 7 segundos
  const messageLimit = 8  // Limite de 8 mensagens (menos rigoroso)
  // --------------------------------

  if (!(sender in userSpamData)) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1, 
      punishLevel: 0
    }
  } else {
    const userData = userSpamData[sender]
    const timeDifference = currentTime - userData.lastMessageTime

    if (timeDifference <= timeWindow) {
      userData.messageCount += 1

      if (userData.messageCount >= messageLimit) {
        userData.punishLevel++
        userData.messageCount = 0 

        if (userData.punishLevel === 1) {
          await conn.reply(m.chat, `✦ *Calma lá @${sender.split("@")[0]}! Você está enviando mensagens muito rápido. Maneire no flood.*`, m, { mentions: [m.sender] })
          // Castigo leve: 15 segundos sem poder usar o bot
          user.banned = true 
          setTimeout(() => { user.banned = false }, 15000)
        } 
        else if (userData.punishLevel === 2) {
          await conn.reply(m.chat, `✦ *Último aviso @${sender.split("@")[0]}! O Soberano Leandro detesta poluição visual. Próxima é BAN.*`, m, { mentions: [m.sender] })
          // Castigo médio: 40 segundos
          user.banned = true
          setTimeout(() => { user.banned = false }, 40000)
        } 
        else if (userData.punishLevel >= 3) {
          await conn.reply(m.chat, `✦ *VOCÊ FOI AVISADO! Banido por excesso de spam.* 💀`, m, { mentions: [m.sender] })
          if (isBotAdmin) {
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
          }
          user.banned = false
          delete userSpamData[sender]
        }
        return !0 
      }
    } else {
      userData.messageCount = 1
    }
    userData.lastMessageTime = currentTime
  }
  return !1
}

export default handler