/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    if (!who) return m.reply(`*⚠️ Marque alguém, responda a uma mensagem ou digite o número para ignorar.*`);

    let user = global.db.data.users[who];
    if (typeof user === 'undefined') global.db.data.users[who] = { banned: false };

    if (command === 'ignorar') {
        if (global.db.data.users[who].banned) return m.reply(`*⚠️ Este usuário já está na lista de ignorados.*`);
        global.db.data.users[who].banned = true;
        m.reply(`*🚫 O Soberano ordenou: O usuário @${who.split('@')[0]} agora será ignorado em todos os grupos.*`, null, { mentions: [who] });
    }

    if (command === 'atender') {
        if (!global.db.data.users[who].banned) return m.reply(`*⚠️ Este usuário não está sendo ignorado.*`);
        global.db.data.users[who].banned = false;
        m.reply(`*✅ O Soberano perdoou: O usuário @${who.split('@')[0]} voltou a ser atendido pelo bot.*`, null, { mentions: [who] });
    }
}

handler.help = ['ignorar @tag', 'atender @tag'];
handler.tags = ['dono'];
handler.command = ['ignorar', 'atender'];
handler.rowner = true; // Só você (Soberano) pode usar

export default handler;