const { PREFIX } = require(`${BASE_DIR}/config`);
const path = require("node:path");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "dono",
  description: "Exibe informações do dono do bot.",
  commands: ["dono", "criador", "dev"],
  usage: `${PREFIX}dono`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendImageFromFile, userJid }) => {
    const userNumber = onlyNumbers(userJid);

    await sendImageFromFile(
      path.resolve(__dirname, "..", "..", "..", "assets", "images", "funny", "dono.jpg"),
      `✨ Olá @${userNumber}, aqui está as informações sobre meu dono:\n–\n• Número do dono: wa.me/556391330669\n-\n• Nome:  𝐋𝐞𝐚𝐧𝐝𝐫𝐨 𝐌𝐞𝐦𝐞𝐬`,
      [userJid]
    );
  },
};