/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    // Pega o nome do usuário de forma segura ⭐
    let packname = m.pushName || 'Soberano'
    let author = 'Gótica Bot 💋'

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) {
        if ((q.msg || q).seconds > 10) return m.reply('⭐ *Erro:* O vídeo deve ter no máximo 10 segundos! 💋')
      }

      await m.react('⏳')
      let img = await q.download?.()
      if (!img) return m.reply('⭐ *Erro:* Não consegui baixar a mídia. 💋')

      // Criando a figurinha ✨
      stiker = await sticker(img, false, packname, author)
      
    } else if (args[0] && /https?:\/\//.test(args[0])) {
      await m.react('⏳')
      stiker = await sticker(false, args[0], packname, author)
      
    } else {
      return m.reply(`⭐ *Hey!* Marque uma foto ou vídeo com *${usedPrefix + command}* para criar sua figurinha. 💋`)
    }

    if (stiker) {
      // Tenta enviar, se a conexão cair, o catch abaixo segura e o bot NÃO desliga 🖤
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
      await m.react('✅')
    } else {
      throw new Error('Falha na conversão')
    }

  } catch (e) {
    console.log('--- ERRO NO STICKER (TRATADO) ---')
    console.error(e)
    await m.react('❌')
    // Resposta amigável para não travar o processo 💫
    if (m.chat) conn.reply(m.chat, '⭐ *Ops!* A conexão oscilou ou a mídia é muito pesada. Tente novamente! 💋', m)
  }
}

handler.help = ['sticker', 'f', 's', 'figurinha']
handler.tags = ['sticker']
handler.command = /^(s|f|sticker|figurinha)$/i
handler.register = false

export default handler