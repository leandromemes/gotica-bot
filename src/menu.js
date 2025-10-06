const { BOT_NAME } = require("./config");
const packageInfo = require("../package.json");
const { readMore } = require("./utils");
const { getPrefix } = require("./utils/database"); // Importa a função de prefixo

/**
 * Menu do bot
 *
 * @author Dev Gui
 */
exports.menuMessage = (groupJid) => {
  const date = new Date();

  // Usa a função do menu antigo para obter o prefixo correto
  const prefix = getPrefix(groupJid); 

  return `┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
🌙 Bem-vindo ao menu🌙
⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆${readMore()}

         ╼╼├ GOTICA BOT├╼╍⋅

┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆ • Dono: Leandro
┇┆ • Data: ${date.toLocaleDateString("pt-br")}
┇┆ • Hora: ${date.toLocaleTimeString("pt-br")}
┇┆ • Prefixo: ${prefix}
┇┆ • Versão: ${packageInfo.version}
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Aluguel / Info]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆💌 ✦⋆͜͡҈➳ ${prefix}alugar
┇┆👑 ✦⋆͜͡҈➳ ${prefix}dono
┇┆📋 ✦⋆͜͡҈➳ ${prefix}comandos
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Dono]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🧠 ✦⋆͜͡҈➳ ${prefix}exec
┇┆🆔 ✦⋆͜͡҈➳ ${prefix}get-id
┇┆🔴 ✦⋆͜͡҈➳ ${prefix}off
┇┆🟢 ✦⋆͜͡҈➳ ${prefix}on
┇┆🖼️ ✦⋆͜͡҈➳ ${prefix}set-menu-image
┇┆⚙️ ✦⋆͜͡҈➳ ${prefix}set-prefix
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Admins]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🔓 ✦⋆͜͡҈➳ ${prefix}abrir
┇┆⏰ ✦⋆͜͡҈➳ ${prefix}agendar-mensagem
┇┆⚙️ ✦⋆͜͡҈➳ ${prefix}only-admin (1/0)
┇┆🔨 ✦⋆͜͡҈➳ ${prefix}ban
┇┆🗑️ ✦⋆͜͡҈➳ ${prefix}delete
┇┆🏃 ✦⋆͜͡҈➳ ${prefix}exit (1/0)
┇┆🔒 ✦⋆͜͡҈➳ ${prefix}fechar
┇┆👻 ✦⋆͜͡҈➳ ${prefix}hidetag
┇┆🧹 ✦⋆͜͡҈➳ ${prefix}limpar
┇┆🔗 ✦⋆͜͡҈➳ ${prefix}link-grupo
┇┆🔇 ✦⋆͜͡҈➳ ${prefix}mute / ${prefix}unmute
┇┆🔼 ✦⋆͜͡҈➳ ${prefix}promover
┇┆🔽 ✦⋆͜͡҈➳ ${prefix}rebaixar
┇┆🕵️ ✦⋆͜͡҈➳ ${prefix}revelar
┇┆💵 ✦⋆͜͡҈➳ ${prefix}saldo
┇┆⚙️ ✦⋆͜͡҈➳ ${prefix}set-proxy
┇┆👋 ✦⋆͜͡҈➳ ${prefix}welcome (1/0)
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Anti/Eventos]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆*— Auto-Respostas —*
┇┆🤖 ✦⋆͜͡҈➳ ${prefix}auto-responder (1/0)
┇┆➕ ✦⋆͜͡҈➳ ${prefix}add-auto-responder
┇┆➖ ✦⋆͜͡҈➳ ${prefix}delete-auto-responder
┇┆📋 ✦⋆͜͡҈➳ ${prefix}list-auto-responder
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆*— Anti-Mídia e Eventos —*
┇┆🔊 ✦⋆͜͡҈➳ ${prefix}anti-audio (1/0)
┇┆📄 ✦⋆͜͡҈➳ ${prefix}anti-document (1/0)
┇┆🎉 ✦⋆͜͡҈➳ ${prefix}anti-event (1/0)
┇┆🖼️ ✦⋆͜͡҈➳ ${prefix}anti-image (1/0)
┇┆🔗 ✦⋆͜͡҈➳ ${prefix}anti-link (1/0)
┇┆🛒 ✦⋆͜͡҈➳ ${prefix}anti-product (1/0)
┇┆🧷 ✦⋆͜͡҈➳ ${prefix}anti-sticker (1/0)
┇┆🎥 ✦⋆͜͡҈➳ ${prefix}anti-video (1/0)
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Principal]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🎨 ✦⋆͜͡҈➳ ${prefix}attp
┇┆📍 ✦⋆͜͡҈➳ ${prefix}cep
┇┆📝 ✦⋆͜͡҈➳ ${prefix}exemplos-de-mensagens
┇┆💬 ✦⋆͜͡҈➳ ${prefix}fake-chat
┇┆🔗 ✦⋆͜͡҈➳ ${prefix}gerar-link
┇┆🆔 ✦⋆͜͡҈➳ ${prefix}get-lid
┇┆🔎 ✦⋆͜͡҈➳ ${prefix}google-search
┇┆🙍 ✦⋆͜͡҈➳ ${prefix}perfil
┇┆📶 ✦⋆͜͡҈➳ ${prefix}ping
┇┆📜 ✦⋆͜͡҈➳ ${prefix}raw-message
┇┆✏️ ✦⋆͜͡҈➳ ${prefix}rename
┇┆🧷 ✦⋆͜͡҈➳ ${prefix}sticker
┇┆🖼️ ✦⋆͜͡҈➳ ${prefix}to-image
┇┆💬 ✦⋆͜͡҈➳ ${prefix}ttp
┇┆🎥 ✦⋆͜͡҈➳ ${prefix}yt-search
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Relacionamentos]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆💌 ✦⋆͜͡҈➳ ${prefix}namorar @
┇┆💔 ✦⋆͜͡҈➳ ${prefix}terminar
┇┆🔍 ✦⋆͜͡҈➳ ${prefix}status
┇┆💞 ✦⋆͜͡҈➳ ${prefix}vernamoro
┇┆💍 ✦⋆͜͡҈➳ ${prefix}casar @
┇┆💣 ✦⋆͜͡҈➳ ${prefix}divorciar
┇┆💑 ✦⋆͜͡҈➳ ${prefix}vercasados
┇┆💘 ✦⋆͜͡҈➳ ${prefix}casal / ${prefix}casalgay
┇┆💋 ✦⋆͜͡҈➳ ${prefix}cantadas
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Downloads]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🎧 ✦⋆͜͡҈➳ ${prefix}play-audio / ${prefix}play
┇┆🎬 ✦⋆͜͡҈➳ ${prefix}play-video
┇┆📱 ✦⋆͜͡҈➳ ${prefix}tik-tok
┇┆🎵 ✦⋆͜͡҈➳ ${prefix}yt-mp3
┇┆🎞️ ✦⋆͜͡҈➳ ${prefix}yt-mp4
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Brincadeiras]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🤗 ✦⋆͜͡҈➳ ${prefix}abracar
┇┆💋 ✦⋆͜͡҈➳ ${prefix}beijar
┇┆🎲 ✦⋆͜͡҈➳ ${prefix}dado
┇┆🍽️ ✦⋆͜͡҈➳ ${prefix}jantar
┇┆🥊 ✦⋆͜͡҈➳ ${prefix}lutar
┇┆🔪 ✦⋆͜͡҈➳ ${prefix}matar
┇┆👊 ✦⋆͜͡҈➳ ${prefix}socar
┇┆🦶🏻 ✦⋆͜͡҈➳ ${prefix}chutar
┇┆💦 ✦⋆͜͡҈➳ ${prefix}gozar
┇┆😋 ✦⋆͜͡҈➳ ${prefix}comer
┇┆🍀 ✦⋆͜͡҈➳ ${prefix}sorteio
┇┆😂 ✦⋆͜͡҈➳ ${prefix}piada
┇┆🌹 ✦⋆͜͡҈➳ ${prefix}flor
┇┆😡 ✦⋆͜͡҈➳ ${prefix}espancar
┇┆🥚 ✦⋆͜͡҈➳ ${prefix}tacarovo
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Ranks ]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🐮 ✦⋆͜͡҈➳ ${prefix}rankgado
┇┆🏳️‍🌈 ✦⋆͜͡҈➳ ${prefix}rankgay
┇┆💋 ✦⋆͜͡҈➳ ${prefix}rankamante
┇┆🧟 ✦⋆͜͡҈➳ ${prefix}rankfeios
┇┆🎬 ✦⋆͜͡҈➳ ${prefix}rankprotagonista
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[IA]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆🤖 ✦⋆͜͡҈➳ ${prefix}gemini
┇┆🧠 ✦⋆͜͡҈➳ ${prefix}ia-sticker
┇┆🚀 ✦⋆͜͡҈➳ ${prefix}flux
┇┆🎨 ✦⋆͜͡҈➳ ${prefix}pixart
┇┆🧠 ✦⋆͜͡҈➳ ${prefix}stable-diffusion-turbo
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃

┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆
┖╮★彡[Efeitos Canvas]彡★
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
┇┆📸 ✦⋆͜͡҈➳ ${prefix}blur
┇┆🇧🇷 ✦⋆͜͡҈➳ ${prefix}bolsonaro
┇┆👮 ✦⋆͜͡҈➳ ${prefix}cadeia
┇┆🎛️ ✦⋆͜͡҈➳ ${prefix}contraste
┇┆🪞 ✦⋆͜͡҈➳ ${prefix}espelhar
┇┆⚫ ✦⋆͜͡҈➳ ${prefix}gray
┇┆🔁 ✦⋆͜͡҈➳ ${prefix}inverter
┇┆🧊 ✦⋆͜͡҈➳ ${prefix}pixel
┇┆🪦 ✦⋆͜͡҈➳ ${prefix}rip
┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ
▹▫◃
├╼╼╼╼╼╼╍⋅⊹⋅⋅⦁ ✪ ⦁⋅⋅⊹⋅╍╾╾╾╾☾⋆
╰✧ ･ ﾟ: * ✧ ･ ﾟ: *`;
};