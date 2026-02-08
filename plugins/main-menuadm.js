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
  await m.react('⏳');

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

    // Título Grande e Destacado para evitar quebra de linha
    let texto = `┏━ 🛡️ 𝗠𝗘𝗡𝗨 𝗔𝗗𝗠𝗜𝗡 🛡️ ━┓\n\n`
    texto += `┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓
┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*
┃ 🤴 *Criador:* Dev Leandro
┃ ⏱️ *Ativa:* ${uptime}
┃ 📅 *Data:* ${date}
┃ 📍 *Prefixo:* [ ${_p} ]
┃ 💿 *Versão:* ${version}
┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛

🛡️ 𝙎𝙀𝙂𝙐𝙍𝘼𝙉𝘾̧𝘼 𝙀 𝙋𝙍𝙊𝙏𝙀𝘾̧𝘼̃𝙊
─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🛡️❈┉━━━━─
ი ̯ ✦⋆͜͡҈➳ *${_p}antibot* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}limparvirus* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}antibot* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}antibot* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}apagarmsg* 

🚫 𝙂𝙀𝙍𝙀𝙉𝘾𝙄𝘼𝙈𝙀𝙉𝙏𝙊
─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🚫❈┉━━━━─
ი ̯ ✦⋆͜͡҈➳ *${_p}x9* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}add*
ი ̯ ✦⋆͜͡҈➳ *${_p}promote*
ი ̯ ✦⋆͜͡҈➳ *${_p}demote*
ი ̯ ✦⋆͜͡҈➳ *${_p}setmsg*
ი ̯ ✦⋆͜͡҈➳ *${_p}delmsg*
ი ̯ ✦⋆͜͡҈➳ *${_p}listmsg*

⚙️ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾̧𝙊̃𝙀𝙎
─━━━━┉❈⏤͟͟͞͞★꙲⃝͟⚙️❈┉━━━━─
             
ი ̯ ✦⋆͜͡҈➳ *${_p}antibot* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}antilink* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}autosticker* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}welcome* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}antispam* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}antifake* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}antitrava* (on/off)
ი ̯ ✦⋆͜͡҈➳ *${_p}antivisu* [on/off]
ი ̯ ✦⋆͜͡҈➳ *${_p}autolevelup* [on/off]

📢 𝙁𝙀𝙍𝙍𝘼𝙈𝙀𝙉𝙏𝘼𝙎 𝙀 𝘼𝙑𝙄𝙎𝙊𝙎
─━━━━┉❈⏤͟͟͞͞★꙲⃝͟📢❈┉━━━━─
ი ̯ ✦⋆͜͡҈➳ *${_p}hidetag*
ი ̯ ✦⋆͜͡҈➳ *${_p}marcar*
ი ̯ ✦⋆͜͡҈➳ *${_p}agendar*
ი ̯ ✦⋆͜͡҈➳ *${_p}link*
ი ̯ ✦⋆͜͡҈➳ *${_p}qrcode*



├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆

😌 *Faça parte da nossa elite! Receba novidades exclusivas em nosso canal oficial.*📢 
👇 *CLIQUE NO BOTÃO* 👇`.trim();

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
    await m.react('🛡️');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Erro ao abrir menu administrativo.');
  }
};

handler.help = ['menuadm'];
handler.tags = ['main'];
handler.command = ['menuadm', 'adm', 'admin'];

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