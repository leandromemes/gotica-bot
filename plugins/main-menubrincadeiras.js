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
    
    texto += `*Olá! Pronto para um pouco de entretenimento?* 🎭\n`
    texto += `Aqui estão os comandos para você interagir e se divertir com seus amigos no grupo. 🦇✨\n\n`

    texto += `┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓
┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*
┃ 🤴 *Criador:* Dev Leandro
┃ ⏱️ *Ativa:* ${uptime}
┃ 📅 *Data:* ${date}
┃ 📍 *Prefixo:* [ ${_p} ]
┃ 💿 *Versão:* ${version}
┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛\n\n`

    texto += `🎭 𝙄𝙉𝙏𝙀𝙍𝘼𝘾̧𝘼̃𝙊 𝙀 𝙕𝙊𝙀𝙄𝙍𝘼\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎭❈┉━━━━─\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}bravo*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}engravidar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}nu*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}dormir*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}decepção*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}ola*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}feliz*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}bebado*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}chorar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}comer*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}tedio*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}morder*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}lingua*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}banho*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}vergonha*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}dançar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}corno*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}gado*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}cafe*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}boanoite*\n\n`

        texto += `🔮 RELACIONAMENTOS\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔮❈┉━━━━─\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}beijar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}abraçar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}casar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}metadinha*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}namorar*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}topcasados*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}casados*\n\n`

    texto += `🔮 𝘿𝙀𝙎𝙏𝙄𝙉𝙊 𝙀 𝙎𝙊𝙍𝙏𝙀\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🔮❈┉━━━━─\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}shipo*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}chance*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}pergunta*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}waifu*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}prever*\n`
    texto += `ი ̯ ✦⋆͜͡҈➳ *${_p}vadiar*\n`

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
    m.reply('❌ Erro ao abrir o menu de diversão.');
  }
};

handler.help = ['menubrincadeiras'];
handler.tags = ['main'];
handler.command = ['menubrincadeiras', 'brincadeiras', 'brincadeira', 'menub'];

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