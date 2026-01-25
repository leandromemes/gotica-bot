import fs from "node:fs";
import path from "node:path";

export default {
  name: "reembolso",
  description: "Reembolso Real via LID automático.",
  commands: ["reembolso", "rb"],
  onlyOwner: true,

  handle: async ({ socket, sendReply, fullArgs, getGroupParticipants }) => {
    try {
      const allGroups = await socket.groupFetchAllParticipating();
      const groups = Object.values(allGroups);

      if (!fullArgs.includes("/")) {
        return await sendReply("❌ Use: !reembolso valor / nº_grupo / número");
      }

      const partes = fullArgs.split("/");
      const valor = parseFloat(partes[0].replace(/[^\d.]/g, ""));
      const indiceGrupo = parseInt(partes[1].trim()) - 1;
      const numeroPessoa = partes[2].trim().replace(/\D/g, "");

      if (isNaN(valor) || indiceGrupo < 0 || indiceGrupo >= groups.length) {
        return await sendReply("⚠️ Dados inválidos.");
      }

      const grupoAlvo = groups[indiceGrupo];
      const remoteJid = grupoAlvo.id;

      // --- O PULO DO GATO ---
      // Busca todos os participantes do grupo para achar o LID real
      const participantes = await getGroupParticipants(remoteJid);
      const usuarioObj = participantes.find(p => p.id.includes(numeroPessoa));

      if (!usuarioObj) {
        return await sendReply(`❌ Não achei @${numeroPessoa} no grupo ${grupoAlvo.subject}.`);
      }

      const lidReal = usuarioObj.id; // Isso aqui vai ser o '2400...@lid'

      const saldoPath = path.join(process.cwd(), 'database', 'saldo-real.json');
      let saldoData = JSON.parse(fs.readFileSync(saldoPath, 'utf8'));
      
      const chaveBanco = `${remoteJid}-${lidReal}`;

      // Injeta no LID (onde o !saldo e !ricos lêem)
      if (!saldoData[chaveBanco]) saldoData[chaveBanco] = 0;
      saldoData[chaveBanco] += valor;

      fs.writeFileSync(saldoPath, JSON.stringify(saldoData, null, 2));

      // Resposta limpa para você
      await sendReply(`✅ *REEMBOLSO REALIZADO*\n💰 Valor: R$ ${valor.toLocaleString('pt-BR')}\n👤 Usuário: @${numeroPessoa}`, { mentions: [lidReal] });

      // Mensagem bonita no grupo marcando a pessoa
      const aviso = `🏦 *SISTEMA BANCÁRIO*\n\nOlá, @${numeroPessoa}.\n\nSeu reembolso de *R$ ${valor.toLocaleString('pt-BR')}* foi creditado com sucesso!\n\n💰 *Status:* Saldo Atualizado.`;
      
      await socket.sendMessage(remoteJid, { 
        text: aviso, 
        mentions: [lidReal] 
      });

    } catch (error) {
      await sendReply("❌ Erro: " + error.message);
    }
  }
};