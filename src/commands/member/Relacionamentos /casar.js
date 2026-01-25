import {
  lerRelacionamentos,
  salvarRelacionamentos,
  getRelacionamentoStatus,
  cleanJid 
} from '../../../utils/relacionamento.js'; 

export default { 
  name: "casar",
  description: "Pede alguém em casamento (Custo R$ 500 do Duelo).",
  commands: ["casar", "casamento"],
  usage: "!casar @pessoa",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ isGroup, remoteJid, sendReply, socket, userLid, sendText, webMessage, isReply, replyLid }) => { 
    
    if (!isGroup) return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    
    try {
      const remetente = userLid; 
      let pretendente;
      
      // VERIFICAÇÃO DO SOBERANO PELO LID INFORMADO
      const soberanoLid = "240041947357401@lid";
      const isSoberano = (cleanJid(remetente) === cleanJid(soberanoLid));

      // Identifica o alvo (Resposta ou Menção)
      if (isReply && replyLid) {
          pretendente = replyLid;
      } else {
        const mentions = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentions && mentions.length > 0) {
          pretendente = mentions[0];
        }
      }
      
      if (!pretendente) return await sendReply("❌ Você precisa marcar (@) ou responder alguém!");
      if (cleanJid(remetente) === cleanJid(pretendente)) return await sendReply("🤡 Casar com você mesmo? Nem a Gótica aceita isso.");
      
      // Verifica Status Atual
      const remetenteStatus = getRelacionamentoStatus(remoteJid, cleanJid(remetente));
      const pretendenteStatus = getRelacionamentoStatus(remoteJid, cleanJid(pretendente));

      if (remetenteStatus?.status === 'casado') return await sendReply("⚠️ Você já é casado(a)! Quer ser preso por bigamia? 👮");
      if (pretendenteStatus?.status === 'casado') return await sendReply("⚠️ Essa pessoa já subiu ao altar com outro(a).");

      // --- LÓGICA ESPECIAL PARA O SOBERANO ---
      if (isSoberano) {
        const db = lerRelacionamentos();
        if (!db[remoteJid]) db[remoteJid] = {};
        
        db[remoteJid][remetente] = { parceiro: pretendente, status: "casado" };
        db[remoteJid][pretendente] = { parceiro: remetente, status: "casado" };
        salvarRelacionamentos(db);

        const msgSoberano = `👰‍♀️🤵‍♂️ *CASAMENTO FORÇADO PELO SOBERANO!* \n\n` +
          `@${remetente.split("@")[0]} escolheu @${pretendente.split("@")[0]} para ser sua companhia eterna.\n\n` +
          `Como @${remetente.split("@")[0]} é o *Soberano Mestre Supremo*, @${pretendente.split("@")[0]} não pode dizer não! 😈\n\n` +
          `Estão oficialmente casados sob o domínio da Gótica! ✨🥂`;
        
        return await sendText(msgSoberano, [remetente, pretendente]);
      }

      // --- LÓGICA NORMAL PARA MEMBROS COMUNS ---
      const pedidoText = `🥂 *PEDIDO DE CASAMENTO* 🥂\n\n@${pretendente.split("@")[0]}, você aceita se casar com @${remetente.split("@")[0]}?\n\n💍 *Custo do Cartório:* R$ 500,00\n\nResponda com *sim* ou *não* em 60 segundos.`;
      
      await sendText(pedidoText, [pretendente, remetente]);

      // Coletor de resposta
      const resposta = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          socket.ev.off("messages.upsert", listener);
          resolve(null);
        }, 60000);

        const listener = ({ messages }) => {
          const msg = messages[0];
          const participant = msg.key.participant || msg.key.remoteJid;
          if (!participant) return;

          if (msg.key.remoteJid === remoteJid && cleanJid(participant) === cleanJid(pretendente)) { 
            const texto = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").toLowerCase().trim();
            if (texto === "sim" || texto === "não") {
              clearTimeout(timeout);
              socket.ev.off("messages.upsert", listener);
              resolve(texto);
            }
          }
        };
        socket.ev.on("messages.upsert", listener);
      });

      if (resposta === "sim") {
        const db = lerRelacionamentos();
        if (!db[remoteJid]) db[remoteJid] = {};
        
        db[remoteJid][remetente] = { parceiro: pretendente, status: "casado" };
        db[remoteJid][pretendente] = { parceiro: remetente, status: "casado" };
        salvarRelacionamentos(db);

        const msgFinal = `👰‍♀️🤵‍♂️ *RECÉM-CASADOS!* \n\nNuma cerimônia gótica e luxuosa, @${remetente.split("@")[0]} e @${pretendente.split("@")[0]} juraram amor eterno!\n\n💸 A taxa de R$ 500,00 foi debitada. Felicidades! ✨🥂`;
        await sendText(msgFinal, [remetente, pretendente]);

      } else if (resposta === "não") {
        await sendReply(`💔 *REJEITADO!* @${pretendente.split("@")[0]} deixou @${remetente.split("@")[0]} no altar. Que mico!`, [pretendente, remetente]);
      } else {
        await sendReply("⌛ O padre cansou de esperar. Pedido cancelado por vácuo.");
      }
    } catch (error) {
      console.error(error);
      return await sendReply("❌ Erro ao organizar o casamento.");
    }
  },
};