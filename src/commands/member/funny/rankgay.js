module.exports = {
  name: "rankgay",
  description: "Mostra os 5 mais gays do grupo com porcentagem aleatória",
  commands: ["rankgay"],
  usage: "!rankgay",
  type: 'member',

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    
    // 1. Garante que é um grupo
    if (!webMessage.key.remoteJid.endsWith('@g.us')) {
      return await sendReply('🌈 Esse comando só funciona em grupos, mona!');
    }

    try {
      // 2. BUSCA ROBUSTA DOS METADADOS (Método que funciona!)
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);
      
      // Filtra os participantes, removendo grupos/broadcasts e garantindo que o JID seja válido
      const membros = grupoInfo.participants
        .filter(m => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map(m => m.id); // Transforma em um array de JIDs válidos

      if (membros.length < 5) {
        return await sendReply('👀 O grupo precisa de pelo menos 5 membros para montar o rank.');
      }

      // 3. Sorteio (Array de JIDs)
      const sorteados = membros.sort(() => 0.5 - Math.random()).slice(0, 5);

      const frases = [
        'Esse aí usa salto até pra dormir 💅',
        'A poc mais poderosa do grupo! 🌟',
        'Certeza que dança Rouge escondido 🕺',
        'Grita mais alto que a Anitta no show 🎤',
        'Mona, tu é um cristal lapidado no glitter ✨',
        'Viadinho gente boa, nada contra os veado 🌈',
        'Toma glitter no café da manhã 😋',
        'Com essa carinha? Viado desde o berço 👶',
        'Esse aqui pisa de salto 20 desde os 12 😱',
        'Mapoa é você meu amor? 😘'
      ];

      const conselhos = [
        'Se joga nas cores, mona! A vida é curta pra ser hétero todos os dias.',
        'O importante é ser você, menos quando for hétero kkk.',
        'Use purpurina, dê close e beije quem quiser!',
        'Viado que é viado espalha brilho até quando sofre.',
        'Ser gay é uma arte, ser bicha é um dom!'
      ];

      let texto = '🏳️‍🌈 *RANK DOS 5 MAIS GAYS DO GRUPO!*\n—\n\n';

      // 4. Montagem da Mensagem
      for (let i = 0; i < sorteados.length; i++) {
        const mentionJid = sorteados[i];
        const mention = '@' + mentionJid.split('@')[0];
        const porcentagem = Math.floor(Math.random() * 100) + 1;
        const frase = frases[Math.floor(Math.random() * frases.length)];

        texto += `°${i + 1} - ${mention} [${porcentagem}%] → (${frase})\n`;
      }

      const conselho = conselhos[Math.floor(Math.random() * conselhos.length)];
      texto += `\n💅 *Conselho Gay do Dia:*\n_"${conselho}"_`;

      // 5. Envio da Mensagem com Menções
      await socket.sendMessage(webMessage.key.remoteJid, {
        text: texto,
        mentions: sorteados, // O array de JIDs é passado para as menções
      });
      
    } catch (e) {
      console.error("Erro no comando !rankgay:", e);
      // Se a falha for na busca (ex: bot não é membro), informa o usuário.
      await sendReply("❌ Ocorreu um erro ao montar o rank gay. O bot pode ter saído do grupo ou estar sem permissão.");
    }
  }
};