export default {
  name: "casal",
  description: "O Oráculo revela o novo casal do grupo.",
  commands: ["casal", "shippar", "analisar"],
  usage: "!casal",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ socket, remoteJid, sendReply, sendText, isGroup, sendReact }) => {
    
    if (!isGroup) return await sendReply('✨ ❌ Comando restrito a grupos.');
    
    try {
      await sendReact("🔮");

      const grupoInfo = await socket.groupMetadata(remoteJid);
      const membros = grupoInfo.participants
        .filter((m) => !m.id.includes("broadcast"))
        .map((m) => m.id);

      if (membros.length < 2) return await sendReply("❌ Membros insuficientes para o sorteio.");

      // Lógica de sorteio
      let i1 = Math.floor(Math.random() * membros.length);
      let i2 = Math.floor(Math.random() * membros.length);
      while (i1 === i2) { i2 = Math.floor(Math.random() * membros.length); }

      const p1 = membros[i1];
      const p2 = membros[i2];

      // Cálculo e Barra de Progresso Profissional
      const porcentagem = Math.floor(Math.random() * 101);
      const blocos = Math.floor(porcentagem / 10);
      const barra = "▓".repeat(blocos) + "░".repeat(10 - blocos);

      // Vereditos
      let veredito;
      if (porcentagem > 85) veredito = "União abençoada pelas estrelas.";
      else if (porcentagem > 50) veredito = "Há uma forte conexão entre vocês.";
      else if (porcentagem > 20) veredito = "A afinidade é incerta, mas possível.";
      else veredito = "As energias não batem no momento.";

      const mensagem = `
✨ *NOVO CASAL DO GRUPO* ✨
------------------------------------------
👩‍❤️‍👨 *CASAL:*
@${p1.split("@")[0]} & @${p2.split("@")[0]}

📈 *AFINIDADE:* ${porcentagem}%
[${barra}]

⚖️ *VEREDITO:* _${veredito}_
------------------------------------------
_Obs: O destino foi traçado aleatoriamente._
`.trim();

      // Envia com os JIDs completos para o nome brilhar azul
      await sendText(mensagem, [p1, p2]);

    } catch (e) {
      console.error(e);
      await sendReply("❌ O Oráculo está nublado... tente novamente.");
    }
  },
};