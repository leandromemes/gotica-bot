import { PREFIX } from "../../../config.js";

export default {
  name: "darcu",
  description: "Sorteia uma pessoa para dar o cu no grupo.",
  commands: ["darcu"],
  usage: `${PREFIX}darcu`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, sendReply, socket, sendText }) => {
    try {
      // 1. Obter metadados do grupo
      const grupoInfo = await socket.groupMetadata(remoteJid);
      
      // 2. Extrair apenas os IDs dos participantes (filtrando IDs inválidos)
      const membros = grupoInfo.participants
        .map((m) => m.id)
        .filter((id) => id.includes("@s.whatsapp.net") || id.includes("@lid"));

      // 3. Checagem de segurança
      if (membros.length === 0) {
        return await sendReply("❌ Não consegui encontrar membros para o sorteio.");
      }

      // 4. Sorteia um membro aleatório
      const sortudo = membros[Math.floor(Math.random() * membros.length)];
      const sortudoNumero = sortudo.split("@")[0];

      const responseText = `🎉🎉🎉 Atenção, galera! O sortudo ou a sortuda de hoje que vai dar o cu é... @${sortudoNumero}! 🎉🎉🎉`;

      // 5. Envia com a menção
      await sendText(responseText, [sortudo]);

    } catch (error) {
      // Se der erro de rate-limit (muitas requisições), avisa de forma amigável
      if (error.message.includes("rate-overlimit")) {
        return await sendReply("⚠️ O WhatsApp está me limitando agora. Tente novamente em alguns segundos!");
      }
      console.error("Erro no comando !darcu:", error);
      return await sendReply("❌ Ocorreu um erro ao sortear o membro.");
    }
  },
};