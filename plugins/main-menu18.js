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
    
    texto += `*Território proibido...* 🌚\n`
    texto += `O lado obscuro da Gótica. 💋🩸\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🌙 𝙄𝙉𝙁𝙊 𝘿𝘼 𝘽𝙊𝙏\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━─\n`
    texto += `┇┆🤴 *Criador:* Leandro\n`
    texto += `┇┆⏱️ *Ativa:* ${uptime}\n`
    texto += `┇┆📅 *Data:* ${date}\n`
    texto += `┇┆📍 *Prefixo:* [ ${_p} ]\n`
    texto += `┇┆💿 *Versão:* ${version}\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: CONTEÚDO ADULTO ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🔞 𝘾𝙊𝙉𝙏𝙀𝙐́𝘿𝙊 𝘼𝘿𝙐𝙇𝙏𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔞❈┉━━━━─\n`
    texto += `┇┆👘 ✦⋆͜͡҈➳ *${_p}hentai*\n`
    texto += `┇┆👠 ✦⋆͜͡҈➳ *${_p}atriz*\n`
    texto += `┇┆📸 ✦⋆͜͡҈➳ *${_p}modelos*\n`
    texto += `┇┆📦 ✦⋆͜͡҈➳ *${_p}pack*\n`
     texto += `┇┆📦 ✦⋆͜͡҈➳ *${_p}videoxxx*\n`
     texto += `┇┆🔞 ✦⋆͜͡҈➳ *${_p}hentaivid*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: INTERAÇÃO CALIENTE ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🍑 𝙄𝙉𝙏𝙀𝙍𝘼𝘾̧𝘼̃𝙊 𝙀 𝘼𝙁𝙀𝙏𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🍑❈┉━━━━─\n`
    texto += `┇┆🔥 ✦⋆͜͡҈➳ *${_p}foder*\n`
    texto += `┇┆🍑 ✦⋆͜͡҈➳ *${_p}anal*\n`
    texto += `┇┆👅 ✦⋆͜͡҈➳ *${_p}mamar*\n`
    texto += `┇┆💦 ✦⋆͜͡҈➳ *${_p}gozar*\n`
    texto += `┇┆🍆 ✦⋆͜͡҈➳ *${_p}punheta*\n`
    texto += `┇┆🦶 ✦⋆͜͡҈➳ *${_p}punhetapes*\n`
    texto += `┇┆🧴 ✦⋆͜͡҈➳ *${_p}espanhola*\n`
    texto += `┇┆👙 ✦⋆͜͡҈➳ *${_p}chuparpeitos*\n`
    texto += `┇┆🍒 ✦⋆͜͡҈➳ *${_p}peganopeito*\n`
    texto += `┇┆🐈 ✦⋆͜͡҈➳ *${_p}lamberbct*\n`
    texto += `┇┆👋 ✦⋆͜͡҈➳ *${_p}palmada*\n`
    texto += `┇┆✂️ ✦⋆͜͡҈➳ *${_p}tesoura*\n`
    texto += `┇┆♋ ✦⋆͜͡҈➳ *${_p}69*\n`
    texto += `┇┆🎯 ✦⋆͜͡҈➳ *${_p}penetrar*\n`
    texto += `┇┆🏩 ✦⋆͜͡҈➳ *${_p}transar*\n`
    texto += `┇┆⚠️ ✦⋆͜͡҈➳ *${_p}estrupar*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`


    texto += `😌 *A elite sabe onde encontrar o melhor.*\n`
    texto += `👇 *CLIQUE NO BOTÃO* 👇`.trim();

    const interactiveMessage = {
      header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
      body: { text: texto },
      footer: { text: "dev Leandro • Gótica Bot ⚡" },
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
handler.command = ['menu18', 'porn', 'menu+18'];

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