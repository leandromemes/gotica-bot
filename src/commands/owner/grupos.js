import { PREFIX } from "../../config.js";
import { activateGroup, deactivateGroup, isActiveGroup } from "../../utils/database.js";

export default {
  name: "grupos",
  description: "Gerencia o bot nos grupos por números",
  commands: ["grupos", "painel"],
  usage: `${PREFIX}grupos`,

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, sendReply, args }) => {
    try {
      const allGroups = await socket.groupFetchAllParticipating();
      const groups = Object.values(allGroups);

      // 1. Listagem Limpa (Sem IDs gigantes)
      if (!args || args.length === 0) {
        let msg = `🏰 *PAINEL DE GRUPOS* (${groups.length})\n\n`;
        
        groups.forEach((g, i) => {
          const status = isActiveGroup(g.id) ? "✅ ON" : "❌ OFF";
          // Exibe apenas: 1. ✅ ON - Nome do Grupo
          msg += `*${i + 1}.* ${status} - ${g.subject}\n`;
        });

        msg += `\n*Comandos:* \n!grupos on [nº]\n!grupos off [nº]`;
        return await sendReply(msg);
      }

      // 2. Lógica de Ação (Mesma que funcionou antes)
      const textoCompleto = args.join(" ").toLowerCase();
      const acao = textoCompleto.includes("on") ? "on" : textoCompleto.includes("off") ? "off" : null;
      const numeroInformado = parseInt(textoCompleto.replace(/\D/g, ""));

      if (!acao || isNaN(numeroInformado) || numeroInformado < 1 || numeroInformado > groups.length) {
        return await sendReply(`⚠️ Mestre, escolha um número de 1 a ${groups.length}.\nEx: !grupos off 4`);
      }

      const grupoAlvo = groups[numeroInformado - 1];
      const jidAlvo = grupoAlvo.id;
      const nomeAlvo = grupoAlvo.subject;

      if (acao === "off") {
        deactivateGroup(jidAlvo);
        return await sendReply(`🤫 *${nomeAlvo}* desativado.`);
      } 
      
      if (acao === "on") {
        activateGroup(jidAlvo);
        return await sendReply(`⚡ *${nomeAlvo}* reativado.`);
      }

    } catch (error) {
      return await sendReply("❌ Erro: " + error.message);
    }
  },
};