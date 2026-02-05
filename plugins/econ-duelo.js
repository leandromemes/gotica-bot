/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = async (m, { conn, args, usedPrefix, command, participants }) => {
    if (!global.db?.data?.chats?.[m.chat]) return
    let chat = global.db.data.chats[m.chat]
    
    if (!chat.modoreal) return m.reply('*O Modo Real precisa estar ativado para duelar.* 🍷')
    if (!chat.users) chat.users = {}

    let senderId = m.sender
    let target = (m.mentionedJid && m.mentionedJid.length > 0) ? m.mentionedJid[0] : (m.quoted && m.quoted.sender ? m.quoted.sender : null)

    if (!target) return m.reply(`*✨ ⚠️ Responda ou mencione quem você deseja desafiar.*\nExemplo: *${usedPrefix}${command} 1000*`)

    const getPrimaryJid = (jid) => {
        if (jid.endsWith('@lid') && m.isGroup) {
            const pInfo = participants.find(p => p.lid === jid)
            return pInfo ? pInfo.id : jid
        }
        return jid
    }

    let uId = getPrimaryJid(senderId)
    let vId = getPrimaryJid(target)

    const eSoberano = (uId.includes(DONO_PHONE) || uId === TARGET_JID_DONO)
    const vitimaSoberano = (vId.includes(DONO_PHONE) || vId === TARGET_JID_DONO)

    if (vId === uId) return m.reply('✨ ❌ Você não pode duelar com você mesmo.')

    if (!chat.users[uId]) chat.users[uId] = { coin: 0, bank: 0 }
    if (!chat.users[vId]) chat.users[vId] = { coin: 0, bank: 0 }

    let user = chat.users[uId]
    let victim = chat.users[vId]

    const valor = parseInt(args[0])
    if (isNaN(valor) || valor <= 0) return m.reply('✨ ❌ Digite um valor válido para a aposta.')

    // --- 🛡️ REGRA DO BANCO (PROTEÇÃO TOTAL) ---
    // Mortais só podem apostar o que têm na CARTEIRA (coin).
    // O Soberano Leandro pode ver o saldo total (coin + bank) para o desafio.

    let saldoDisponivelDesafiante = eSoberano ? ((user.coin || 0) + (user.bank || 0)) : (user.coin || 0)
    let saldoDisponivelDesafiado = eSoberano ? ((victim.coin || 0) + (victim.bank || 0)) : (victim.coin || 0)

    if (saldoDisponivelDesafiante < valor) {
        return m.reply(`✨ ❌ Carteira insuficiente. Você tem apenas *R$ ${(user.coin || 0).toLocaleString('pt-br')}* em mãos. O banco está protegido!`)
    }

    if (saldoDisponivelDesafiado < valor) {
        return m.reply(`✨ ❌ O oponente não tem esse valor na carteira. O banco dele está protegido contra duelos comuns!`)
    }

    // --- 👑 LÓGICA DE VITÓRIA ---
    let vencedorId, perdedorId
    if (eSoberano) {
        vencedorId = uId; perdedorId = vId
    } else if (vitimaSoberano) {
        vencedorId = vId; perdedorId = uId
    } else {
        vencedorId = Math.random() < 0.5 ? uId : vId
        perdedorId = vencedorId === uId ? vId : uId
    }

    // --- 💸 PAGAMENTO ---
    let perdedorObj = chat.users[perdedorId]
    let vencedorObj = chat.users[vencedorId]

    if (perdedorId !== (eSoberano ? uId : (vitimaSoberano ? vId : ''))) {
        // Se o perdedor for desafiado pelo Soberano, o banco NÃO protege.
        if (eSoberano || vitimaSoberano) {
            if (perdedorObj.coin >= valor) {
                perdedorObj.coin -= valor
            } else {
                let restante = valor - perdedorObj.coin
                perdedorObj.coin = 0
                perdedorObj.bank -= restante // O Soberano fura o bloqueio do banco!
            }
        } else {
            // Duelo comum: Só tira da carteira.
            perdedorObj.coin -= valor
        }
    }

    vencedorObj.coin = (vencedorObj.coin || 0) + valor

    if (global.db.write) await global.db.write()

    let resultado = `
⚔️ *DUELO ENCERRADO* ⚔️
---------------------------------
🔥 Aposta: *R$ ${valor.toLocaleString('pt-br')}*

🥇 Vencedor: @${vencedorId.split('@')[0]}
💸 Ganho: *+R$ ${valor.toLocaleString('pt-br')}*

💔 Perdedor: @${perdedorId.split('@')[0]}
💀 Perda: *-R$ ${valor.toLocaleString('pt-br')}*
---------------------------------`.trim()

    if (eSoberano || vitimaSoberano) {
        resultado += `\n\n👑 *Aviso:* O Soberano ignorou a proteção bancária da vítima!`
    } else {
        resultado += `\n\n🛡️ *Aviso:* O cofre (Bank) permaneceu intacto.`
    }

    await conn.reply(m.chat, resultado, m, { mentions: [uId, vId] })
}

handler.help = ['duelo']
handler.tags = ['economia']
handler.command = ['duelo', 'x1', 'apostar']
handler.group = true

export default handler