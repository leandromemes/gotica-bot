/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { promises } from 'fs';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';

const cwd = process.cwd();

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
    try {
        let user = global.db?.data?.users?.[m.sender] || { exp: 0, level: 0 };
        let { exp, level } = user;
        
        let role = (level <= 3) ? '🥉 BRONZE' : 
                   (level <= 10) ? '🥈 PRATA' : 
                   (level <= 20) ? '🥇 OURO' : 
                   (level <= 35) ? '💠 PLATINA' : 
                   (level <= 50) ? '💎 DIAMANTE' : 
                   (level <= 70) ? '🏆 MESTRE' : 
                   (level <= 100) ? '🔥 ELITE' : '👑 DESAFIANTE';

        let { max } = xpRange(level, global.multiplier || 1);
        let name = await conn.getName(m.sender);
        let uptime = process.uptime() * 1000;
        let muptime = clockString(uptime);
        let totalreg = global.db?.data?.users ? Object.keys(global.db.data.users).length : 0;

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

        let sections = [{
            title: "𝐒𝐄𝐋𝐄𝐂𝐈𝐎𝐍𝐄 𝐔𝐌𝐀 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐀",
            rows: [
                { title: "🦇 𝗠𝗘𝗡𝗨 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟", description: "Membros, Downloads e Stickers", id: `${_p}menuprincipal` },
                { title: "🛡️ 𝗠𝗘𝗡𝗨 𝗔𝗗𝗠", description: "Comandos de Gerenciamento e Grupo", id: `${_p}menugrupo` },
                { title: "👑 𝗠𝗘𝗡𝗨 𝗗𝗢𝗡𝗢", description: "Comandos de Controle e Ferramentas Lord", id: `${_p}menuowner` },
                { title: "🧩 𝗕𝗥𝗜𝗡𝗖𝗔𝗗𝗘𝗜𝗥𝗔𝗦", description: "Diversão e Interação", id: `${_p}menubrincadeiras` },
                { title: "🎲 𝗠𝗘𝗡𝗨 𝗝𝗢𝗚𝗢𝗦", description: "Desafios e Mini-jogos", id: `${_p}menujuegos` },
                { title: "💰 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔 & 𝗥𝗣𝗚", description: "Ranking, XP e Status", id: `${_p}menueconomia` },
                { title: "🔞 𝗠𝗘𝗡𝗨 +𝟭𝟴", description: "Conteúdo Adulto (NSFW)", id: `${_p}menunsfw` }
            ]
        }];

        let texto = `𝙊𝙡𝙖́ *${name}*, ${ucapan()}
𝙈𝙚𝙪 𝙣𝙤𝙢𝙚 𝙚́ *𝙂𝙤́𝙩𝙞𝙘𝙖 𝘽𝙤𝙩*! 💋

┏━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━┓
┃   *𝖨𝖭𝖥𝖮 𝖣𝖠 𝖡𝖮𝖳*
┃ 🤴 *Criador:* Dev Leandro
┃ ⏱️ *Ativa:* ${muptime}
┃ 👥 *Usuários:* ${totalreg}
┗━━━━⏤͟͟͞͞★꙲⃝͟🌙❈┉━━━━┛

🕸️ᩚ⃟꙰⟡˖ ࣪𝗦𝗧𝗔𝗧𝗨𝗦 𝗗𝗢 𝗨𝗦𝗨𝗔́𝗥𝗜𝗢 🕸️
🌑 *E𝗫𝗣:* ${exp} / ${max}
🌑 *𝗡𝗜́𝗩𝗘𝗟:* ${level}
🌑 *𝗣𝗔𝗧𝗘𝗡𝗧𝗘:* ${role}`.trim();

        let headerMessage = { hasMediaAttachment: true };
        if (randomGif) {
            headerMessage.videoMessage = media.videoMessage;
        } else {
            headerMessage.imageMessage = media.imageMessage;
        }

        const interactiveMessage = {
            header: headerMessage,
            body: { text: texto },
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
                    },
                    {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "✨ ABRIR MENU LISTA",
                            sections: sections
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
        conn.reply(m.chat, `⚠️ *Erro no menu:* ${e.message}`, m);
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|ajuda)$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

function ucapan() {
    const hour = moment.tz('America/Sao_Paulo').hour();
    if (hour >= 5 && hour < 12) return "𝘽𝙤𝙢 𝘿𝙞𝙖! ☀️";
    if (hour >= 12 && hour < 18) return "𝘽𝙤𝙖 𝙏𝙖𝙧𝙙𝙚! 🌤️";
    return "𝘽𝙤𝙖 𝙉𝙤𝙞𝙩𝐞! 🌙";
}