/**
 * 👑 COMANDO AUTO-ADMIN - EXCLUSIVO SOBERANO
 * Sistema de Defesa: Só o Mestre Supremo tem acesso.
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

Você realmente achou que teria o mesmo poder que o **MESTRE SUPREMO SOBERANO**? 
Não me faça rir! Esse comando é exclusivo para quem manda nessa porra toda. 💋⭐

🚫 *ACESSO NEGADO, VERME.* _Vá brincar em outro lugar antes que eu te apague._`.trim())
    }

    // Se o Soberano já for admin
    if (isAdmin) {
        return m.reply('*⚠️ Você já é o administrador, Soberano. O comando é seu!*')
    }

    // Verifica se o BOT é admin antes de tentar dar a promoção
    if (!isBotAdmin) {
        return m.reply('*❌ Erro:* Soberano, eu preciso ser administrador do grupo primeiro para poder te dar o cargo!')
    }

    try {
        // Promove diretamente o remetente da mensagem
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
        await m.react('👑')
        
        await m.reply('👑 *PODER CONCEDIDO! O Soberano agora comanda essa zona.*')

    } catch (e) {
        console.error('[ERRO AUTO-ADMIN]:', e)
        m.reply('*💥 Ocorreu um erro ao tentar te promover. Verifique se eu tenho cargo de administrador neste grupo!*')
    }
}

handler.help = ['autoadmin']
handler.tags = ['owner']
handler.command = ['seradm', 'viraradm', 'meadm']
handler.rowner = true 
handler.group = true 
handler.botAdmin = true 

export default handler