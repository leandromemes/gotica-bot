import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { OWNER_LID, PREFIX } from "../../config.js";
import { onlyNumbers } from "../../utils/index.js";

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

const saveWarnings = (data) => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export default {
  name: "deladv",
  description: "Remove as advertências de um membro.",
  commands: ["deladv", "unwarn", "perdoar", "limparadv"],
  usage: `${PREFIX}deladv @usuario`,

  handle: async ({ 
    socket, 
    sendReply, 
    remoteJid, 
    replyLid, 
    args, 
    isReply, 
    userLid, 
    isOwner, 
    mentionedJidList 
  }) => {
    
    // --- CHECAGEM DE ADM EM TEMPO REAL ---
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const admins = groupMetadata.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);
    
    const isAdm = admins.includes(userLid) || isOwner || userLid === OWNER_LID;

    if (!isAdm) {
      return await sendReply("❌ Apenas administradores ou meu dono podem usar este comando!");
    }
    // -------------------------------------

    let targetLid = isReply ? replyLid : (mentionedJidList?.[0] || (args[0] ? `${onlyNumbers(args[0])}@lid` : null));
    
    if (!targetLid) {
      return await sendReply("⚠️ Marque alguém ou responda a uma mensagem para perdoar.");
    }

    const warnings = getWarnings();
    
    if (warnings[remoteJid] && warnings[remoteJid][targetLid] > 0) {
      delete warnings[remoteJid][targetLid];
      saveWarnings(warnings);
      
      const targetNumber = targetLid.split('@')[0];
      await sendReply(`✨ ✅ Ficha limpa! As advertências de @${targetNumber} foram zeradas.`, [targetLid]);
    } else {
      await sendReply("ℹ️ Este membro não possui advertências ativas para serem removidas.");
    }
  },
};