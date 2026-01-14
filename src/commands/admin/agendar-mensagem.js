/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui / Corrigido por Gemini
 * Local: src/commands/admin/agendar-mensagem.js
 */
import { PREFIX } from "../../config.js";

export default {
  name: "agendar-mensagem",
  description: "Agenda uma mensagem para ser enviada após um tempo definido.",
  commands: ["agendar", "agendar-mensagem"],
  usage: `${PREFIX}agendar-mensagem mensagem / tempo`,
  
  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ args, sendErrorReply, sendSuccessReply, socket, remoteJid }) => {
    if (args.length !== 2) {
      return await sendErrorReply(
        `Formato incorreto. Use: ${PREFIX}agendar-mensagem mensagem / tempo\n\nExemplo: ${PREFIX}agendar-mensagem Reunião amanhã / 10m`
      );
    }

    const rawTime = args[1].trim();
    const message = args[0].trim();

    let timeInMs = 0;

    if (/^\d+s$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 1000;
    } else if (/^\d+m$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 1000;
    } else if (/^\d+h$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 60 * 1000;
    } else {
      return await sendErrorReply(
        `Formato de tempo inválido.\nUse:\n• 10s para 10 segundos\n• 5m para 5 minutos\n• 2h para 2 horas`
      );
    }

    if (!message || message.trim() === "" || isNaN(timeInMs) || timeInMs <= 0) {
      return await sendErrorReply(
        "Mensagem inválida ou tempo não especificado corretamente."
      );
    }

    // Confirmação de agendamento (com ✨ apenas aqui na resposta do bot)
    await sendSuccessReply(` ⌚ Mensagem agendada para daqui a ${rawTime}...`);

    setTimeout(async () => {
      try {
        // Envio 1: Cabeçalho corrigido (sem ✨ duplicado)
        await socket.sendMessage(remoteJid, { text: `⏰ *Mensagem agendada:*` });
        
        // Envio 2: A mensagem pura (sem ✨ e sem formatação extra)
        await socket.sendMessage(remoteJid, { text: message });
      } catch (error) {
        console.error("Erro ao enviar mensagem agendada:", error);
      }
    }, timeInMs);
  },
};