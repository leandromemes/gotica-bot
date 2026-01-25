import { PREFIX } from "../../../config.js"; 

const EU_NUNCA_FRASES = [
  // RELACIONAMENTOS E FLERTE
  "Eu nunca curti fotos antigas de um ex sem querer.",
  "Eu nunca mandei um 'oi sumido(a)' por puro tédio.",
  "Eu nunca terminei um relacionamento por mensagem.",
  "Eu nunca stalkeei alguém até descobrir onde a pessoa morava.",
  "Eu nunca fui em um encontro e quis ir embora nos primeiros 5 minutos.",
  "Eu nunca dei um beijo triplo.",
  "Eu nunca fingi ter namorado(a) para fugir de alguém.",
  "Eu nunca mandei mensagem bêbado(a) para o ex.",
  "Eu nunca fiquei com dois amigos do mesmo grupo.",
  
  // ESCOLA E ESTUDOS
  "Eu nunca colei em uma prova e fui pego.",
  "Eu nunca dormi na sala de aula e acordei com todo mundo rindo.",
  "Eu nunca matei aula para ir ao shopping.",
  "Eu nunca entreguei uma prova em branco porque não sabia nada.",
  "Eu nunca esqueci o dia da prova e cheguei na escola sem saber de nada.",
  "Eu nunca fiz o professor rir para ele esquecer de passar lição de casa.",
  "Eu nunca fui expulso de sala por conversar demais.",

  // ESPORTES E ATIVIDADE FÍSICA
  "Eu nunca fingi que estava passando mal para não fazer educação física.",
  "Eu nunca chutei o chão tentando chutar a bola de futebol.",
  "Eu nunca paguei academia por um mês e só fui um dia.",
  "Eu nunca tomei uma bolada na cara durante um jogo.",
  "Eu nunca comemorei um gol que foi contra.",
  "Eu nunca corri atrás do ônibus e perdi ele na frente de todo mundo.",

  // ESTRANHAS E BIZARRAS
  "Eu nunca soltei um pum em um elevador lotado.",
  "Eu nunca mandei áudio falando mal de alguém para a própria pessoa.",
  "Eu nunca tive um sonho bizarro com alguém deste grupo.",
  "Eu nunca fingi estar mexendo no celular para evitar falar com alguém.",
  "Eu nunca menti que estava dormindo para não responder no WhatsApp.",
  "Eu nunca comi comida que caiu no chão (regra dos 5 segundos).",
  "Eu nunca entrei em um banheiro do gênero oposto por engano.",
  "Eu nunca falei sozinho na rua e percebi que alguém estava olhando.",
  "Eu nunca entrei no carro de um estranho achando que era Uber.",
  "Eu nunca usei o Google para saber se eu estava morrendo por causa de uma dorzinha.",
  "Eu nunca ri em um momento extremamente sério ou triste.",
  "Eu nunca lambi o prato em um restaurante.",
  "Eu nunca vi um vulto em casa e saí correndo de medo."
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