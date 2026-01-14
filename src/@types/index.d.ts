import { terminarRelacionamento, cleanJid } from '../../../utils/relacionamento.js';

export default {
  name: "terminar",
  description: "Termina o relacionamento.",
  commands: ["terminar", "separar"],

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ isGroup, remoteJid, sendReply, userLid, sendReact, sendText }) => {
    if (!isGroup) return;

    // Busca o ID do parceiro no banco de dados
    const parceiroIdRaw = terminarRelacionamento(remoteJid, cleanJid(userLid));

    if (!parceiroIdRaw) {
      return sendReply("🤨 Você nem está em um relacionamento. Tá querendo terminar com a solidão?");
    }

    await sendReact("💔");

    // LÓGICA DE NOMES CORRIGIDA:
    // Se o ID do banco não tem @, precisamos colocar o sufixo correto.
    // Baseado na sua tipagem, se for um LID (longo), usamos @lid, senão @s.whatsapp.net
    let parceiroMencao = parceiroIdRaw;
    if (!parceiroIdRaw.includes('@')) {
      parceiroMencao = parceiroIdRaw.length > 15 
        ? `${parceiroIdRaw}@lid` 
        : `${parceiroIdRaw}@s.whatsapp.net`;
    }
    
    // Montamos a mensagem usando os IDs para o WhatsApp converter em nomes azuis
    const msg = `💔 *ACABOU O AMOR!*\n\n@${userLid.split("@")[0]} terminou tudo com @${parceiroMencao.split("@")[0]}.\n\n_Desejo sorte para quem aguentar vocês agora!_ 💅✨`;
    
    // O ARRAY de menções no final é obrigatório para o WhatsApp processar o nome
    await sendText(msg, [userLid, parceiroMencao]);
  },
};