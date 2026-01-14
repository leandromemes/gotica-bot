import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

export default {
  name: "aura",
  description: "Envia o áudio da aura.",
  commands: ["aura", "presença"],
  
  handle: async ({ remoteJid, sendAudioFromFile, webMessage, socket }) => {
    // 1. Reação para confirmar o comando
    await socket.sendMessage(remoteJid, { react: { text: "✨", key: webMessage.key } });

    // 2. Caminho do áudio
    const audioPath = path.resolve(BASE_DIR, 'assets', 'audios', 'aura.mp3');

    // 3. Verifica se o arquivo existe e envia
    if (fs.existsSync(audioPath)) {
        try {
            // Enviamos como mensagem de voz (true) para dar aquele impacto
            await sendAudioFromFile(audioPath, true);
        } catch (e) {
            console.log("Erro ao enviar o áudio de aura:", e);
        }
    } else {
        console.log("Arquivo aura.mp3 não encontrado em assets/audios/");
    }
  },
};