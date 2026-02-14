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
  await m.react('🧩');

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

    let texto = `┏━ 🧩 𝗠𝗘𝗡𝗨 𝗗𝗜𝗩𝗘𝗥𝗦𝗔̃𝗢 🧩 ━┓\n\n`
    
    texto += `*Pronto para o entretenimento?* 🎭\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🌙 𝙄𝙉𝙁𝙊 𝘿𝘼 𝘽𝙊𝙏\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━─\n`
    texto += `┇┆🤴 *Criador:* Leandro\n`
    texto += `┇┆⏱️ *Ativa:* ${uptime}\n`
    texto += `┇┆📅 *Data:* ${date}\n`
    texto += `┇┆📍 *Prefixo:* [ ${_p} ]\n`
    texto += `┇┆💿 *Versão:* ${version}\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: JOGOS ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🎮 𝙅𝙊𝙂𝙊𝙎 𝙀 𝘿𝙀𝙎𝘼𝙐𝙄𝙊𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎮❈┉━━━━─\n`
    texto += `┇┆🎲 ✦⋆͜͡҈➳ *${_p}roleta*\n`
    texto += `┇┆🎰 ✦⋆͜͡҈➳ *${_p}cassino*\n`
    texto += `┇┆🧩 ✦⋆͜͡҈➳ *${_p}advinhacao*\n`
    texto += `┇┆🔠 ✦⋆͜͡҈➳ *${_p}anagrama*\n`
    texto += `┇┆💀 ✦⋆͜͡҈➳ *${_p}forca*\n`
    texto += `┇┆✂️ ✦⋆͜͡҈➳ *${_p}ppt*\n`
    texto += `┇┆🪙 ✦⋆͜͡҈➳ *${_p}caraoucoroa*\n`
    texto += `┇┆❌ ✦⋆͜͡҈➳ *${_p}velha*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: INTERAÇÃO ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🎭 𝙄𝙉𝙏𝙀𝙍𝘼𝘾̧𝘼̃𝙊 𝙀 𝘼𝘾̧𝙊̃𝙀𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎭❈┉━━━━─\n`
    texto += `┇┆👋 ✦⋆͜͡҈➳ *${_p}ola*\n`
    texto += `┇┆😡 ✦⋆͜͡҈➳ *${_p}bravo*\n`
    texto += `┇┆😴 ✦⋆͜͡҈➳ *${_p}dormir*\n`
    texto += `┇┆😊 ✦⋆͜͡҈➳ *${_p}feliz*\n`
    texto += `┇┆😭 ✦⋆͜͡҈➳ *${_p}chorar*\n`
    texto += `┇┆🤤 ✦⋆͜͡҈➳ *${_p}comer*\n`
    texto += `┇┆😑 ✦⋆͜͡҈➳ *${_p}tedio*\n`
    texto += `┇┆🦷 ✦⋆͜͡҈➳ *${_p}morder*\n`
    texto += `┇┆😛 ✦⋆͜͡҈➳ *${_p}lingua*\n`
    texto += `┇┆🛁 ✦⋆͜͡҈➳ *${_p}banho*\n`
    texto += `┇┆😳 ✦⋆͜͡҈➳ *${_p}vergonha*\n`
    texto += `┇┆💃 ✦⋆͜͡҈➳ *${_p}dançar*\n`
    texto += `┇┆☕ ✦⋆͜͡҈➳ *${_p}cafe*\n`
    texto += `┇┆💤 ✦⋆͜͡҈➳ *${_p}boanoite*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: RELACIONAMENTOS ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🔮 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉𝘼𝙈𝙀𝙉𝙏𝙊𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔮❈┉━━━━─\n`
    texto += `┇┆💋 ✦⋆͜͡҈➳ *${_p}beijar*\n`
    texto += `┇┆🫂 ✦⋆͜͡҈➳ *${_p}abraçar*\n`
    texto += `┇┆💍 ✦⋆͜͡҈➳ *${_p}casar*\n`
    texto += `┇┆💞 ✦⋆͜͡҈➳ *${_p}metadinha*\n`
    texto += `┇┆👩‍❤️‍👨 ✦⋆͜͡҈➳ *${_p}namorar*\n`
    texto += `┇┆🏆 ✦⋆͜͡҈➳ *${_p}topcasados*\n`
    texto += `┇┆💒 ✦⋆͜͡҈➳ *${_p}casados*\n`
    texto += `┇┆🤰 ✦⋆͜͡҈➳ *${_p}engravidar*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    // --- CATEGORIA: ZOERIA E SORTE ---
    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🎲 𝙕𝙊𝙀𝙄𝙍𝘼 𝙀 𝘿𝙀𝙎𝙏𝙄𝙉𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎲❈┉━━━━─\n`
    texto += `┇┆🚢 ✦⋆͜͡҈➳ *${_p}shipo*\n`
    texto += `┇┆📊 ✦⋆͜͡҈➳ *${_p}enquete*\n`
    texto += `┇┆📈 ✦⋆͜͡҈➳ *${_p}chance*\n`
    texto += `┇┆❓ ✦⋆͜͡҈➳ *${_p}pergunta*\n`
    texto += `┇┆✨ ✦⋆͜͡҈➳ *${_p}prever*\n`
    texto += `┇┆🔥 ✦⋆͜͡҈➳ *${_p}vadiar*\n`
    texto += `┇┆🍻 ✦⋆͜͡҈➳ *${_p}bebado*\n`
    texto += `┇┆🤘 ✦⋆͜͡҈➳ *${_p}corno*\n`
    texto += `┇┆🐂 ✦⋆͜͡҈➳ *${_p}gado*\n`
    texto += `┇┆😏 ✦⋆͜͡҈➳ *${_p}nu*\n`
    texto += `┇┆🌸 ✦⋆͜͡҈➳ *${_p}waifu*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `😌 *Faça parte da nossa elite!*\n`
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
    m.reply('❌ Erro ao abrir o menu unificado.');
  }
};

handler.help = ['menubrincadeiras'];
handler.tags = ['main'];
handler.command = ['menubrincadeiras', 'brincadeiras', 'brincadeira', 'menub', 'jogos', 'jogar'];

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