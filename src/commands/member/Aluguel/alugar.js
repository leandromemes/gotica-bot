const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "alugar",
  description: "Informações sobre como alugar a Gótica Bot.",
  commands: ["alugar"],
  usage: `${PREFIX}alugar`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendText, userJid }) => {
    await sendText(
      `💌 Alugue a *Gótica Bot* para seu grupo!\n\n` +
      `Ela responde, manda áudio, cria figurinhas e não tem papas na língua! Engraçada e cheia de comandos que bombam nos grupos! \n\n` +
      `💲 Apenas *R$20,00 por mês*\n` +
      `💳 Pagamento via Pix\n` +
      `🫂 1 Grupo\n` +
      `📦 Entrega imediata\n\n` +
      `Entre em contato com o dono para contratar:\n` +
      `📲 wa.me/556391330669 (Leandro Memes)`
    );
  },
};