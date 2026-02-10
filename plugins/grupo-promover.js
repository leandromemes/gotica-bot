/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const handler = async (m, { conn, text, participants }) => {
  let user;

  // Obtém o usuário a ser promovido
  if (m.mentionedJid && m.mentionedJid.length) {
    user = m.mentionedJid[0]; // Usa o primeiro mencionado
  } else if (m.quoted?.sender) {
    user = m.quoted.sender;
  } else {
    throw '⭐ *Hey!* Você deve mencionar um usuário ou responder à mensagem dele para promovê-lo. 💋';
  }

  try {
    // Promover o usuário
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    
    // Reação de coroa para o novo admin
    await m.react("👑");

    conn.reply(m.chat, `⭐ @${user.split('@')[0]} agora faz parte da elite. É o novo administrador do grupo! 💋`, m, {
      mentions: [user]
    });
  } catch (e) {
    m.reply('⭐ *Erro:* Não foi possível promover este usuário. Verifique se eu tenho as permissões necessárias. 💋');
  }
};

handler.help = ['promover'];
handler.tags = ['admin'];
handler.command = ['promote', 'promover', 'daradm']; // Handlers em português
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.register = false; 

export default handler;