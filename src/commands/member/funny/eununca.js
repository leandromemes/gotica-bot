import { PREFIX } from "../../../config.js"; 

const EU_NUNCA_FRASES = [
  "Eu nunca curti fotos antigas de um ex sem querer.",
  "Eu nunca mandei um 'oi sumido(a)' por puro tédio.",
  "Eu nunca fingi estar mexendo no celular para evitar falar com alguém.",
  "Eu nunca dei um beijo triplo.",
  "Eu nunca terminei um relacionamento por mensagem.",
  "Eu nunca colei em uma prova e fui pego.",
  "Eu nunca dormi na sala de aula e acordei com todo mundo rindo.",
  "Eu nunca menti que estava dormindo para não responder no WhatsApp.",
  "Eu nunca soltei um pum em um elevador lotado.",
  "Eu nunca mandei áudio falando mal de alguém para a própria pessoa.",
  "Eu nunca tive um sonho bizarro com alguém deste grupo.",
  "Eu nunca stalkeei alguém até descobrir onde a pessoa morava."
];

export default {
  name: "eununca",
  description: "Inicia um jogo Eu Nunca no formato de Enquete.",
  commands: ["eununca", "eujax", "nunca"],
  usage: `${PREFIX}eununca`,
  
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ sendPoll, sendReact, remoteJid, isGroup, sendReply }) => {
    
    if (!isGroup) {
      return sendReply("🙄 *Sério?* Esse jogo só tem graça em grupos. Tente lá, plebeu!");
    }
    
    await sendReact("🎲"); 

    const fraseAleatoria = EU_NUNCA_FRASES[Math.floor(Math.random() * EU_NUNCA_FRASES.length)];

    const title = `🚨 *EU NUNCA (VOTE ABAIXO)* 🚨\n\n📌 _${fraseAleatoria}_`;

    // CORREÇÃO: Transformando em Array de Objetos conforme seu exemplo funcional
    const options = [
      { optionName: "🙋 Eu Já" },
      { optionName: "🙅 Eu Nunca" }
    ];
    
    try {
      await sendPoll(
        title,
        options,
        true // true = escolha única
      );
    } catch (error) {
      console.error("Erro ao enviar enquete:", error);
      await sendReply("❌ Tive um problema técnico para criar a enquete. Tente novamente!");
    }
  },
};