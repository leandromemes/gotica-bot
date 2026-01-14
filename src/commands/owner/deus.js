import { BOT_EMOJI } from "../../config.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', '..', '..');

export default {
  name: "deus",
  description: "Entrada triunfal do Criador Leandro com Áudio e Vídeo.",
  commands: ["deus", "soberano", "criador"],
  
  handle: async (params) => {
    const { remoteJid, socket, getGroupParticipants, sendAudioFromFile, webMessage } = params;

    // 1. Reação imediata na sua mensagem para mostrar que o bot ouviu o mestre
    await socket.sendMessage(remoteJid, { react: { text: "👑", key: webMessage.key } });

    // 2. PRIMEIRO: Enviar Áudio de Trovão (como mensagem de voz/PTT)
    const audioPath = path.resolve(BASE_DIR, 'assets', 'audios', 'trovao.mp3');
    if (fs.existsSync(audioPath)) {
        try {
            await sendAudioFromFile(audioPath, true);
        } catch (e) { 
            console.log("Erro ao enviar áudio:", e); 
        }
    }

    // 3. Preparar a marcação de TODOS os participantes (@everyone)
    const participants = await getGroupParticipants(remoteJid);
    const mentions = participants.map((p) => p.id);

    const mensagem = `⚡ *ATENÇÃO, MORTAIS!* ⚡\n\nO Grande Mestre supremo *LEANDRO* manifestou sua presença neste chat! 👑\n\nCurvem-se perante sua divindade e mostrem o devido respeito. Onde o Mestre ordena, todos devem obedecer sem questionar! 🙇‍♂️✨\n\n_Dando continuidade ao reinado..._`;

    // 4. DEPOIS: Enviar o Vídeo (10.mp4) com a legenda e marcações
    const videoPath = path.resolve(BASE_DIR, 'assets', 'stickers', '10.mp4');
    
    if (fs.existsSync(videoPath)) {
        try {
            await socket.sendMessage(remoteJid, {
                video: fs.readFileSync(videoPath),
                caption: `${BOT_EMOJI} ${mensagem}`,
                gifPlayback: true, // Faz o vídeo rodar em loop como se fosse um GIF
                mentions: mentions
            });
        } catch (e) {
            console.log("Erro ao enviar vídeo:", e);
            // Fallback: Envia apenas o texto se o vídeo der erro
            await socket.sendMessage(remoteJid, { 
                text: `${BOT_EMOJI} ${mensagem}`, 
                mentions: mentions 
            });
        }
    } else {
        // Se o arquivo não for encontrado, envia o texto e as mentions
        await socket.sendMessage(remoteJid, { 
            text: `${BOT_EMOJI} ${mensagem}`, 
            mentions: mentions 
        });
    }
  },
};