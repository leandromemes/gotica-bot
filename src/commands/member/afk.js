import { PREFIX } from "../../config.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.resolve(__dirname, "..", "..", "..", "database");

export default {
  name: "afk",
  description: "Ativa o modo ausente.",
  commands: ["afk"],
  usage: `${PREFIX}afk [motivo]`,

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ sendReply, args, userLid, sendReact }) => {
    const afkDbFile = path.join(databasePath, "afk.json");
    if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath, { recursive: true });

    let afkData = fs.existsSync(afkDbFile) ? JSON.parse(fs.readFileSync(afkDbFile, "utf-8")) : {};
    
    const motivo = args.join(" ") || "Indisponível";
    const myId = userLid; // Usando o userLid da tipagem

    afkData[myId] = {
      motivo: motivo,
      timestamp: Date.now()
    };

    fs.writeFileSync(afkDbFile, JSON.stringify(afkData, null, 2));

    await sendReact("💤");
    await sendReply(`✅ *Modo AFK ativado!*\n\n📌 *Motivo:* ${motivo}\n\n_Vou avisar quem te marcar ou enviar mensagem._`);
  },
};