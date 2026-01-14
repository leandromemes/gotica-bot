import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "bater",
  description: "Dá um corretivo em alguém.",
  commands: ["bater", "punch",],
  usage: `${PREFIX}bater @usuario`,
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
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Você precisa mencionar ou marcar um membro!"
      );
    }

    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : null;

    if (!targetLid) {
      await sendErrorReply(
        "Você precisa mencionar um usuário ou responder uma mensagem para bater."
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "bater.mp4"),
      `@${userNumber} deu uma surra em @${targetNumber}!`,
      [userLid, targetLid]
    );
  },
};