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

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = conn.getName(who);
    let name2 = conn.getName(m.sender);
    await m.react('😴');

    let str;
    if (m.mentionedJid.length > 0 || m.quoted) {
        str = `*${name2}* está dormindo com *${name || who}*. 😴💤`;
    } else {
        str = `*${name2}* está tirando um cochilo... 😴`.trim();
    }
    
    if (m.isGroup) {
        // Vídeos originais preservados conforme sua ordem
        let pp = 'https://telegra.ph/file/0684477ff198a678d4821.mp4'; 
        let pp2 = 'https://telegra.ph/file/583b7a7322fd6722751b5.mp4'; 
        let pp3 = 'https://telegra.ph/file/e6ff46f4796c57f2235bd.mp4';
        let pp4 = 'https://telegra.ph/file/06b4469cd5974cf4e28ff.mp4';
        let pp5 = 'https://telegra.ph/file/9213f74b91f8a96c43922.mp4';
        let pp6 = 'https://telegra.ph/file/b93da0c01981f17c05858.mp4';
        let pp7 = 'https://telegra.ph/file/8e0b0fe1d653d6956608a.mp4';
        let pp8 = 'https://telegra.ph/file/3b091f28e5f52bc774449.mp4';
        let pp9 = 'https://telegra.ph/file/7c795529b38d1a93395f6.mp4';
        let pp10 = 'https://telegra.ph/file/6b8e6cc26de052d4018ba.mp4';
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10];
        const video = videos[Math.floor(Math.random() * videos.length)];

        let mentions = [who];
        await conn.sendMessage(m.chat, { 
            video: { url: video }, 
            gifPlayback: true, 
            caption: str, 
            mentions 
        }, { quoted: m });
    }
}

handler.help = ['dormir', 'sleep'];
handler.tags = ['anime'];
handler.command = ['dormir', 'dormi', 'soninho']; // Tudo em português
handler.group = true;

// Cooldown zero para o soberano Leandro, 5s para os outros
handler.cooldown = m => (m.sender.split`@`[0] === '556391330669' ? 0 : 5000);

// Para que serve: Envia um vídeo de anime de alguém dormindo ou tirando um cochilo.
// Como usar: .dormir @marcar ou apenas .dormir.
// Acesso: Todos os membros.

export default handler;