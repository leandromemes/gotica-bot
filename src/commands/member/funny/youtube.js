import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import fs from "fs";

// Caminho da imagem de divulgação
const YOUTUBE_IMG_PATH = path.resolve(ASSETS_DIR, "images", "funny", "youtube_channel.jpg"); 

export default {
  name: "youtube",
  description: "Divulgação oficial do canal Leandro Memes.",
  commands: ["youtube", "yt", "canal", "leandro"],
  usage: `${PREFIX}youtube`,
  
  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ sendImageFromFile, sendReply, sendReact }) => {
    
    await sendReact("🎥");

    const channelLink = "https://youtube.com/@leandromemes";
    
    // Texto com formatação elegante e profissional
    const mensagem = `
✨ *CENTRAL DE ENTRETENIMENTO* ✨
------------------------------------------

🎬 *CANAL:* 𝐋𝐞𝐚𝐧𝐝𝐫𝐨 𝐌𝐞𝐦𝐞𝐬
👤 *CRIADOR:* @Leandro

Hey! Você já conhece o submundo do entretenimento? No canal oficial do meu criador você encontra o melhor do conteúdo:

📌 *CONTEÚDO:*
• 📹 Vídeos Exclusivos
• ⚡ Shorts Diários
• 🤣 Memes de Qualidade

------------------------------------------
🚀 *FAÇA PARTE DA COMUNIDADE:*
👇 *INSCREVA-SE AGORA*
${channelLink}

_Apoie quem me deu a vida! Ative o sininho. 🔔_
`.trim();
    
    // Verifica se a imagem existe fisicamente antes de tentar enviar
    if (fs.existsSync(YOUTUBE_IMG_PATH)) {
        try {
            await sendImageFromFile(YOUTUBE_IMG_PATH, mensagem);
        } catch (error) {
            await sendReply(mensagem);
        }
    } else {
        // Se a imagem não existir, envia apenas o texto formatado
        await sendReply(mensagem);
    }
  },
};