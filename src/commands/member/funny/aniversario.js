import { delay } from "baileys";
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "aniversario",
  description: "Parabeniza um participante com um textão, reação e áudio",
  commands: ["aniversario", "parabens"],
  usage: `${PREFIX}aniversario @marcar ou marque a mensagem`,

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({
    isReply,
    replyLid,
    socket,
    remoteJid,
    sendAudioFromFile,
    sendReact,
    webMessage
  }) => {
    try {
      // 1. Identifica o aniversariante
      const mentionedJid = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const targetLid = mentionedJid 
        ? (mentionedJid.includes("@lid") ? mentionedJid : `${onlyNumbers(mentionedJid)}@lid`)
        : (isReply ? replyLid : null);

      if (!targetLid) {
        return await socket.sendMessage(remoteJid, { 
          text: `⚠️ Marque o aniversariante ou responda a mensagem dele!` 
        });
      }

      const number = onlyNumbers(targetLid);

      // 2. Reação de Bolo
      await sendReact("🎂");
      
      // 3. O TEXTÃO PERSONALIZADO
      const textao = `✨ 🎊 *HOJE O DIA ESTÁ EM FESTA!* 🎊 ✨\n\n` +
        `🎈 @${number}\n\n` +
        `Passando para te desejar um aniversário épico! Que a vida te reserve apenas as melhores surpresas e que cada novo ciclo seja repleto de conquistas, sorrisos e momentos inesquecíveis.\n\n` +
        `🌟 *Desejo a você:* \n` +
        `┣ 🛡️ Muita saúde para lutar;\n` +
        `┣ 💰 Prosperidade em seus caminhos;\n` +
        `┣ 🥂 Alegrias infinitas com os amigos;\n` +
        `┗ ❤️ E que nunca falte amor e paz!\n\n` +
        `Aproveite cada segundo do seu dia, pois você merece o mundo! Parabéns por ser essa pessoa incrível que ilumina o nosso grupo! 🎂🙌🎉\n\n` +
        `Ass: gótica bot`;

      await socket.sendMessage(remoteJid, { 
        text: textao,
        mentions: [targetLid]
      });

      // 4. Áudio de Parabéns
      await delay(2000);
      const audioPath = path.join(ASSETS_DIR, "samples", "parabens.mp3");
      
      try {
        await sendAudioFromFile(audioPath, true); 
      } catch (error) {
        console.error("Áudio não encontrado.");
      }

    } catch (error) {
      console.error("Erro no comando aniversario:", error);
    }
  },
};