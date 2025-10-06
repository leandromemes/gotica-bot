const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "vantagens",
  description: "Mostra as vantagens de alugar a Gótica Bot",
  commands: ["vantagens", "beneficios", "aluguelinfo", "vantagem"],
  usage: `${PREFIX}vantagens`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendText }) => {
    const texto = `
✨ *Vantagens de Alugar a Gótica Bot para seu grupo:*

• 🤖 Responde com inteligência e muito humor
• 🔊 Envia áudios personalizados e engraçados
• 🎵 Você pode pedir *músicas e vídeos* direto no grupo
• 🧼 Sistema de *banimento* e silenciamento de membros
• 🧙‍♀️ Transforma *texto e imagens em figurinhas mágicas*
• 🧩 Diversas *brincadeiras* interativas e comandos criativos
• 🔥 Atualizações frequentes com novos comandos e memes
• 🧠 Suporte rápido e direto com o *dono do bot*
• 🕹️ Comandos de entretenimento, sorteios, namoros e muito mais

💲 *Tudo isso por apenas R$20 por mês*  

💬 Contrate agora mesmo a gótica para animar seu grupo!

📲 Fale com o dono: wa.me/556391330669  
(Leandro Memes)
    `;

    await sendText(texto.trim());
  },
};