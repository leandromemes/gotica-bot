import { ASSETS_DIR, PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { getProfileImageData } from "../../services/baileys.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "perfil",
  description: "Mostra o dossiê completo e debochado de um usuário",
  commands: ["perfil", "profile"],
  usage: `${PREFIX}perfil ou perfil @usuario`,
  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({
    args,
    socket,
    remoteJid,
    userLid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError("Este comando só pode ser usado em grupo.");
    }

    // Pega o alvo por menção ou usa quem mandou o comando
    const targetLid = args[0] ? `${onlyNumbers(args[0])}@lid` : userLid;

    await sendWaitReply("🕵️ Analisando o histórico podre desse usuário...");

    try {
      let profilePicUrl;
      let userRole = "Mortal Comum";

      try {
        const { profileImage } = await getProfileImageData(socket, targetLid);
        profilePicUrl = profileImage || `${ASSETS_DIR}/images/default-user.png`;
      } catch (error) {
        errorLog(`Erro ao pegar foto: ${targetLid}`);
        profilePicUrl = `${ASSETS_DIR}/images/default-user.png`;
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === targetLid);

      if (participant?.admin) userRole = "👑 Administrador(a)";

      // Gerador de estatísticas inúteis e engraçadas
      const r = () => Math.floor(Math.random() * 101); // 0 a 100
      const preco = (Math.random() * 200 + 5).toFixed(2); // Valor baixo pra zoar

      const mensagem = `
🕵️ *DOSSIÊ GÓTICO: INFORMAÇÕES* 🕵️
---------------------------------------
👤 *Alvo:* @${targetLid.split("@")[0]}
🎖️ *Cargo:* ${userRole}

✨ *ESTATÍSTICAS ATUAIS:*
🤢 *Feiúra:* ${r()}%
💃 *Prostituição:* ${r()}%
🐮 *Gado:* ${r()}%
🎱 *Passiva:* ${r()}%
🍑 *Safadeza:* ${r()}%
🧠 *Inteligência:* ${Math.floor(Math.random() * 20)}% (Baixa)
🏳️‍🌈 *Chance de ser Gay:* ${r()}%

💰 *VALOR NO MERCADO:*
🔞 *Programa:* R$ ${preco}
🦴 *Vale a pena?* ${r() > 50 ? "Sim, na falta de opção." : "Nem de graça!"}

---------------------------------------
_Obs: As informações acima foram tiradas da minha bola de cristal levemente suja._ 💅`.trim();

      await sendSuccessReact();

      await socket.sendMessage(remoteJid, {
        image: { url: profilePicUrl },
        caption: mensagem,
        mentions: [targetLid],
      });
    } catch (error) {
      console.error(error);
      sendErrorReply("Ocorreu um erro ao tentar verificar o perfil.");
    }
  },
};