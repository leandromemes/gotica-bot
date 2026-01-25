import { lerRelacionamentos, salvarRelacionamentos, cleanJid } from '../../../utils/relacionamento.js';

export default {
  name: "terminar",
  description: "Termina o namoro ou divórcia o casamento atual.",
  commands: ["terminar", "separar", "divorciar", "divorcio"],
  usage: "!terminar",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ isGroup, remoteJid, sendReply, userLid, sendReact, sendText }) => {
    if (!isGroup) return;

    const db = lerRelacionamentos();
    const grupo = db[remoteJid] || {};
    
    // Busca o usuário no banco (pelo ID completo que salvamos no !namorar/!casar)
    const meuId = userLid;
    const meuRelacionamento = grupo[meuId];

    if (!meuRelacionamento) {
      return sendReply("🤨 Você está solteiro(a). Não dá para terminar o que não existe, pare de passar vergonha! 🤡");
    }

    const parceiroId = meuRelacionamento.parceiro;
    const statusAtual = meuRelacionamento.status; // 'namorando' ou 'casado'

    // Remove ambos do banco de dados
    delete db[remoteJid][meuId];
    delete db[remoteJid][parceiroId];
    
    salvarRelacionamentos(db);
    await sendReact("💔");

    // Define a mensagem com base no status
    let titulo, fraseFinal;
    if (statusAtual === 'casado') {
      titulo = "⚖️ *DIVÓRCIO JUDICIAL PAPAL* ⚖️";
      fraseFinal = "O papel do divórcio foi assinado. Quem fica com a casa e o bot? 🏚️💅";
    } else {
      titulo = "💔 *ACABOU O AMOR!*";
      fraseFinal = "Voltou para a pista! Desejo sorte para quem aguentar vocês agora! ✨";
    }

    const msg = `${titulo}\n\n@${meuId.split("@")[0]} colocou um fim no ${statusAtual} com @${parceiroId.split("@")[0]}.\n\n_${fraseFinal}_`;
    
    // Envia com as mentions para brilhar os nomes
    await sendText(msg, [meuId, parceiroId]);
  },
};