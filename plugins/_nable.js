/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { createHash } from 'crypto';
import fetch from 'node-fetch';

const fancyFontMap = {
  'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
  'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

function toFancyText(text) {
  if (typeof text !== 'string') text = String(text);
  return text.split('').map(char => fancyFontMap[char] || char).join('');
}

const featureNames = {
  'welcome': 'Boas-Vindas', 'bv': 'Boas-Vindas', 'bienvenida': 'Boas-Vindas',
  'antiprivado': 'Anti-Privado', 'antipriv': 'Anti-Privado', 'antiprivate': 'Anti-Privado',
  'antiPorno': 'Anti-Porno',
  'restrict': 'Restringir', 'restringir': 'Restringir',
  'autolevelup': 'Modo Real', 'autonivel': 'Modo Real', 'levelrico': 'Modo Real', 'nivelricos': 'Modo Real', 'modoreal': 'Modo Real',
  'audios': 'Áudios',
  'autosticker': 'Auto Sticker',
  'antibot': 'Anti-Bot', 'antibots': 'Anti-Bot',
  'autoaceptar': 'Auto Aceitar', 'aceptarauto': 'Auto Aceitar',
  'antiestrangeiro': 'Anti-Estrangeiro', 'autorechazar': 'Anti-Estrangeiro', 'rechazarauto': 'Anti-Estrangeiro',
  'autoresponder': 'Auto Responder', 'autorespond': 'Auto Responder',
  'antisubbots': 'Anti-Sub Bots', 'antisub': 'Anti-Sub Bots', 'antisubot': 'Anti-Sub Bots', 'antibot2': 'Anti-Sub Bots',
  'modoadmin': 'Modo Admin', 'soloadmin': 'Modo Admin',
  'autoread': 'Auto Ler', 'autoleer': 'Auto Ler', 'autover': 'Auto Ler',
  'antiver': 'Anti-Visu', 'antiocultar': 'Anti-Visu', 'antiviewonce': 'Anti-Visu', 'antivisu': 'Anti-Visu', 'antivisuunica': 'Anti-Visu',
  'reaction': 'Reações', 'reaccion': 'Reações', 'emojis': 'Reações',
  'nsfw': 'NSFW (+18)', 'nsfwhot': 'NSFW', 'nsfwhorny': 'NSFW',
  'antispam': 'Anti-Spam', 'antiSpam': 'Anti-Spam', 'antispamosos': 'Anti-Spam',
  'antidelete': 'Anti-Deletar', 'antieliminar': 'Anti-Deletar',
  'jadibotmd': 'Modo JadiBot', 'modejadibot': 'Modo JadiBot',
  'detect': 'Detecção', 'configuraciones': 'Detecção', 'avisodegp': 'Detecção',
  'detect2': 'Detecção 2', 'avisos': 'Detecção 2', 'eventos': 'Detecção 2',
  'autosimi': 'SimSimi (IA)', 'simsimi': 'SimSimi (IA)',
  'antilink': 'Anti-Links', 'antilink2': 'Anti-Links 2',
  'antitrabas': 'Anti-Travas', 'antitraba': 'Anti-Travas',
  'antifake': 'Anti-Fakes', 'antivirtuales': 'Anti-Fakes',
  'antitoxic': 'Anti-Tóxico', 'antitoxicos': 'Anti-Tóxico'
};

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = command.toLowerCase();
  let isAll = false;
  const isSoberano = isOwner || isROwner || m.sender.includes('240041947357401');

  // Normalização Crucial
  if (['antivisu', 'antivisuunica', 'antiviewonce', 'antiocultar'].includes(type)) type = 'antiver';
  if (['modoreal', 'nivelricos', 'levelrico', 'autonivel'].includes(type)) type = 'autolevelup';
  if (['antiestrangeiro', 'antiesterangeiro', 'autorechazar', 'rechazarauto'].includes(type)) type = 'antiestrangeiro';

  // Verificação de Estado Atual
  let currentStatus = chat[type];
  if (['antiprivado', 'antipriv', 'antiprivate'].includes(type)) currentStatus = bot.antiPrivate;
  if (['restrict', 'restringir'].includes(type)) currentStatus = bot.restrict;
  if (['antispam', 'antiSpam'].includes(type)) currentStatus = bot.antiSpam;
  if (['jadibotmd', 'modejadibot'].includes(type)) currentStatus = bot.jadibotmd;
  if (['autoread', 'autoleer'].includes(type)) currentStatus = global.opts['autoread'];

  if (args[0] === 'on' || args[0] === 'enable') {
    if (currentStatus === true) return m.reply(`*Opa! Essa função já está ATIVADA.*`);
    var isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {
    if (currentStatus === false || currentStatus === undefined) return m.reply(`*Opa! Essa função já está DESATIVADA.*`);
    var isEnable = false;
  } else {
    const estado = currentStatus ? '✓ Ativado' : '✗ Desativado';
    return conn.reply(m.chat, `「🦇」 ${toFancyText('Uso do Comando')}: *${usedPrefix}${command} on/off*\n\n${toFancyText('Estado Atual')}: *${toFancyText(estado)}*`, m);
  }

  // Execução e Salvamento
  switch (type) {
    case 'welcome': case 'antiver': case 'antiPorno': case 'autolevelup': case 'audios': 
    case 'autosticker': case 'antibot': case 'autoaceptar': case 'antiestrangeiro': 
    case 'autoresponder': case 'antisubbots': case 'modoadmin': case 'reaction': 
    case 'nsfw': case 'detect': case 'detect2': case 'autosimi': 
    case 'antilink': case 'antidelete': case 'antitrabas': case 'antifake': case 'antitoxic':
      if (m.isGroup && !isAdmin && !isSoberano) return global.dfail('admin', m, conn);
      chat[type] = isEnable;
      break;

    case 'antiprivado': case 'restrict': case 'antispam': case 'jadibotmd':
      isAll = true;
      if (!isSoberano) return global.dfail('rowner', m, conn);
      if (type === 'antispam') bot.antiSpam = isEnable;
      if (type === 'restrict') bot.restrict = isEnable;
      if (type === 'antiprivado') bot.antiPrivate = isEnable;
      if (type === 'jadibotmd') bot.jadibotmd = isEnable;
      break;

    case 'autoread':
      isAll = true;
      if (!isSoberano) return global.dfail('rowner', m, conn);
      global.opts['autoread'] = isEnable;
      break;
  }

  let displayName = featureNames[command.toLowerCase()] || type;
  let replyText = isEnable 
    ? `✅ *A função ${toFancyText(displayName)} foi ATIVADA* ${isAll ? 'para o Bot' : 'para este chat'}.`
    : `⚠️ *A função ${toFancyText(displayName)} foi DESATIVADA* ${isAll ? 'para o Bot' : 'para este chat'}.`;

  // Se ativar o Anti-Estrangeiro, mostra os prefixos bloqueados
  if (type === 'antiestrangeiro' && isEnable) {
      replyText += `\n\n*Prefixos Bloqueados:* [6, 90, 963, 966, 967, 249, 212, 92, 93, 94, 7, 49, 2, 91, 48]`;
  }

  await m.react(isEnable ? '✅' : '⚠️');
  
  const res = await fetch('https://i.postimg.cc/nhdkndD6/pngtree-yellow-bell-ringing-with-sound-waves-png-image-20687908.png');
  const thumb2 = Buffer.from(await res.arrayBuffer());
  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Notificacion' },
    message: { locationMessage: { name: isEnable ? `🔔 ${toFancyText('LIGADO')}` : `🔕 ${toFancyText('DESLIGADO')}`, jpegThumbnail: thumb2 } },
    participant: '0@s.whatsapp.net'
  };

  await conn.reply(m.chat, replyText, fkontak);
};

handler.help = ['config'];
handler.tags = ['nable'];
handler.command = ['welcome', 'audios', 'bv', 'bienvenida', 'antiprivado', 'antipriv', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'levelrico', 'nivelricos', 'modoreal', 'autosticker', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'antiestrangeiro', 'antiesterangeiro', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antisub', 'antisubot', 'antibot2', 'modoadmin', 'soloadmin', 'autoread', 'autoleer', 'autover', 'antiver', 'antiocultar', 'antiviewonce', 'antivisu', 'antivisuunica', 'reaction', 'reaccion', 'emojis', 'nsfw', 'nsfwhot', 'nsfwhorny', 'antispam', 'antiSpam', 'antispamosos', 'antidelete', 'antieliminar', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'configuraciones', 'avisodegp', 'detect2', 'avisos', 'eventos', 'autosimi', 'simsimi', 'antilink', 'antilink2', 'antitoxic', 'antitoxicos', 'antitraba', 'antitrabas', 'antifake', 'antivirtuales'];

export default handler;