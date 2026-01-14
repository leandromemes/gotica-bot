import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { OWNER_LID, PREFIX } from "../../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = path.resolve(__dirname, "..", "..", "..");
const DB_PATH = path.resolve(BASE_DIR, "database", "warnings.json");

const getWarnings = () => {
  if (!fs.existsSync(DB_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch { return {}; }
};

export default {
  name: "listadv",
  description: "Lista os membros advertidos do grupo.",
  commands: ["listadv", "advertidos", "listaadv"],
  usage: `${PREFIX}listadv`,

  handle: async ({ socket, sendReply, remoteJid, userLid, isOwner }) => {
    
    // --- CHECAGEM DE ADM EM TEMPO REAL ---
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const admins = groupMetadata.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);
    
    const isAdm = admins.includes(userLid) || isOwner || userLid === OWNER_LID;

    if (!isAdm) {
      return await sendReply("❌ Apenas administradores ou meu dono podem ver a lista de advertências!");
    }
    // -------------------------------------

    const warnings = getWarnings();
    const groupWarns = warnings[remoteJid];

    if (!groupWarns || Object.keys(groupWarns).length === 0) {
      return await sendReply("✅ *Nenhum membro* possui advertências neste grupo.");
    }

    let lista = "📝 *LISTA DE ADVERTIDOS*\n---------------------------------\n";
    const mentions = [];
    let count = 0;

    for (const [jid, qtd] of Object.entries(groupWarns)) {
      if (qtd > 0) {
        lista += `👤 @${jid.split('@')[0]} — [ ${qtd}/3 ]\n`;
        mentions.push(jid);
        count++;
      }
    }

    if (count === 0) {
        return await sendReply("✅ *Nenhum membro* com advertências ativas no momento.");
    }

    lista += "\n---------------------------------\n_Para perdoar use: !deladv @usuario_";
    
    await sendReply(lista, mentions);
  },
};