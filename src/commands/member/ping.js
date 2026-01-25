import os from 'os';
import { PREFIX } from "../../config.js";

export default {
  name: "ping",
  description: "Exibe o status detalhado do sistema e tempo de resposta.",
  commands: ["ping", "pong", "status", "info"],
  usage: `${PREFIX}ping`,

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ sendReply, sendReact, startProcess, fullMessage }) => {
    // Reação inicial
    await sendReact("⚡");

    // Cálculo de Latência
    const ping = Date.now() - startProcess;

    // Cálculo de Uptime (Tempo Online)
    const uptimeSeconds = process.uptime();
    const h = Math.floor(uptimeSeconds / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = Math.floor(uptimeSeconds % 60);
    const uptimeFormated = `${h}h ${m}m ${s}s`;

    // Informações de Memória (RAM)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // GB
    const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(2); // MB

    // Resposta Dinâmica (Ping/Pong)
    const responseType = fullMessage.toLowerCase().includes("ping") ? "PONG" : "PING";

    const statusMessage = `
🛰️ *SISTEMA CENTRAL - ${responseType}*
---------------------------------------
📡 *Conexão:*
• Latência: \`${ping}ms\`
• Status: \`Online 🟢\`

⏳ *Atividade:*
• Uptime: \`${uptimeFormated}\`
• Versão: \`7.3.5\`

💻 *Hardware (Server):*
• RAM em uso: \`${usedRam} MB\`
• Total Server: \`${totalRam} GB\`

_Gótica Bot 2.0 - Processamento em tempo real._
---------------------------------------`.trim();

    await sendReply(statusMessage);
  },
};