const path = require("node:path");
// Assume que BASE_DIR está definido
const { PREFIX, BOT_NAME } = require(`${BASE_DIR}/config`); 
const { readMore } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "menureal",
  description: "Menu completo da economia do bot com imagem",
  commands: ["menureal", "menueconomia", "real"],
  usage: `${PREFIX}menureal`,

  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendImageFromFile, sendReact }) => {
    await sendReact("💰");

    const legenda = `
┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
💰 Menu da Economia Real da ${BOT_NAME} 💰
⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆${readMore()}

💸 Informações e Ganhos Simples:

┇┆🤑 ✦⋆͜͡҈➳ ${PREFIX}saldo
┇┆📈 ✦⋆͜͡҈➳ ${PREFIX}rankricos
┇┆⛏️ ✦⋆͜͡҈➳ ${PREFIX}trabalhar
┇┆🧪 ✦⋆͜͡҈➳ ${PREFIX}traficar

💸 Transferências e Caridade:

┇┆💸 ✦⋆͜͡҈➳ ${PREFIX}pix (valor)
┇┆🎁 ✦⋆͜͡҈➳ ${PREFIX}doar (valor)
┇┆🤝 ✦⋆͜͡҈➳ ${PREFIX}caridade (valor)

💸 Risco e Apostas (P2P e Individual):

┇┆🎲 ✦⋆͜͡҈➳ ${PREFIX}apostar (valor)
┇┆💥 ✦⋆͜͡҈➳ ${PREFIX}apostartudo
┇┆⚔️ ✦⋆͜͡҈➳ ${PREFIX}duelo (valor)
┇┆🥷🏻 ✦⋆͜͡҈➳ ${PREFIX}assaltar (@membro) 

💸 Comandos Administrativos:

┇┆✅ ✦⋆͜͡҈➳ ${PREFIX}modoreal 1/0 (Adms)
┇┆🧼 ✦⋆͜͡҈➳ ${PREFIX}limpargrana (Dono)

┇┆⚠️ Use com moderação! A gótica não se responsabiliza por perdas.

┖╮★彡[Gótica Bot — Economia Virtual]彡★`;

    // CORREÇÃO DEFINITIVA: Sobe 4 níveis (economia, member, commands, src) para chegar na raiz,
    // garantindo que o caminho para 'assets' esteja correto.
    const imgPath = path.resolve(__dirname, "../../../../assets/images/menu-real.jpg");

    await sendImageFromFile(imgPath, legenda);
  },
};