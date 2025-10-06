// src/commands/member/ia/iaedit.js

const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

// O caminho de importação AGORA ESTÁ CORRETO
const { editImageAI, spiderAPITokenConfigured } = require(`${BASE_DIR}/services/spider-x-api`);

// 🚨 CORREÇÃO DE ERRO: Importando o downloadMediaMessage do Baileys
// O erro de 'MODULE_NOT_FOUND' sugere que este nome de módulo está errado no seu ambiente.
// Vamos tentar importá-lo da forma que a maioria dos bots faz, se estiver disponível no seu objeto 'webMessage'
// Para agora, vamos manter o require para que o erro de carregamento não volte.
const { downloadMediaMessage } = require('@whiskeysockets/baileys'); 


module.exports = {
  name: "iaedit",
  description: "Edita uma imagem usando IA (Gemini/Spider X) com um prompt de texto.",
  commands: ["iaedit", "editaia"],
  usage: `${PREFIX}iaedit [responda à imagem] adicione um chapéu de cowboy`,
  
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendReply, socket, webMessage }) => { 
    if (!spiderAPITokenConfigured) {
        return await sendReply("🚨 A API do Spider X não está configurada corretamente. Verifique seu token em `src/config.js`.");
    }
    
    const remoteJid = webMessage.key.remoteJid;
    // Tenta pegar a imagem da mensagem original ou da mensagem citada
    const media = webMessage.message?.imageMessage || webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    
    if (!media) {
      throw new InvalidParameterError(
        `Você precisa enviar ou responder a uma imagem e incluir o prompt de edição. Exemplo: ${PREFIX}iaedit [imagem] mude o fundo para um deserto`
      );
    }

    const prompt = fullArgs; 
    
    if (prompt.length < 5) {
        throw new InvalidParameterError(
            `Seu prompt é muito curto. Descreva com mais detalhes o que você quer fazer na imagem.`
        );
    }

    await sendReply("⏳ Aguarde, estou enviando sua imagem para a IA e processando a edição. Isso pode levar um momento...");
    
    try {
        // 1. Baixar a imagem
        const buffer = await downloadMediaMessage(media, 'buffer');
        
        // 2. Converter para Base64
        const base64Image = buffer.toString('base64');

        // 3. Chamar a função de edição (editImageAI)
        const imageUrl = await editImageAI(base64Image, prompt);

        // 4. Enviar a imagem editada de volta
        await socket.sendMessage(remoteJid, {
            image: { url: imageUrl },
            caption: `✅ Sua imagem editada pela IA está pronta!\n*Prompt*: ${prompt}`,
            contextInfo: {}
        });

    } catch (e) {
        console.error("Erro no comando !iaedit:", e.message);
        await sendReply(`❌ Erro na Edição por IA: ${e.message}`);
    }
  },
};