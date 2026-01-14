import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "rank-gostosa",
  description: "Gera o ranking das mais gostosas/gostosos do grupo com imagem.",
  commands: ["rankgostosa", "rankgostoso", "gostosas"],
  usage: `${PREFIX}rankgostosa`,

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ 
    socket, 
    remoteJid, 
    sendImageFromFile, 
    sendErrorReply, 
    sendSuccessReact 
  }) => {
    try {
      // 1. Verificação de Grupo
      if (!remoteJid.endsWith("@g.us")) {
        return await sendErrorReply("Mestre, este comando só pode ser usado em grupos!");
      }

      // 2. Obter participantes e filtrar (remove o bot da lista para ele não se auto-elogiar)
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const myId = socket.user.id.split(":")[0] + "@s.whatsapp.net";
      
      const participants = groupMetadata.participants
        .filter(p => p.id !== myId)
        .map(p => p.id);

      if (participants.length < 5) {
        return await sendErrorReply("O grupo precisa de pelo menos 5 membros para o ranking!");
      }

      // 3. Sortear 5 membros aleatórios
      const shuffled = participants.sort(() => 0.5 - Math.random());
      const top5 = shuffled.slice(0, 5);
      
      // Converte os IDs sorteados para o formato @lid que o seu bot usa para marcar nomes
      const mentionsLid = top5.map(id => `${onlyNumbers(id)}@lid`);
      const date = new Date().toLocaleDateString("pt-BR");

      // 4. Montar a legenda com as menções
      const mensagem = `╔══════════════════════════╗
║   💋 *RANKING DAS GOSTOSAS* 💋   ║
╚══════════════════════════╝

📸 *Análise de:* 📆 ${date}
───────────────────────────────

👑 *GOSTOSA SUPREMA*
@${onlyNumbers(mentionsLid[0])}
💞 *Nível:* 100% - Para o trânsito!
───────────────────────────────
🔥 *GOSTOSO(A) DE LUXO*
@${onlyNumbers(mentionsLid[1])}
💞 *Nível:* 94% - Charme puro!
───────────────────────────────
💃 *GOSTOSO(A) BRILHANTE*
@${onlyNumbers(mentionsLid[2])}
💞 *Nível:* 82% - Brilha mais que o sol.
───────────────────────────────
😉 *INTERMEDIÁRIO(A)*
@${onlyNumbers(mentionsLid[3])}
💞 *Nível:* 69% - Beleza natural.
───────────────────────────────
😋 *RECRUTA*
@${onlyNumbers(mentionsLid[4])}
💞 *Nível:* 57% - Tá no caminho certo!
───────────────────────────────
🏆 *Ranking oficial gerado pelo Oráculo!*`;

      await sendSuccessReact();

      // 5. Enviar imagem da pasta funny com a legenda e menções @lid
      await sendImageFromFile(
        path.resolve(ASSETS_DIR, "images", "funny", "rankgostosa.jpg"),
        mensagem,
        mentionsLid
      );

    } catch (error) {
      console.error("Erro no comando rankgostosa:", error);
      await sendErrorReply("Ocorreu um erro ao gerar o ranking. Verifique se a imagem 'rankgostosa.jpg' existe na pasta assets.");
    }
  },
};