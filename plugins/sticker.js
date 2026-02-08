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
    
    // Pega o nome do usuário ou o pushName do WhatsApp
    let packname = m.pushName || 'Usuário'
    let author = 'Gótica Bot 💋'

    await m.react('⏳')

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) {
        if ((q.msg || q).seconds > 10) return m.reply('*⚠️ O vídeo deve ter no máximo 10 segundos!*')
      }

      let img = await q.download?.()
      if (!img) return m.reply('*❌ Falha ao baixar a mídia!*')

      // Criando a figurinha com o nome de quem usou o comando
      stiker = await sticker(img, false, packname, author)
      
    } else if (args[0] && /https?:\/\//.test(args[0])) {
      stiker = await sticker(false, args[0], packname, author)
      
    } else {
      return m.reply(`*✨ Marque uma foto ou vídeo com ${usedPrefix + command}*`)
    }
  } catch (e) {
    console.error(e)
    stiker = false
  } finally {
    if (stiker) {
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
      await m.react('✅')
    } else {
      m.reply('*❌ Erro ao criar figurinha. Verifique se o vídeo não está corrompido!*')
    }
  }
}

handler.help = ['sticker', 'f', 's', 'figurinha']
handler.tags = ['sticker']
handler.command = /^(s|f|sticker|figurinha)$/i
handler.register = false

export default handler