import { delay } from "baileys";
import path from "node:path";
import { ASSETS_DIR } from "../../config.js";
import { onlyNumbers } from "../../utils/index.js";

export default {
  name: "bam",
  description: "Simula a remoção de um membro com áudio e sticker",
  commands: ["bam"],
  usage: "!bam @marcar ou marque a mensagem",

  handle: async ({
    isReply,
    replyLid,
    socket,
    remoteJid,
    sendSuccessReact,
    sendAudioFromFile,
    sendStickerFromFile,
    webMessage
  }) => {
    try {
      // 1. Identifica o alvo (Menção ou Reply)
      const mentionedJid = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      
      const targetLid = mentionedJid 
        ? (mentionedJid.includes("@lid") ? mentionedJid : `${onlyNumbers(mentionedJid)}@lid`)
        : (isReply ? replyLid : null);

      if (!targetLid) {
        return await socket.sendMessage(remoteJid, { 
          text: "⚠️ Você precisa mencionar alguém ou marcar uma mensagem!" 
        });
      }

      // 2. Reação e Mensagem de Texto (Conforme você melhorou)
      await sendSuccessReact();
      await socket.sendMessage(remoteJid, { 
        text: "✅ inseto removido com sucesso!👋" 
      });

      // 3. Enviar Áudio (Como se estivesse gravado)
      // O arquivo deve estar em: assets/samples/ban.mp3
      await delay(1500);
      const audioPath = path.join(ASSETS_DIR, "samples", "ban.mp3");
      await sendAudioFromFile(audioPath, true); 

      // 4. Enviar Figurinha
      // O arquivo deve estar em: assets/samples/ban.webp
      await delay(1500);
      const stickerPath = path.join(ASSETS_DIR, "samples", "bam.webp");
      await sendStickerFromFile(stickerPath);

    } catch (error) {
      console.error("Erro no ban fake completo:", error);
    }
  },
};