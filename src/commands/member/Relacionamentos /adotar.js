import { lerFamilia, salvarFamilia, cleanJid } from '../../../utils/familia.js';

export default {
  name: "adotar",
  description: "Adota um membro como seu filho(a).",
  commands: ["adotar", "filho", "filha"],
  usage: "!adotar @pessoa",

  handle: async ({ isGroup, remoteJid, sendReply, socket, userLid, webMessage, isReply, replyLid, sendText }) => {
    if (!isGroup) return await sendReply("❌ Só funciona em grupos.");

    const pai = userLid;
    let filho;

    if (isReply && replyLid) filho = replyLid;
    else {
      const mentions = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (mentions?.length > 0) filho = mentions[0];
    }

    if (!filho) return await sendReply("❌ Marque ou responda quem você quer adotar.");
    if (cleanJid(pai) === cleanJid(filho)) return await sendReply("🤡 Você não pode ser seu próprio pai!");

    const db = lerFamilia();
    if (!db[remoteJid]) db[remoteJid] = {};
    if (!db[remoteJid][pai]) db[remoteJid][pai] = { esposas: [], filhos: [], irmaos: [] };
    if (!db[remoteJid][filho]) db[remoteJid][filho] = { esposas: [], filhos: [], irmaos: [] };

    // Verifica se já é filho
    if (db[remoteJid][pai].filhos.includes(filho)) return await sendReply("⚠️ Esse membro já é seu filho(a)!");

    const msgPedido = `🍼 *PEDIDO DE ADOÇÃO* 🍼\n\n@${filho.split("@")[0]}, você aceita ser filho(a) de @${pai.split("@")[0]}?\n\nResponda com *sim* ou *no* em 60 segundos.`;
    await sendText(msgPedido, [filho, pai]);

    // Coletor de resposta
    const resposta = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.ev.off("messages.upsert", listener);
        resolve(null);
      }, 60000);

      const listener = ({ messages }) => {
        const msg = messages[0];
        const participant = msg.key.participant || msg.key.remoteJid;
        if (msg.key.remoteJid === remoteJid && cleanJid(participant) === cleanJid(filho)) {
          const texto = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").toLowerCase().trim();
          if (texto === "sim" || texto === "não" || texto === "nao") {
            clearTimeout(timeout);
            socket.ev.off("messages.upsert", listener);
            resolve(texto);
          }
        }
      };
      socket.ev.on("messages.upsert", listener);
    });

    if (resposta === "sim") {
      db[remoteJid][pai].filhos.push(filho);
      db[remoteJid][filho].pai = pai; // Define quem é o pai do filho
      salvarFamilia(db);
      await sendText(`🍼🎉 *FAMÍLIA CRESCEU!* \n\n@${pai.split("@")[0]} adotou @${filho.split("@")[0]} como seu novo herdeiro(a)!`, [pai, filho]);
    } else {
      await sendReply("💔 O pedido de adoção foi recusado ou ignorado.");
    }
  }
};