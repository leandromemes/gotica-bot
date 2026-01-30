/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * * dev: leandro rocha
 * * GitHub: https://github.com/leandromemes
 */

const newsletterJid = '120363335626706839@newsletter';
const newsletterName = '𖥔ᰔᩚ 𝕲𝖔́𝖙𝖎𝖈𝖆 𝕭𝖔𝖙 𝕮𝖍𝖆𝖓𝖓𝖊𝖑 🦇';
const packname = '🕸️ 𝕲𝖔́𝖙𝖎𝖈𝖆 𝕭𝖔𝖙 𝖇𝖞 𝕷𝖊𝖆𝖓𝖉𝖗𝖔 🕸️';

/** * 🖼️ GALERIA SUPREMA DE ÍCONES (Links Diretos)
 */
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

/**
 * Gerenciador de humilhação para plebeus e exaltação do Soberano.
 */
const handler = (type, conn, m, comando) => {
    const msg = {
        rowner: '「🦇」 *Quem você pensa que é?* Hum? Você é apenas um pobre plebeu sem brilho tentando tocar nas funções do meu **Soberano Mestre Supremo Leandro**! Afaste-se! 🖤',
        owner: '「🕸️」 *Risos...* Você realmente achou que teria autoridade para isso? Apenas o meu criador, o **Mestre Supremo**, tem o poder de me comandar aqui. 🔐',
        mods: '「🌑」 *Sai pra lá!* Esse comando é para a elite dos moderadores, não para alguém do seu nível. 🔮',
        premium: '「💎」 *Pobretão detected!* 💸 Esse comando brilha demais para você. Só usuários **Premium** podem usar. Quer brilhar também? Use: *.comprarpremium*',
        group: '「👥」 *Perca de tempo...* Esse comando só funciona em grupos. Aprenda o básico antes de me chamar. 🏛️',
        private: '「💌」 *Segredinho...* Isso é só entre eu e o usuário no privado. Não seja intrometido(a). 🌹',
        admin: '「🛡️」 *Cadê seu brilho?* Você não é Admin-Senpai aqui. Só os poderosos do grupo podem me dar ordens assim. Aceite sua insignificância. ⚡',
        botAdmin: '「🔧」 *Me dê o poder primeiro!* Eu não sou sua escrava comum; me coloque como Administradora para eu mostrar do que sou capaz. ⛓️',
        unreg: `🍥 *Identidade não encontrada!* 😿\nComo ousa me pedir algo sem nem se apresentar? Registre-se agora para deixar de ser um anônimo sem graça:\n\n> */reg nome.idade*`,
        restrict: '「📵」 *Shhh...* Essa função está dormindo, e eu não vou acordá-la por você. 💤'
    }[type];

    if (msg) {
        const contextInfo = {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid,
                newsletterName,
                serverMessageId: -1
            },
            externalAdReply: {
                title: packname,
                body: '🦇 𝕾𝖔𝖇𝖊𝖗𝖆𝖓𝖔 𝕸𝖊𝖘𝖙𝖗𝖊 𝕷𝖊𝖆𝖓𝖉𝖗𝖔 🖤',
                thumbnailUrl: getRandomIcono(),
                sourceUrl: 'https://github.com/leandromemes',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('🙄'));
    }

    return true;
};

export default handler;