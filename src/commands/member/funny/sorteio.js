module.exports = {
  name: "sorteio",
  description: "Realiza um sorteio entre os membros do grupo",
  commands: ["sorteio"],
  usage: "!sorteio nome-do-prêmio",

  handle: async ({ socket, webMessage, args, sendReply }) => {
    try {
      const groupId = webMessage.key.remoteJid;
      const groupMetadata = await socket.groupMetadata(groupId);

      const participants = groupMetadata.participants
        .filter(p => !p.id.endsWith("g.us") && !p.id.includes("broadcast"))
        .map(p => p.id);

      if (participants.length === 0) {
        return await sendReply("⚠️ Não foi possível realizar o sorteio. Grupo vazio.");
      }

      const sorteado = participants[Math.floor(Math.random() * participants.length)];
      const premio = args.join(" ") || "um prêmio misterioso";

      const mensagem = `🎉 Parabéns @${sorteado.split("@")[0]}, você acaba de ser contemplado(a) como o(a) ganhador(a) do sorteio...\n\n✦ Para mais informações entre em contato com o(a) adm responsável pelo sorteio: _“${premio}”_.`;

      await socket.sendMessage(groupId, {
        text: mensagem,
        mentions: [sorteado],
      });

    } catch (error) {
      console.error("Erro no comando !sorteio:", error);
      await sendReply("❌ Erro ao realizar o sorteio.");
    }
  },
};