// src/commands/member/Relacionamentos/trair.js

const { cleanJid } = require('../../../utils/relacionamento');

// Lista de mensagens de traição
const MENSAGENS_TRAICAO = [
    "💔 {remetente} traiu {traido}! Isso vai render fofoca até no grupo da família...",
    "😢 {remetente} pisou na bola e traiu {traido}. Agora só resta chorar comendo sorvete.",
    "🥀 {remetente} traiu {traido}. Lembre-se: confiança é como celular quebrado, não volta mais.",
    "😂💔 {remetente} traiu {traido}! Isso vai virar meme até no TikTok.",
    "🐍 {remetente} traiu {traido}. Mais veneno que isso só na novela das 9.",
    "💌 {remetente} traiu {traido}. Agora é só silêncio e Spotify com músicas de sofrência.",
    "😭 {remetente} traiu {traido}. Preparem os lencinhos, pois essa história vai longe.",
    "🎭 {remetente} traiu {traido}! Dramas, lágrimas e muitas indiretas à vista.",
    "📉 {remetente} traiu {traido}. Relação em queda livre — sem paraquedas.",
    "🥺 {remetente} traiu {traido}. É o fim da era “felizes para sempre”.",
];

// Função auxiliar para obter um elemento aleatório
const getRandomMessage = () => {
    const index = Math.floor(Math.random() * MENSAGENS_TRAICAO.length);
    return MENSAGENS_TRAICAO[index];
};

module.exports = {
  name: "trair",
  description: "Acusa alguém de traição (apenas uma brincadeira).",
  commands: ["trair", "traicao"],
  usage: "!trair @pessoa OU responda a uma mensagem com !trair",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ webMessage, sendReply, socket, userJid }) => {
    const groupId = webMessage.key.remoteJid;
    if (!groupId.endsWith('@g.us')) {
      return await sendReply("✨ ❌ Este comando só funciona em grupos.");
    }
    
    try {
      const remetenteJid = cleanJid(userJid);
      let traidoJid;
      
      const contextInfo = webMessage.message?.extendedTextMessage?.contextInfo;
      
      // 1. Tenta identificar o alvo por MENÇÃO
      const mentionList = contextInfo?.mentionedJid || [];
      if (mentionList.length > 0) {
        traidoJid = cleanJid(mentionList[0]);
      } 
      
      // 2. Tenta identificar o alvo por RESPOSTA (Reply)
      else if (contextInfo?.participant) {
        traidoJid = cleanJid(contextInfo.participant);
      }
      
      // 3. Checagem de Alvo
      if (!traidoJid) {
        return await sendReply("❌ Você precisa *mencionar* alguém ou *responder* a uma mensagem com `!trair`.");
      }
      
      if (remetenteJid === traidoJid) {
        return await sendReply("🚨 Traição consigo mesmo? Isso é só drama! Marque outra pessoa.");
      }
      
      // 4. Monta a Mensagem
      const remetenteTag = `@${remetenteJid.split("@")[0]}`;
      const traidoTag = `@${traidoJid.split("@")[0]}`;
      
      const mensagemTemplate = getRandomMessage();
      
      const mensagemFinal = mensagemTemplate
        .replace("{remetente}", remetenteTag)
        .replace("{traido}", traidoTag);
      
      // 5. Envia a Mensagem
      await socket.sendMessage(groupId, {
        text: mensagemFinal,
        mentions: [remetenteJid, traidoJid],
      });

    } catch (error) {
      console.error("Erro no comando !trair:", error);
      return await sendReply("❌ Ocorreu um erro fatal ao tentar espalhar a fofoca da traição.");
    }
  },
};