import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "comer",
  description: "Comer alguém (meme).",
  commands: ["comer", "comendo"],
  usage: `${PREFIX}comer @usuario`,
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
        "Você precisa mencionar um usuário ou responder uma mensagem para comer."
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "comer.mp4"),
      `@${userNumber} está comendo @${targetNumber}! 😳🔥`,
      [userLid, targetLid]
    );
  },
};