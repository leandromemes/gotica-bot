import fs from "node:fs";
import { exitMessage, welcomeMessage } from "../messages.js";
import { getProfileImageData } from "../services/baileys.js";
import { isActiveExitGroup, isActiveGroup, isActiveWelcomeGroup, getX9Status } from "../utils/database.js";
import { extractUserLid, onlyNumbers } from "../utils/index.js";
import { errorLog } from "../utils/logger.js";

export async function onGroupParticipantsUpdate({ data, remoteJid, socket, action, participants }) {
  try {
    if (!remoteJid.endsWith("@g.us") || !isActiveGroup(remoteJid)) return;

    const userLid = extractUserLid(data);
    const mestreSupremoLid = "240041947357401@lid";
    const meuGrupoOficial = "120363407678212501@g.us";

    // 1. --- PROTEÇÃO SUPREMA (EXCLUSIVA DO SEU GRUPO OFICIAL) ---
    if (remoteJid === meuGrupoOficial) {
      const agressor = participants?.[0] || data.author?.replace(/:[0-9][0-9]|:[0-9]/g, "");

      if (agressor && agressor !== mestreSupremoLid && agressor !== socket.user.id) {
        // Proteção para o Soberano (Você)
        if (userLid === mestreSupremoLid && (action === "remove" || action === "demote")) {
          if (action === "remove") await socket.groupParticipantsUpdate(remoteJid, [userLid], "add");
          await socket.groupParticipantsUpdate(remoteJid, [userLid], "promote");
          await socket.groupParticipantsUpdate(remoteJid, [agressor], "demote");
          
          return await socket.sendMessage(remoteJid, { 
            text: `🚫 *INTENTONA FRUSTRADA!* 🚫\n\nO membro @${agressor.split('@')[0]} tentou desafiar o Soberano e perdeu o cargo de ADM na hora!`,
            mentions: [agressor]
          });
        }

        // Proteção contra briga de outros ADMs (Nenhum ADM tira outro)
        if (action === "demote") {
          await socket.groupParticipantsUpdate(remoteJid, [userLid], "promote");
          await socket.groupParticipantsUpdate(remoteJid, [agressor], "demote");
          return await socket.sendMessage(remoteJid, { 
            text: `⚖️ *ORDEM NO GRUPO:* @${agressor.split('@')[0]}, você não tem autoridade para rebaixar outros administradores aqui. Seu cargo foi revogado!`,
            mentions: [agressor]
          });
        }
      }
    }

    // 2. --- LÓGICA X9 (SUSPENSE - FUNCIONA NOS OUTROS GRUPOS) ---
    const x9Ativo = getX9Status(remoteJid);
    const authorRaw = data.author || "";
    const authorClean = authorRaw.replace(/:[0-9][0-9]|:[0-9]/g, "");

    if (x9Ativo && authorClean && (action === "promote" || action === "demote")) {
      // Se já tratamos a proteção acima, não precisa mandar o X9
      const autorID = authorClean.split('@')[0];
      let x9Msg = "";
      if (action === "promote") {
        x9Msg = `📈 *MEMBRO PROMOVIDO* 😱\n\nO(A) @${autorID} resolveu dar o cargo de ADM para alguém... 👑\n\nQuem é o novo privilegiado? Não vou dizer pq não sou x9! 💅💸`;
      } else if (action === "demote" && remoteJid !== meuGrupoOficial) {
        x9Msg = `📉 *ADM REBAIXADO* 😱\n\nIh! O(A) @${autorID} acabou de remover alguém da lista de admins! 🧹😂\n\nAceita que dói menos! 🤫🚫`;
      }
      if (x9Msg) return await socket.sendMessage(remoteJid, { text: x9Msg, mentions: [authorClean] });
    }

    // 3. --- LÓGICA WELCOME/EXIT ORIGINAL ---
    const isWelcome = action === "add" && isActiveWelcomeGroup(remoteJid);
    const isExit = action === "remove" && isActiveExitGroup(remoteJid);

    if (isWelcome || isExit) {
      if (userLid.startsWith("120363")) return; // Evita duplicados de IDs de grupo
      
      const { buffer, profileImage } = await getProfileImageData(socket, userLid);
      const template = isWelcome ? welcomeMessage : exitMessage;
      const userNumber = onlyNumbers(userLid);
      const finalMsg = template.replace("@member", `@${userNumber}`);

      if (buffer) {
        await socket.sendMessage(remoteJid, { image: buffer, caption: finalMsg, mentions: [userLid] });
      } else {
        await socket.sendMessage(remoteJid, { text: finalMsg, mentions: [userLid] });
      }
      if (profileImage && !profileImage.includes("default-user")) {
        try { fs.unlinkSync(profileImage); } catch (e) {}
      }
    }
  } catch (error) {
    errorLog(`Erro: ${error.message}`);
  }
}