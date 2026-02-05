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
import { xpRange } from '../lib/levelling.js';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p }) => {
  // Reação de espera
  await m.react('⏳');

  try {
    let { exp, level, role } = global.db.data.users[m.sender] || { exp: 0, level: 0, role: 'Verme' };
    let name = await conn.getName(m.sender);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
    let version = '2.0.4';

    // 1. Lógica para pegar vídeo aleatório da pasta src/menu
    const gifVideosDir = path.join(cwd, 'src', 'menu');
    let randomVideo = null;
    if (fs.existsSync(gifVideosDir)) {
        const files = fs.readdirSync(gifVideosDir).filter(file => file.endsWith('.mp4') || file.endsWith('.mkv'));
        if (files.length > 0) {
            randomVideo = path.join(gifVideosDir, files[Math.floor(Math.random() * files.length)]);
        }
    }

    // 2. Prepara a mídia
    let media = await prepareWAMessageMedia(
        { video: randomVideo ? fs.readFileSync(randomVideo) : { url: 'https://files.catbox.moe/yyk5xo.jpg' }, gifPlayback: true }, 
        { upload: conn.waUploadToServer }
    );

    // 3. Texto Principal formatado com Novo Título e Copy
    let ucapanText = ucapan();
    let textoPrincipal = `🌙ᩚ⃟꙰⟡˖ *𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐌𝐄𝐍𝐔𝐒* 🌙⃟✿˚

𝙊𝙡𝙖́ *${name}* ${ucapanText}
𝙈𝙚𝙪 𝙣𝙤𝙢𝙚 𝙚́ *𝙂𝙤́𝙩𝙞𝙘𝙖 𝘽𝙤𝙩*! 💋


┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🦇❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menuprincipal*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🛡️❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menuadm*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟👑❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menudono*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🧩❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menubrincadeiras*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎮❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menujogos*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟💰❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menureal*
┃
┃ ─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔞❈┉━━━━─
┃
┃ ი ̯ ✦⋆͜͡҈➳ *${_p}menu+18*
┃
├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆

😌 *Faça parte da nossa elite! Receba novidades exclusivas em nosso canal oficial.*📢 
👇 *CLIQUE NO BOTÃO* 👇`.trim();

    // 4. Mensagem Interativa
    const interactiveMessage = {
      header: { 
        hasMediaAttachment: true, 
        videoMessage: media.videoMessage 
      },
      body: { text: textoPrincipal },
      footer: { text: "" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "𝖢𝖺𝗇𝖺𝗅 𝖽𝖺 𝖦𝗈́𝗍𝗂𝖼𝖺 💋",
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
    await m.react('🦇');

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

function clockString(ms) {
  let d = Math.floor(ms / 86400000);
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let result = [];
  if (d > 0) result.push(`${d}d`);
  if (h > 0) result.push(`${h}h`);
  if (m > 0) result.push(`${m}m`);
  return result.length > 0 ? result.join(' ') : '0m';
}

function ucapan() {
  const time = moment.tz('America/Sao_Paulo').format('HH');
  if (time >= 5 && time < 12) return "𝘽𝙤𝙢 𝘿𝙞𝙖! ☀️";
  if (time >= 12 && time < 18) return "𝘽𝙤𝙖 𝙏𝙖𝙧𝙙𝖾! 🌤️";
  return "𝘽𝙤𝙖 𝙉𝙤𝙞𝙩𝙚! 🌙";
}