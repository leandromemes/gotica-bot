module.exports = {
  name: "rankfeios",
  description: "Mostra os 5 mais feios do grupo",
  commands: ["rankfeios"],
  usage: "!rankfeios",

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    
    // 1. Garante que é um grupo
    if (!webMessage.key.remoteJid.endsWith('@g.us')) {
      return await sendReply('✨ ❌ Esse comando só funciona em grupos.');
    }
    
    try {
      // 2. BUSCA ROBUSTA DOS METADADOS
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);
      
      // Filtra os participantes, removendo grupos/broadcasts e garantindo que o JID seja válido
      const membros = grupoInfo.participants
        .filter(m => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map(m => m.id);

      if (membros.length < 5) {
        return await sendReply("✨ ❌ Poucos membros no grupo para montar o rank.");
      }

      // 3. Sorteio dos 5 Feios
      const embaralhados = membros.sort(() => 0.5 - Math.random()).slice(0, 5);

      const frases = [
        "Se feiura fosse arte, esse era o Picasso da desgraça.",
        "Tão feio que o espelho quebra antes de refletir.",
        "A beleza dele é igual wi-fi de roça: instável e fraca.",
        "Se fosse bonito, dava até pena. Mas nem isso.",
        "De tão feio, o espelho pediu demissão.",
        "A única coisa bonita nele é a esperança.",
        "Parece que caiu da árvore e foi batido com o galho.",
        "Feio com força. Mas tem um bom coração (eu acho).",
        "O tipo de feio que só a mãe ama (com esforço).",
        "Dava certo num filme de terror sem maquiagem."
      ];

      // Gera 5 porcentagens aleatórias
      const porcentagens = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 100) + 1
      );

      let mensagem = "🙈 *RANK DOS 5 MAIS FEIOS DO GRUPO*\n—\n";

      // 4. Montagem da Mensagem
      for (let i = 0; i < 5; i++) {
        const membro = embaralhados[i];
        const frase = frases[Math.floor(Math.random() * frases.length)];
        const porcentagem = porcentagens[i];

        // O 'membro.split("@")[0]' é o número sem o @s.whatsapp.net
        mensagem += `🤢 ${i + 1}° *@${membro.split("@")[0]}* → (${frase}) - *[${porcentagem}%]*\n`;
      }

      mensagem += `\n🧼 *Conselho:* Feiura é de nascença, mas simpatia ajuda 😅`;

      // 5. Envio da Mensagem com Menções
      await socket.sendMessage(webMessage.key.remoteJid, {
        text: mensagem,
        mentions: embaralhados, // O array de JIDs é passado para as menções
      });
      
    } catch (e) {
      console.error("Erro no comando !rankfeios:", e);
      await sendReply("❌ Ocorreu um erro ao montar o rank dos feios.");
    }
  },
};