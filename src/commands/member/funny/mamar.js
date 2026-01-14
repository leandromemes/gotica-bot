import { PREFIX } from "../../../config.js";

export default {
  name: "mamar",
  description: "Sorteia uma pessoa para mamar a administração do grupo.",
  commands: ["mamar"],
  usage: `${PREFIX}mamar`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, sendReply, socket, sendText }) => {
    try {
      // 1. Obter metadados do grupo
      const grupoInfo = await socket.groupMetadata(remoteJid);
      
      // 2. Filtrar membros válidos (Pessoas Reais)
      const membros = grupoInfo.participants
        .map((m) => m.id)
        .filter((id) => id.includes("@s.whatsapp.net") || id.includes("@lid"));

      // 3. Checagem de membros
      if (membros.length < 1) {
        return await sendReply("❌ Não encontrei membros suficientes para o sorteio.");
      }

      // 4. Sorteia um membro aleatório
      const sortudo = membros[Math.floor(Math.random() * membros.length)];
      const sortudoNumero = sortudo.split("@")[0];

      const responseText = `⚠️🫣 Atenção, galera! O sortudo ou a sortuda de hoje que vai dar uma mamada na administração do grupo é... @${sortudoNumero}! 👅🐸🍆`;

      // 5. Envia a mensagem com a menção
      await sendText(responseText, [sortudo]);

    } catch (error) {
      if (error.message.includes("rate-overlimit")) {
        return await sendReply("⚠️ O WhatsApp está limitando a leitura do grupo. Aguarde uns segundos!");
      }
      console.error("Erro no comando !mamar:", error);
      return await sendReply("❌ Ocorreu um erro ao processar o sorteio. Verifique se sou ADM.");
    }
  },
};