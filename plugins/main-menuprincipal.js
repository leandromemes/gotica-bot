import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p }) => {
    try {
        // Removido o check de m.prefix que estava travando o comando
        
        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);
        let totalreg = global.db?.data?.users ? Object.keys(global.db.data.users).length : 0;
        let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length;

        // Lógica de Mídia (GIF ou Imagem)
        const gifVideosDir = path.join(cwd, 'src', 'menu');
        let randomGif = null;
        if (fs.existsSync(gifVideosDir)) {
            const gifVideos = fs.readdirSync(gifVideosDir)
                .filter(file => file.endsWith('.mp4'))
                .map(file => path.join(gifVideosDir, file));
            if (gifVideos.length > 0) {
                randomGif = gifVideos[Math.floor(Math.random() * gifVideos.length)];
            }
        }

        let media;
        if (randomGif) {
            media = await prepareWAMessageMedia({ video: { url: randomGif }, gifPlayback: true }, { upload: conn.waUploadToServer });
        } else {
            media = await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/yyk5xo.jpg' } }, { upload: conn.waUploadToServer });
        }

        let txt = `🕸️ *𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 - 𝙈𝙀𝙉𝙐 𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇* 🕸️

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[ 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧 ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┃ 🤴 𝘿𝙚𝙫: Leandro Rocha
┃ 🌐 𝘾𝙤𝙢𝙖𝙣𝙙𝙤𝙨: ${totalCommands}
┃ ⏱️ 𝘼𝙩iva: ${uptime}
┃ 👥 𝙐𝙨𝙪𝙖́𝙧𝙞𝙤𝙨: ${totalreg}
┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[ 𝗜𝗡𝗙𝗢 / 𝗕𝗢𝗧 ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆⚡ ✦⋆͜͡҈➳ ${_p}ping
┇┆⏲️ ✦⋆͜͡҈➳ ${_p}uptime
┇┆📋 ✦⋆͜͡҈➳ ${_p}menu
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[ 𝗚𝗥𝗨𝗣𝗢𝗦 ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆📜 ✦⋆͜͡҈➳ ${_p}regras
┇┆👮 ✦⋆͜͡҈➳ ${_p}adms
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🎨 ✦⋆͜͡҈➳ ${_p}s
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦 ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🎶 ✦⋆͜͡҈➳ ${_p}play
┇┆🎥 ✦⋆͜͡҈➳ ${_p}ytv
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃`.trim();

        // Correção na estrutura do Header para evitar conflito de mídia
        let headerMessage = { hasMediaAttachment: true };
        if (randomGif) {
            headerMessage.videoMessage = media.videoMessage;
        } else {
            headerMessage.imageMessage = media.imageMessage;
        }

        const interactiveMessage = {
            header: headerMessage,
            body: { text: txt },
            footer: { text: "Gótica Bot • dev Leandro" },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📢 𝖢𝖺𝗇𝖺𝗅 𝖽𝖺 𝖦𝗈́𝗍𝗂𝖼𝖺",
                            url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u",
                            merchant_url: "https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u"
                        })
                    }
                ]
            }
        };

        let msgi = generateWAMessageFromContent(m.chat, { 
            viewOnceMessage: { message: { interactiveMessage } } 
        }, { userJid: conn.user.jid, quoted: m });

        await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
        await m.react('🦇');

    } catch (e) {
        console.error(e);
        // Resposta de erro traduzida
        conn.reply(m.chat, `⚠️ *Erro ao carregar menu:* ${e.message}`, m);
    }
};

handler.help = ['menuprincipal'];
handler.tags = ['main'];
handler.command = ['menuall', 'allmenu', 'menuprincipal'];

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `${h}h ${m}m ${s}s`;
}