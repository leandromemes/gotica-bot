import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

import { BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
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
  name: "advertir",
  description: "Dá advertência a um membro (3 = BAN).",
  commands: ["advertir", "adv", "warn"],
  usage: `${PREFIX}advertir @usuario`,

  handle: async ({
    sendReply,
    remoteJid,
    userLid,
    replyLid,
    args,
    isReply,
    socket,
    mentionedJidList,
    isOwner
  }) => {
    
    // --- NOVA CHECAGEM DE ADM MANUAL ---
    const groupMetadata = await socket.groupMetadata(remoteJid);
    const admins = groupMetadata.participants
      .filter(p => p.admin !== null)
      .map(p => p.id);
    
    const isAdm = admins.includes(userLid) || isOwner || userLid === OWNER_LID;

    if (!isAdm) {
      return await sendReply("❌ Apenas administradores ou meu dono podem usar este comando!");
    }
    // -----------------------------------

    let targetLid = isReply ? replyLid : (mentionedJidList && mentionedJidList.length > 0 ? mentionedJidList[0] : null);

    if (!targetLid && args[0]) {
      targetLid = `${onlyNumbers(args[0])}@lid`;
    }

    if (!targetLid) {
      return await sendReply("⚠️ Você precisa marcar alguém ou responder a uma mensagem.");
    }

    if (targetLid === OWNER_LID || targetLid === BOT_LID) {
        return await sendReply("❌ Impossível advertir o dono ou a mim mesma.");
    }

    const warnings = getWarnings();
    if (!warnings[remoteJid]) warnings[remoteJid] = {};
    if (!warnings[remoteJid][targetLid]) warnings[remoteJid][targetLid] = 0;

    warnings[remoteJid][targetLid] += 1;
    const count = warnings[remoteJid][targetLid];
    const targetNumber = targetLid.split("@")[0];

    if (count >= 3) {
      warnings[remoteJid][targetLid] = 0;
      saveWarnings(warnings);

      await sendReply(`🚫 *BANIMENTO POR ADVERTÊNCIAS* 🚫\n---------------------------------\n👤 Membro: @${targetNumber}\n⚠️ Status: 3/3\n\n_Removendo do grupo agora..._`, [targetLid]);

      try {
        await socket.groupParticipantsUpdate(remoteJid, [targetLid], "remove");
      } catch (err) {
        await sendReply("❌ Falha ao remover: Certifique-se de que eu sou ADM e o alvo NÃO é ADM.");
      }
      
    } else {
      const faltaParaBan = 3 - count;
      await sendReply(
        `⚠️ *ADVERTÊNCIA APLICADA* ⚠️\n---------------------------------\n👤 Membro: @${targetNumber}\n📊 Status: [ ${count} / 3 ]\n\n❗ *Atenção:* Se chegar a 3 advertências, você será *BANIDO*.\n\nFaltam: *${faltaParaBan}* chance(s).`,
        [targetLid]
      );
      saveWarnings(warnings);
    }
  }
};