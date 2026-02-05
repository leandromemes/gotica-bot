/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  /* O comando .desenhar é um gerador de arte por IA com tradutor embutido.
     Serve para criar imagens artísticas de alta qualidade.
     Uso: .desenhar [descrição da imagem]
     Público: Livre (Membros, Admins e Dono).
  */

  const prompt = args.join(' ');
  if (!prompt) {
    return conn.reply(
      m.chat,
      `*┇┆🔍 O que você deseja desenhar?*\n\nExemplo: \n*${usedPrefix + command} uma gótica em um castelo sombrio*`,
      m
    );
  }

  try {
    await m.react('🎨');
    
    // O diferencial: Traduz o pedido para inglês para a IA entender melhor
    const { text: translatedPrompt } = await translate(prompt, { to: 'en', autoCorrect: true });

    await conn.reply(m.chat, `*┇┆⏳ Criando sua arte...*\nIsso pode levar alguns segundos.`, m);

    const apiUrl = `https://api.vreden.my.id/api/artificial/aiease/text2img?prompt=${encodeURIComponent(translatedPrompt)}&style=19`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!res.ok) throw new Error('Servidor ocupado.');

    const json = await res.json();
    const images = json?.result;
    if (!images || images.length === 0) throw new Error('Falha na geração.');

    const imageUrl = images[0].origin;
    const imageRes = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://api.vreden.my.id/'
      }
    });

    const buffer = await imageRes.buffer();

    // Envio limpo sem poluição de créditos na legenda
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `*✨ Resultado:* "${prompt}"`,
      mimetype: 'image/jpeg'
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, `*┇┆⚠️ Erro:* Não foi possível gerar a imagem agora.`, m);
  }
};

handler.help = ['desenhar'];
handler.tags = ['ai'];
handler.command = ['desenhar', 'd']; // Atalho .d para agilizar pro Soberano

handler.register = false;

export default handler;