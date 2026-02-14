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
  try {
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
    let version = '2.0.4';

    const gifVideosDir = path.join(process.cwd(), 'src', 'menu');
    let randomVideo = null;
    if (fs.existsSync(gifVideosDir)) {
        const files = fs.readdirSync(gifVideosDir).filter(file => file.endsWith('.mp4'));
        if (files.length > 0) {
            randomVideo = path.join(gifVideosDir, files[Math.floor(Math.random() * files.length)]);
        }
    }

    let media = await prepareWAMessageMedia(
        { video: randomVideo ? fs.readFileSync(randomVideo) : { url: 'https://files.catbox.moe/yyk5xo.jpg' }, gifPlayback: true }, 
        { upload: conn.waUploadToServer }
    );

    let texto = `┏━ 💰 𝗠𝗘𝗡𝗨 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔 💰 ━┓\n\n`
    texto += `┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓\n`
    texto += `┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*\n`
    texto += `┃ 🤴 *Criador:* Leandro\n`
    texto += `┃ ⏱️ *Ativa:* ${uptime}\n`
    texto += `┃ 📅 *Data:* ${date}\n`
    texto += `┃ 📍 *Prefixo:* [ ${_p} ]\n`
    texto += `┃ 💿 *Versão:* ${version}\n`
    texto += `┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `👑 𝙋𝘼𝙄𝙉𝙀𝙇 𝘿𝙊 𝙎𝙊𝘽𝙀𝙍𝘼𝙉𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟👑❈┉━━━━─\n`
    texto += `┇┆💸 ✦⋆͜͡҈➳ *${_p}dardinheiro*\n`
    texto += `┇┆📉 ✦⋆͜͡҈➳ *${_p}tirardinheiro*\n`
    texto += `┇┆🧹 ✦⋆͜͡҈➳ *${_p}resetargrana*\n`
    texto += `┇┆🎫 ✦⋆͜͡҈➳ *${_p}gerarcodigo*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `⚙️ 𝘼𝙏𝙄𝙑𝘼𝘾̧𝙊̃𝙀𝙎 𝘿𝙀 𝘼𝘿𝙈\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟⚙️❈┉━━━━─\n`
    texto += `┇┆🛠️ ✦⋆͜͡҈➳ *${_p}modoreal* [on/off]\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `⚒️ 𝙂𝘼𝙉𝙃𝙊𝙎 𝙀 𝙏𝙍𝘼𝘽𝘼𝙇𝙃𝙊𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟⚒️❈┉━━━━─\n`
    texto += `┇┆👷 ✦⋆͜͡҈➳ *${_p}trabalhar*\n`
    texto += `┇┆📦 ✦⋆͜͡҈➳ *${_p}traficar*\n`
    texto += `┇┆🔫 ✦⋆͜͡҈➳ *${_p}roubar*\n`
    texto += `┇┆🗓️ ✦⋆͜͡҈➳ *${_p}salario*\n`
    texto += `┇┆🚔 ✦⋆͜͡҈➳ *${_p}crime*\n`
    texto += `┇┆🛫 ✦⋆͜͡҈➳ *${_p}viajar*\n`
    texto += `┇┆⚔️ ✦⋆͜͡҈➳ *${_p}missao*\n`
    texto += `┇┆🌳 ✦⋆͜͡҈➳ *${_p}bosque*\n`
    texto += `┇┆🎃 ✦⋆͜͡҈➳ *${_p}halloween*\n`
    texto += `┇┆🦇 ✦⋆͜͡҈➳ *${_p}caverna*\n`
    texto += `┇┆🎁 ✦⋆͜͡҈➳ *${_p}recompensa*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🎲 𝘼𝙋𝙊𝙎𝙏𝘼𝙎 𝙀 𝙎𝙊𝙍𝙏𝙀\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎲❈┉━━━━─\n`
    texto += `┇┆🎰 ✦⋆͜͡҈➳ *${_p}apostar*\n`
    texto += `┇┆💰 ✦⋆͜͡҈➳ *${_p}apostartudo*\n`
    texto += `┇┆🎡 ✦⋆͜͡҈➳ *${_p}roleta*\n`
    texto += `┇┆🪙 ✦⋆͜͡҈➳ *${_p}caraoucoroa*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🏦 𝘽𝘼𝙉𝘾𝙊 𝙀 𝙎𝙏𝘼𝙏𝙐𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🏦❈┉━━━━─\n`
    texto += `┇┆🏦 ✦⋆͜͡҈➳ *${_p}saldo*\n`
    texto += `┇┆💳 ✦⋆͜͡҈➳ *${_p}inventario*\n`
    texto += `┇┆📥 ✦⋆͜͡҈➳ *${_p}depositar*\n`
    texto += `┇┆📤 ✦⋆͜͡҈➳ *${_p}sacar*\n`
    texto += `┇┆⚡ ✦⋆͜͡҈➳ *${_p}pix*\n`
    texto += `┇┆🏆 ✦⋆͜͡҈➳ *${_p}ricos*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
    texto += `🎁 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎 𝙀𝙓𝙏𝙍𝘼𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎁❈┉━━━━─\n`
    texto += `┇┆🩹 ✦⋆͜͡҈➳ *${_p}curar*\n`
    texto += `┇┆🎟️ ✦⋆͜͡҈➳ *${_p}resgatar*\n`
    texto += `┇┆🛍️ ✦⋆͜͡҈➳ *${_p}loja*\n`
    texto += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

    texto += `├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆\n\n`
    texto += `😌 *Faça parte da nossa elite! Receba novidades exclusivas em nosso canal oficial.*📢\n`
    texto += `👇 *CLIQUE NO BOTÃO* 👇`

    const interactiveMessage = {
      header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
      body: { text: texto.trim() },
      footer: { text: "Gotica Bot - Leandro" },
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
    await m.react('💰');

  } catch (e) {
    console.error(e);
    m.reply('❌ Erro ao abrir menu de economia.');
  }
};

handler.command = ['menueconomia', 'menureal', 'menurpg', 'economia'];
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