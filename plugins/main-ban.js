/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, participants, usedPrefix, command, isOwner, isAdmin }) => {
    // 1. Identifica o alvo
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    if (!who) return m.reply(`*🫣 Quem vamos eliminar?*\nMarque alguém ou responda a mensagem do inseto.`)

    // 2. Trava de Segurança contra ADMs
    let targetAdmin = participants.find(p => p.id === who)?.admin
    if (targetAdmin) {
        return m.reply('*😅 Ops:* Eu não posso banir este usuário porque ele é um *Adm*. Remova o cargo dele primeiro se quiser que eu o elimine.')
    }

    // 3. Esculacho para quem não é ADM ou Soberano
    if (!isAdmin && !isOwner) {
        return m.reply('🤔 Quem você pensa que é? Você não passa de um inseto insignificante nesse grupo. Só o Soberano ou os ADMs têm o direito de exterminar alguém. Volte para o seu lugar antes que eu me volte contra você!')
    }

    // --- RITUAL DE ELIMINAÇÃO ACELERADO (0.5s) ---

    // Envia a mensagem inicial
    await conn.sendMessage(m.chat, { text: 'Inseto removido com sucesso 🗑✅' })
    await new Promise(resolve => setTimeout(resolve, 500))

    // Envia a Figurinha
    await conn.sendMessage(m.chat, { 
        sticker: { url: 'https://files.catbox.moe/pgbury.webp' } 
    })
    await new Promise(resolve => setTimeout(resolve, 500))

    // Envia o Áudio
    await conn.sendMessage(m.chat, { 
        audio: { url: 'https://files.catbox.moe/bxobyn.mpeg' }, 
        mimetype: 'audio/mp4', 
        ptt: true 
    })
    await new Promise(resolve => setTimeout(resolve, 500))

    // O Chute final
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
}

handler.help = ['ban']
handler.tags = ['admin']
handler.command = ['ban', 'b', 'vaza']
handler.group = true
handler.botAdmin = true
handler.register = false 

export default handler