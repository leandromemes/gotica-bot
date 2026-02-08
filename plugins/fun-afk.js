/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { text, conn }) => {
    let user = global.db.data.users[m.sender]
    user.afk = + new Date()
    user.afkReason = text || ''
    
    // Frase alterada conforme seu pedido
    await conn.reply(m.chat, `*💤 MODO AFK ATIVADO*\n\n*Usuário:* ${conn.getName(m.sender)}\n*Motivo:* ${user.afkReason || 'Não especificado'}\n\n_Eu vou avisar quando alguém responder suas mensagens enquanto você estiver fora!_`, m)
}

handler.before = async function (m, { conn }) {
    if (m.fromMe) return 
    if (!global.db.data.users) return

    // 1. LÓGICA DE RETORNO (SAIR DO AFK)
    let user = global.db.data.users[m.sender]
    if (user && user.afk > -1) {
        if (!m.text.match(/^(\.|\/|\#|!)afk/i)) {
            let tempo = +new Date - user.afk
            let ms = tempo
            let h = Math.floor(ms / 3600000)
            let m_a = Math.floor((ms % 3600000) / 60000)
            let s = Math.floor((ms % 60000) / 1000)
            
            let tempoFormatado = `${h > 0 ? h + 'h ' : ''}${m_a > 0 ? m_a + 'm ' : ''}${s}s`
            await conn.reply(m.chat, `*👋 Bem-vindo(a) de volta!*\n\nVocê não está mais em modo AFK.\n⏱️ *Tempo que ficou fora:* ${tempoFormatado}`, m)
            
            user.afk = -1
            user.afkReason = ''
        }
    }

    // 2. LÓGICA DE AVISO (QUANDO ALGUÉM RESPONDE SUA MENSAGEM)
    // Focando agora principalmente no quoted (responder mensagem)
    let jid = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null)
    
    if (jid && jid !== m.sender) {
        let afkUser = global.db.data.users[jid]
        if (afkUser && afkUser.afk > -1) {
            let reason = afkUser.afkReason || 'Não especificado'
            let tempoAfk = +new Date - afkUser.afk
            let min = Math.floor(tempoAfk / 60000)

            let msg = `*⚠️ ESTE USUÁRIO ESTÁ AUSENTE*\n\nEle(a) não vai ver sua resposta agora.\n\n📝 *Motivo:* ${reason}\n⏱️ *Está ausente há:* ${min} minutos`.trim()
            await conn.reply(m.chat, msg, m)
        }
    }
}

handler.help = ['afk *<motivo>*']
handler.tags = ['diversão']
handler.command = ['afk']
handler.group = true

export default handler