const { PREFIX } = require(`${BASE_DIR}/config`);
const { 
  activateRealGroup, 
  deactivateRealGroup,
  isActiveRealGroup // Importa para checagem interna de status
} = require(`${BASE_DIR}/utils/database`);

// JIDs FIXOS PARA O DONO: Chave mestra do seu sistema de economia (Obrigatório para comandos de controle)
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

module.exports = {
  name: "modoreal",
  description: "Ativa ou desativa o sistema de Real (economia) no grupo. Comando de Dono.",
  commands: ["modoreal"],
  usage: `${PREFIX}modoreal 1 ou ${PREFIX}modoreal 0`,
  
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, userJid, args, sendReply }) => {
    
    // 1. CHECAGEM DE DONO (Corrigida)
    const isOwner = userJid.includes(DONO_PHONE) || userJid.includes(TARGET_JID_DONO);
    if (!isOwner) {
        return sendReply("🚨 Comando restrito. Apenas meu dono *Leandro* pode controlar o modo real.");
    }

    // 2. Validação da Ação
    const actionStr = String(args || '').trim().split(/\s+/)[0];
    const statusAtual = isActiveRealGroup(remoteJid);

    if (actionStr === '1') {
        if (statusAtual) {
             return sendReply("ℹ️ O Modo Real já está *ATIVADO* neste grupo.");
        }
        // Ativar o modo real
        activateRealGroup(remoteJid);
        
        await sendReply(`
✅ *MODO REAL ATIVADO!*
---------------------------------
O sistema de Real (R$) agora está ativo neste grupo.
Membros podem usar comandos de economia.
        `.trim());

    } else if (actionStr === '0') {
        if (!statusAtual) {
             return sendReply("ℹ️ O Modo Real já está *DESATIVADO* neste grupo.");
        }
        // Desativar o modo real
        deactivateRealGroup(remoteJid);
        
        await sendReply(`
❌ *MODO REAL DESATIVADO!*
---------------------------------
O sistema de Real (R$) foi desativado neste grupo.
Comandos de economia não funcionarão mais.
        `.trim());

    } else {
        // Argumento inválido ou ausente
        const statusMsg = statusAtual ? "ATIVADO" : "DESATIVADO";
        await sendReply(`
⚠️ *Argumento Inválido ou Ausente!*
---------------------------------
Status Atual: *${statusMsg}*
Use:
- ${PREFIX}modoreal *1* para ativar o modo real.
- ${PREFIX}modoreal *0* para desativar o modo real.
        `.trim());
    }
  },
};