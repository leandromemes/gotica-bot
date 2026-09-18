/**
 * 👑 COMANDO SER-MEMBRO - EXCLUSIVO SOBERANO
 * Sistema de Rebaixamento Voluntário: Remove os privilégios de admin do Mestre Supremo.
 * @author ༄ Đev Šoberano ×͜×
 */

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Pega todos os identificadores possíveis de quem enviou
    const sender = m.sender || m.key.participant || m.key.remoteJid || ''
    const senderLid = m.key.senderLid || ''

    // Limpa os identificadores para comparação segura
    const cleanSenderNum = sender.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
    const cleanLidNum = senderLid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '')

    // Validação dinâmica baseada na global.owner do seu settings.js
    const ownerList = Array.isArray(global.owner) ? global.owner : []
    let isSoberano = m?.fromMe || false

    if (!isSoberano) {
        for (const entry of ownerList) {
            const ownerId = String(entry[0] || '').trim()
            if (!ownerId) continue
            const ownerDigits = ownerId.replace(/[^0-9]/g, '')
            if (ownerDigits && (cleanSenderNum === ownerDigits || cleanLidNum === ownerDigits || sender.includes(ownerId) || senderLid.includes(ownerId))) {
                isSoberano = true
                break
            }
        }
    }

    // 🔒 TRAVA DE SEGURANÇA E DEBOCHE AGRESSIVO
    if (!isSoberano) {
        await m.react('🤣')
        return m.reply(`
⚠️ *QUEM VOCÊ PENSA QUE É?* ⚠️

Você realmente achou que mandaria no **MESTRE SUPREMO SOBERANO**? 
Não me faça rir! Esse comando é exclusivo para quem manda nessa porra toda. 💋⭐

🚫 *ACESSO NEGADO, VERME.* _Vá brincar em outro lugar antes que eu te apague._`.trim())
    }

    // Se o Soberano NÃO for admin, não tem o que rebaixar
    if (!isAdmin) {
        return m.reply('*⚠️ Você já é um membro comum no grupo, Soberano!*')
    }

    // Verifica se o BOT é admin para ter permissão de rebaixar
    if (!isBotAdmin) {
        return m.reply('*❌ Erro:* Soberano, eu preciso ser administrador do grupo para poder alterar seu cargo!')
    }

    try {
        // Rebaixa diretamente o remetente da mensagem
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'demote')
        await m.react('🫡')
        
        await m.reply('🫡 *Ok MESTRE, VOCE FOI REBAIXADO!* \n\n O Soberano agora está disfarçado entre os membros comuns.')

    } catch (e) {
        console.error('[ERRO SER-MEMBRO]:', e)
        m.reply('*💥 Ocorreu um erro ao tentar te rebaixar. Verifique se eu tenho cargo de administrador neste grupo!*')
    }
}

handler.help = ['sermembro']
handler.tags = ['owner']
handler.command = ['sermembro', 'virarmembro', 'tiraradm']
handler.rowner = true 
handler.group = true 
handler.botAdmin = true 

export default handler