import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { onlyNumbers } from "../../../utils/index.js";
import { PREFIX } from "../../../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.resolve(__dirname, "..", "..", "..", "..", "database");

export default {
  name: "rankativo",
  description: "Ranking detalhado de atividade",
  commands: ["rankativo", "ranking"],
  usage: `${PREFIX}rankativo`,
  
  handle: async ({ remoteJid, socket, sendReply }) => {
    if (!remoteJid.endsWith("@g.us")) return await sendReply("✨ ❌ Apenas em grupos.");

    try {
      const dbFile = path.join(databasePath, "frequencia.json");
      
      if (!fs.existsSync(dbFile)) return await sendReply("📊 Sem atividade registrada no banco de dados.");

      const allData = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
      const groupData = allData[remoteJid] || {};
      const botNumber = onlyNumbers(socket.user.id);

      const ranking = Object.keys(groupData)
        .map(jid => {
          const u = groupData[jid];
          return {
            jid,
            msgs: u.messages || 0,
            stks: u.stickers || 0,
            cmds: u.commands || 0,
            total: (u.messages || 0) + (u.stickers || 0) + (u.commands || 0)
          };
        })
        .filter(u => !u.jid.includes(botNumber) && u.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

      if (ranking.length === 0) return await sendReply("✨ Ninguém apareceu no radar ainda.");

      let mensagem = `🏆 *RANK DOS MAIS ATIVOS* 🏆\n\n`;
      const mentions = [];

      ranking.forEach((u, index) => {
        const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        mentions.push(u.jid);

        mensagem += `${medals[index]} *${index + 1}º* - @${onlyNumbers(u.jid)}\n`;
        mensagem += `┣ 📝 Msgs: ${u.msgs} | 🎨 Figs: ${u.stks}\n`;
        mensagem += `┣ 🤖 Cmds: ${u.cmds}\n`;
        mensagem += `┗ 📱 Disp: Android\n\n`;
      });

      await socket.sendMessage(remoteJid, { text: mensagem, mentions });
    } catch (error) {
      await sendReply("❌ Erro ao gerar ranking.");
    }
  },
};