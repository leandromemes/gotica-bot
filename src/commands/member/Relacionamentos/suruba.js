const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "suruba",
  description: "Brincadeira da suruba com marcações aleatórias",
  commands: ["suruba"],
  usage: `${PREFIX}suruba <1-5>`,
  
  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, args, userJid, sendReply }) => {
    
    try {
      
      if (!remoteJid.endsWith('@g.us')) {
         return await sendReply("✨ ❌ Este comando só funciona em grupos.");
      }
      
      // 1. BUSCA ROBUSTA DOS METADADOS (O que faltava!)
      const grupoInfo = await socket.groupMetadata(remoteJid); 

      // Se args[0] for vazio, assume 1 como default para evitar NaN
      const num = parseInt(args[0] || '1'); 

      if (isNaN(num) || num < 1 || num > 5) {
        return await sendReply(
          `😏 Use assim: *${PREFIX}suruba 1-5*\nExemplo: *${PREFIX}suruba 3*`
        );
      }

      // Filtra os participantes, excluindo o remetente
      const allParticipants = grupoInfo.participants.map(p => p.id);
      const participants = allParticipants.filter((id) => id !== userJid);

      if (participants.length < num) {
        return await sendReply("👀 Não tem gente suficiente pra essa suruba...");
      }

      // Embaralha os participantes e seleciona 'num'
      const shuffled = participants.sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, num);

      // JID do remetente
      const senderJid = userJid;
      
      // Cria a menção do remetente para a mensagem
      const senderMention = `@${senderJid.split("@")[0]}`;
      
      // Cria as menções dos escolhidos para o texto (sem o @s.whatsapp.net)
      const chosenMentions = chosen.map((id) => "@" + id.split("@")[0]).join("\n");
      
      // Lista final de JIDs para o campo 'mentions'
      const finalMentionsList = [senderJid, ...chosen];

      // Mensagens engraçadas sortidas
      const messages = [
        `🔥 ${senderMention} tá com fogo no rabo e chamou para a suruba:\n${chosenMentions}`,
        `🍑 Hoje é dia de sacanagem! ${senderMention} quer se divertir com:\n${chosenMentions}`,
        `💦 ${senderMention} acumulou tesão e convocou:\n${chosenMentions}`,
        `😈 Clima esquentou! ${senderMention} não aguentou e chamou:\n${chosenMentions}`,
        `🫦 A putaria foi liberada! ${senderMention} quer fazer um surubão com:\n${chosenMentions}`,
      ];

      // Escolhe mensagem aleatória
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      // ENVIO DA MENSAGEM
      await socket.sendMessage(remoteJid, {
        text: randomMsg,
        mentions: finalMentionsList,
      });
      
    } catch (err) {
      console.error("Erro no comando suruba:", err);
      await sendReply("❌ Deu ruim no comando da suruba!");
    }
  },
};