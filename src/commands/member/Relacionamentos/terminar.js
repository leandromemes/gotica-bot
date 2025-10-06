// src/commands/member/Relacionamentos/terminar.js
const {
  getRelacionamentoStatus,
  terminarRelacionamento
} = require('../../../utils/relacionamento'); 

module.exports = {
  name: "terminar",
  description: "Termina seu relacionamento (namoro ou casamento).",
  commands: ["terminar", "divorciar"],
  usage: "!terminar",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, userJid, sendReply, command }) => {
    
    const groupJid = webMessage.key.remoteJid;
    if (!groupJid.endsWith('@g.us')) {
      return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    }
    
    try {
      const status = getRelacionamentoStatus(groupJid, userJid);

      if (!status) {
        if (command === 'divorciar') {
           return await sendReply("🚫 Você não está casado(a) para se divorciar. Use !namorar primeiro.");
        }
        return await sendReply("🚫 Você não está em nenhum relacionamento para terminar. Use !namorar.");
      }
      
      const tipo = status.status; // 'namorando' ou 'casado'
      const parceiroJid = status.parceiro;

      // 1. Termina o relacionamento (função central)
      terminarRelacionamento(groupJid, userJid);

      let mensagem;
      if (tipo === 'namorando') {
          mensagem = `💔 O namoro de @${userJid.split('@')[0]} e @${parceiroJid.split('@')[0]} chegou ao fim. Sejam livres novamente!`;
      } else { // Casamento
          mensagem = `⚖️ *DIVÓRCIO!* O casamento de @${userJid.split('@')[0]} e @${parceiroJid.split('@')[0]} terminou oficialmente. Adeus à vida a dois!`;
      }

      await socket.sendMessage(groupJid, {
        text: mensagem,
        mentions: [userJid, parceiroJid],
      });

    } catch (e) {
      console.error("Erro no comando !terminar:", e);
      await sendReply("💔❌ Erro ao tentar terminar o relacionamento.");
    }
  },
};