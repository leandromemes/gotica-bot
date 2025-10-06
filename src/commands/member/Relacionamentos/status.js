// src/commands/member/Relacionamentos/status.js
const { getRelacionamentoStatus, cleanJid } = require('../../../utils/relacionamento');

module.exports = {
  name: "status",
  description: "Mostra seu status de relacionamento no grupo.",
  commands: ["status", "verstatus"],
  usage: "!status",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ webMessage, userJid, sendReply, socket }) => {
    const groupJid = webMessage.key.remoteJid;
    if (!groupJid.endsWith('@g.us')) {
      return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    }

    try {
      const cleanedUserJid = cleanJid(userJid); 
      
      // 🚨 getRelacionamentoStatus deve funcionar agora
      const status = getRelacionamentoStatus(groupJid, cleanedUserJid); 

      let mensagem;
      let mentions = [cleanedUserJid]; 

      if (!status) {
        mensagem = `👤 @${cleanedUserJid.split('@')[0]}, você está atualmente *SOLTEIRO(A)* neste grupo. Use \`!namorar\` para mudar isso!`;
      } else {
        const tipo = status.status;
        const parceiroJid = status.parceiro;
        mentions.push(parceiroJid);
        
        if (tipo === 'namorando') {
          mensagem = `💍 Você está *NAMORANDO* com @${parceiroJid.split('@')[0]} neste grupo! Use \`!terminar\` se as coisas não estiverem boas.`;
        } else if (tipo === 'casado') {
          mensagem = `🥂 Você está *CASADO(A)* com @${parceiroJid.split('@')[0]} neste grupo! Parabéns! Use \`!divorciar\` se a vida a dois apertar.`;
        } else {
          mensagem = `❓ Seu status de relacionamento é *${tipo.toUpperCase()}* com @${parceiroJid.split('@')[0]}.`;
        }
      }
      
      await socket.sendMessage(groupJid, {
        text: mensagem,
        mentions: [...new Set(mentions)] 
      });

    } catch (e) {
      console.error("Erro no comando !status:", e); 
      return await sendReply("❌ Ocorreu um erro ao verificar seu status.");
    }
  },
};