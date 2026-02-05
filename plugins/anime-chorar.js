/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    // Para que serve: Envia um GIF de anime chorando, sozinho ou por alguém.
    // Como usar: .chorar @tag ou apenas .chorar
    // Público: Todos. Sem travas de registro.

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
    await m.react('😭');

    let str;
    if (m.mentionedJid.length > 0 || m.quoted) {
        str = `*${name2}* está chorando por culpa de *${name}*... 😭`;
    } else {
        str = `*${name2}* está chorando... 😭`.trim();
    }
    
    // Links de vídeos
    const videos = [
        'https://qu.ax/gRjHK.mp4', 
        'https://qu.ax/VjjCJ.mp4', 
        'https://qu.ax/ltieQ.mp4',
        'https://qu.ax/oryVi.mp4',
        'https://qu.ax/YprzU.mp4',
        'https://qu.ax/nxaUW.mp4',
        'https://qu.ax/woSGV.mp4',
        'https://qu.ax/WkmA.mp4'
    ];
    
    const video = videos[Math.floor(Math.random() * videos.length)];
    let mentions = [who];

    try {
        await conn.sendMessage(m.chat, { 
            video: { url: video }, 
            gifPlayback: true, 
            caption: str, 
            mentions 
        }, { quoted: m });
    } catch (e) {
        console.error('Erro no comando chorar:', e);
        await conn.reply(m.chat, str, m);
    }
}

handler.help = ['chorar'];
handler.tags = ['anime'];
handler.command = ['chorar', 'cry', 'llorar'];

handler.group = false;
handler.register = false;

export default handler;

// Para adicionar ao seu menu:
// txt += '┇┆😭 ${_p}chorar\n'