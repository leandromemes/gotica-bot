module.exports = {
  name: "rankprotagonista",
  description: "Mostra os 5 protagonistas do grupo",
  commands: ["rankprotagonista"],
  usage: "!rankprotagonista",

  handle: async ({ socket, webMessage, sendReply }) => {
    try {
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);
      const membros = grupoInfo.participants
        .filter(m => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map(m => m.id);

      if (membros.length < 5) {
        return await sendReply("🎭❌ Poucos membros no grupo para montar o rank.");
      }

      const sorteados = membros.sort(() => 0.5 - Math.random()).slice(0, 5);

      const frases = [
        "Esse aqui é o *main character*, sem ele o grupo nem gira.",
        "Sempre quer ser o centro das atenções, e consegue.",
        "A estrela do grupo, só falta a novela da Globo.",
        "Se acha a última bolacha do pacote... e talvez seja.",
        "Drama? Mistério? Fofoca? Ele tá no meio. Protagonista real.",
        "Quando não é sobre ele, ele dá um jeito de ser.",
        "Bebe água como se fosse champagne num tapete vermelho.",
        "Anda como se estivesse numa passarela invisível.",
        "Se o grupo fosse um filme, esse seria o ator principal com falas longas.",
        "Carisma de milhões e ego de bilhões."
      ];

      const porcentagens = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 100) + 1
      );

      let mensagem = "🎬 *RANK DOS 5 MAIS PROTAGONISTAS DO GRUPO*\n—\n";

      for (let i = 0; i < 5; i++) {
        const membro = sorteados[i];
        const frase = frases[Math.floor(Math.random() * frases.length)];
        const porcentagem = porcentagens[i];

        mensagem += `🎭 ${i + 1}° *@${membro.split("@")[0]}* → (${frase}) - *[${porcentagem}%]*\n`;
      }

      mensagem += `\n📢 *Conselho:* Ser protagonista é legal... só não rouba a cena demais ou o grupo te mata 🤣`;

      await socket.sendMessage(webMessage.key.remoteJid, {
        text: mensagem,
        mentions: sorteados,
      });
    } catch (e) {
      console.error("Erro no comando !rankprotagonista:", e);
      await sendReply("❌ Ocorreu um erro ao montar o rank dos protagonistas.");
    }
  },
};