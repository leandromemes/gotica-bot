/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { addExif } from '../lib/sticker.js';

let cooldowns = {}
const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = async (m, { conn, usedPrefix, command }) => {
  const nomeUser = m.pushName || 'Explorador'
  const eDono = (m.sender.includes(DONO_PHONE) || m.sender === TARGET_JID_DONO)

  // REGRA SOBERANA: Leandro sem tempo de espera
  if (!eDono) {
    const tempoEspera = 60 * 1000
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoEspera) {
      let restante = Math.ceil((cooldowns[m.sender] + tempoEspera - Date.now()) / 1000)
      return m.reply(`*⚠️ AGUARDE:* Olá ${nomeUser}, aguarde ${restante}s para usar o take novamente.`)
    }
    cooldowns[m.sender] = Date.now()
  }

  if (!m.quoted) return m.reply(`*Responda a uma figurinha para colocar seus créditos nela!* \n\n> Exemplo: Responda a um sticker com *${usedPrefix + command}*`);

  await m.react('⏳')

  try {
    const stikerBuffer = await m.quoted.download();
    if (!stikerBuffer) return m.reply(`*❌ Erro:* Não foi possível baixar a figurinha.`);

    // CONFIGURAÇÃO AUTOMÁTICA SOLICITADA PELO SOBERANO
    let packname = nomeUser; // Nome de quem enviou o comando
    let author = 'Gotica Bot💋'; // Nome fixo do bot

    const exif = await addExif(stikerBuffer, packname, author);

    await conn.sendMessage(m.chat, { sticker: exif }, { quoted: m });
    await m.react('✅')

  } catch (e) {
    console.error(e)
    m.reply('*❌ ERRO:* Não consegui processar esta figurinha.')
  }
};

handler.help = ['take'];
handler.tags = ['sticker'];
handler.command = ['take', 'wm', 'roubar'];
handler.group = true;

export default handler;