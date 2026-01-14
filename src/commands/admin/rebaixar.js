import { PREFIX } from "../../config.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "rebaixar",
  description: "Rebaixa um administrador para membro comum",
  commands: ["rebaixar", "rebaixa", "demote"],
  usage: `${PREFIX}rebaixar @usuario ou responda a mensagem`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    socket,
    sendWarningReply,
    sendSuccessReply,
    sendErrorReply,
    webMessage,
  }) => {
    if (!isGroup(remoteJid)) {
      return sendWarningReply("Este comando só pode ser usado em grupo!");
    }

    // Lógica para capturar o ID (Respondendo mensagem ou Marcando)
    let userId;
    const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
    const quoted = contextInfo?.participant;
    const mentioned = contextInfo?.mentionedJid?.[0];

    if (quoted) {
      userId = quoted;
    } else if (mentioned) {
      userId = mentioned;
    } else if (args.length > 0) {
      userId = `${onlyNumbers(args[0])}@s.whatsapp.net`;
    }

    if (!userId) {
      return sendWarningReply(
        "Por favor, marque um administrador ou responda a mensagem dele para rebaixar."
      );
    }

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "demote");
      await sendSuccessReply("Usuário rebaixado com sucesso! Perdeu o trono. 🤡");
    } catch (error) {
      errorLog(`Erro ao rebaixar administrador: ${error.message}`);
      await sendErrorReply(
        "Ocorreu um erro. Verifique se eu sou administrador do grupo!"
      );
    }
  },
};