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

let handler = async (m, { conn, usedPrefix: _p, isOwner }) => {
  // Verificação de soberania
  const soberano = '556391330669@s.whatsapp.net';
  const isSoberano = m.sender === soberano || isOwner;

  if (!isSoberano) {
    await m.react('🖕');
    return conn.reply(m.chat, `「😒」 *Quem você pensa que é?* Hum? Você é apenas um pobre plebeu sem brilho tentando tocar nas funções do meu *Soberano Mestre Supremo Leandro*! Afaste-se! 🖤`, m);
  }

  await m.react('👑');

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

    // Título de Soberano - Limpo e Majestoso
    let texto = `┏━ 👑 𝗠𝗘𝗡𝗨 𝗗𝗢𝗡𝗢 👑 ━┓\n\n`
    
    texto += `*Saudações, Soberano!* 🍷\n`
    texto += `É uma honra ter você aqui, fique à vontade. ⚔️\n\n`

    texto += `🔱 𝙋𝙊𝘿𝙀𝙍 𝙎𝙐𝙋𝙍𝙀𝙈𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟👑❈┉━━━━─\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}reiniciar*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}sair*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}seradm*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}ignorar*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}atender*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}ignorados*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}apagarmsg*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}listadegrupos*\n`
    texto += `ი ̯👑 ✦⋆͜͡҈➳ *${_p}antiprivado* [on/off]\n\n`

    texto += `⚡ 𝙁𝙀𝙍𝙍𝘼𝙈𝙀𝙉𝙏𝘼𝙎 𝙎𝙐𝙋𝙍𝙀𝙈𝘼𝙎\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟⚙️❈┉━━━━─\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}aviso*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}prefix*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}detcplugins*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}delsession*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}rastrearip*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}limpartmp*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}ofuscar*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}github*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}comprimir*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}fake*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}uptime*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}horario*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}ip*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}setmsg* [gatilho]\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}delmsg* [gatilho]\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}listmsg*\n`
    texto += `ი ̯⚙️ ✦⋆͜͡҈➳ *${_p}apagarmsg*\n\n`

texto += `💎 𝙏𝙀𝙎𝙊𝙐𝙍𝙊 𝙍𝙀𝘼𝙇\n`
texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟💎❈┉━━━━─\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}addxp*\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}addmoney*\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}addprem*\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}delpremium*\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}listprem*\n`
texto += `ი ̯💎 ✦⋆͜͡҈➳ *${_p}checkprem*\n\n`

    texto += `🏰 𝙂𝙐𝘼𝙍𝘿𝘼 𝘿𝙊 𝙍𝙀𝙄𝙉𝙊\n`
    texto += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🛡️❈┉━━━━─\n`
    texto += `ი ̯🛡️ ✦⋆͜͡҈➳ *${_p}block*\n`
    texto += `ი ̯🛡️ ✦⋆͜͡҈➳ *${_p}setppbot*\n`
    texto += `ი ̯🛡️ ✦⋆͜͡҈➳ *${_p}nuke*\n`
    texto += `ი ̯🛡️ ✦⋆͜͡҈➳ *${_p}leavegc*\n\n`

    texto += `├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆\n\n`
    texto += `🧛 *Gótica Bot está sob seu total domínio, Majestade.* 🩸\n`
    texto += `👇 *ACESSO AO SEU REPOSITÓRIO* 👇`.trim();

    const interactiveMessage = {
      header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
      body: { text: texto },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🏰 Github do soberano",
              url: "https://github.com/leandromemes" 
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
    m.reply('❌ Soberano, a matriz encontrou uma resistência. Erro ao gerar o menu.');
  }
};

handler.help = ['menudono'];
handler.tags = ['main'];
handler.command = ['menudono', 'lord', 'dono', 'master'];

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