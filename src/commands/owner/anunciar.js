const { PREFIX } = require(`${BASE_DIR}/config`);

// JIDs FIXOS PARA O DONO (Checagem de Dono)
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669@s.whatsapp.net';

module.exports = {
  name: "anunciar",
  description: "Envia uma mensagem de anúncio para todos os grupos que o bot participa.",
  commands: ["anunciar", "comunicar", "aviso"],
  usage: `${PREFIX}anunciar [sua mensagem]`,
  
  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, userJid, args, webMessage, sendReply }) => {
    
    // 1. CHECAGEM DE DONO (Obrigatória)
    const isOwner = userJid.includes(DONO_PHONE) || userJid.includes(TARGET_JID_DONO);
    
    if (!isOwner) {
        return sendReply("🚨 Comando restrito. Apenas meu dono *Leandro* pode enviar anúncios para todos os grupos.");
    }
    
    // 2. Validação da Mensagem
    if (!args || args.length === 0) {
      return await sendReply(
        `✨ Você precisa me fornecer uma mensagem! Exemplo de uso:\n\n${PREFIX}anunciar Hoje teremos manutenção no sistema.`
      );
    }

    const announcementText = args.join(" ");
    const senderName = webMessage.pushName || "Dono(a) do Bot";
    const broadcastMessage = `
📢 *ANÚNCIO IMPORTANTE!* 📢
---------------------------------
*Mensagem:* ${announcementText}
---------------------------------
👤 Enviado por: *${senderName}*
    `.trim();

    try {
      const groups = await socket.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);

      if (groupIds.length === 0) {
        return await sendReply("Não estou em nenhum grupo para anunciar.");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      await sendReply(`📢 Iniciando o envio do anúncio para *${groupIds.length}* grupos com delay de 3 segundos entre cada...`);

      for (const groupId of groupIds) {
        try {
          await socket.sendMessage(groupId, { text: broadcastMessage });
          successCount++;
          
          // ALTERAÇÃO CRÍTICA: 500ms -> 3000ms (3 segundos)
          await new Promise(resolve => setTimeout(resolve, 3000)); 
        } catch (e) {
          errorCount++;
          console.error(`[ANUNCIAR] Falha ao enviar para o grupo ${groupId}:`, e);
        }
      }

      await sendReply(`
✅ *Anúncio Global Finalizado!*
---------------------------------
🌐 Enviado com sucesso para: *${successCount}* grupos.
❌ Falhas (Sem permissão/saída): ${errorCount} grupos.
      `.trim());

    } catch (error) {
      console.error("[ANUNCIAR] Erro ao buscar os grupos:", error);
      await sendReply("Ocorreu um erro ao tentar buscar a lista de grupos para enviar o anúncio.");
    }
  },
};