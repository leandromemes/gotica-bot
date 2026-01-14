import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { PREFIX, BOT_NAME } from "../../../config.js";
import { readMore } from "../../../utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: "menureal",
  description: "Menu completo da economia do bot com imagem",
  commands: ["menureal", "menueconomia", "real"],
  usage: `${PREFIX}menureal`,

  /**
   * @param {import('../../../types').CommandHandleProps} props
   */
  handle: async ({ 
    remoteJid,
    socket,
    sendReact, 
    sendReply,
    message // Mudança de fullMessage para message
  }) => {
    try {
      // 1. Reage à mensagem
      await sendReact("💰");

      const legenda = `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
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
┇┆🧼 ✦⋆⋆͜͡҈➳ ${PREFIX}limpargrana (Dono)

┇┆⚠️ Use com moderação! A ${BOT_NAME} não se responsabiliza por perdas.

┖╮★彡[Gótica Bot — Economia Virtual]彡★`;

      // 2. Caminho da imagem (Assets na raiz do projeto)
      const imgPath = path.resolve(__dirname, "..", "..", "..", "..", "assets", "images", "menu-real.jpg");

      // 3. Verifica se o arquivo existe
      if (!fs.existsSync(imgPath)) {
          return await sendReply(`❌ Imagem não encontrada!\nCertifique-se que o arquivo menu-real.jpg está em: /assets/images/`);
      }

      // 4. Envio usando o método correto do Takeshi
      await socket.sendMessage(remoteJid, {
          image: fs.readFileSync(imgPath),
          caption: legenda
      }, { quoted: message });

    } catch (error) {
      console.error(error);
      await sendReply("❌ Ocorreu um erro interno ao tentar enviar o menu.");
    }
  },
};