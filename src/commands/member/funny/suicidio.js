import { isGroup } from "../../../utils/index.js";
import path from "node:path";
import { ASSETS_DIR } from "../../../config.js";

export default {
  name: "suicidio",
  description: "O usuário declara que cansou da vida no grupo.",
  commands: ["suicidio", "morrer", "adeus"],
  usage: "!suicidio",

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, sendReact, userLid, webMessage }) => {
    try {
      if (!isGroup(remoteJid)) return;

      const userNumber = userLid.split('@')[0];

      // Reação de luto
      await sendReact("⚰️");

      const mensagens = [
        `🚨 *NOTA DE FALECIMENTO* 🚨\n\nÉ com muita "tristeza" que informamos que @${userNumber} não aguentou a pressão do grupo e acabou de cometer suicídio virtual! 💀\n\n_Que Deus o tenha..._ 🕯️`,
        `🥀 *ADEUS, MUNDO CRUEL!* 🥀\n\n@${userNumber} cansou de ser ignorado e decidiu tirar a própria vida. Ele(a) se foi, mas suas figurinhas ruins ficarão na memória. 📉💔`,
        `👻 *ALERTA DE SUICÍDIO!*\n\n@${userNumber} acaba de virar um encosto no grupo. Cansou da vida de vivo e se matou, agora vai assombrar o grupo! ⚰️🔥`
      ];

      const textoFinal = mensagens[Math.floor(Math.random() * mensagens.length)];

      // Caminho do vídeo (Certifique-se de ter um arquivo chamado suicidio.mp4 em assets)
      // Se não tiver o vídeo, ele enviará apenas o texto.
      const videoPath = path.resolve(ASSETS_DIR, "suicidio.mp4");

      await socket.sendMessage(remoteJid, {
        video: { url: videoPath },
        caption: textoFinal,
        mentions: [userLid],
        gifPlayback: true // Envia como GIF se preferir
      });

    } catch (error) {
      // Se der erro por falta do vídeo, envia só o texto para não quebrar
      const userNumber = userLid.split('@')[0];
      await socket.sendMessage(remoteJid, {
        text: `🥀 *ADEUS!* @${userNumber} cansou de viver neste grupo e se retirou da vida! 💀🕯️`,
        mentions: [userLid]
      });
    }
  },
};