/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p }) => {
    try {
        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);
        let totalreg = global.db?.data?.users ? Object.keys(global.db.data.users).length : 0;
        
        let tags = {
            'main': '𝗜𝗡𝗙𝗢 / 𝗕𝗢𝗧',
            'sticker': '𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦',
            'downloader': '𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦',
            'tools': '𝗙𝗘𝗥𝗥𝗔𝗠𝗘𝗡𝗧𝗔𝗦'
        }

        const gifVideosDir = path.join(cwd, 'src', 'menu');
        let randomGif = null;
        if (fs.existsSync(gifVideosDir)) {
            const gifVideos = fs.readdirSync(gifVideosDir).filter(file => file.endsWith('.mp4'));
            if (gifVideos.length > 0) randomGif = path.join(gifVideosDir, gifVideos[Math.floor(Math.random() * gifVideos.length)]);
        }

        let media = randomGif 
            ? await prepareWAMessageMedia({ video: { url: randomGif }, gifPlayback: true }, { upload: conn.waUploadToServer })
            : await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/yyk5xo.jpg' } }, { upload: conn.waUploadToServer });

        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled)
        let txt = `🕸️ *𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 - 𝙈𝙀𝙉𝙐 𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇* 🕸️\n\n`
        txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n┖╮★彡[ 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 ]彡★\n`
        txt += `┃ 🤴 𝘿𝙚𝙫: Leandro Rocha\n┃ ⏱️ 𝘼𝙩iva: ${uptime}\n┃ 👥 𝙐𝙨𝙪𝙖́𝙧𝙞𝙤𝙨: ${totalreg}\n┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛\n\n`

        for (let tag in tags) {
            let filteredHelp = help.filter(menu => menu.tags && menu.tags.includes(tag))
            if (filteredHelp.length > 0) {
                txt += `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆\n┖╮★彡[ ${tags[tag]} ]彡★\n┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n`
                for (let menu of filteredHelp) {
                    if (menu.help) {
                        let mainName = Array.isArray(menu.help) ? menu.help[0] : menu.help;
                        txt += `┇┆⚡ ✦⋆͜͡҈➳ ${_p}${mainName}\n`
                    }
                }
                txt += `┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ\n▹▫◃\n\n`
            }
        }

        let headerMessage = randomGif ? { hasMediaAttachment: true, videoMessage: media.videoMessage } : { hasMediaAttachment: true, imageMessage: media.imageMessage };

        const interactiveMessage = {
            header: headerMessage,
            body: { text: txt.trim() },
            footer: { text: "Gótica Bot • dev Leandro" },
            nativeFlowMessage: {
                buttons: [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📢 𝖢𝖺𝗇𝖺𝗅 𝖽𝖺 𝖦𝗈́𝗍𝗂𝖼𝖺",
                        url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u",
                        merchant_url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u"
                    })
                }]
            }
        };

        let msgi = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: m });
        await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
        await m.react('🦇');
    } catch (e) { console.error(e); m.reply('❌ Erro ao gerar menu.'); }
};

handler.help = ['menuprincipal'];
handler.tags = ['main'];
handler.command = ['menuprincipal'];
export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${h}h ${m}m ${s}s`;
}