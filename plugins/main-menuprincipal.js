/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p }) => {
    await m.react('⏳');
    try {
        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);
        let date = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
        let version = '2.0.4'; 
        
        const gifVideosDir = path.join(cwd, 'src', 'menu');
        let randomGif = null;
        if (fs.existsSync(gifVideosDir)) {
            const gifVideos = fs.readdirSync(gifVideosDir).filter(file => file.endsWith('.mp4') || file.endsWith('.mkv'));
            if (gifVideos.length > 0) randomGif = path.join(gifVideosDir, gifVideos[Math.floor(Math.random() * gifVideos.length)]);
        }

        let media = await prepareWAMessageMedia(
            { video: randomGif ? fs.readFileSync(randomGif) : { url: 'https://files.catbox.moe/yyk5xo.jpg' }, gifPlayback: true }, 
            { upload: conn.waUploadToServer }
        );

        let txt = `┏ 🕸️ *𝗠𝗘𝗡𝗨 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟* 🕸️ ┓\n\n`
        
        txt += `┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓\n`
        txt += `┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*\n`
        txt += `┃ 🤴 *Criador:* Leandro\n`
        txt += `┃ ⏱️ *Ativa:* ${uptime}\n`
        txt += `┃ 📅 *Data:* ${date}\n`
        txt += `┃ 📍 *Prefixo:* [ ${_p} ]\n`
        txt += `┃ 💿 *Versão:* ${version}\n`
        txt += `┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛\n\n`

        
        // --- CATEGORIA: MENUS ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `🎨 𝙈𝙀𝙉𝙐𝙎 𝘿𝙀 𝘼𝘾𝙀𝙎𝙎𝙊\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎨❈┉━━━━─\n`
        txt += `┇┆👮 ✦⋆͜͡҈➳ *${_p}menuadm*\n`
        txt += `┇┆👑 ✦⋆͜͡҈➳ *${_p}menudono*\n`
        txt += `┇┆🧩 ✦⋆͜͡҈➳ *${_p}menubrincadeiras*\n`
        txt += `┇┆🎮 ✦⋆͜͡҈➳ *${_p}menujogos*\n`
        txt += `┇┆💪 ✦⋆͜͡҈➳ *${_p}menureal*\n`
        txt += `┇┆🔞 ✦⋆͜͡҈➳ *${_p}menu+18*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: STICKERS ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `🎭 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝙀 𝙁𝙄𝙂𝙐𝙍𝙄𝙉𝙃𝘼𝙎\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎭❈┉━━━━─\n`
        txt += `┇┆🖼️ ✦⋆͜͡҈➳ *${_p}sticker*\n`
        txt += `┇┆🃏 ✦⋆͜͡҈➳ *${_p}fig*\n`
        txt += `┇┆🔤 ✦⋆͜͡҈➳ *${_p}ttp*\n`
        txt += `┇┆🌀 ✦⋆͜͡҈➳ *${_p}emojimix*\n`
        txt += `┇┆📷 ✦⋆͜͡҈➳ *${_p}foto*\n`
        txt += `┇┆✍️ ✦⋆͜͡҈➳ *${_p}citacao*\n`
        txt += `┇┆🔄 ✦⋆͜͡҈➳ *${_p}toimg*\n`
        txt += `┇┆✂️ ✦⋆͜͡҈➳ *${_p}take*\n`
        txt += `┇┆🤖 ✦⋆͜͡҈➳ *${_p}autosticker*\n`
        txt += `┇┆🎞️ ✦⋆͜͡҈➳ *${_p}togif*\n`
        txt += `┇┆🎬 ✦⋆͜͡҈➳ *${_p}tomp4*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: DOWNLOADS ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `📥 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙎 𝙈𝙐𝙇𝙏𝙄𝙈𝙄𝘿𝙄𝘼\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟📥❈┉━━━━─\n`
        txt += `┇┆📽️ ✦⋆͜͡҈➳ *${_p}play*\n`
        txt += `┇┆🎧 ✦⋆͜͡҈➳ *${_p}spotify*\n`
        txt += `┇┆🎬 ✦⋆͜͡҈➳ *${_p}ytmp4*\n`
        txt += `┇┆📸 ✦⋆͜͡҈➳ *${_p}sp*\n`
        txt += `┇┆🎵 ✦⋆͜͡҈➳ *${_p}tomp3*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: FERRAMENTAS ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `🛠️ 𝙁𝙀𝙍𝙍𝘼𝙈𝙀𝙉𝙏𝘼𝙎 𝙐𝙏𝙀𝙄𝙎\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🛠️❈┉━━━━─\n`
        txt += `┇┆🧮 ✦⋆͜͡҈➳ *${_p}calculadora*\n`
        txt += `┇┆🌎 ✦⋆͜͡҈➳ *${_p}traduzir*\n`
        txt += `┇┆🗜️ ✦⋆͜͡҈➳ *${_p}comprimir*\n`
        txt += `┇┆🅰️ ✦⋆͜͡҈➳ *${_p}fontes*\n`
        txt += `┇┆🕒 ✦⋆͜͡҈➳ *${_p}horario*\n`
        txt += `┇┆🖊️ ✦⋆͜͡҈➳ *${_p}logos*\n`
        txt += `┇┆📲 ✦⋆͜͡҈➳ *${_p}print*\n`
        txt += `┇┆📄 ✦⋆͜͡҈➳ *${_p}todoc*\n`
        txt += `┇┆📕 ✦⋆͜͡҈➳ *${_p}topdf*\n`
        txt += `┇┆🔗 ✦⋆͜͡҈➳ *${_p}link*\n`
        txt += `┇┆📚 ✦⋆͜͡҈➳ *${_p}wikipedia*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: ENTRETENIMENTO ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `🎭 𝙀𝙉𝙏𝙍𝙀𝙏𝙀𝙉𝙄𝙈𝙀𝙉𝙏𝙊\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🎭❈┉━━━━─\n`
        txt += `┇┆👻 ✦⋆͜͡҈➳ *${_p}fake*\n`
        txt += `┇┆🆔 ✦⋆͜͡҈➳ *${_p}prever*\n`
        txt += `┇┆☁️ ✦⋆͜͡҈➳ *${_p}afk*\n`
        txt += `┇┆📚 ✦⋆͜͡҈➳ *${_p}wiki*\n`
        txt += `┇┆🎵 ✦⋆͜͡҈➳ *${_p}audio*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: ANIMES ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `⛩️ 𝘼𝙉𝙄𝙈𝙀𝙎 𝙀 𝙊𝙏𝘼𝙆𝙐\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟⛩️❈┉━━━━─\n`
        txt += `┇┆🔍 ✦⋆͜͡҈➳ *${_p}animes*\n`
        txt += `┇┆🎬 ✦⋆͜͡҈➳ *${_p}animeinfo*\n`
        txt += `┇┆🌸 ✦⋆͜͡҈➳ *${_p}waifu*\n`
        txt += `┇┆🏮 ✦⋆͜͡҈➳ *${_p}loli*\n`
        txt += `┇┆🧩 ✦⋆͜͡҈➳ *${_p}akira*\n`
        txt += `┇┆👺 ✦⋆͜͡҈➳ *${_p}shinobu*\n`
        txt += `┇┆🔥 ✦⋆͜͡҈➳ *${_p}neko*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`

        // --- CATEGORIA: INTELIGÊNCIA ARTIFICIAL ---
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n`
        txt += `🧠 𝙄𝙉𝙏𝙀𝙇𝙄𝙂𝙀𝙉𝘾𝙄𝘼 𝘼𝙍𝙏𝙄𝙁𝙄𝘾𝙄𝘼𝙇\n`
        txt += `─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🧠❈┉━━━━─\n`
        txt += `┇┆💬 ✦⋆͜͡҈➳ *${_p}demo*\n`
        txt += `┇┆🤖 ✦⋆͜͡҈➳ *${_p}gemini*\n`
        txt += `┇┆✨ ✦⋆͜͡҈➳ *${_p}luminai*\n`
        txt += `┇┆🦙 ✦⋆͜͡҈➳ *${_p}llama*\n`
        txt += `┇┆🎨 ✦⋆͜͡҈➳ *${_p}gerar*\n`
        txt += `┇┆🖼️ ✦⋆͜͡҈➳ *${_p}flux*\n`
        txt += `┇┆🎵 ✦⋆͜͡҈➳ *${_p}vozes*\n`
        txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n\n`


        txt += `├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆\n\n`
        txt += `*Faça parte da nossa elite! Receba novidades exclusivas em nosso canal oficial.*📢\n`
        txt += `👇 *CLIQUE NO BOTÃO* 👇`.trim();

        const interactiveMessage = {
            header: { hasMediaAttachment: true, videoMessage: media.videoMessage },
            body: { text: txt },
            nativeFlowMessage: {
                buttons: [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "𝖢𝖺𝗇𝖺𝗅 𝖽𝖺 𝖦𝗈́𝗍𝗂𝖼𝖺 💋",
                        url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u"
                    })
                }]
            }
        };

        let msgi = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.id, quoted: m });
        await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
        await m.react('✨');
    } catch (e) { 
        console.error(e); 
        await m.react('❌');
        m.reply('❌ Erro ao gerar menu principal.'); 
    }
};

handler.help = ['menu', 'help'];
handler.tags = ['main'];
handler.command = ['menuprincipal', 'menup', 'comandos'];

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