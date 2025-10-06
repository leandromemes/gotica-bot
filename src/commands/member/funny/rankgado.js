module.exports = {
  name: "rankgado",
  description: "Mostra o ranking dos 5 maiores gados do grupo",
  commands: ["rankgado"],
  usage: "!rankgado",

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    
    // 1. Garante que é um grupo
    if (!webMessage.key.remoteJid.endsWith('@g.us')) {
      return await sendReply('✨ ❌ Esse comando só funciona em grupos, seu gado.');
    }
    
    try {
      // 2. BUSCA ROBUSTA DOS METADADOS
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);
      
      // Filtra os participantes, removendo grupos/broadcasts e garantindo que o JID seja válido
      const membros = grupoInfo.participants
        .filter((m) => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map((m) => m.id);

      if (membros.length < 5) {
        return await sendReply("✨ ❌ Poucos membros no grupo para formar um ranking.");
      }

      const frases = [
        "Mandava bom dia todo dia mesmo sendo ignorado 🐸",
        "Já pediu desculpa por algo que nem fez só pra não perder o contatinho 💔",
        "Já caiu no golpe do “me chama no pv” 😢",
        "É o famoso que banca tudo e não ganha nem um beijo 💸",
        "Ficou na friendzone 7 vezes e agradeceu 😭",
        "Toma chifre e ainda chama de amor 🐂",
        "Já fez vaquinha pra pagar a janta da crush e nem foi 🥲",
        "Passa o dia todo no status da ex 👀",
        "Faz textão e a pessoa visualiza e responde com 'ok' 🫠",
        "É gado até do bot do grupo 💬",
      ];

      // 3. Sorteio dos 5 Gados
      const embaralhados = membros.sort(() => 0.5 - Math.random());
      const top5 = embaralhados.slice(0, 5);

      let mensagem = "🐮 *RANK DOS 5 MAIORES GADOS DO GRUPO!*\n—\n";

      // 4. Montagem da Mensagem
      for (let i = 0; i < top5.length; i++) {
        const gado = top5[i];
        const frase = frases[Math.floor(Math.random() * frases.length)];
        const porcentagem = Math.floor(Math.random() * 100) + 1;

        // O 'gado.split("@")[0]' é o número sem o @s.whatsapp.net
        mensagem += `🐮 ${i + 1}° [${porcentagem}%] - @${gado.split("@")[0]} → ${frase}\n`;
      }

      mensagem += `\n📌 *Conselho do Bot:*\n_“Se valorize, gado. Até boi tem limite!” 🐃💔_`;

      // 5. Envio da Mensagem com Menções
      await socket.sendMessage(webMessage.key.remoteJid, {
        text: mensagem,
        mentions: top5, // O array de JIDs é passado para as menções
      });

    } catch (e) {
      console.error("Erro no comando !rankgado:", e);
      await sendReply("✨ ❌ Ocorreu um erro ao montar o rank dos gados.");
    }
  },
};