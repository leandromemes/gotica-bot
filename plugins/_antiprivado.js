/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

export async function before(m, { conn, isOwner, isROwner }) {
  // Ignora se for o próprio bot ou se for grupo
  if (m.isBaileys || m.fromMe || m.isGroup) return !1;
  if (!m.message) return !0;

  // Se for o Soberano Leandro, o bot sempre responde
  if (isOwner || isROwner) return !1;

  const bot = global.db.data.settings[this.user.jid] || {};
  const user = global.db.data.users[m.sender];

  // Se o Anti-Privado estiver ON
  if (bot.antiPrivate) {
    
    // Se o usuário já foi avisado uma vez, o bot apenas ignora (retorna true para parar o processo)
    if (user.antiPrivateAvisado) return !0;

    // Se for a primeira vez que ele manda msg, o bot avisa e marca como avisado
    await m.reply(`🧛‍♂️ Olá @${m.sender.split`@`[0]}, meu criador *Leandro* desativou os comandos no privado.\n\nEste é o meu único aviso: Eu não responderei mais aqui. Entre no grupo oficial para me usar:\n\nhttps://chat.whatsapp.com/HhIATn48XsuAbduwn8sowT`, false, { mentions: [m.sender] });

    // Registra que esse plebeu já foi avisado no banco de dados
    user.antiPrivateAvisado = true;
    
    // Para a execução aqui para não responder o comando que ele tentou usar
    return !0;
  }

  return !1;
}