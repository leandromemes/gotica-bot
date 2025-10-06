// src/commands/member/Relacionamentos/namorar.js

const {
  formatarReal,
  getSaldoInfo, 
  salvarSaldoData,
  lerRelacionamentos,
  salvarRelacionamentos,
  getRelacionamentoStatus,
  cleanJid 
} = require('../../../utils/relacionamento'); 

const CUSTO_ANEL = 250;

module.exports = {
  name: "namorar",
  description: "Pede alguém em namoro. (Custo R$0 para teste)",
  commands: ["namorar"],
  usage: "!namorar @pessoa",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ webMessage, sendReply, socket, userJid }) => {
    const groupId = webMessage.key.remoteJid;
    if (!groupId.endsWith('@g.us')) {
      return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    }
    
    try {
      // 1. Identificar o alvo e remetente
      const mentionList = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const remetente = cleanJid(userJid); 
      
      let pretendenteRaw;
      
      if (mentionList.length === 0) {
        return await sendReply("❌ Você precisa *mencionar* alguém para pedir em namoro. Use: !namorar @pessoa");
      }
      
      pretendenteRaw = mentionList[0];
      const pretendente = cleanJid(pretendenteRaw); 

      if (remetente === pretendente) {
        return await sendReply("❌ Você não pode namorar consigo mesmo(a).");
      }
      
      // 2. Verifica Relacionamento 
      const remetenteStatus = getRelacionamentoStatus(groupId, remetente);
      const pretendenteStatus = getRelacionamentoStatus(groupId, pretendente);

      if (remetenteStatus || pretendenteStatus) {
        const jidOcupado = remetenteStatus ? remetente : pretendente; 
        const status = remetenteStatus ? remetenteStatus.status : pretendenteStatus.status;
        
        return await sendReply(`❌ O(a) @${jidOcupado.split("@")[0]} já está ${status}. Usem \`!terminar\` ou \`!divorciar\` antes.`);
      }
      
      // 🚨 REMOVIDO: A checagem que impedia o bot de namorar foi removida.
      
      // 3. Envio do Pedido e Coleta da Resposta (Sem desconto, custo 0)
      await socket.sendMessage(groupId, {
        text: `💌 Pedido de namoro para @${pretendente.split("@")[0]}!\n\n@${remetente.split("@")[0]} quer namorar com você! 💍\n\nVocê aceita? Responda com *sim* ou *não* em 60 segundos.`,
        mentions: [pretendente, remetente],
      });

      // Coletor de resposta (Listener)
      const resposta = await new Promise((resolve) => {
        const listener = ({ messages }) => {
          const msg = messages[0];
          
          // 🚨 CORREÇÃO FINAL DO JID NULL: Ignora mensagens sem um remetente válido
          const participantJid = msg.key.participant;
          if (!participantJid) return; 

          // Assegura que a resposta é do pretendente
          if (msg.key.remoteJid === groupId && cleanJid(participantJid) === pretendente) { 
            const texto = msg.message?.conversation?.toLowerCase().trim();
            if (texto === "sim" || texto === "não") {
              socket.ev.off("messages.upsert", listener);
              resolve(texto);
            }
          }
        };
        socket.ev.on("messages.upsert", listener);
        setTimeout(() => {
          socket.ev.off("messages.upsert", listener);
          resolve(null);
        }, 60000); 
      });

      // 4. Processa a Resposta
      if (resposta === "sim") {
        const relacionamentos = lerRelacionamentos();
        if (!relacionamentos[groupId]) relacionamentos[groupId] = {};
        
        relacionamentos[groupId][remetente] = { parceiro: pretendente, status: "namorando" };
        relacionamentos[groupId][pretendente] = { parceiro: remetente, status: "namorando" };
        salvarRelacionamentos(relacionamentos);

        await socket.sendMessage(groupId, {
          text: `💑 *É OFICIAL!* @${remetente.split("@")[0]} ❤️ @${pretendente.split("@")[0]} agora estão namorando! Felicidades ao novo casal!`,
          mentions: [remetente, pretendente],
        });
      } else if (resposta === "não") {
        await sendReply(`💔 Que pena! O pedido foi recusado por @${pretendente.split("@")[0]}.`);
      } else {
        await sendReply("⌛ O tempo para responder esgotou e o pedido foi cancelado.");
      }
    } catch (error) {
      console.error("Erro no comando !namorar:", error);
      return await sendReply("❌ Ocorreu um erro fatal ao processar o pedido de namoro.");
    }
  },
};