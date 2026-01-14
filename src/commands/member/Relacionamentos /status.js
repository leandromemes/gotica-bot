import { lerRelacionamentos, cleanJid } from '../../../utils/relacionamento.js';

export default {
  name: "status",
  description: "Exibe seu status amoroso detalhado no grupo.",
  commands: ["status", "verstatus", "relacionamento", "meuamor"],
  usage: "!status",

  /**
   * @param {import('../../../@types').CommandHandleProps} props
   */
  handle: async ({ remoteJid, userLid, sendReply, sendText, isGroup, sendReact }) => {
    
    if (!isGroup) return await sendReply("✨ ❌ Este comando só funciona em grupos.");

    try {
      const db = lerRelacionamentos();
      const grupo = db[remoteJid] || {};
      
      // BUSCA HÍBRIDA: Procura pelo ID completo (como salvamos agora) 
      // ou pelo ID limpo (para casais antigos)
      const meuIdOriginal = userLid;
      const meuIdLimpo = cleanJid(userLid);
      
      const status = grupo[meuIdOriginal] || grupo[meuIdLimpo]; 

      let mensagem;
      let mentions = [userLid]; 
      
      await sendReact("🔍");

      if (!status) {
        mensagem = `
🖤 *INVENTÁRIO AMOROSO* 🖤
------------------------------------------
👤 *Usuário:* @${userLid.split('@')[0]}
💍 *Status:* \`SOLTEIRO(A)\`
📉 *Situação:* Disponível na pista!

_Dica: Use !namorar @pessoa para sair da seca._
------------------------------------------`.trim();
      } else {
        const tipo = status.status;
        const parceiroJid = status.parceiro;
        
        // Reconstrói o JID do parceiro para garantir o nome azul
        // Se o parceiro no banco já tiver @, usamos direto, senão colocamos o sufixo
        let fParceiro = parceiroJid;
        if (!parceiroJid.includes('@')) {
          fParceiro = parceiroJid.length > 15 
            ? `${parceiroJid}@lid` 
            : `${parceiroJid}@s.whatsapp.net`;
        }
          
        mentions.push(fParceiro);

        const emojiRel = tipo === 'namorando' ? '💘' : '💍';
        const acao = tipo === 'namorando' ? 'namorando' : 'casado(a)';
        const comandoFim = tipo === 'namorando' ? '!terminar' : '!divorciar';

        mensagem = `
${emojiRel} *CERTIDÃO DE RELACIONAMENTO* ${emojiRel}
------------------------------------------
👤 *Titular:* @${userLid.split('@')[0]}
❤️ *Compromissado(a) com:* @${fParceiro.split('@')[0]}
📜 *Tipo:* \`${tipo.toUpperCase()}\`

✨ _Que a Gótica Bot abençoe essa união!_
------------------------------------------
💡 _Para encerrar, use ${comandoFim}_`.trim();
        
        await sendReact(tipo === 'namorando' ? "❤️" : "🥂");
      }
      
      // Envia a mensagem com as mentions para brilhar os nomes
      await sendText(mensagem, mentions);

    } catch (e) {
      console.error("Erro no comando !status:", e); 
      return await sendReply("❌ Ocorreu um erro ao verificar seu histórico amoroso.");
    }
  },
};