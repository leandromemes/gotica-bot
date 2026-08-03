/**
 * 👑 COMANDO SER-MEMBRO - EXCLUSIVO SOBERANO
 * Sistema de Rebaixamento Voluntário: Remove os privilégios de admin do Mestre Supremo.
 */

const DONO_OFICIAL = '5574991940377@s.whatsapp.net'
const TARGET_LID_DONO = '25886472585277@lid'

const handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Pega todos os identificadores possíveis de quem enviou
    const sender = m.sender || m.key.participant || m.key.remoteJid || ''
    const senderLid = m.key.senderLid || ''

    // Limpa os identificadores para comparação segura
    const cleanSenderNum = sender.split('@')[0].split(':')[0]
    const cleanLidNum = senderLid.split('@')[0].split(':')[0]

    const isOwnerJid = cleanSenderNum === '5574991940377'
    const isOwnerLid = cleanLidNum === '25886472585277' || sender === TARGET_LID_DONO || senderLid === TARGET_LID_DONO

    // 🔒 TRAVA DE SEGURANÇA E DEBOCHE AGRESSIVO
    if (!isOwnerJid && !isOwnerLid) {
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