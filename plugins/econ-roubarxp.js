/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669';

const handler = async (m, { conn, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.modoreal) return m.reply('*O Modo Real precisa estar ativado para roubar conhecimento.* 🍷')

  let senderId = m.sender
  let who = (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)

  if (!who) return m.reply('*❌ Mencione alguém ou responda uma mensagem para roubar XP!*')

  // Normalização para Proteção de Leandro
  const tratarId = (id) => (id && (id.includes(DONO_PHONE) || id === TARGET_JID_DONO)) ? TARGET_JID_DONO : id;
  const ladraoId = tratarId(senderId);
  const vitimaId = tratarId(who);

  if (!chat.users) chat.users = {}
  if (!chat.users[ladraoId]) chat.users[ladraoId] = { exp: 0, lastrobxp: 0 }
  if (!chat.users[vitimaId]) chat.users[vitimaId] = { exp: 0 }

  let user = chat.users[ladraoId]
  let targetUser = chat.users[vitimaId]

  // --- 👑 PROTEÇÃO DO MESTRE SUPREMO ---
  if (vitimaId === TARGET_JID_DONO && ladraoId !== TARGET_JID_DONO) {
    const multaXP = 5000; 
    user.exp = Math.max(0, (user.exp || 0) - multaXP)
    targetUser.exp = (targetUser.exp || 0) + multaXP
    
    await m.react('⚡')
    return m.reply(`🤨 *AUDÁCIA SEM LIMITES!*\n\nTentando roubar a experiência do mestre *Leandro*? Você perdeu *${multaXP} XP* por sua insolência! 👑`)
  }

  if (ladraoId === vitimaId) return m.reply('*🤡 Vai roubar sua própria mente? Tente outra coisa.*')

  const cooldown = 2 * 60 * 60 * 1000 
  const now = Date.now()
  if (now - (user.lastrobxp || 0) < cooldown) {
    return m.reply(`⏳ Aguarde *${msToTime((user.lastrobxp + cooldown) - now)}* para tentar outro roubo intelectual.`)
  }

  if ((targetUser.exp || 0) < 300) {
    return m.reply(`⚠️ @${who.split('@')[0]} é um novato sem experiência suficiente para ser roubado.`, null, { mentions: [who] })
  }

  await m.react('🧠')
  
  const robAmount = Math.floor(Math.random() * (4000 - 200 + 1)) + 200
  const finalRob = Math.min(robAmount, targetUser.exp)

  user.exp = (user.exp || 0) + finalRob
  targetUser.exp -= finalRob
  user.lastrobxp = now

  let texto = `
🧠 *CONHECIMENTO SAQUEADO!*
---------------------------------
🥷 *Ladrão:* @${senderId.split('@')[0]}
📉 *Vítima:* @${who.split('@')[0]}

✨ *XP Roubado:* +${finalRob}
---------------------------------`.trim()

  await conn.reply(m.chat, texto, m, { mentions: [senderId, who] })
  if (global.db.write) await global.db.write()
}

handler.help = ['roubarxp']
handler.tags = ['economia']
handler.command = ['roubarxp', 'robxp', 'robarxp']
handler.group = true
// handler.register = true  <-- REMOVIDO PARA FUNCIONAR SEM REGISTRO

export default handler

function msToTime(duration) {
  let hours = Math.floor(duration / (1000 * 60 * 60))
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${hours}h e ${minutes}m`
}