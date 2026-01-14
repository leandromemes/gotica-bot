import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from 'node:url';
import { PREFIX, OWNER_LID } from "../../../config.js";
import { delay } from "baileys";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', '..', '..', '..');

const SALDO_FILE = "saldo-real.json";
const TARGET_JID_DONO = '240041947357401@lid'; 
const DONO_PHONE = '556391330669';

if (!global.activeQuiz) global.activeQuiz = {};

const ANIMAIS_DIR = path.resolve(BASE_DIR, 'assets', 'quiz', 'animais');
const AMIGOS_DIR = path.resolve(BASE_DIR, 'assets', 'quiz', 'amigos');

const animaisBase = [
  { nome: "ocapi", arquivo: "ocapi.jpg", pasta: ANIMAIS_DIR },
  { nome: "axolote", arquivo: "axolote.jpg", pasta: ANIMAIS_DIR },
  { nome: "pangolim", arquivo: "pangolim.jpg", pasta: ANIMAIS_DIR },
  { nome: "narval", arquivo: "narval.jpg", pasta: ANIMAIS_DIR },
  { nome: "ornitorrinco", arquivo: "ornitorrinco.jpg", pasta: ANIMAIS_DIR },
  { nome: "suricato", arquivo: "suricato.jpg", pasta: ANIMAIS_DIR },
  { nome: "capivara", arquivo: "capivara.jpg", pasta: ANIMAIS_DIR },
  { nome: "panda vermelho", arquivo: "panda-vermelho.jpg", pasta: ANIMAIS_DIR },
  { nome: "dragão de komodo", arquivo: "dragao-de-komodo.jpg", pasta: ANIMAIS_DIR },
  { nome: "tucano", arquivo: "tucano.jpg", pasta: ANIMAIS_DIR },
  { nome: "lince", arquivo: "lince.jpg", pasta: ANIMAIS_DIR },
  { nome: "coala", arquivo: "coala.jpg", pasta: ANIMAIS_DIR },
  { nome: "feneco", arquivo: "feneco.jpg", pasta: ANIMAIS_DIR },
  { nome: "tapir", arquivo: "tapir.jpg", pasta: ANIMAIS_DIR },
  { nome: "Diabo da Tasmânia", arquivo: "diabo-da-tasmania.jpg", pasta: ANIMAIS_DIR },
  { nome: "preguiça", arquivo: "preguica.jpg", pasta: ANIMAIS_DIR },
  { nome: "porco espinho", arquivo: "equidna.jpg", pasta: ANIMAIS_DIR },
  { nome: "casuar", arquivo: "casuar.jpg", pasta: ANIMAIS_DIR },
  { nome: "peixe palhaço", arquivo: "peixe-palhaco.jpg", pasta: ANIMAIS_DIR },
  { nome: "bisão", arquivo: "bisao.jpg", pasta: ANIMAIS_DIR },
  { nome: "gato", arquivo: "gato.jpg", pasta: ANIMAIS_DIR },
  { nome: "cachorro", arquivo: "cachorro.jpg", pasta: ANIMAIS_DIR },
  { nome: "papagaio", arquivo: "papagaio.jpg", pasta: ANIMAIS_DIR },
  { nome: "arara", arquivo: "arara.jpg", pasta: ANIMAIS_DIR },
  { nome: "jabuti", arquivo: "jabuti.jpg", pasta: ANIMAIS_DIR },
  { nome: "elefante", arquivo: "elefante.jpg", pasta: ANIMAIS_DIR }
];

const amigosOcultos = [
  { nome: "Ana", arquivo: "ana.jpg", pasta: AMIGOS_DIR },
  { nome: "Murilo", arquivo: "murilo.jpg", pasta: AMIGOS_DIR },
  { nome: "Gisele", arquivo: "gisele.jpg", pasta: AMIGOS_DIR },
  { nome: "Carlos", arquivo: "carlos.jpg", pasta: AMIGOS_DIR },
  { nome: "Fernanda", arquivo: "fernanda.jpg", pasta: AMIGOS_DIR },
  { nome: "Cadu", arquivo: "cadu.jpg", pasta: AMIGOS_DIR },
  { nome: "Paulo", arquivo: "paulo.jpg", pasta: AMIGOS_DIR }
];

export default {
  name: "quizanimais",
  description: "Quiz de animais (Modo A para incluir amigos).",
  commands: ["quizanimais"],
  usage: `${PREFIX}quizanimais [A]`,

  handle: async ({ remoteJid, sendReply, socket, userLid, sendText, args }) => {
    
    if (global.activeQuiz[remoteJid]) {
        global.activeQuiz[remoteJid] = false;
        return sendReply("🛑 *O Quiz Animais foi desativado!*");
    }

    // Se tiver o "A" no comando, ele junta as listas
    const modoSurpresa = args[0]?.toUpperCase() === 'A';
    const listaFinal = modoSurpresa ? [...animaisBase, ...amigosOcultos] : animaisBase;

    global.activeQuiz[remoteJid] = true;
    await sendReply(`✨ 🦁 *O Quiz Animais foi ATIVADO!* ${modoSurpresa ? '\n(Modo Especial Ativado 🤫)' : ''}\n\nVocês têm 5 minutos para acertar cada um!`);

    while (global.activeQuiz[remoteJid]) {
        const item = listaFinal[Math.floor(Math.random() * listaFinal.length)];
        const caminhoImagem = path.resolve(item.pasta, item.arquivo);
        const nomeCorreto = item.nome.toLowerCase();

        if (!fs.existsSync(caminhoImagem)) {
            await delay(2000);
            continue; 
        }

        try {
            await socket.sendMessage(remoteJid, { 
                image: fs.readFileSync(caminhoImagem), 
                caption: `❓ *QUE ANIMAL É ESTE?*\n\nResponda em até 5 minutos para ganhar *R$ 50,00*!` 
            });
        } catch (error) {
            await delay(5000);
            continue;
        }

        let acertou = false;
        const tempoLimite = Date.now() + 300000; 

        const monitor = async (m) => {
            if (!global.activeQuiz[remoteJid] || acertou) return;
            const msg = m.messages[0];
            if (!msg.message || msg.key.remoteJid !== remoteJid || msg.key.fromMe) return;

            const texto = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase().trim();
            const autor = msg.key.participant || msg.key.remoteJid;

            if (texto === nomeCorreto) {
                acertou = true;
                const saldoPath = path.resolve(BASE_DIR, 'database', SALDO_FILE);
                let saldoData = fs.existsSync(saldoPath) ? JSON.parse(fs.readFileSync(saldoPath, 'utf8')) : {};
                let jidToUse = (autor.includes(DONO_PHONE) || autor === OWNER_LID) ? TARGET_JID_DONO : autor;
                const key = `${remoteJid}-${jidToUse}`;
                saldoData[key] = (saldoData[key] || 0) + 50;
                fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

                await sendText(`🎉 *ACERTOU!* @${autor.split('@')[0]}\n\nResposta: *${item.nome.toUpperCase()}*\n💰 Prêmio de *R$ 50,00* enviado!`, [autor]);
            }
        };

        socket.ev.on('messages.upsert', monitor);
        while (!acertou && Date.now() < tempoLimite && global.activeQuiz[remoteJid]) {
            await delay(2000);
        }
        socket.ev.off('messages.upsert', monitor);

        if (!global.activeQuiz[remoteJid]) break;

        if (!acertou) {
            await sendText(`⏰ *Tempo Esgotado!*\nNinguém acertou. A fera era: *${item.nome.toUpperCase()}*\n\nPróximo em 10 segundos...`);
            await delay(10000);
        } else {
            await delay(5000);
        }
    }
  },
};