import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "tacarovo",
  description: "Taca um ovo em um usuário mencionado.",
  commands: ["tacarovo", "ovo", "tacar"],
  usage: `${PREFIX}tacarovo @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendGifFromFile,
    sendErrorReply,
    userLid,
    replyLid,
    args,
    isReply,
  }) => {
    // 1. Verificação de alvo (se não marcou ninguém e não está respondendo a ninguém)
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Você precisa mencionar alguém ou responder a uma mensagem para tacar um ovo! 🥚"
      );
    }

    // 2. Define quem é o alvo (LID ou Número)
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@s.whatsapp.net`
      : null;

    if (!targetLid) {
      await sendErrorReply(
        "Usuário não encontrado. Tente marcar a pessoa com @."
      );
      return;
    }

    // 3. Pega apenas os números para a legenda
    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    // 4. Caminho do arquivo de vídeo/gif
    // Ele vai procurar em: assets/images/funny/tacarovo.mp4
    const videoPath = path.resolve(ASSETS_DIR, "images", "funny", "tacarovo.mp4");

    try {
      await sendGifFromFile(
        videoPath,
        `🍳 *@${userNumber}* tacou um ovo bem na testa de *@${targetNumber}*! KKKKKK`,
        [userLid, targetLid]
      );
    } catch (error) {
      // Se o arquivo não existir, o bot avisa em vez de travar
      await sendErrorReply(
        "Erro: O arquivo 'tacarovo.mp4' não foi encontrado na pasta 'assets/images/funny/'."
      );
    }
  },
};