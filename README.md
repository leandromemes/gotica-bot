# 🤖 Gótica Bot

![Takeshi Bot](./assets/images/takeshi-bot.png)

> Bot de WhatsApp multifuncional, otimizado e personalizado por **Leandro**. Uma base completa com foco em diversão, economia e administração de grupos.

[![Versão](https://img.shields.io/badge/Vers%C3%A3o-7.3.0-purple)](#)
[![Node.js](https://img.shields.io/badge/Node.js-22.19-green?logo=node.js)](https://nodejs.org/en)
[![Baileys](https://img.shields.io/badge/Baileys-7.0.0.9-purple?logo=whatsapp)](https://github.com/WhiskeySockets/Baileys)

## 📖 Sobre o Projeto
A **Gótica Bot** é uma evolução focada em comandos de entretenimento e utilitários. Diferente de outras bases, aqui priorizamos a interação entre membros com sistemas de **Relacionamentos** (casar, namorar, trair) e **Economia Real** (ganhar dinheiro, apostar e trabalhar), tudo configurado para ser intuitivo e divertido.

---

## 🚀 Instalação no Termux

Siga os passos abaixo para instalar o bot no seu Android:

1. **Dependências iniciais:**
   ```sh
   
   pkg upgrade -y && pkg update -y && pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y

 2. **Permissão de armazenamento:**
    ```sh
    
    termux-setup-storage

3. **Clonar e instalar:**
   ```sh
 
   git clone https://github.com/leandromemes/gotica-bot.git
   cd gotica-bot
   npm install

4. **Habilite permissões de leitura e escrita (faça apenas 1x esse passo).**
   ```sh
 
   chmod -R 755 ./*

5. **Iniciar o bot:**
   ```sh

   npm start

8. Insira o número de telefone e pressione `enter`.

***⚙️ Configurações Principais**
Edite o arquivo `src/config.js` para definir o dono e o nome do bot:

```js
// Prefixo padrão dos comandos.
export const PREFIX = "!";

// Emoji do bot (mude se preferir).
export const BOT_EMOJI = "🤖";

// Nome do bot (mude se preferir).
export const BOT_NAME = "gótica Bot";

// LID do bot.
// Para obter o LID do bot, use o comando <prefixo>lid respondendo em cima de uma mensagem do número do bot
// Troque o <prefixo> pelo prefixo do bot (ex: /lid).
export const BOT_LID = "12345678901234567890@lid";

// LID do dono do bot.
// Para obter o LID do dono do bot, use o comando <prefixo>meu-lid
// Troque o <prefixo> pelo prefixo do bot (ex: /meu-lid).
export const OWNER_LID = "12345678901234567890@lid";
```

## 🛠️ Funcionalidades em Destaque

```js
Categoria,Comandos Principais
💞 Relacionamentos:"Casar, Namorar, Trair, Status, Casal do Dia, Terminar."

💰 Economia:"Saldo, Trabalhar, Roubar, Traficar, Apostar Tudo, Pix, Rank Ricos."

🛡️ Admin: "Ban, Mute, Anti-Link, Marcar Todos, Revelar, Agendar Mensagens."

🎭 Diversão: "Aniversário (com áudio), Bater, Beijar, Quiz, Gay, Gado, Aura."

🖼️ Mídia: "Sticker(figurinha),Renomear, ToImage, Play Áudio/Vídeo, TikTok."
```

## ⚠️ Aviso Legal

**Este projeto não possui vínculo oficial com o WhatsApp (Meta Inc.). O desenvolvedor não se responsabiliza por banimentos ou uso indevido da ferramenta. Use com moderação para evitar bloqueios.**

*Desenvolvido e Mantido por: `Leandro`*
