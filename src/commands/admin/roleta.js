import { BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
import { DangerError } from "../../errors/index.js";

// Função manual de delay para o Termux
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: "roleta-russa",
  description: "Sorteia um membro aleatório (não admin) para ser banido.",
  commands: ["roleta", "roletarussa"],
  usage: `${PREFIX}roleta`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    socket,
    remoteJid,
    sendReply,
    sendSuccessReact,
    sendErrorReply,
    sendReact,
    isGroup,
  }) => {
    try {
      if (!isGroup) {
        return await sendErrorReply("Este comando só pode ser usado em grupos!");
      }

      // 1. Reação imediata de arma
      await sendReact("🔫");

      // 2. Pegar metadados e verificar se o BOT é admin
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participants = groupMetadata.participants;
      
      const botId = socket.user.id.split(':')[0] + '@s.whatsapp.net';
      const botData = participants.find(p => p.id === botId || p.id === BOT_LID);

      if (!botData?.admin) {
        return await sendErrorReply("Mestre, eu preciso de poder (ADM) para expulsar os perdedores! 👑");
      }

      // 3. Filtrar as vítimas (Não admin, não bot, não dono)
      const possibleVictims = participants.filter((p) => {
        const isAdmin = p.admin === "admin" || p.admin === "superadmin";
        const isBot = p.id === botId || p.id === BOT_LID;
        const isOwner = p.id === OWNER_LID;
        
        return !isAdmin && !isBot && !isOwner;
      });

      if (possibleVictims.length === 0) {
        throw new DangerError("Não existem membros comuns (plebeus) disponíveis para o sacrifício!");
      }

      // 4. O Clima de Suspense
      await sendReply("🔫 *O tambor foi carregado com uma bala mortal...*");
      await delay(2500);
      await sendReply("🔄 *Girando o tambor... a sorte está lançada!*");
      await delay(2500);
      await sendReply("⚠️ *Encostando o cano na cabeça do azarado...*");
      await delay(2000);
      await sendReply("... *CLICK!* ...");
      await delay(1500);

      // 5. Sortear a vítima
      const victim = possibleVictims[Math.floor(Math.random() * possibleVictims.length)];
      const victimId = victim.id;

      // 6. Executar o BAN e anunciar
      await socket.groupParticipantsUpdate(remoteJid, [victimId], "remove");
      await sendSuccessReact();

      const msgFinal = `💥 *POW!!!*\n\nA bala atingiu em cheio @${victimId.split("@")[0]}!\n\nFoi eliminado da existência por perder na Roleta Russa! 💀⚰️`;

      await socket.sendMessage(remoteJid, {
        text: msgFinal,
        mentions: [victimId]
      });

    } catch (error) {
      console.error("Erro na Roleta Russa:", error);
      await sendErrorReply(`Ocorreu um erro no jogo: ${error.message}`);
    }
  },
};