import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEVELOPER_MODE, PREFIX } from "../config.js";
import { badMacHandler } from "../utils/badMacHandler.js";
import { checkIfMemberIsMuted, isActiveGroup } from "../utils/database.js";
import { dynamicCommand } from "../utils/dynamicCommand.js";
import {
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAtLeastMinutesInPast,
  isAddOrLeave,
  onlyNumbers,
} from "../utils/index.js";
import { loadCommonFunctions } from "../utils/loadCommonFunctions.js";
import { errorLog, infoLog } from "../utils/logger.js";
import { customMiddleware } from "./customMiddleware.js";
import { messageHandler } from "./messageHandler.js";
import { onGroupParticipantsUpdate } from "./onGroupParticipantsUpdate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databasePath = path.resolve(__dirname, "..", "..", "database");

export async function onMessagesUpsert({ socket, messages, startProcess }) {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    // 1. CONTADOR DE ATIVIDADE (Silencioso e sem travas)
    try {
      const rJid = webMessage.key.remoteJid;
      const pJid = webMessage.key.participant || webMessage.key.remoteJid;

      if (rJid.endsWith("@g.us") && !webMessage.key.fromMe && webMessage.message) {
        const dbFile = path.join(databasePath, "frequencia.json");
        if (!fs.existsSync(databasePath)) fs.mkdirSync(databasePath, { recursive: true });

        let data = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, "utf-8")) : {};
        if (!data[rJid]) data[rJid] = {};
        
        const userId = pJid.split(":")[0] + (pJid.includes("@lid") ? "@lid" : "@s.whatsapp.net");
        if (!data[rJid][userId]) data[rJid][userId] = { messages: 0, stickers: 0, commands: 0 };

        const msg = webMessage.message;
        const type = Object.keys(msg || {})[0];
        const text = msg?.conversation || msg?.extendedTextMessage?.text || msg?.imageMessage?.caption || "";

        if (type === "stickerMessage") data[rJid][userId].stickers += 1;
        else if (text.startsWith(PREFIX)) data[rJid][userId].commands += 1;
        else data[rJid][userId].messages += 1;

        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
      }
    } catch (e) {}

    if (DEVELOPER_MODE) {
      infoLog(`\n\n⪨========== [ MENSAGEM RECEBIDA ] ==========⪩ \n\n${JSON.stringify(messages, null, 2)}`);
    }

    try {
      const timestamp = webMessage.messageTimestamp;
      const remoteJid = webMessage.key.remoteJid;

      // 2. PROCESSADOR DE MENSAGENS (Original Dev Gui)
      if (webMessage?.message) {
        messageHandler(socket, webMessage);
      }

      // 3. FILTRO DE TEMPO (Original Dev Gui)
      if (isAtLeastMinutesInPast(timestamp)) {
        continue;
      }

      // 4. EVENTOS DE ENTRADA E SAÍDA (Movido para cima para não ser barrado por travas)
      if (isAddOrLeave.includes(webMessage.messageStubType)) {
        let action = webMessage.messageStubType === GROUP_PARTICIPANT_ADD ? "add" : "remove";

        await customMiddleware({
          socket,
          webMessage,
          type: "participant",
          action,
          data: webMessage.messageStubParameters[0],
          commonFunctions: null,
        });

        await onGroupParticipantsUpdate({
          data: webMessage.messageStubParameters[0],
          remoteJid: webMessage.key.remoteJid,
          socket,
          action,
        });

        continue; // Usa continue para não processar o resto como mensagem comum
      }

      // 5. CARREGAR FUNÇÕES COMUNS (Original Dev Gui)
      const commonFunctions = loadCommonFunctions({ socket, webMessage });
      if (!commonFunctions) continue;

      // 6. TRAVA DE GRUPO ATIVO (Invisibilidade) - Agora DEPOIS do Welcome/Exit
      if (remoteJid.endsWith("@g.us") && !isActiveGroup(remoteJid)) {
        if (!commonFunctions.isOwner) continue;
      }
      
      // 7. TRAVA DE MUTE (Original Dev Gui)
      if (checkIfMemberIsMuted(webMessage?.key?.remoteJid, webMessage?.key?.participant?.replace(/:[0-9][0-9]|:[0-9]/g, ""))) {
        try {
          const { id, remoteJid, participant } = webMessage.key;
          await socket.sendMessage(remoteJid, { delete: { remoteJid, fromMe: false, id, participant } });
        } catch (error) {}
        return;
      }

      // 8. MIDDLEWARES E COMANDOS (Original Dev Gui)
      await customMiddleware({ socket, webMessage, type: "message", commonFunctions });
      await dynamicCommand(commonFunctions, startProcess);

    } catch (error) {
      if (badMacHandler.handleError(error, "message-processing")) continue;
      continue;
    }
  }
}