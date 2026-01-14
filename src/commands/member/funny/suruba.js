import { PREFIX } from "../../../config.js"; 

export default {
  name: "suruba",
  description: "Brincadeira da suruba com marcações aleatórias",
  commands: ["suruba", "surubao"],
  usage: `${PREFIX}suruba <1-5>`,
  
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, args, userLid, sendReply, isGroup, sendText }) => {
    
    try {
      // 1. Garante que é um grupo
      if (!isGroup) {
         return await sendReply("✨ ❌ Este comando só funciona em grupos.");
      }
      
      // 2. Validação do parâmetro (Quantidade de pessoas)
      const num = parseInt(args[0] || '1'); 

      if (isNaN(num) || num < 1 || num > 5) {
        return await sendReply(
          `😏 Use assim: *${PREFIX}suruba 1-5*\nExemplo: *${PREFIX}suruba 3*`
        );
      }
      
      // 3. Checagem do remetente
      if (!userLid) {
          return await sendReply("❌ Não consegui identificar quem enviou o comando.");
      }

      // 4. Busca metadados
      const grupoInfo = await socket.groupMetadata(remoteJid); 

      // 5. Filtra participantes válidos e exclui quem enviou o comando
      const participants = grupoInfo.participants
        .map(p => p.id)
        .filter(id => (id.includes("@s.whatsapp.net") || id.includes("@lid")) && id !== userLid);

      if (participants.length < num) {
        return await sendReply(`👀 Não tem gente suficiente no grupo pra essa suruba...`);
      }

      // 6. Embaralha e seleciona a quantidade desejada
      const shuffled = participants.sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, num);

      // 7. Lista de menções (Remetente + Escolhidos)
      const finalMentionsList = [userLid, ...chosen];

      // 8. Montagem da Mensagem
      const senderMention = `@${userLid.split("@")[0]}`; 
      const chosenMentions = chosen.map((id) => "@" + id.split("@")[0]).join("\n");
      
      const messages = [
        `🔥 ${senderMention} tá com fogo e chamou para a suruba:\n\n${chosenMentions}`,
        `🍑 Hoje é dia de sacanagem! ${senderMention} quer se divertir com:\n\n${chosenMentions}`,
        `💦 ${senderMention} acumulou tesão e convocou:\n\n${chosenMentions}`,
        `😈 Clima esquentou! ${senderMention} não aguentou e chamou:\n\n${chosenMentions}`,
        `🫦 A putaria foi liberada! ${senderMention} quer fazer um surubão com:\n\n${chosenMentions}`,
      ];

      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      // 9. Envio
      await sendText(randomMsg, finalMentionsList);
      
    } catch (err) {
      console.error("Erro no comando suruba:", err);
      if (err.message.includes("rate-overlimit")) {
        return await sendReply("⚠️ O WhatsApp está limitando agora. Tente em instantes!");
      }
      await sendReply("❌ Ocorreu um erro ao organizar a suruba!");
    }
  },
};