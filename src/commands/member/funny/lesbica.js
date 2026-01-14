import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "lesbica",
  description: "Mede o nível de sapatão de uma usuária",
  commands: ["lesbica", "sapatao", "lesbicometro"],
  usage: `${PREFIX}lesbica @usuario`,
  
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
      throw new InvalidParameterError("Mestre, não consegui identificar a pessoa!");
    }

    try {
      // 2. Gera a porcentagem
      const level = Math.floor(Math.random() * 101);
      
      // 3. Define o veredito
      let veredito = "";
      if (level < 10) {
        veredito = "Princesinha! Só gosta de rosa e passa longe de uma oficina.";
      } else if (level < 40) {
        veredito = "Hétero básica. Mas já deu uma olhadinha diferente pra amiga.";
      } else if (level < 70) {
        veredito = "Caminhoneira em formação! Já está pensando em comprar uma camisa xadrez.";
      } else if (level < 95) {
        veredito = "Sapatão raiz! O caminhão já está estacionado na porta.";
      } else {
        veredito = "MESTRE DAS CHAVES! Já quer morar junto no segundo encontro e adotar 3 gatos! 👩‍❤️‍👩✂️";
      }

      const targetNumber = onlyNumbers(targetLid);
      const mensagem = `✨ 👩‍❤️‍👩 *SAPATÔMETRO ANALISADOR* 👩‍❤️‍👩\n\n` +
                       `👤 *Alvo:* @${targetNumber}\n` +
                       `📊 *Nível:* ${level}%\n\n` +
                       `📝 *Veredito:*\n_${veredito}_\n\n` +
                       `⚠️ *Análise:* O sensor detectou uma forte energia de camisa xadrez e unhas curtas!`;

      await sendSuccessReact();

      // 4. Envia a imagem com a legenda e menção correta usando ASSETS_DIR
      await sendImageFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "lesbica.jpg"),
        mensagem,
        [targetLid]
      );

    } catch (error) {
      console.error("Erro no comando lesbica:", error);
      // Fallback: Se a imagem falhar, manda apenas o texto
      try {
        const targetNumber = onlyNumbers(targetLid);
        const mensagemFallback = `✨ 👩‍❤️‍👩 *SAPATÔMETRO ANALISADOR* 👩‍❤️‍👩\n\n👤 *Alvo:* @${targetNumber}\n📊 *Nível:* ${level}% (Erro ao carregar imagem)`;
        await socket.sendMessage(remoteJid, { text: mensagemFallback, mentions: [targetLid] });
      } catch (e) {
        sendErrorReply("Ocorreu um erro ao processar o lesbicômetro.");
      }
    }
  },
};