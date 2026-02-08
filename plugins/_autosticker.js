/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { sticker } from '../lib/sticker.js'

const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = m => m

handler.all = async function (m) {
  let chat = db.data.chats[m.chat]
  let user = db.data.users[m.sender]

  // Verifica se o recurso está ativo no grupo
  if (chat.autosticker && m.isGroup) {
    let q = m
    let stiker = false
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    
    // Define o nome do pacote e autor (Especial para o Soberano)
    const isSoberano = (m.sender.includes(DONO_PHONE) || m.sender === TARGET_JID_DONO)
    let pack = isSoberano ? "Soberano" : (global.packname || 'Gótica Bot')
    let auth = isSoberano ? "gotica bot" : (global.author || 'dev Leandro')

    if (/webp/g.test(mime)) return
    
    if (/image/g.test(mime)) {
      let img = await q.download?.()
      if (!img) return
      stiker = await sticker(img, false, pack, auth)
      
    } else if (/video/g.test(mime)) {
      if ((q.msg || q).seconds > 15) {
        return await m.reply(`*《✧》O vídeo não deve durar mais de 15 segundos.*`)
      }

      let img = await q.download()
      if (!img) return
      // Para vídeos, mantemos a lógica de sticker animado
      stiker = await sticker(img, false, pack, auth)
      
    } else if (m.text.split(/\n| /i)[0]) {
      if (isUrl(m.text)) {
        stiker = await sticker(false, m.text.split(/\n| /i)[0], pack, auth)
      } else return
    }

    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true)
    }
  }
  return !0
}

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi'))
}