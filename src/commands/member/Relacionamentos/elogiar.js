module.exports = {
  name: "elogiar",
  description: "Receba um elogio aleatório",
  commands: ["elogiar"],
  usage: "!elogiar",

  handle: async ({ sendReply }) => {
    const elogios = [
      "✨ Você é uma pessoa incrível, nunca se esqueça disso!",
      "😄 Seu sorriso ilumina qualquer grupo!",
      "⚡ Você tem uma energia que contagia!",
      "🌟 Você é único(a), e isso é maravilhoso!",
      "🔥 Sua presença deixa tudo melhor!",
      "🎯 Você é tipo meme bom: aparece e melhora o dia!",
      "💖 Você é especial do seu jeitinho!",
      "🚀 Você arrasa mais que Wi-Fi no rolê!",
      "🏆 Quem te conhece sabe: você é 10/10!",
      "🎉 Tá na mira do elogio porque é top demais!"
    ];

    const elogioAleatorio = elogios[Math.floor(Math.random() * elogios.length)];
    await sendReply(elogioAleatorio);
  },
};