/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { promises } from 'fs';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p }) => {
  await m.react('⏳');

  try {
    let name = await conn.getName(m.sender);
    let ucapanText = ucapan();

    const gifVideosDir = path.join(cwd, 'src', 'menu');
    let randomVideo = null;
    if (fs.existsSync(gifVideosDir)) {
        const files = fs.readdirSync(gifVideosDir).filter(file => file.endsWith('.mp4') || file.endsWith('.mkv'));
        if (files.length > 0) {
            randomVideo = path.join(gifVideosDir, files[Math.floor(Math.random() * files.length)]);
        }
    }

    let media = await prepareWAMessageMedia(
        { video: randomVideo ? fs.readFileSync(randomVideo) : { url: 'https://files.catbox.moe/yyk5xo.jpg' }, gifPlayback: true }, 
        { upload: conn.waUploadToServer }
    );

    let textoPrincipal = `🌙ᩚ⃟꙰⟡˖ *𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐌𝐄𝐍𝐔𝐒* 🌙⃟✿˚\n\n`
    textoPrincipal += `𝙊𝙡𝙖́ *${name}* ${ucapanText}\n`
    textoPrincipal += `𝙈𝙚𝙪 𝙣𝙤𝙢𝙚 𝙚́ *𝙂𝙤́𝙩𝙞𝙘𝙖 𝘽𝙤𝙩*! 💋✨`

    const interactiveMessage = {
      header: { 
        hasMediaAttachment: true, 
        videoMessage: media.videoMessage 
      },
      body: { text: textoPrincipal },
      footer: { text: "dev Leandro • Gótica Bot ⚡" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "✨ MENU PRINCIPAL",
              id: `${_p}menupre`
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "🛡️ MENU ADM",
              id: `${_p}menuadm`
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "👑 MENU DONO",
              id: `${_p}menudono`
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "🧩 BRINCADEIRAS",
              id: `${_p}menubrincadeiras`
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "🔞 MENU +18",
              id: `${_p}menu+18`
            })
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "💋 CANAL DA GÓTICA",
              url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u"
            })
          }
        ]
      }
    };

    let msgi = generateWAMessageFromContent(m.chat, { 
      viewOnceMessage: { message: { interactiveMessage } } 
    }, { userJid: conn.user.id, quoted: m });

    await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
    await m.react('🖤');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `❌ Erro no menu: ${e.message}`, m);
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menus', 'ajuda'];

export default handler;

function ucapan() {
  const time = moment.tz('America/Sao_Paulo').format('HH');
  if (time >= 5 && time < 12) return "𝘽𝙤𝙢 𝘿𝙞𝙖! ☀️";
  if (time >= 12 && time < 18) return "𝘽𝙤𝙖 𝙏𝙖𝙧𝙙𝙚! 🌤️";
  return "𝘽𝙤𝙖 𝙉𝙤𝙞𝙩𝙚! 🌙";
}