module.exports = {
  name: "darcu",
  description: "Sorteia uma pessoa para dar o cu no grupo.",
  commands: ["darcu"],
  usage: "!darcu",

  handle: async ({ webMessage, sendReply, socket }) => {
    try {
      const groupId = webMessage.key.remoteJid;
      const grupoInfo = await socket.groupMetadata(groupId);
      
      const membros = grupoInfo.participants
        .filter((m) => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map((m) => m.id);

      // Garante que haja pelo menos uma pessoa para sortear além do bot
      if (membros.length < 1) {
        return await sendReply("❌ Poucos membros no grupo para sortear. Pelo menos 1 membro é necessário.");
      }

      // Sorteia um membro aleatório
      const sortudo = membros[Math.floor(Math.random() * membros.length)];

      const responseText = `🎉🎉🎉 Atenção, galera! O sortudo ou a sortuda de hoje que vai dar o cu é... @${sortudo.split("@")[0]}! 🎉🎉🎉`;

      // Envia a mensagem com a menção
      await socket.sendMessage(groupId, {
        text: responseText,
        mentions: [sortudo],
      });

    } catch (error) {
      console.error("Erro no comando !darcu:", error);
      return await sendReply("❌ Ocorreu um erro ao processar o comando. Tente novamente mais tarde.");
    }
  },
};