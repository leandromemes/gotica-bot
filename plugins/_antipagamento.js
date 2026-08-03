/**
 * 🛡️ SENTINELA ANTI-FRAUDE (VERSÃO ULTRA-SENSÍVEL)
 * @author Leandro Rocha
 * @project CYBERSOBERANO 💋⭐✨💫🌙🖤
 */

export async function before(m, { conn, groupMetadata, isSoberano }) {
    if (!m.isGroup) return !0
    if (m.fromMe || isSoberano) return !0

    // Garante leitura segura do banco do chat sem estourar TypeError
    let chat = global.db.data?.chats?.[m.chat]
    if (!chat || !chat.antipagamento) return !0

    const groupParticipants = groupMetadata?.participants || []
    
    // Checa se o remetente é admin
    const isAdmin = groupParticipants.find(p => (p.id || p.jid) === m.sender)?.admin
    if (isAdmin) return !0

    // Checa se o bot é admin
    const botId = conn.user.jid
    const isBotAdmin = !!groupParticipants.find(p => (p.id || p.jid) === botId)?.admin

    // Detecta qualquer vestígio de mensagem de pagamento ou pedido (Ghost Payment)
    const paymentTypes = ['paymentInviteMessage', 'requestPaymentMessage', 'orderMessage', 'paymentMessage']
    const isPaymentSpam = paymentTypes.includes(m.mtype) || 
                          !!m.message?.paymentInviteMessage || 
                          !!m.message?.requestPaymentMessage

    if (isPaymentSpam) {
        const user = `@${m.sender.split`@`[0]}`
        
        await conn.reply(m.chat, `*「 🛡️ PROTEÇÃO SOBERANA 」*\n\n《✧》${user} Detectado envio de pagamento/spam. Seguindo as ordens do mestre, você foi removido. 💀`, m, { mentions: [m.sender] })

        if (isBotAdmin) {
            // Apaga a mensagem (limpeza de rastro)
            await conn.sendMessage(m.chat, { delete: m.key })
            // Expulsa o invasor
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        return !1 // Bloqueia o processamento
    }
    return !0
}