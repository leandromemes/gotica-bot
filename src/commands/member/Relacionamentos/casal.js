module.exports = {
  name: "casal",
  description: "Forma um casal aleatório no grupo",
  commands: ["casal", "shippar"],
  usage: "!casal",

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    
    // 1. Garante que é um grupo
    if (!webMessage.key.remoteJid.endsWith('@g.us')) {
      return await sendReply('✨ ❌ Este comando só funciona em grupos!');
    }
    
    try {
      // 2. BUSCA ROBUSTA DOS METADADOS
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);

      const membros = grupoInfo.participants
        .filter((m) => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map((m) => m.id);

      if (membros.length < 2) {
        return await sendReply("💘❌ Poucos membros no grupo para formar um casal. Precisa de pelo menos 2.");
      }

      // 3. Sorteio dos dois sortudos
      const embaralhados = membros.sort(() => 0.5 - Math.random());
      const pessoa1 = embaralhados[0];
      const pessoa2 = embaralhados[1];

      const porcentagem = Math.floor(Math.random() * 100) + 1;

      const frases = [
        `💘 O destino uniu *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}*! Um casal improvável com *${porcentagem}%* de química!`,
        `💖 Shippo forte! *@${pessoa1.split("@")[0]}* + *@${pessoa2.split("@")[0]}* = Match perfeito! Compatibilidade: *${porcentagem}%*`,
        `🔥 Parece que temos um novo par no grupo! *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* formam um casal com *${porcentagem}%* de amor!`,
        `💍 Quando é pra ser, acontece! *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* já podem marcar o casamento. Conexão: *${porcentagem}%*`,
        `😍 Que fofos! Esses dois foram feitos um para o outro: *@${pessoa1.split("@")[0]}* & *@${pessoa2.split("@")[0]}*. *${porcentagem}%* de paixão!`,
        `✨ Deu match! *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* são o casal mais shippado do momento. *${porcentagem}%* de compatibilidade.`,
        `👀 Atenção, solteiros: *@${pessoa1.split("@")[0]}* e *@${pessoa2.split("@")[0]}* estão oficialmente juntos! Que dure para sempre: *${porcentagem}%*`
      ];

      const fraseFinal = frases[Math.floor(Math.random() * frases.length)];

      // 4. Envio da Mensagem com Menções
      await socket.sendMessage(webMessage.key.remoteJid, {
        text: fraseFinal,
        mentions: [pessoa1, pessoa2],
      });

    } catch (e) {
      console.error("Erro no comando !casal:", e);
      await sendReply("❌ Ocorreu um erro ao tentar formar um casal. O desenvolvedor foi notificado!");
    }
  },
};