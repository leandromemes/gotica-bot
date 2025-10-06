module.exports = {
  name: "rankamante",
  description: "Mostra o ranking dos 5 maiores amantes do grupo",
  commands: ["rankamante"],
  usage: "!rankamante",

  /**
   * @param {import('../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, webMessage, sendReply }) => {
    
    // 1. Garante que é um grupo
    if (!webMessage.key.remoteJid.endsWith('@g.us')) {
      return await sendReply('✨ ❌ Esse comando só funciona em grupos, amante!');
    }
    
    try {
      // 2. BUSCA ROBUSTA DOS METADADOS
      const grupoInfo = await socket.groupMetadata(webMessage.key.remoteJid);

      const membros = grupoInfo.participants
        .filter((m) => !m.id.endsWith("g.us") && !m.id.includes("broadcast"))
        .map((m) => m.id);

      if (membros.length < 5) {
        return await sendReply("✨ ❌ Poucos membros no grupo para formar o rank dos amantes.");
      }

      const frases = [
        "Esse aí seduz até digitando 'oi'... cuidado!",
        "Amante profissional, tem até crachá!",
        "Deixa qualquer um apaixonado só com o bom dia.",
        "Romântico, pegador e cafajeste na medida certa.",
        "Quem nunca caiu no papo desse aí, que atire o primeiro emoji.",
        "Tem mais contatinho que a agenda do Neymar.",
        "Tem fama de fiel... mas só fama mesmo.",
        "Quando ama, ama forte... o problema é que ama todo mundo.",
        "Beija com gosto, mas some depois.",
        "O tipo que manda 'você merece mais' depois de trair."
      ];

      const conselhos = [
        "💘 Conquistar é fácil, difícil é manter o mistério.",
        "💬 Amante bom sabe sair antes de ser descoberto.",
        "💋 Cuidado, quem ama demais acaba ficando solteiro.",
        "❤️ O segredo de um bom amante é saber sumir na hora certa.",
        "👀 Se apaixonar por amante dá processo emocional!"
      ];

      // Sorteia e pega os top 5 JIDs
      const embaralhados = membros.sort(() => 0.5 - Math.random()).slice(0, 5);

      let mensagem = "💋 *RANK DOS 5 MAIORES AMANTES DO GRUPO!*\n—\n";

      // 3. Montagem da Mensagem (CORREÇÃO na menção: usa o ID do participante)
      embaralhados.forEach((id, index) => {
        const numero = id.split("@")[0]; // O número puro
        const porcentagem = Math.floor(Math.random() * 100) + 1;
        const frase = frases[Math.floor(Math.random() * frases.length)];

        // Usa o número do ID para a menção
        mensagem += `💋 ${index + 1}° *[${porcentagem}%]* - @${numero} -> (${frase})\n`; 
      });

      const conselhoFinal = conselhos[Math.floor(Math.random() * conselhos.length)];
      mensagem += `\n🧠 *Conselho de amante:* ${conselhoFinal}`;

      // 4. Envio da Mensagem com Menções
      await socket.sendMessage(webMessage.key.remoteJid, {
        text: mensagem,
        mentions: embaralhados, // Array de JIDs
      });

    } catch (e) {
      console.error("Erro no comando !rankamante:", e);
      await sendReply("✨ ❌ Erro ao gerar o rank dos amantes.");
    }
  },
};