// src/commands/member/Relacionamentos/namorados.js
const { lerRelacionamentos, formatarReal } = require('../../../utils/relacionamento');

module.exports = {
  name: "namorados",
  description: "Mostra todos os casais (namorando/casados) do grupo.",
  commands: ["namorados", "casados", "casais", "vernamoro"],
  usage: "!namorados",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    const groupJid = webMessage.key.remoteJid;
    if (!groupJid.endsWith('@g.us')) {
      return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    }

    try {
      const relacionamentos = lerRelacionamentos();
      const groupRelacionamentos = relacionamentos[groupJid] || {};
      
      const casais = [];
      // Usamos um Set para evitar listar o mesmo casal duas vezes (A com B, e B com A)
      const jidsProcessados = new Set();
      const mentions = [];

      for (const jid1 in groupRelacionamentos) {
        if (jidsProcessados.has(jid1)) {
          continue;
        }

        const relacao1 = groupRelacionamentos[jid1];
        const jid2 = relacao1.parceiro;

        // Verifica se o parceiro existe e não foi processado ainda
        if (jid2 && !jidsProcessados.has(jid2)) {
          const relacao2 = groupRelacionamentos[jid2];

          // Confirma que a relação é mútua e válida
          if (relacao2 && relacao2.parceiro === jid1) {
            const status = relacao1.status; // 'namorando' ou 'casado'
            
            casais.push({ jid1, jid2, status });
            jidsProcessados.add(jid1);
            jidsProcessados.add(jid2);
            mentions.push(jid1, jid2);
          }
        }
      }
      
      let resposta = `❤️ *CASAIS E NAMORADOS NO GRUPO* ❤️\n\n`;

      if (casais.length === 0) {
        resposta += "Ninguém está em um relacionamento neste grupo. Use \`!namorar\` para começar!";
      } else {
        casais.forEach((casal, index) => {
          const emoji = casal.status === 'namorando' ? '💍' : '🥂';
          const statusText = casal.status.toUpperCase();
          
          resposta += `${index + 1}. ${emoji} *${statusText}:* @${casal.jid1.split('@')[0]} & @${casal.jid2.split('@')[0]}\n`;
        });
        resposta += "\nFelicidades aos pombinhos!";
      }

      await socket.sendMessage(groupJid, {
        text: resposta,
        mentions: mentions
      });

    } catch (e) {
      console.error("Erro no comando !namorados:", e);
      return await sendReply("❌ Ocorreu um erro ao buscar a lista de casais.");
    }
  },
};