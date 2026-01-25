import { lerFamilia, cleanJid } from '../../../utils/familia.js';
import { lerRelacionamentos } from '../../../utils/relacionamento.js';

export default {
  name: "familia",
  description: "Mostra sua família completa.",
  commands: ["familia", "arvore", "parentes"],

  handle: async ({ remoteJid, userLid, sendReply }) => {
    const user = cleanJid(userLid);
    const soberanoLid = "240041947357401@lid";
    const isSoberano = (user === cleanJid(soberanoLid));

    // LER DADOS DOS DOIS ARQUIVOS
    const dbFamilia = lerFamilia();
    const dbRelacionamentos = lerRelacionamentos();

    const familiaData = dbFamilia[remoteJid]?.[user] || {};
    const relacaoData = dbRelacionamentos[remoteJid]?.[user] || {};

    // Se não tem nada em nenhum dos dois
    if (!familiaData.pai && !familiaData.filhos && !familiaData.irmaos && !relacaoData.parceiro) {
        return await sendReply("🥀 Você ainda não tem família registrada aqui.");
    }

    let msg = isSoberano 
        ? `👑 *FAMÍLIA DO SOBERANO* 👑\n\n` 
        : `🦇 *MINHA FAMÍLIA GÓTICA* 🦇\n\n`;
    
    let mentions = [];

    // 1. ESPOSA / MARIDO
    if (relacaoData.parceiro) {
        const termo = relacaoData.status === "casado" ? "Esposa(o)" : "Namorada(o)";
        msg += `💍 *${termo}:* @${relacaoData.parceiro.split("@")[0]}\n`;
        mentions.push(relacaoData.parceiro);
    }

    // 2. PAI / MÃE (Mudado para "Pai/Mãe" como pedido)
    if (familiaData.pai) {
        msg += `👨‍👦 *Pai/Mãe:* @${familiaData.pai.split("@")[0]}\n`;
        mentions.push(familiaData.pai);
    }

    // 3. FILHOS
    if (familiaData.filhos?.length > 0) {
      msg += `🍼 *Filhos:* \n` + familiaData.filhos.map(f => {
          mentions.push(f);
          return ` └ @${f.split("@")[0]}`;
      }).join("\n") + "\n";
    }

    // 4. IRMÃOS
    if (familiaData.irmaos?.length > 0) {
      msg += `👥 *Irmãos:* \n` + familiaData.irmaos.map(i => {
          mentions.push(i);
          return ` └ @${i.split("@")[0]}`;
      }).join("\n") + "\n";
    }

    msg += `\n_A família é a nossa base!_ 🦇`;

    await sendReply(msg, mentions);
  }
};