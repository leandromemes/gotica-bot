import { delay } from "baileys";
import path from "node:path";
import { ASSETS_DIR, BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
import { DangerError, InvalidParameterError } from "../../errors/index.js";
import { onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "ban",
  description: "Remove um membro do grupo com áudio e sticker",
  commands: ["ban", "b"],
  usage: `${PREFIX}ban @marcar ou marque a mensagem`,

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({
    isReply,
    socket,
    remoteJid,
    replyLid,
    userLid,
    sendSuccessReact,
    sendErrorReply,
    sendAudioFromFile,
    sendStickerFromFile,
    webMessage
  }) => {
    try {
      // 1. Captura o alvo (Menção ou Reply)
      const mentionedJid = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      
      const memberToRemoveLid = mentionedJid 
        ? (mentionedJid.includes("@lid") ? mentionedJid : `${onlyNumbers(mentionedJid)}@lid`)
        : (isReply ? replyLid : null);

      if (!memberToRemoveLid) {
        throw new InvalidParameterError("Você precisa mencionar alguém ou marcar uma mensagem!");
      }

      // 2. Travas de Segurança Reais
      if (memberToRemoveLid === userLid) throw new DangerError("Você não pode remover você mesmo!");
      if (OWNER_LID && memberToRemoveLid === OWNER_LID) throw new DangerError("Você não pode remover o dono do bot!");
      if (BOT_LID && memberToRemoveLid === BOT_LID) throw new DangerError("Você não pode me remover!");

      // 3. EXECUÇÃO REAL DA REMOÇÃO
      await socket.groupParticipantsUpdate(remoteJid, [memberToRemoveLid], "remove");

      // 4. Sequência de Mensagens (Igual ao BAM)
      await sendSuccessReact();
      
      await socket.sendMessage(remoteJid, { 
        text: "✅ inseto removido com sucesso!👋" 
      });

      // Enviar Áudio (Como se estivesse gravado)
      await delay(1500);
      const audioPath = path.join(ASSETS_DIR, "samples", "ban.mp3");
      await sendAudioFromFile(audioPath, true); 

      // Enviar Figurinha
      await delay(1500);
      const stickerPath = path.join(ASSETS_DIR, "samples", "bam.webp");
      await sendStickerFromFile(stickerPath);

    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendErrorReply(`Ocorreu um erro ao remover o membro: ${error.message}`);
    }
  },
};