/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

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
    await m.react('🫦');

    let str;
    if (m.mentionedJid.length > 0 || m.quoted) {
        str = `*${name2}* deu um beijo em *${name}*! ( ˘ ³˘)❤️`;
    } else {
        str = `*${name2}* está se beijando... que amor próprio! ( ˘ ³˘)❤️`.trim();
    }
    
    if (m.isGroup) {
        // Seus novos links permanentes do Catbox
        const videos = [
            'https://files.catbox.moe/jj9vob.mp4',
            'https://files.catbox.moe/vsuo93.mp4'
        ];
        
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

handler.help = ['kiss', 'beijo'];
handler.tags = ['anime'];
handler.command = ['beija', 'beijo', 'beijar'];
handler.group = true;

// Cooldown zero para o Soberano Leandro
handler.cooldown = m => (m.sender.split`@`[0] === '556391330669' ? 0 : 5000);

// Para que serve: Envia um vídeo de anime dando um beijo em alguém.
// Benefícios: Interação romântica/divertida com links permanentes que não expiram.
// Acesso: Todos os membros.

export default handler;