// src/commands/member/search/yt-search.js

const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);

// Caminho de importação ajustado para sua estrutura de pastas
const { searchChannel, getChannelDetails } = require('../../../services/youtube'); 

module.exports = {
  name: "yt-search",
  description: "Busca a foto de perfil, inscritos e URL de um canal do YouTube.",
  commands: ["yt-search", "youtube-search"],
  usage: `${PREFIX}yt-search MC Hariel`,
  
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendReply, socket, webMessage }) => { 
    if (fullArgs.length <= 1) {
      throw new InvalidParameterError(
        "Você precisa fornecer uma pesquisa para o YouTube."
      );
    }
    
    const remoteJid = webMessage.key.remoteJid;
    
    // 1. Buscar o ID e Nome do Canal
    const canalData = await searchChannel(fullArgs);
    
    if (!canalData) {
      return await sendReply(
        "Não foi possível encontrar o canal. Tente refinar a busca."
      );
    }

    const { channelId, channelName } = canalData;
    const canalURL = `https://www.youtube.com/channel/${channelId}`;
    
    // 2. Buscar Detalhes (Inscritos e Miniatura)
    const { subscribers, thumbnailUrl } = await getChannelDetails(channelId);
    
    
    // 3. Montar a legenda (caption)
    let caption = "";
    caption += `✨ ✅ *Pesquisa de Canal realizada*\n\n*Termo*: ${fullArgs}\n\n*Resultado*\n`;
    caption += `Inscritos: *${subscribers}*\n\n`;
    caption += `Nome do Canal: *${channelName}*\n\n`;
    caption += `URL do Canal: ${canalURL}`;
    
    // 4. Envio da Mensagem com Imagem (solução final)
    if (thumbnailUrl) {
        // Envia a miniatura como a imagem principal (solução que garante a imagem)
        await socket.sendMessage(remoteJid, {
            image: { url: thumbnailUrl },
            caption: caption,
            contextInfo: {} // Garante que não cite o comando
        });
    } else {
        // Fallback: Se não encontrar a imagem, envia apenas o texto.
        await socket.sendMessage(remoteJid, {
            text: caption,
            contextInfo: {}
        });
    }
  },
};