export default {
  name: "trair",
  description: "Expõe a traição de alguém com relatório de cara de pau.",
  commands: ["trair", "traicao", "chifre"],
  usage: "!trair @pessoa",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ webMessage, sendReply, sendText, userLid, isGroup, mentionedJidList, sendReact }) => {
    
    if (!isGroup) return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    
    try {
      let traidoJid;
      const remetenteJid = userLid;
      
      // Identifica o alvo (Menção ou Resposta)
      if (mentionedJidList && mentionedJidList.length > 0) {
        traidoJid = mentionedJidList[0];
      } else if (webMessage.message?.extendedTextMessage?.contextInfo?.participant) {
        traidoJid = webMessage.message.extendedTextMessage.contextInfo.participant;
      }
      
      if (!traidoJid) return await sendReply("❌ Marque o chifrudo(a) ou responda a mensagem dele(a)!");
      if (traidoJid === remetenteJid) return await sendReply("🚨 Auto-traição? Isso se chama crise de identidade, procure um psicólogo. 💅");

      await sendReact("🐍");

      // Gerador de Medidor de Cara de Pau
      const caraDePau = Math.floor(Math.random() * 101);
      const blocos = Math.floor(caraDePau / 10);
      const barra = "🔥".repeat(blocos) + "░".repeat(10 - blocos);

      const MENSAGENS = [
        "💔 @{remetente} não aguentou a tentação e traiu @{traido}! O grupo parou para ver esse barraco.",
        "🐍 @{remetente} foi flagrado(a) pulando a cerca! @{traido}, sinto cheiro de chifre no ar...",
        "🎭 @{remetente} entregou uma atuação digna de Oscar, mas @{traido} descobriu a traição!",
        "📉 @{remetente} traiu @{traido}. O mercado de chifres está em alta hoje!",
        "👀 @{remetente} achou que ninguém ia ver, mas a Gótica Bot viu tudo! Forças, @{traido}."
      ];

      const template = MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
      
      const mensagemFinal = `
🚨 *ALERTA DE TALARICAGEM* 🚨
------------------------------------------
${template.replace("{remetente}", remetenteJid.split('@')[0]).replace("{traido}", traidoJid.split('@')[0])}

🎭 *Nível de Cara de Pau:* ${caraDePau}%
[${barra}]

⚖️ *VEREDITO:* _${caraDePau > 70 ? "Pura maldade no coração." : "Foi um deslize... ou não."}_
------------------------------------------
_Obs: A fofoca foi espalhada com sucesso!_
`.trim();

      // Envia com os JIDs originais para o nome brilhar
      await sendText(mensagemFinal, [remetenteJid, traidoJid]);

    } catch (error) {
      console.error(error);
      return await sendReply("❌ Erro ao processar a traição.");
    }
  },
};