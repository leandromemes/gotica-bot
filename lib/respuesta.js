/**
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

// --- SEUS LINKS REAIS ---
const newsletterJid = '';
const canalOficial = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'; // Link do seu canal


const iconos = [
'https://i.ibb.co/LhHbSZT9/aaaaa.jpg',
'https://i.ibb.co/Xx4qKyyv/dadfasd-DS.jpg',
'https://i.ibb.co/jkKyvzv4/kikikkk.jpg',
'https://i.ibb.co/xSjSCKW9/sssssa.jpg',
'https://i.ibb.co/m5DfDMSC/ssssssa.jpg',
'https://i.ibb.co/SwwdGbmS/sssw-D.jpg',
'https://i.ibb.co/5hjWPnjB/Whats-App-Image-2026-01-30-at-12-29-33-PM.jpg',
'https://i.ibb.co/8nbdzqZv/Whats-App-Image-2026-01-30-at-12-29-36-PM.jpg',
'https://i.ibb.co/spVfpwzY/Whats-App-Image-2026-01-30-at-12-29-39-PMsda.jpg',
'https://i.ibb.co/99XhymZw/aaaa.jpg'
];

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

const handler = (type, conn, m, comando) => {
  const msg = {
    rowner: '「❌」 *Quem você pensa que é?* Esse comando é exclusivo do meu *Soberano Mestre Leandro*. Saia das sombras, plebeu. 🍷',
    owner: '「❌」 *Tentativa de invasão?* Apenas o *Leandro* e seus desenvolvedores de elite tocam aqui. 🕸️',
    mods: '「❌」 *Acesso Negado!* Comando restrito aos programadores do submundo. 🔮',
    premium: '「❌」 *Pobreza detectada!* Esta função é apenas para usuários **Premium**. Quer brilhar? Use: .comprarpremium',
    group: '「❌」 *Perdido?* Este comando só funciona em grupos. Aprenda a ler os manuais do reino. 👥',
    private: '「❌」 *Segredinho?* Use este comando apenas no meu privado para não passar vergonha no grupo. 💌',
    admin: '「❌」 *Sem coroa? Sem comando!* Apenas Admins podem usar esta função. Volte quando tiver autoridade. 🛡️',
    botAdmin: '「❌」 *Eu sou apenas uma súdita?* Me dê Admin para que eu possa desatar meu verdadeiro poder neste grupo!',
    unreg: `「❌」*Opa! Quem é você?* Você ainda não se registrou no meu sistema. ✨\n\n📝 Use:\n */reg nome.idade*\n\nExemplo: */reg Leandro.25*`,
    restrict: '「❌」 *Função Adormecida...* Esta habilidade está desativada no momento. 💤'
  }[type];

  if (msg) {
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: false, // REMOVIDO: Tira o "Encaminhado com frequência"
      forwardingScore: 0,  // REMOVIDO: Limpa o rastro de spam
      externalAdReply: {
        title: packname,
        body: '🌑 𝕭𝖊𝖒-𝖛𝖎𝖓𝖉𝖔 𝖆𝖔 𝖒𝖊𝖚 𝖗𝖊𝖎𝖓𝖔...',
        thumbnailUrl: getRandomIcono(),
        sourceUrl: canalOficial, // LINK DO BOTÃO "Acessar canal"
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('✖️'));
  }

  return true;
};

export default handler;