import { PREFIX } from "../../../config.js"; 

const DILEMAS_FRASES = [
  "Namorar alguém que cheira mal ou namorar alguém que só fala de ex?",
  "Descobrir que foi traído(a) ou descobrir que você é o 'plano B'?",
  "Casar com quem você não ama ou viver sozinho(a) para sempre?",
  "Ficar sem celular por um mês ou sem ver o 'crush' por um ano?",
  "Ser trocado(a) por um amigo ou por um completo estranho?",
  "Ter acesso ao WhatsApp do crush ou saber quem te stalkeia?",
  "Namorar alguém 20 anos mais velho ou 10 anos mais novo?",
  "Levar um fora em público ou ser ignorado(a) no vácuo eterno?",
  "Beijar alguém com bafo ou beijar alguém que não sabe beijar?",
  "Saber a data que vai terminar ou o motivo do término?",
  "Um namorado(a) ciumento ou um que não liga para nada?",
  "Sempre dizer o que pensa ou nunca mais falar 'eu te amo'?",
  "Ter um encontro no cinema ou em um jantar romântico?",
  "Ver o histórico do parceiro ou as mensagens apagadas?",
  "Ficar com um ex ou com o melhor amigo do ex?",
  "Receber nude por engano da mãe ou do seu pai?",
  "Ser amado por quem não gosta ou odiado por quem você ama?",
  "Casar com rico que odeia ou com pobre que você ama?",
  "Casamento luxuoso de 1 ano ou simples de 50 anos?",
  "Nunca mais beijar ou nunca mais abraçar?",
  "Webnamoro perfeito ou namoro real tóxico?",
  "Beijar o melhor amigo(a) ou o seu maior inimigo(a)?",
  "Descobrir que o crush é primo ou que ele te odeia?",
  "Vomitar no encontro ou ter diarreia explosiva?",
  "Ser inteligente e feio ou ser burro e bonito?",
  "Ser o gênio sem amigos ou o popular que reprova?",
  "Repetir de ano com amigos ou passar sozinho em outra sala?",
  "Esquecer a calça na escola ou esquecer como se lê na prova?",
  "Fazer 10 provas num dia ou um trabalho pra escola toda?",
  "Ter o professor mais bravo ou o que passa lição toda hora?",
  "Dormir na aula e roncar ou soltar pum no silêncio?",
  "Levar suspensão injusta ou ser o dedo-duro da turma?",
  "Escola sem Wi-Fi ou escola sem ar-condicionado?",
  "Sempre tirar 10 sem aprender ou aprender e tirar 5?",
  "Ter prova surpresa toda semana ou lição de casa todo dia?",
  "Lanche grátis na cantina ou nunca mais ter Ed. Física?",
  "Cair no pátio lotado ou ser chamado na diretoria por erro?",
  "Ficar sem recreio um mês ou limpar banheiro uma semana?",
  "Usar uniforme de palhaço ou ir de pijama todo dia?",
  "Ser o favorito do professor ou o líder do grêmio?",
  "Ter matemática o dia todo ou redação o dia todo?",
  "Esquecer o trabalho em casa ou fazer o trabalho errado?",
  "Professor ler seu zap ou pais verem seu boletim?",
  "Férias de 6 meses estudando 12h ou férias normais?",
  "Nunca mais usar caneta ou nunca mais usar computador?",
  "Seu pai ser seu professor ou sua mãe ser a diretora?",
  "Ser expulso da escola ou reprovado 3 vezes seguidas?",
  "Ter aula no sábado ou aula até as 20h na sexta?",
  "Trabalho em grupo sozinho ou individual valendo nota tripla?",
  "Perder a mochila com tudo ou perder o celular na escola?",
  "Ter 10 milhões de seguidores odiado ou 100 amado?",
  "Viver sem internet ou viver sem música?",
  "Famoso por algo ridículo ou gênio desconhecido?",
  "Celular top com tela quebrada ou antigo perfeito?",
  "Chegar 1 hora adiantado ou 1 hora atrasado?",
  "Saber voar ou ser invisível?",
  "Poder ler mentes ou poder viajar no tempo?",
  "Viver no mundo de Harry Potter ou no de Star Wars?",
  "Ser um lobisomem ou ser um vampiro?",
  "Ser YouTuber de sucesso ou ser Pro-Player?",
  "Nunca mais comer pizza ou nunca mais comer hambúrguer?",
  "Sempre gritar ao falar ou sempre sussurrar?",
  "Ter a pele azul ou ter rabo?",
  "Viajar para o futuro ou viajar para o passado?",
  "Ganhar 1 milhão agora ou 10 milhões em 10 anos?",
  "Ter um dragão de estimação ou um unicórnio?",
  "Nunca mais usar redes sociais ou nunca mais ver filmes?",
  "Ser a pessoa mais alta do mundo ou a mais baixa?",
  "Respirar debaixo d'água ou ser imune ao fogo?",
  "Sempre sentir cheiro de pipoca ou ouvir um assobio?",
  "Histórico do Google na família ou na escola?",
  "Ser um pirata ou ser um ninja?",
  "Viver sem luz elétrica ou viver sem água encanada?",
  "Poder mudar seu rosto ou mudar sua personalidade?",
  "Ser um herói solitário ou um vilão com muitos amigos?",
  "Quebrar o braço ou quebrar a perna?",
  "Perder todos os dentes ou perder todo o cabelo?",
  "Sempre falar a verdade ou nunca mais poder falar?",
  "Corpo coberto de pelos ou ser totalmente pelado?",
  "Viver no calor de 40 graus ou no frio de -10?",
  "Comer uma barata viva ou um balde de minhocas?",
  "Preso com palhaço assassino ou com ex louco?",
  "Usar roupas molhadas ou sapatos 2 números menores?",
  "Cabeça de melancia ou cabeça de uva?",
  "Beber suco de cebola ou comer sorvete de alho?",
  "Perder o paladar ou perder o olfato?",
  "Mãos no lugar dos pés ou pés no lugar das mãos?",
  "Sempre ter soluço ou sempre vontade de espirrar?",
  "Dormir em cama de pregos ou cama de cobras?",
  "Ser a única pessoa na Terra ou viver em cidade lotada?",
  "Saber quando vai morrer ou como vai morrer?",
  "Falar com animais ou falar todas as línguas?",
  "Vida curta e rica ou vida longa e pobre?",
  "Ser preso injustamente ou seu amigo preso por você?",
  "Botão de 'pause' na vida ou botão de 'voltar'?",
  "Mundo acabar em fogo ou em gelo?",
  "Atacado por urso ou por enxame de abelhas?",
  "Lutar com 100 patos gigantes ou 1 cavalo anão?",
  "Mesma cueca por um mês ou mesma meia por um mês?",
  "Comer apenas salgado ou apenas doce para sempre?"
];

export default {
  name: "oqprefere",
  description: "Dilemas difíceis para escolher.",
  commands: ["oqprefere", "prefere", "escolha"],
  usage: `${PREFIX}oqprefere`,
  
  handle: async ({ sendPoll, sendReact, isGroup, sendReply }) => {
    
    if (!isGroup) {
      return sendReply("🙄 *Sério?* Esse jogo só tem graça em grupos. Tente lá, plebeu!");
    }
    
    await sendReact("🤔"); 

    const fraseAleatoria = DILEMAS_FRASES[Math.floor(Math.random() * DILEMAS_FRASES.length)];
    
    // Divide a frase pelo " ou "
    const opcoesEnquete = fraseAleatoria.split(/ ou /i);

    // O título agora é fixo e limpo para não repetir a pergunta
    const title = `🤔 *O QUE VOCÊ PREFERE?* 🤔\n\n_Vote na opção abaixo:_`;

    const options = [
      { optionName: opcoesEnquete[0].trim() },
      { optionName: opcoesEnquete[1].replace("?", "").trim() }
    ];
    
    try {
      await sendPoll(title, options, true);
    } catch (error) {
      console.error("Erro ao enviar enquete:", error);
      await sendReply("❌ Erro ao criar a enquete. Tente novamente!");
    }
  },
};