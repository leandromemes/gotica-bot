import { PREFIX } from '../../../config.js'; 

export default {
  name: "alugar",
  description: "Informações sobre como alugar a Gótica Bot para o seu grupo.",
  commands: ["alugar", "valor", "contratar"],
  usage: `${PREFIX}alugar`, 

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendText, sendReact }) => {
    // Reage com um emoji de dinheiro para dar um charme
    await sendReact("💸");

    const mensagem = 
      `🧛‍♀️ *CONTRATE A GÓTICA BOT* 🧛‍♀️\n\n` +
      `Quer que eu leve meu deboche e minhas funções incríveis para o seu grupo? Eu faço figurinhas, mando áudios, respondo geral e agito o chat como ninguém! \n\n` +
      `💎 *Vantagens de me ter no grupo:* \n` +
      `• Figurinhas ilimitadas (até de vídeo) 🎞️\n` +
      `• Jogos interativos e engraçados 🎲\n` +
      `• Comandos de administração potentes 🛠️\n` +
      `• Muita personalidade e zero papas na língua! 💅\n\n` +
      `💲 *Investimento:* apenas *R$20,00 mensais*\n` +
      `💳 *Forma de pagamento:* Pix\n` +
      `🫂 *Válido para:* 1 Grupo\n` +
      `📦 *Ativação:* Imediata após o pagamento\n\n` +
      `📍 *Interessado(a)?* Fale agora com o meu Mestre Supremo Leandro e garanta minha presença no seu reino:\n\n` +
      `📲 *WhatsApp:* wa.me/556391330669\n\n` +
      `_Não perca tempo, antes que eu mude de ideia e resolva cobrar mais caro!_ 😘`;

    await sendText(mensagem);
  },
};