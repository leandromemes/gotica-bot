import { lerFamilia, salvarFamilia, cleanJid } from '../../../utils/familia.js';

export default {
  name: "abandonar",
  description: "Abandona um filho da sua lista de família.",
  commands: ["abandonar", "deserdar"],
  usage: "!abandonar @filho (ou responda a ele)",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ isGroup, remoteJid, sendReply, userLid, isReply, replyLid, webMessage, sendReact, sendText }) => {
    if (!isGroup) return await sendReply("❌ Só funciona em grupos.");

    // 1. Identifica quem será abandonado
    let filho;
    if (isReply && replyLid) {
      filho = replyLid;
    } else {
      const mentions = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (mentions?.length > 0) filho = mentions[0];
    }

    if (!filho) return await sendReply("⚠️ Marque ou responda quem você deseja abandonar.");

    const pai = userLid;
    const db = lerFamilia();

    // 2. Verifica se o grupo e o pai existem no banco
    if (!db[remoteJid] || !db[remoteJid][pai]) {
      return await sendReply("🤡 Você não tem nenhum registro de família neste grupo.");
    }

    // 3. Verifica se o alvo é realmente seu filho
    const listaFilhos = db[remoteJid][pai].filhos || [];
    const index = listaFilhos.findIndex(f => cleanJid(f) === cleanJid(filho));

    if (index === -1) {
      return await sendReply("⚠️ Essa pessoa não consta como seu filho(a) no meu registro deste grupo!");
    }

    // 4. PROCESSO DE ABANDONO
    // Remove do array de filhos do pai
    db[remoteJid][pai].filhos.splice(index, 1);

    // Remove a referência de pai/mãe no cadastro do filho (se existir)
    if (db[remoteJid][filho]) {
      if (cleanJid(db[remoteJid][filho].pai) === cleanJid(pai)) {
        delete db[remoteJid][filho].pai;
      }
      if (cleanJid(db[remoteJid][filho].mae) === cleanJid(pai)) {
        delete db[remoteJid][filho].mae;
      }
    }

    // 5. SALVA NO BANCO
    salvarFamilia(db);
    await sendReact("🚬");

    // 6. MENSAGEM FINAL
    const texto = `⚖️ *ABANDONO DE INCAPAZ*\n\n@${pai.split("@")[0]} disse que ia ali na esquina comprar um maço de cigarro e nunca mais voltou. \n\n@${filho.split("@")[0]} foi deixado para trás e não faz mais parte da família! 🚬🏃‍♂️💨`;

    await sendText(texto, [pai, filho]);
  }
};