import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "gay",
  description: "Mede o nível de viadagem de um usuário",
  commands: ["gay", "viado", "gaymetro"],
  usage: `${PREFIX}gay @usuario`,
  
  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    userLid,
    replyLid,
    isReply,
    sendImageFromFile,
    sendErrorReply,
    sendSuccessReact,
  }) => {
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : userLid;

    if (!targetLid) {
      throw new InvalidParameterError("Mestre, não consegui identificar o alvo!");
    }

    try {
      const gayLevel = Math.floor(Math.random() * 101);
      
      let veredito = "";
      if (gayLevel < 10) {
        veredito = "Cabra macho! Esse aí nem limpa a bunda pra não ter contato.";
      } else if (gayLevel < 40) {
        veredito = "Hetero curioso. Já olhou pro lado no vestiário.";
      } else if (gayLevel < 70) {
        veredito = "Gay enrustido! Se tocar a música da Pabllo ele se entrega.";
      } else if (gayLevel < 95) {
        veredito = "Gay assumido! Já brilha mais que o sol do meio-dia.";
      } else {
        veredito = "RAINHA DO CLOSE! Esse aqui não pode ver um brilho que já quer montar! 💅✨";
      }

      const targetNumber = onlyNumbers(targetLid);
      const mensagem = `✨ 🌈 *GAYÔMETRO ANALISADOR* 🌈\n\n👤 *Analisado:* @${targetNumber}\n📊 *Nível:* ${gayLevel}%\n\n📝 *Veredito:*\n_${veredito}_\n\n⚠️ *Aviso:* O sensor detectou purpurina no ambiente!`;

      await sendSuccessReact();

      await sendImageFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "gay.jpg"),
        mensagem,
        [targetLid]
      );

    } catch (error) {
      console.error("Erro no comando gay:", error);
      sendErrorReply("Ocorreu um erro ao processar o gayômetro.");
    }
  },
};