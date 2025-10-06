module.exports = {
  name: "casalgay",
  description: "Forma um casal gay aleatório no grupo",
  commands: ["casalgay"],
  usage: "!casalgay",

  handle: async ({ socket, webMessage, sendReply }) => {
    try {
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);

      const membros = grupoInfo.participants
        .filter((m) => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map((m) => m.id);

      if (membros.length < 2) {
        return await sendReply("🏳️‍🌈❌ Poucos membros no grupo para formar um casal gay.");
      }

      const embaralhados = membros.sort(() => 0.5 - Math.random());
      const pessoa1 = embaralhados[0];
      const pessoa2 = embaralhados[1];

      const nome1 = grupoInfo.participants.find(p => p.id === pessoa1)?.notify || pessoa1.split("@")[0];
      const nome2 = grupoInfo.participants.find(p => p.id === pessoa2)?.notify || pessoa2.split("@")[0];

      const porcentagem = Math.floor(Math.random() * 100) + 1;

      const frases = [
        `💅✨ O amor venceu! *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* formam um casal babadeiro com *${porcentagem}%* de química!`,
        `🌈 Eu ouvi casal do pop? *@${pessoa1.split("@")[0]}* + *@${pessoa2.split("@")[0]}* = lacração! Compatibilidade: *${porcentagem}%*`,
        `👬 Shippo forte! Esses dois viados são tudo: *@${pessoa1.split("@")[0]}* & *@${pessoa2.split("@")[0]}*. *${porcentagem}%* de amor colorido!`,
        `💘 Um casal de milhões! *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* tão mais grudados que glitter no carnaval! *${porcentagem}%*`,
        `🪩 As gay tão on! Casalzão formado por *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* com *${porcentagem}%* de viadagem confirmada.`,
        `🔥 Se beijar esses dois dá choque de purpurina! *@${pessoa1.split("@")[0]}* ❤️ *@${pessoa2.split("@")[0]}* — casal arco-íris com *${porcentagem}%* de conexão.`,
        `💖 Se amam mais que Pabllo ama um look novo! *@${pessoa1.split("@")[0]}* & *@${pessoa2.split("@")[0]}* são o casal do ano. *${porcentagem}%*`
      ];

      const fraseFinal = frases[Math.floor(Math.random() * frases.length)];

      await socket.sendMessage(webMessage.key.remoteJid, {
        text: fraseFinal,
        mentions: [pessoa1, pessoa2],
      });

    } catch (e) {
      console.error("Erro no comando !casalgay:", e);
      await sendReply("🏳️‍🌈❌ Erro ao tentar formar um casal gay. O desenvolvedor foi notificado!");
    }
  },
};