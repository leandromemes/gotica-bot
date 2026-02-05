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

let handler = async (m, { conn, usedPrefix }) => {
  if (!global.db?.data?.chats?.[m.chat]) return
  
  let chat = global.db.data.chats[m.chat]
  if (!chat.modoreal) return m.reply('*O Modo Real precisa estar ativado para praticar crimes.* 🍷')

  let senderId = m.sender
  let target = (m.mentionedJid && m.mentionedJid.length > 0) ? m.mentionedJid[0] : (m.quoted && m.quoted.sender ? m.quoted.sender : null)

  if (!target) return m.reply('*❌ Mencione ou responda alguém para roubar!*')

  // --- DEFINIÇÃO DAS VARIÁVEIS (CORREÇÃO DO ERRO) ---
  const eSoberano = (senderId.includes(DONO_PHONE) || senderId === TARGET_JID_DONO);
  const vitimaEosoberano = (target.includes(DONO_PHONE) || target === TARGET_JID_DONO);

  if (senderId === target) return m.reply('🤡 *Roubar a si mesmo?*')

  if (!chat.users) chat.users = {}
  if (!chat.users[senderId]) chat.users[senderId] = { coin: 0, bank: 0, lastrob2: 0 }
  if (!chat.users[target]) chat.users[target] = { coin: 0, bank: 0 }

  let user = chat.users[senderId]
  let targetUser = chat.users[target]

  // --- 🛡️ PROTEÇÃO DO LEANDRO ---
  if (vitimaEosoberano && !eSoberano) {
    let multa = 15000
    user.coin = (user.coin || 0) - multa
    targetUser.coin = (targetUser.coin || 0) + multa
    return m.reply(`🤨 *AUDÁCIA!* Tentou roubar o *Soberano* e perdeu R$ ${multa.toLocaleString('pt-br')}. 👑`)
  }

  // --- ⏳ COOLDOWN ---
  const now = Date.now()
  const cooldownTime = 5 * 60 * 1000 
  if (!eSoberano && (now - (user.lastrob2 || 0) < cooldownTime)) {
    let resto = Math.ceil((cooldownTime - (now - user.lastrob2)) / 1000)
    return m.reply(`🚨 *Aguarde:* ${Math.floor(resto/60)}m ${resto%60}s.`)
  }

  // --- 🏦 LÓGICA DE SALDO (Soberano fura o Bank) ---
  let sCarteira = targetUser.coin || 0
  let sBanco = targetUser.bank || 0
  let saldoTotalAlvo = eSoberano ? (sCarteira + sBanco) : sCarteira

  if (saldoTotalAlvo < 500) {
      return m.reply(eSoberano ? '⚠️ *O alvo está totalmente zerado!*' : '⚠️ *A vítima não tem dinheiro na carteira. O banco dela está protegido!*')
  }

  const sucesso = eSoberano ? true : Math.random() < 0.40 

  if (sucesso) {
    const fatorRoubo = eSoberano ? 0.50 : (0.15 + Math.random() * 0.15)
    let valorRoubado = 0

    if (eSoberano) {
        let rouboC = Math.floor(sCarteira * fatorRoubo)
        let rouboB = Math.floor(sBanco * fatorRoubo)
        targetUser.coin -= rouboC
        targetUser.bank -= rouboB
        valorRoubado = rouboC + rouboB
    } else {
        valorRoubado = Math.floor(sCarteira * fatorRoubo)
        targetUser.coin -= valorRoubado
    }

    user.coin = (user.coin || 0) + valorRoubado
    if (!eSoberano) user.lastrob2 = now

    let texto = `
⚡ *${eSoberano ? '⚔️ INVASÃO SOBERANA ⚔️' : '🥷 ROUBO CONCLUÍDO'}*
---------------------------------------
👤 *Ladrão:* @${senderId.split('@')[0]}
👤 *Vítima:* @${target.split('@')[0]}

💵 *Valor Extraído:* R$ ${valorRoubado.toLocaleString('pt-br')}
${eSoberano ? '🏦 *Status:* Cofre bancário (Bank) violado!' : '👛 *Status:* O Bank protegeu o restante.'}

📉 *Saldo Restante da Vítima:* R$ ${( (targetUser.coin || 0) + (targetUser.bank || 0) ).toLocaleString('pt-br')}
💰 *Seu Novo Saldo:* R$ ${user.coin.toLocaleString('pt-br')}
---------------------------------------
> ${eSoberano ? 'A riqueza do Soberano é inevitável.' : 'Fique esperto.'}`.trim()

    await conn.sendMessage(m.chat, { text: texto, mentions: [senderId, target] }, { quoted: m })
  } else {
    let multa = Math.floor((user.coin || 0) * 0.10)
    user.coin -= multa
    targetUser.coin += multa
    m.reply(`🤡 *RODOU!* Pagou R$ ${multa.toLocaleString('pt-br')} para a vítima.`)
  }
  if (global.db.write) await global.db.write()
}

handler.help = ['roubar']
handler.tags = ['economia']
handler.command = ['roubar', 'assaltar', 'rob', 'steal']
handler.group = true

export default handler