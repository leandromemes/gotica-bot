/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fetch from 'node-fetch'

const fancyFontMap = {
  'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
  'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
}

function toFancyText(text) {
  return text.split('').map(char => fancyFontMap[char] || char).join('')
}

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  const isSoberano = isOwner || isROwner || m.sender.includes('240041947357401')

  if (args[0] === 'on' || args[0] === 'enable') {
    if (chat.modoadmin === true) return m.reply(`*Opa! O modo Soberano/Adm já está ativado aqui.*`)
    chat.modoadmin = true
    await m.react('🔐')
    let textOn = `✅ *MODO ADMIN ATIVADO*\n\nAgora só os patrões (Adms) podem me usar. Os membros comuns vão ter que esperar ou chorar na cama! 🤫🦇`
    await conn.reply(m.chat, textOn, m)
    
  } else if (args[0] === 'off' || args[0] === 'disable') {
    if (chat.modoadmin === false) return m.reply(`*O modo já está desativado.*`)
    chat.modoadmin = false
    await m.react('🔓')
    let textOff = `⚠️ *MODO ADMIN DESATIVADO*\n\nPronto, liberei a bagunça. Agora até os meros mortais podem usar meus comandos de novo. 🙄`
    await conn.reply(m.chat, textOff, m)
    
  } else {
    const estado = chat.modoadmin ? '✓ Ativado (Só Adms)' : '✗ Desativado (Todos)'
    return conn.reply(m.chat, `「🦇」 ${toFancyText('Uso do Comando')}:\n*${usedPrefix}${command} on/off*\n\n${toFancyText('Estado Atual')}: *${toFancyText(estado)}*`, m)
  }
}

handler.help = ['soadm on/off']
handler.tags = ['adm']
handler.command = ['soadm', 'soloadmin', 'modoadmin']
handler.group = true
handler.admin = true // Apenas Adms e Soberano ativam

export default handler