import { fileURLToPath } from 'node:url';
import path from "node:path";
import { onlyNumbers } from '../../../utils/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminho para a imagem do dono
const DONO_IMG_PATH = path.resolve(__dirname, "..", "..", "..", "..", "assets", "images", "funny", "dono.jpg");

export default {
  name: "dono",
  description: "Exibe informações do dono do bot.",
  commands: ["dono", "criador", "dev"],
  usage: "!dono", 
  
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendImageFromFile, userLid, sendReact }) => {
    
    await sendReact("👑");
    const userNumber = onlyNumbers(userLid);

    const mensagem = `✨ Escuta aqui, @${userNumber}, é melhor você ter respeito ao falar do meu criador!

👑 *MESTRE SUPREMO:* 𝐋𝐞𝐚𝐧𝐝𝐫𝐨 𝐌𝐞𝐦𝐞𝐬
📱 *WhatsApp:* wa.me/556391330669
🌐 *Redes Sociais:* https://linktr.ee/Leandromemes

_Ele é o único que manda em mim (e em você também se ele quiser). Não o irrite!_ 💋`;

    try {
      await sendImageFromFile(
        DONO_IMG_PATH,
        mensagem,
        [userLid] 
      );
    } catch (error) {
      console.error("Erro ao enviar foto do dono:", error);
      // Se a imagem falhar, envia pelo menos o texto para não deixar o usuário no vácuo
      await sendText(mensagem, [userLid]);
    }
  },
};