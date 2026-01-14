import { lerRelacionamentos, salvarRelacionamentos, getRelacionamentoStatus, cleanJid } from '../../../utils/relacionamento.js';

export default {
  name: "namorar",
  description: "Pede alguém em namoro salvando o JID completo para mostrar nomes.",
  commands: ["namorar", "pedido"],
  usage: "!namorar @pessoa",

  handle: async ({ isGroup, remoteJid, sendReply, socket, userLid, sendText, webMessage, isReply, replyLid, sendReact }) => {
    if (!isGroup) return await sendReply("🙄 Quer namorar no privado? Vá para um grupo!");
    
    try {
      const remetente = userLid; 
      let pretendente;
      
      if (isReply && replyLid) {
          pretendente = replyLid;
      } else {
        const mentions = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentions && mentions.length > 0) {
          pretendente = mentions[0];
        }
      }

      if (!pretendente) return await sendReply("⚠️ Marque (@) ou responda alguém!");
      
      if (cleanJid(remetente) === cleanJid(pretendente)) {
        return await sendReply("🤡 Querendo namorar consigo mesmo?");
      }
      
      if (getRelacionamentoStatus(remoteJid, remetente) || getRelacionamentoStatus(remoteJid, pretendente)) {
        return await sendReply("💅 Alguém aqui já está ocupado!");
      }
      
      await sendReact("💘");
      
      const pedidoText = `💌 *PEDIDO DE NAMORO* 💌\n\n@${pretendente.split('@')[0]}, você foi pedido(a) em namoro por @${remetente.split('@')[0]}! 💍\n\nResponda com *sim* ou *não* em 60 segundos.`;
      
      await sendText(pedidoText, [pretendente, remetente]);

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
        
        // SALVANDO O JID COMPLETO (IMPORTANTE PARA O NOME APARECER DEPOIS)
        db[remoteJid][remetente] = { parceiro: pretendente, status: "namorando" };
        db[remoteJid][pretendente] = { parceiro: remetente, status: "namorando" };
        
        salvarRelacionamentos(db);

        await sendReact("💏");
        await sendText(`💑 *OFICIAL:* @${remetente.split('@')[0]} ❤️ @${pretendente.split('@')[0]} agora estão namorando! ✨💅`, [remetente, pretendente]);
      } else if (resposta === "não") {
        await sendReact("💔");
        await sendReply(`🤣 *RECUSADO!* @${remetente.split('@')[0]} foi rejeitado por @${pretendente.split('@')[0]}.`, [remetente, pretendente]);
      } else {
        await sendReply("⌛ Tempo esgotado!");
      }
    } catch (error) {
      console.error(error);
      return await sendReply("❌ Erro no processo.");
    }
  },
};