// src/commands/member/Relacionamentos/casar.js

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
  name: "casar",
  description: "Pede alguém em casamento. (Custo R$0 para teste)",
  commands: ["casar"],
  usage: "!casar @pessoa",

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
        return await sendReply("❌ Você precisa *mencionar* alguém para pedir em casamento. Use: !casar @pessoa");
      }
      
      pretendenteRaw = mentionList[0];
      const pretendente = cleanJid(pretendenteRaw); 

      if (remetente === pretendente) {
        return await sendReply("❌ Você não pode casar consigo mesmo(a).");
      }
      
      // 2. Verifica Relacionamento 
      const remetenteStatus = getRelacionamentoStatus(groupId, remetente);
      const pretendenteStatus = getRelacionamentoStatus(groupId, pretendente);

      // 🚨 NOVA LÓGICA DE CHECAGEM 🚨
      if (remetenteStatus) {
        if (remetenteStatus.parceiro !== pretendente) {
            // Está em um relacionamento com outra pessoa
            return await sendReply(`❌ @${remetente.split("@")[0]}, você já está ${remetenteStatus.status} com outra pessoa. Use \`!terminar\` antes.`);
        }
        if (remetenteStatus.status === 'casado') {
            // Já está casado
            return await sendReply(`❌ @${remetente.split("@")[0]}, você e @${pretendente.split("@")[0]} já estão casados. Divórcio não é a resposta para tudo!`);
        }
        // Se o status for 'namorando' com o parceiro Certo, o fluxo continua (Permitido casar)
      }
      
      if (pretendenteStatus) {
        if (pretendenteStatus.parceiro !== remetente) {
             // O pretendente está em um relacionamento com outra pessoa
            return await sendReply(`❌ O(a) @${pretendente.split("@")[0]} já está ${pretendenteStatus.status} com outra pessoa.`);
        }
         if (pretendenteStatus.status === 'casado') {
            // O pretendente já está casado (com você, o que já seria pego no remetenteStatus)
            return await sendReply(`❌ @${pretendente.split("@")[0]} e você já estão casados.`);
        }
        // Se o status for 'namorando' com o parceiro Certo, o fluxo continua (Permitido casar)
      }
      
      // 3. Envio do Pedido e Coleta da Resposta (Sem desconto, custo 0)
      await socket.sendMessage(groupId, {
        text: `🥂 Pedido de CASAMENTO para @${pretendente.split("@")[0]}!\n\n@${remetente.split("@")[0]} quer se CASAR com você! 💍\n\nVocê aceita? Responda com *sim* ou *não* em 60 segundos.`,
        mentions: [pretendente, remetente],
      });

      // Coletor de resposta (Listener)
      const resposta = await new Promise((resolve) => {
        const listener = ({ messages }) => {
          const msg = messages[0];
          
          const participantJid = msg.key.participant;
          if (!participantJid) return; 

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
        
        // MUDANÇA CRÍTICA: Status alterado para "casado"
        relacionamentos[groupId][remetente] = { parceiro: pretendente, status: "casado" };
        relacionamentos[groupId][pretendente] = { parceiro: remetente, status: "casado" };
        salvarRelacionamentos(relacionamentos);

        await socket.sendMessage(groupId, {
          text: `🎉 *CASADOS!* @${remetente.split("@")[0]} 💍 @${pretendente.split("@")[0]} agora são marido e mulher! Muitas felicidades!`,
          mentions: [remetente, pretendente],
        });
      } else if (resposta === "não") {
        await sendReply(`💔 Que pena! O pedido foi recusado por @${pretendente.split("@")[0]}.`);
      } else {
        await sendReply("⌛ O tempo para responder esgotou e o pedido foi cancelado.");
      }
    } catch (error) {
      console.error("Erro no comando !casar:", error);
      return await sendReply("❌ Ocorreu um erro fatal ao processar o pedido de casamento.");
    }
  },
};