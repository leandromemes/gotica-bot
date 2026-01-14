import { PREFIX } from "../../config.js";
import { activateGroup, deactivateGroup, isActiveGroup } from "../../utils/database.js";

export default {
  name: "grupos",
  description: "Gerencia o bot nos grupos",
  commands: ["grupos", "painel", "testing"], // Deixei o nome antigo aqui também
  usage: `${PREFIX}grupos`,

  handle: async ({ socket, sendReply, args, isOwner }) => {
    if (!isOwner) return;

    try {
      if (args.length === 0) {
        const allGroups = await socket.groupFetchAllParticipating();
        const groups = Object.values(allGroups);
        
        let msg = "🏰 *PAINEL DE CONTROLE*\n\n";
        groups.forEach((g, i) => {
          const status = isActiveGroup(g.id) ? "✅ ON" : "❌ OFF";
          msg += `${i + 1}. ${status} *${g.subject}*\nID: \`\`\`${g.id}\`\`\`\n\n`;
        });
        msg += `*Comandos:* \n!grupos off [ID]\n!grupos on [ID]`;
        return await sendReply(msg);
      }

      const acao = args[0].toLowerCase();
      const targetId = args[1];

      if (!targetId || !targetId.endsWith("@g.us")) {
        return await sendReply("⚠️ Informe o ID do grupo corretamente.");
      }

      if (acao === "off") {
        deactivateGroup(targetId);
        await sendReply(`🤫 Grupo desativado: ${targetId}`);
      } else if (acao === "on") {
        activateGroup(targetId);
        await sendReply(`⚡ Grupo reativado: ${targetId}`);
      }
    } catch (error) {
      await sendReply(`❌ Erro: ${error.message}`);
    }
  },
};