import { isGroup, onlyNumbers } from "../../../utils/index.js";
import { getProfileImageData } from "../../../services/baileys.js";

export default {
  name: "ppp",
  description: "Cria uma enquete PPP de um membro.",
  commands: ["ppp", "pego", "passo"],
  usage: "!ppp @usuario ou responda a mensagem de alguém com !ppp",

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    sendErrorReply,
    sendSuccessReact,
    webMessage,
  }) => {
    try {
      if (!isGroup(remoteJid)) {
        return await sendErrorReply("Este comando só pode ser usado em grupos.");
      }

      // 1. Identificar o alvo (Por resposta ou por menção)
      const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
      const quoted = contextInfo?.participant;
      const mentioned = contextInfo?.mentionedJid?.[0];
      
      let targetJid;
      if (quoted) {
        targetJid = quoted;
      } else if (mentioned) {
        targetJid = mentioned;
      } else if (args.length > 0) {
        targetJid = `${onlyNumbers(args[0])}@s.whatsapp.net`;
      }

      if (!targetJid) {
        return await sendErrorReply("Você precisa marcar alguém ou responder a uma mensagem!");
      }

      const targetNumber = onlyNumbers(targetJid);

      // 2. Obter a foto de perfil através do serviço do Baileys
      let profileBuffer;
      try {
        const { buffer } = await getProfileImageData(socket, targetJid);
        profileBuffer = buffer;
      } catch (e) {
        profileBuffer = null;
      }

      await sendSuccessReact();

      const caption = `🔥 *JOGO DO PPP*\n\n👤 *Alvo:* @${targetNumber}\n\nEscolham uma opção abaixo! 👇`;

      // 3. Enviar a Foto ou apenas o Texto se não houver foto
      if (profileBuffer) {
        await socket.sendMessage(remoteJid, {
          image: profileBuffer,
          caption: caption,
          mentions: [targetJid]
        });
      } else {
        await socket.sendMessage(remoteJid, {
          text: `⚠️ *O membro não possui foto de perfil pública.*\n\n${caption}`,
          mentions: [targetJid]
        });
      }

      // 4. Enviar a Enquete com as opções em destaque
      await socket.sendMessage(remoteJid, {
        poll: {
          name: "VOTEM COM SABEDORIA!",
          values: ["🔥 PEGO", "🤔 PENSO", "❌ PASSO"],
          selectableCount: 1,
        },
      });

    } catch (error) {
      console.error("Erro no comando PPP:", error);
      await sendErrorReply("Ocorreu um erro ao gerar o PPP. Verifique se o alvo é válido!");
    }
  },
};