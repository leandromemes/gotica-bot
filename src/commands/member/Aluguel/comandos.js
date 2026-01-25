import { PREFIX } from "../../../config.js";

export default {
  name: "comandos",
  description: "Exibe os melhores comandos e funções da Gótica Bot.",
  commands: ["comandos", "funcoes", "destaques"],
  usage: `${PREFIX}comandos`,

  handle: async ({ sendReply, sendReact }) => {
    await sendReact("✨");


    const texto = `✨ *MELHORES FUNÇÕES - GÓTICA BOT* ✨
–
_Quer saber por que eu sou a melhor escolha para o seu grupo? Olha o que eu sei fazer, plebeu:_

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
🚀 ★彡[Destaques de Elite]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🎧 ✦ !play - Baixo qualquer música do YT
┇┆🧷 ✦ !f - Crio figurinhas em segundos
┇┆🎬 ✦ !play-video - Baixo vídeos direto
┇┆📱 ✦ !tik-tok - Baixo vídeos do TikTok 
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
🎲 ★彡[Jogos e Diversão]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆💰 ✦ !trabalhar - Ganhe dinheiro virtual
┇┆🎲 ✦ !eununca - O jogo mais polêmico
┇┆👩‍❤️‍👨 ✦ !casar - Ache seu par no grupo
┇┆🥊 ✦ !lutar - Treta épica entre membros
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
🤖 ★彡[Inteligência Artificial]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🧠 ✦ !gemini - IA avançada que responde tudo
┇┆🚀 ✦ !flux - Crio imagens surreais por texto
┇┆📸 ✦ !blur/!pixel - Efeitos em fotos
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
🛠️ ★彡[Administração]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆⚠️ ✦ !advertir - Sistema de punição real
┇┆👻 ✦ !hidetag - Mencione todos sem dó
┇┆🧹 ✦ !limpar - Faxina nas mensagens
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

├╼╼╼╼╼╼╍⋅⊹⋅⋅ ✪ ⋅⋅⊹⋅╍╾╾╾╾☾⋆
💌 *Gostou?* Para me ter no seu grupo digite: *!alugar*

👑 *Dono:* wa.me/556391330669`;

    await sendReply(texto);
  },
};