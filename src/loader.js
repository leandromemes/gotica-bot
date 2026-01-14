import { TIMEOUT_IN_MILLISECONDS_BY_EVENT } from "./config.js";
import { onMessagesUpsert } from "./middlewares/onMesssagesUpsert.js";
import { onGroupParticipantsUpdate } from "./middlewares/onGroupParticipantsUpdate.js";
import { getX9Status } from "./utils/database.js";
import { badMacHandler } from "./utils/badMacHandler.js";
import { errorLog } from "./utils/logger.js";

export function load(socket) {
  const cleanJid = (jid) => jid ? jid.replace(/:[0-9][0-9]|:[0-9]/g, "") : "";

  const safeEventHandler = async (callback, data, eventName) => {
    try {
      await callback(data);
    } catch (error) {
      if (badMacHandler.handleError(error, eventName)) return;
      errorLog(`Erro ao processar evento ${eventName}: ${error.message}`);
    }
  };

  socket.ev.on("messages.upsert", async (data) => {
    const startProcess = Date.now();
    setTimeout(() => {
      safeEventHandler(() => onMessagesUpsert({ socket, messages: data.messages, startProcess }), data, "messages.upsert");
    }, TIMEOUT_IN_MILLISECONDS_BY_EVENT);
  });

  // Evento de Entrar/Sair/Promover/Rebaixar (O original era assim)
  socket.ev.on("group-participants.update", async (data) => {
    await safeEventHandler(
      () => onGroupParticipantsUpdate({ socket, remoteJid: data.id, data, action: data.action }),
      data,
      "group-participants.update"
    );
  });

  // MONITOR X9 - NOME, DESCRIÇÃO E CONFIGS
  socket.ev.on("groups.update", async (updates) => {
    for (const update of updates) {
      if (!getX9Status(update.id)) continue;
      const authorRaw = update.author || "";
      if (!authorRaw) continue;

      const author = cleanJid(authorRaw);
      const fofoqueiroMencao = author.split('@')[0];

      if (update.subject) {
        await socket.sendMessage(update.id, { text: `📢 *NOME DO GRUPO ALTERADO!*\n\nO @${fofoqueiroMencao} mexeu no nome para: *${update.subject}*.\n\nFicou uma porcaria, mas quem sou eu para julgar? 🤡`, mentions: [author] });
      }
      if (update.desc) {
        await socket.sendMessage(update.id, { text: `📝 *DESCRIÇÃO DO GRUPO ALTERADA!*\n\nO @${fofoqueiroMencao} resolveu atualizar a descrição. Aposto que ninguém vai ler esse testamento... 🙄`, mentions: [author] });
      }
      if (update.announce !== undefined) {
        const estado = update.announce ? "FECHOU O GRUPO" : "ABRIU O GRUPO";
        await socket.sendMessage(update.id, { text: `🤫 *MUDANÇA NAS CONFIGURAÇÕES!*\n\nO @${fofoqueiroMencao} ${estado}.`, mentions: [author] });
      }
    }
  });

  process.on("uncaughtException", (error) => errorLog(`Erro não capturado: ${error.message}`));
  process.on("unhandledRejection", (reason) => errorLog(`Promessa rejeitada: ${reason}`));
}