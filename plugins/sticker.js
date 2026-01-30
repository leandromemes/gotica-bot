/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * * dev: leandro rocha
 */

import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    let packname = 'Gótica Bot 🦇'
    let author = 'Dev: Leandro Rocha'

    if (/webp|image|video/g.test(mime)) {
      // Verificação de vídeo (máximo 11 seg)
      if (/video/g.test(mime)) {
        if ((q.msg || q).seconds > 11) return m.reply('❮✦❯ O vídeo deve ter no máximo 10 segundos!')
      }

      // Baixando a mídia diretamente do Baileys
      let img = await q.download?.()
      if (!img) return m.reply('❮✦❯ Falha ao baixar a mídia. Tente novamente!')

      // Criando a figurinha
      stiker = await sticker(img, false, packname, author)
      
    } else if (args[0] && /https?:\/\//.test(args[0])) {
      // Caso seja um link
      stiker = await sticker(false, args[0], packname, author)
      
    } else {
      return m.reply(`❮✦❯ Marque uma foto ou vídeo com *${usedPrefix + command}*`)
    }
  } catch (e) {
    console.error(e)
    stiker = false
  } finally {
    if (stiker) {
      // Envio direto como sticker
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
    } else {
      m.reply('❮✦❯ Erro ao criar figurinha. Verifique se o FFmpeg está instalado!')
    }
  }
}

handler.help = ['s', 'f', 'sticker', 'figurinha']
handler.tags = ['sticker']
handler.command = /^(s|f|sticker|figurinha)$/i

export default handler