import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "gado",
  description: "Mede o nível de gadice de um usuário com imagem temática",
  commands: ["gado", "gadometro", "boi"],
  usage: `${PREFIX}gado @usuario`,
  
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
    // Verifica se há alvo (mencionado ou resposta)
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : userLid; // Se não marcar ninguém, mede o de quem enviou

    if (!targetLid) {
      throw new InvalidParameterError("Mestre, não consegui identificar o alvo!");
    }

    try {
      const gadoLevel = Math.floor(Math.random() * 101);
      
      let diagnostico = "";
      if (gadoLevel < 20) {
        diagnostico = "Brabo! Esse aí nasceu pra ser o lobo alfa, não olha nem pro lado.";
      } else if (gadoLevel < 50) {
        diagnostico = "Gado de apartamento. Só muge quando tem Wi-Fi.";
      } else if (gadoLevel < 80) {
        diagnostico = "Gado de raça! Já ouve o berrante e começa a trotar.";
      } else {
        diagnostico = "REI DO GADO! O chifre é tão grande que já pegou sinal de rádio! 🐂";
      }

      const targetNumber = onlyNumbers(targetLid);
      const mensagem = `✨ 🐮 *SISTEMA DE MONITORAMENTO BOVINO* 🐮\n\n👤 *Alvo:* @${targetNumber}\n📊 *Gadômetro:* ${gadoLevel}%\n\n📝 *Diagnóstico:*\n_${diagnostico}_\n\n🔔 *Aviso:* Porteira aberta, o berrante tocou!`;

      await sendSuccessReact();

      await sendImageFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "gado.jpg"),
        mensagem,
        [targetLid]
      );

    } catch (error) {
      console.error("Erro no comando gado:", error);
      sendErrorReply("Ocorreu um erro ao processar o gadômetro.");
    }
  },
};