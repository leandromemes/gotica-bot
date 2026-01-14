import { PREFIX } from "../../config.js"; 
import { 
  activateRealGroup, 
  deactivateRealGroup, 
  isActiveRealGroup 
} from "../../utils/database.js"; 

export default {
  name: "modoreal",
  description: "Ativa ou desativa o sistema de Real no grupo.",
  commands: ["modoreal", "economia"],
  usage: `${PREFIX}modoreal 1 ou 0`,
  
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ 
    remoteJid, 
    args, 
    sendReply, 
    sendWarningReply, 
    sendSuccessReply, 
    isGroup, 
    type, // O bot injeta o cargo aqui: "admin", "owner" ou "member"
    userLid, 
    webMessage 
  }) => { 
    
    // 1. Verificação de Grupo
    if (!isGroup) return sendReply("🚨 Este comando só pode ser usado em grupos.");
    
    // 2. Verificação de Segurança (Dono ou Admin)
    // Verificamos se o cargo (type) é admin ou owner, 
    // ou se o seu ID manual está presente (backup de segurança)
    const souDonoManual = userLid.includes("556391330669") || userLid.includes("240041947357401");
    const eAutorizado = type === "admin" || type === "owner" || souDonoManual;

    if (!eAutorizado) {
        return sendWarningReply("Apenas administradores do grupo ou o Dono podem usar este comando.");
    }
    
    const actionStr = String(args[0] || '').trim();
    const statusAtual = isActiveRealGroup(remoteJid);

    // 3. Lógica de Ativação
    if (actionStr === '1') {
        if (statusAtual) return sendReply("ℹ️ O Modo Real já está *ATIVADO* neste grupo.");
        
        activateRealGroup(remoteJid);
        await sendSuccessReply(`MODO REAL ATIVADO!\n\nO sistema de Real (R$) agora está ativo neste grupo.\nUse ${PREFIX}trabalhar para começar!`);

    } else if (actionStr === '0') {
        if (!statusAtual) return sendReply("ℹ️ O Modo Real já está *DESATIVADO* neste grupo.");
        
        deactivateRealGroup(remoteJid);
        await sendWarningReply("Modo Real DESATIVADO neste grupo.");

    } else {
        const statusMsg = statusAtual ? "ATIVADO" : "DESATIVADO";
        await sendReply(`⚠️ *Status Atual: ${statusMsg}*\n\nUse:\n- ${PREFIX}modoreal 1 (Ligar)\n- ${PREFIX}modoreal 0 (Desligar)`);
    }
  },
};