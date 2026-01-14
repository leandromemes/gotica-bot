import { isGroup } from "../../../utils/index.js";

export default {
  name: "cortar",
  description: "Corta a amizade com alguém de forma dramática.",
  commands: ["cortar", "cortaamizade", "fim"],
  usage: "!cortar @usuario ou responda a mensagem",

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    sendErrorReply,
    sendReact,
    webMessage,
    userLid, // ID de quem enviou o comando
  }) => {
    try {
      if (!isGroup(remoteJid)) {
        return await sendErrorReply("Este comando só pode ser usado em grupos.");
      }

      // 1. Identificar quem está cortando (Autor) e o alvo
      const authorJid = userLid;
      const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
      const quoted = contextInfo?.participant;
      const mentioned = contextInfo?.mentionedJid?.[0];
      
      let targetJid;
      if (quoted) {
        targetJid = quoted;
      } else if (mentioned) {
        targetJid = mentioned;
      }

      if (!targetJid) {
        return await sendErrorReply("Você precisa marcar alguém ou responder a uma mensagem para cortar a amizade!");
      }

      if (targetJid === authorJid) {
        return await sendErrorReply("Você não pode cortar a amizade consigo mesmo, ô solitário! 😂");
      }

      // 2. Reação de coração partido
      await socket.sendMessage(remoteJid, { react: { text: "💔", key: webMessage.key } });

      // 3. Mensagem Dramática
      const authorNumber = authorJid.split('@')[0];
      const targetNumber = targetJid.split('@')[0];

      const mensagensDramatizadas = [
        `💔 *O FIM DE UMA ERA!* 💔\n\nAtenção grupo! @${authorNumber} cansou das mancadas e acabou de *CORTAR A AMIZADE* com @${targetNumber}! ✂️❌\n\nNão me procurem para reconciliações, o block é real! 👋💅`,
        `📉 *ALERTA DE TRETA!* 📉\n\n@${authorNumber} declarou que a amizade com @${targetNumber} perdeu a validade! 🚫\n\n"É cada um no seu quadrado e Deus por todos." Amizade cancelada com sucesso! ✌️🔥`,
        `✂️ *CORTA! CORTA! CORTA!*\n\n@${authorNumber} passou a tesoura na amizade que tinha com @${targetNumber}. 💔\n\nSem choro, sem volta e sem figurinha de "bom dia" no privado! Tchau, obrigado! 👋🐍`
      ];

      // Sorteia uma das mensagens para não ficar repetitivo
      const mensagemFinal = mensagensDramatizadas[Math.floor(Math.random() * mensagensDramatizadas.length)];

      await socket.sendMessage(remoteJid, {
        text: mensagemFinal,
        mentions: [authorJid, targetJid]
      });

    } catch (error) {
      console.error("Erro no comando Cortar:", error);
      await sendErrorReply("Ocorreu um erro ao tentar cortar a amizade.");
    }
  },
};