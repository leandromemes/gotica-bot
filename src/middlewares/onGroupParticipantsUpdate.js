import fs from "node:fs";
import { exitMessage, welcomeMessage } from "../messages.js";
import { getProfileImageData } from "../services/baileys.js";
import { isActiveExitGroup, isActiveGroup, isActiveWelcomeGroup, getX9Status } from "../utils/database.js";
import { extractUserLid, onlyNumbers } from "../utils/index.js";
import { errorLog } from "../utils/logger.js";

export async function onGroupParticipantsUpdate({ data, remoteJid, socket, action }) {
  try {
    if (!remoteJid.endsWith("@g.us") || !isActiveGroup(remoteJid)) return;

    const userLid = extractUserLid(data);
    // SE O ID FOR O NÚMERO ESTRANHO (LID), A GENTE IGNORA PARA NÃO MANDAR DUPLICADO
    if (userLid.startsWith("120363")) return;

    // --- LÓGICA X9 (SUSPENSE) ---
    const x9Ativo = getX9Status(remoteJid);
    const authorRaw = data.author || "";
    const authorClean = authorRaw.replace(/:[0-9][0-9]|:[0-9]/g, "");

    if (x9Ativo && authorClean && (action === "promote" || action === "demote")) {
      const autorID = authorClean.split('@')[0];
      let x9Msg = "";
      if (action === "promote") {
        x9Msg = `📈 *MEMBRO PROMOVIDO* 😱\n\nO(A) @${autorID} resolveu dar o cargo de ADM para alguém... 👑\n\nQuem é o novo privilegiado? Não vou dizer pq não sou x9, mas já tem gente se achando o dono do grupo! 💅💸`;
      } else if (action === "demote") {
        x9Msg = `📉 *ADM REBAIXADO* 😱\n\nIh! O(A) @${autorID} acabou de remover alguém da lista de admins! 🧹😂\n\nQuem voltou a ser membro comum? Segredo! Só sei que a marra acabou e agora vai ter que obedecer igual todo mundo. Aceita que dói menos! 🤫🚫`;
      }
      if (x9Msg) return await socket.sendMessage(remoteJid, { text: x9Msg, mentions: [authorClean] });
    }

    // --- LÓGICA WELCOME/EXIT ORIGINAL ---
    const isWelcome = action === "add" && isActiveWelcomeGroup(remoteJid);
    const isExit = action === "remove" && isActiveExitGroup(remoteJid);

    if (isWelcome || isExit) {
      const { buffer, profileImage } = await getProfileImageData(socket, userLid);
      const template = isWelcome ? welcomeMessage : exitMessage;
      const userNumber = onlyNumbers(userLid);
      const finalMsg = template.replace("@member", `@${userNumber}`);

      if (buffer) {
        await socket.sendMessage(remoteJid, { image: buffer, caption: finalMsg, mentions: [userLid] });
      } else {
        await socket.sendMessage(remoteJid, { text: finalMsg, mentions: [userLid] });
      }
      if (profileImage && !profileImage.includes("default-user")) fs.unlinkSync(profileImage);
    }
  } catch (error) {
    errorLog(`Erro: ${error.message}`);
  }
}