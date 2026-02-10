/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fetch from 'node-fetch'

const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  const botNameGotica = "Gótica Bot"

  // Reação de atenção
  m.react('📣')

  // Verifica se é Admin ou Soberano
  if (!(isAdmin || isOwner)) {
    return m.reply('✨ *Soberano,* apenas você ou os administradores podem invocar a todos. 🖤')
  }

  let fkontak = null
  try {
    const res = await fetch('https://i.postimg.cc/nhdkndD6/pngtree-yellow-bell-ringing-with-sound-waves-png-image-20687908.png')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    fkontak = {
      key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: {
        locationMessage: {
          name: `¡𝗠𝗘𝗡𝗖̧𝗔̃𝗢 𝗣𝗔𝗥𝗔 𝗧𝗢𝗗𝗢 𝗢 𝗚𝗥𝗨𝗣𝗢!`,
          jpegThumbnail: thumb2
        }
      },
      participant: '0@s.whatsapp.net'
    }
  } catch {}

  const mensagem = args.join` ` || 'Atenção a todos os membros'
  const titulo = `*─ᐅ「 𝗔𝗩𝗜𝗦𝗢 𝗚𝗘𝗥𝗔𝗟 」*`

  let texto = `${titulo}\n\n`
  texto += `*Mensagem:* \`${mensagem}\`\n\n`
  texto += `╭─「 *Invocando as Sombras* 」\n`

  // Loop para listar membros com seus emojis alternados
  for (const member of participants) {
    texto += `│ 💫 @${member.id.split('@')[0]}\n`
  }

  texto += `╰─「 ${botNameGotica} 」`

  await conn.sendMessage(m.chat, { 
    text: texto, 
    mentions: participants.map((a) => a.id) 
  }, { quoted: fkontak })
}

handler.help = ['tagall <mensagem>']
handler.tags = ['admin']
handler.command = ['todos', 'invocar', 'marca', 'marcar'] // Handlers em português
handler.admin = true
handler.group = true
handler.register = false 

export default handler