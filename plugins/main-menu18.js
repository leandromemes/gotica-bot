/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix: _p }) => {
  await m.react('🔞');

  try {
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
    let version = '2.0.4';

    const gifVideosDir = path.join(process.cwd(), 'src', 'menu');
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

    let texto = `┏━━ 🔞 𝗠𝗘𝗡𝗨 𝗛𝗘𝗡𝗧𝗔𝗜 🔞 ━━┓\n\n`
    
    texto += `*'território proibido...* 🌚\n`
    texto += `A Gótica também tem seu lado obscuro. Use com responsabilidade (ou não). 💋🩸\n\n`

    texto += `┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓
┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*
┃ 🤴 *Criador:* Dev Leandro
┃ ⏱️ *Ativa:* ${uptime}
┃ 📅 *Data:* ${date}
┃ 📍 *Prefixo:* [ ${_p} ]
┃ 💿 *Versão:* ${version}
┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛\n\n`

    texto += `🔞 𝘾𝙊𝙉𝙏𝙀𝙐́𝘿𝙊 𝘼𝘿𝙐𝙇𝙏𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔞❈┉━━━━─\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}hentai*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}nsfwloli*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}nsfwfoot*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}nsfwass*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}nsfwbdsm*\n\n`

    texto += `🎥 𝙈𝙄́𝘿𝙄𝘼 𝙋𝙀𝙍𝗜𝗚𝙊𝙎𝘼\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔥❈┉━━━━─\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}pack*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}videosx*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}hentaivid*\n\n`

    texto += `├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆\n\n`
    texto += `😌 *Faça parte da nossa elite! Receba novidades exclusivas em nosso canal oficial.*📢\n`
    texto += `👇 *CLIQUE NO BOTÃO* 👇`.trim();

    const interactiveMessage = {
      header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
      body: { text: texto },
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

  } catch (e) {
    console.error(e);
    m.reply('❌ O conteúdo proibido falhou ao carregar.');
  }
};

handler.help = ['menu18'];
handler.tags = ['main'];
handler.command = ['menu18', 'hentai', 'porn', 'menu+18'];

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