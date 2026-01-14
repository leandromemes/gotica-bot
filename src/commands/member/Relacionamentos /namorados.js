import { lerRelacionamentos } from '../../../utils/relacionamento.js';

export default {
  name: "namorados",
  description: "Mostra todos os casais do grupo com nomes reais.",
  commands: ["namorados", "casados", "casais"],
  usage: "!namorados",

  handle: async ({ remoteJid, sendReply, sendText }) => {
    if (!remoteJid.endsWith('@g.us')) return await sendReply("❌ Só em grupos.");

    try {
      const relacionamentos = lerRelacionamentos();
      const groupRelacionamentos = relacionamentos[remoteJid] || {};
      
      const mentions = [];
      let resposta = `❤️ *CASAIS DO GRUPO* ❤️\n\n`;
      const jaListados = new Set();
      let contador = 0;

      for (const usuarioJid in groupRelacionamentos) {
        if (jaListados.has(usuarioJid)) continue;

        const info = groupRelacionamentos[usuarioJid];
        const parceiroJid = info.parceiro;

        // Adiciona aos listados para não repetir o casal
        jaListados.add(usuarioJid);
        jaListados.add(parceiroJid);

        // Adiciona ao array de menções para o WhatsApp puxar o nome
        mentions.push(usuarioJid, parceiroJid);
        contador++;

        const emoji = info.status === 'namorando' ? '💘' : '💍';
        const statusText = info.status.toUpperCase();
        
        resposta += `${contador}. ${emoji} *${statusText}:*\n@${usuarioJid.split('@')[0]} ❤️ @${parceiroJid.split('@')[0]}\n\n`;
      }

      if (contador === 0) {
        return await sendReply("💔 Ninguém está em um relacionamento neste grupo.");
      }

      resposta += "Felicidades aos pombinhos! ✨💅";

      // O sendText com as mentions completas faz a mágica do nome aparecer
      await sendText(resposta, mentions);

    } catch (e) {
      console.error(e);
      return await sendReply("❌ Erro ao buscar a lista de casais.");
    }
  },
};