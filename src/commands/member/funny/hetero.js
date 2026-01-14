import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "hetero",
  description: "Mede o nível de heterice de um usuário",
  commands: ["hetero", "heterometro", "macho"],
  usage: `${PREFIX}hetero @usuario`,
  
  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    userLid,
    replyLid,
    isReply,
    socket,
    sendImageFromFile,
    sendErrorReply,
    sendSuccessReact,
  }) => {
    // 1. Identifica o alvo (quem foi mencionado, resposta ou quem enviou)
    const targetLid = isReply
      ? replyLid
      : args[0]
      ? `${onlyNumbers(args[0])}@lid`
      : userLid;

    if (!targetLid) {
      throw new InvalidParameterError("Mestre, não consegui identificar o alvo!");
    }

    try {
      // 2. Gera a porcentagem
      const level = Math.floor(Math.random() * 101);
      
      // 3. Define o veredito
      let veredito = "";
      if (level < 10) {
        veredito = "Suspeito... O radar apitou! Esse aí gosta de um brilho e não esconde.";
      } else if (level < 40) {
        veredito = "Hétero flex! Diz que é macho mas o TikTok só tem dancinha.";
      } else if (level < 70) {
        veredito = "Hétero padrão. Gosta de futebol, churrasco e de falar 'é mole'.";
      } else if (level < 95) {
        veredito = "Hétero raiz! Usa sapatênis, camisa polo e não sabe lavar uma louça.";
      } else {
        veredito = "MACHO ALFA SUPREMO! O nível de heterice é tão alto que ele dá bom dia pro sol com um aperto de mão! 🤠🍺";
      }

      const targetNumber = onlyNumbers(targetLid);
      const mensagem = `✨ 🛡️ *HETERÔMETRO ANALISADOR* 🛡️\n\n` +
                       `👤 *Alvo:* @${targetNumber}\n` +
                       `📊 *Nível:* ${level}%\n\n` +
                       `📝 *Veredito:*\n_${veredito}_\n\n` +
                       `⚠️ *Análise:* O sensor detectou traços de testosterona e gosto por churrasco mal passado!`;

      await sendSuccessReact();

      // 4. Envia a imagem com a legenda e menção correta
      await sendImageFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "hetero.jpg"),
        mensagem,
        [targetLid]
      );

    } catch (error) {
      console.error("Erro no comando hetero:", error);
      // Fallback: Se a imagem falhar, tenta mandar só o texto para não deixar o mestre na mão
      try {
        const targetNumber = onlyNumbers(targetLid);
        const mensagemFallback = `✨ 🛡️ *HETERÔMETRO ANALISADOR* 🛡️\n\n👤 *Alvo:* @${targetNumber}\n📊 *Nível:* [ERRO DE IMAGEM]`;
        await socket.sendMessage(remoteJid, { text: mensagemFallback, mentions: [targetLid] });
      } catch (e) {
        sendErrorReply("Ocorreu um erro ao processar o heterômetro.");
      }
    }
  },
};