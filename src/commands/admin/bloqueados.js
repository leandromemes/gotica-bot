import { getBlockedCommands } from "../../utils/database.js";

export default {
  name: "bloqueados",
  description: "Lista os comandos que estão desativados no grupo.",
  commands: ["bloqueados", "listablock", "cmds-off"],
  
  handle: async ({ remoteJid, sendReply }) => {
    const bloqueados = getBlockedCommands(remoteJid);

    if (bloqueados.length === 0) {
      return await sendReply("✅ *Nenhum comando está bloqueado neste grupo.* O povo está livre (por enquanto)! 😎");
    }

    const lista = bloqueados.map(cmd => `• *${cmd}*`).join("\n");
    
    await sendReply(`🚫 *COMANDOS BLOQUEADOS NESTE CHAT:* \n\n${lista}\n\n_Somente o Mestre Supremo Leandro ignora essas travas!_ 👑`);
  },
};