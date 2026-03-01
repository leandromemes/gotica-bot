/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, participants }) => {
    // 👑 Identificação EXCLUSIVA da Malvadeza
    const malvadezaLid = '207469183762631@lid';
    const malvadezaNum = '554195651236@s.whatsapp.net';

    // O bot verifica se quem enviou é o LID ou o Número dela ⭐
    const isMalvadeza = m.sender === malvadezaLid || m.sender === malvadezaNum;

    if (!isMalvadeza) {
        await m.react('🤣');
        return m.reply('*💋 Ora ora...* Somente a *Malvadeza* tem autorização para invocar este poder! Volte para o seu lugar mortal. 🌙🖤');
    }

    // Se for ela, executa o ritual ✨
    await m.react('🖤');

    const audioPath = path.join(__dirname, '../media/trovao.mp3');
    const videoPath = path.join(__dirname, '../media/10.mp4');

    // 1. Enviar Áudio
    if (fs.existsSync(audioPath)) {
        await conn.sendFile(m.chat, audioPath, 'audio.mp3', '', m, true);
    }

    // 2. Preparar Marcação de TODOS
    const mentions = participants.map((p) => p.id);
    const mensagem = `🖤 *ELA CHEGOU!* 🖤\n\nA poderosa *MALVADEZA* está presente! 💋\n\nAvisem aos desavisados que a ordem agora é outra. Respeitem a dama do caos ou sintam a fúria da Gótica!\n\n*Status:* obedeça sem questionar!. ✨🌙`;

    // 3. Enviar Vídeo com legenda e marcações 💫
    if (fs.existsSync(videoPath)) {
        try {
            await conn.sendMessage(m.chat, {
                video: fs.readFileSync(videoPath),
                caption: mensagem,
                gifPlayback: true,
                mentions: mentions
            }, { quoted: m });
        } catch (e) {
            await conn.sendMessage(m.chat, { text: mensagem, mentions: mentions }, { quoted: m });
        }
    } else {
        await conn.sendMessage(m.chat, { text: mensagem, mentions: mentions }, { quoted: m });
    }
};

handler.help = ['malvadeza'];
handler.tags = ['owner'];
handler.command = ['malvadeza', 'vilã']; 
handler.group = true;
handler.register = false; 

export default handler;