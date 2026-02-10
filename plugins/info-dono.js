/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    await m.react("👑")

    const who = m.sender
    const userNumber = who.split('@')[0]
    
    // Imagem do Soberano
    const DONO_IMG = 'https://files.catbox.moe/gx8ivr.jpeg' 

    const mensagem = `✨ Escuta aqui, @${userNumber}, é melhor você ter respeito ao falar do meu criador!

👑 *MESTRE SUPREMO:* 𝐋𝐞𝐚𝐧𝐝𝐫𝐨 𝐌𝐞𝐦𝐞𝐬
📱 *WhatsApp:* wa.me/556391330669
🌐 *Redes Sociais:* https://linktr.ee/Leandromemes

_Ele é o único que manda em mim (e em você também se ele quiser). Não o irrite!_ 💋`

    const response = await fetch(DONO_IMG)
    const buffer = await response.buffer()

    await conn.sendMessage(m.chat, {
        image: buffer,
        caption: mensagem,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['dono']
handler.tags = ['info']
// Forcei todos os nomes aqui para este arquivo ser o único
handler.command = /^(dono|creator|creador|dueño|owner|dev|soberano)$/i
handler.register = false 

export default handler