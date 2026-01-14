import { PREFIX } from "../../config.js";
import { blockCommand, unblockCommand } from "../../utils/database.js";

export default {
  name: "comando",
  description: "Desativa ou Ativa um comando específico no grupo.",
  commands: ["cmd", "desativar", "ativar"],
  usage: `${PREFIX}desativar ppp`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ args, remoteJid, sendReply, sendSuccessReact, commandName }) => {
    // 1. Verifica se você digitou o nome do comando alvo
    if (!args || args.length === 0) {
      return await sendReply(
        `❌ *Ei, Mestre!* Você esqueceu de dizer qual comando quer alterar.\n\nUse: *${PREFIX}${commandName} [nome do comando]*`
      );
    }

    // 2. Identifica a ação baseada em como você chamou o comando (!ativar ou !desativar)
    // Se você usar !cmd ativar ppp, ele pega o args[0]. Se usar !desativar ppp, ele olha o commandName.
    const acaoPrincipal = commandName.toLowerCase();
    const nomeCmd = args[0].toLowerCase().replace(PREFIX, "");

    // 3. Lógica para DESATIVAR
    if (acaoPrincipal === "desativar" || (acaoPrincipal === "cmd" && args[0] === "off")) {
      const alvo = acaoPrincipal === "cmd" ? args[1] : nomeCmd;
      if (!alvo) return await sendReply("❌ Especifique o comando para desativar.");
      
      blockCommand(remoteJid, alvo.toLowerCase().replace(PREFIX, ""));
      await sendSuccessReact();
      return await sendReply(
        `🚫 *ORDEM SUPREMA!* O comando *${alvo}* foi bloqueado neste grupo. Ninguém toca nele! 🤫`
      );
    }

    // 4. Lógica para ATIVAR
    if (acaoPrincipal === "ativar" || (acaoPrincipal === "cmd" && args[0] === "on")) {
      const alvo = acaoPrincipal === "cmd" ? args[1] : nomeCmd;
      if (!alvo) return await sendReply("❌ Especifique o comando para ativar.");

      unblockCommand(remoteJid, alvo.toLowerCase().replace(PREFIX, ""));
      await sendSuccessReact();
      return await sendReply(
        `✅ *LIBERADO!* O comando *${alvo}* está ativo novamente para os plebeus.`
      );
    }
  },
};