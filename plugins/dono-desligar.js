/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return 

    let chat = global.db.data.chats[m.chat];
    const botJid = conn.user.jid;

    if (!chat.bannedBots) chat.bannedBots = [];
    
    if (chat.bannedBots.includes(botJid)) {
        return m.reply('🌙 *Soberano,* eu já me encontro em repouso (desativada) neste chat. 🖤');
    }

    // Adiciona o bot na lista de banidos do chat
    chat.bannedBots.push(botJid);

    await m.react("🔒");
    m.reply(`📴 *Bot Desativado* 🖤\n\nEstarei em silêncio neste chat até que você me chame novamente com *#on*. 🌙`);
};

handler.help = ['off'];
handler.tags = ['owner'];
handler.command = ['off', 'offbot', 'desativarbot']; 
handler.group = true;
handler.register = false; 

export default handler;