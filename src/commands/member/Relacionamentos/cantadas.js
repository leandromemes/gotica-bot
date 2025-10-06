module.exports = {
  name: "cantadas",
  description: "Receba uma cantada aleatória",
  commands: ["cantadas"],
  usage: "!cantadas",

  handle: async ({ sendReply }) => {
    const cantadas = [
      "🗺️ Você tem mapa? Porque eu me perdi no brilho dos seus olhos.",
      "😵‍💫 Você não é pescoço, mas mexeu com a minha cabeça.",
      "🥚🐔 Se beleza brotasse em ovos, você seria dona da granja inteira!",
      "🍔 Se você fosse um sanduíche, seu nome seria x-princesa!",
      "📱 Perdi meu número de telefone, me empresta o seu?",
      "💎 Você não usa calcinha, você usa um porta-joias.",
      "🎩✨ Eu não sou mágico, mas toda vez que te vejo, o resto do mundo some.",
      "💨☀️ Você é tipo vento em tarde quente: não vejo, mas sinto que me mudou.",
      "🌞 Você não é sol, mas ilumina o que eu nem sabia que tava escuro.",
      "⏳ Se beleza fosse tempo, você seria uma eternidade."
    ];

    const cantadaAleatoria = cantadas[Math.floor(Math.random() * cantadas.length)];
    await sendReply(cantadaAleatoria);
  },
};