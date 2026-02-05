/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import * as fs from 'fs';

export async function before(m, {conn, isAdmin, isBotAdmin, usedPrefix}) {
  if (m.isBaileys && m.fromMe) {
    return !0;
  }
  if (!m.isGroup) return !1;

  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  const delet = m.key.participant;
  const bang = m.key.id;
  const name = await conn.getName(m.sender);
  
  // Fake message para o bot não bugar ao responder
  const fakemek = {
    'key': {'participant': '0@s.whatsapp.net', 'remoteJid': '0@s.whatsapp.net'}, 
    'message': {'groupInviteMessage': {'groupJid': '51995386439-1616969743@g.us', 'inviteCode': 'm', 'groupName': 'Proteção Gótica', 'caption': 'Anti-Trava Ativo', 'jpegThumbnail': null}}
  };

  // Se a mensagem tiver mais de 5000 caracteres, é considerada trava
  if (chat.antiTraba && m.text.length > 5000) { 
    
    // Se for ADM, o bot apenas avisa (Adm tem imunidade no código original)
    if (isAdmin) return conn.sendMessage(m.chat, {text: `⚠️ O administrador @${m.sender.split('@')[0]} acabou de enviar um texto muito longo (trava). Cuidado plebeus!`, mentions: [m.sender]}, {quoted: fakemek});

    // Aviso de detecção
    conn.sendMessage(m.chat, `* [ ! ] MENSAGEM DE TRAVA DETECTADA [ ! ] *\n`, m);
    
    if (!isBotAdmin) return m.reply('❌ Não sou administrador, não posso remover o invasor!');

    if (isBotAdmin && bot.restrict) {
      // 1. Deleta a trava imediatamente
      await conn.sendMessage(m.chat, {delete: {remoteJid: m.chat, fromMe: false, id: bang, participant: delet}});
      
      // 2. Limpa o chat enviando espaços em branco e expõe o invasor
      setTimeout(() => {
        conn.sendMessage(m.chat, {
          text: `✅ Chat Limpo ✓\n${'\n'.repeat(400)}\n🧛‍♂️ *Invasor:* wa.me/${m.sender.split('@')[0]}\n👤 *Nome:* ${name}\n[ ! ] Enviou um texto com excesso de caracteres para tentar travar o grupo. Já foi removido do reino!`, 
          mentions: [m.sender]
        }, {quoted: fakemek});
      }, 0);

      // 3. Remove o engraçadinho
      setTimeout(() => {
        conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
      }, 1000);

    } else if (!bot.restrict) {
        return m.reply('⚠️ *Soberano Leandro*, o modo restrito está desligado! Ligue para eu poder expulsar travadores.');
    }
  }
  return !0;
}