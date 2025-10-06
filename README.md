# 🤖 Gótica Bot

<div align="center">
    <img src="./assets/images/gotica-bot.png" width="500" alt="Gótica Bot Logo">
</div>

<br />

<div align="center">
    <a href="https://github.com/leandromemes/gotica-bot">
        <img alt="Version" src="https://img.shields.io/badge/Vers%C3%A3o-6.3.4-blue">
    </a>
    <a href="https://github.com/leandromemes/gotica-bot">
        <img alt="Autor" src="https://img.shields.io/badge/Autor-Leandro-red">
    </a>
</div>

<br />

> Base para bots de WhatsApp multifuncional com diversos comandos prontos. Projeto desenvolvido e mantido por Leandro.

[![Node.js](https://img.shields.io/badge/Node.js-22.19-green?logo=node.js)](https://nodejs.org/en)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.19-purple?logo=whatsapp)](https://github.com/WhiskeySockets/Baileys)
[![FFMPEG](https://img.shields.io/badge/FFMPEG-Latest-orange?logo=ffmpeg)](https://ffmpeg.org/)

## 📋 Sumário

1. [Atenção - Suporte e Uso](#-atenção---suporte-e-uso)
2. [Sobre o Projeto](#sobre-este-projeto)
3. [Instalação](#instalação)
    - [Instalação em VPS (Debian/Ubuntu)](#instalação-em-vps-debianubuntu)
    - [Instalação no Termux](#instalação-no-termux)
4. [Configuração](#configuração)
5. [Funcionalidades](#funcionalidades)
6. [Personalização](#personalização)
7. [Estrutura de Pastas](#estrutura-de-pastas)
8. [Licença e Disclaimer](#licença-e-disclaimer)

## ⚠ Atenção - Suporte e Uso

Este bot é disponibilizado de forma **gratuíta** para a comunidade. Não nos responsabilizamos por qualquer cobrança feita por terceiros pelo uso desta base.

## Sobre este projeto

O **Gótica Bot** é um projeto independente, desenvolvido para interações automatizadas via WhatsApp, utilizando a biblioteca **Baileys**.

Não há qualquer vínculo oficial com o WhatsApp. É de responsabilidade exclusiva do usuário garantir que a sua utilização esteja em conformidade com os termos de uso do WhatsApp e a legislação vigente.

## Instalação

### Instalação em VPS (Debian/Ubuntu)

1.  **Pré-requisitos:** Instale `git`, `curl`, `ffmpeg` e o NVM/Node.js v20+.
2.  **Clone o repositório:**
    ```sh
    git clone [https://github.com/leandromemes/gotica-bot.git](https://github.com/leandromemes/gotica-bot.git)
    cd gotica-bot
    ```
3.  **Instale as dependências e o PM2:**
    ```sh
    npm install
    npm install pm2 -g
    ```
4.  **Inicie o bot e pare para configurar:** Use `npm start` para obter o código de pareamento, conecte o dispositivo no WhatsApp e, em seguida, pare com `CTRL + C`.
5.  **Configure o bot:** Edite o arquivo `src/config.js`.
6.  **Inicie com PM2:**
    ```sh
    pm2 start index.js --name "Gotica-1"
    ```

### Instalação no Termux

1.  **Pré-requisitos:** Execute os comandos básicos para instalação de dependências:
    ```sh
    pkg upgrade -y && pkg update -y && pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y
    termux-setup-storage
    ```
2.  **Clone e instale:**
    ```sh
    cd /sdcard # ou a pasta de sua preferência
    git clone [https://github.com/leandromemes/gotica-bot.git](https://github.com/leandromemes/gotica-bot.git)
    cd gotica-bot
    npm install
    ```
3.  **Inicie, Conecte e Configure:** Siga os passos de conexão e configuração (itens 4 e 5 da Instalação em VPS).
4.  **Execute o bot:**
    ```sh
    npm start
    ```

## Configuração

O arquivo principal de configuração é o **`src/config.js`**. Edite-o para definir:
- `PREFIX` (o prefixo do seu comando, ex: `!`, `/` ou `.`)
- `BOT_NAME` (Nome do seu bot)
- `BOT_NUMBER` e `OWNER_NUMBER` (Seus números de telefone)

```javascript
// Exemplo de configuração em src/config.js
exports.PREFIX = "/";
exports.BOT_NAME = "Gótica Bot";
// ... (outras configurações de número)
Funcionalidades
O Gótica Bot inclui uma vasta gama de comandos administrativos, de moderação de grupo e de membro, como:

Contexto	Funcionalidades Principais
Dono	Controle de infraestrutura, desligar/ligar o bot, alterar configurações globais.
Admin	Banir, promover/rebaixar, anti-link, anti-mídia, anti-sticker, agendamento de mensagens, boas-vindas.
Membro	Busca CEP, Comandos de diversão/brincadeiras, conversão de mídias (sticker para imagem e vice-versa), comandos de utilidade.

Exportar para as Planilhas
Personalização
Menu de Comandos: O menu fica no arquivo src/menu.js.

Mensagens de Grupo: As mensagens de boas-vindas e saída de grupo ficam no arquivo src/messages.js.

Estrutura de Pastas
📁 assets ➔ Arquivos de mídia (logo, stickers, etc.)

📁 database ➔ Arquivos de dados (auto-responder, configurações de grupo).

📁 src ➔ Código Fonte Principal

📁 commands ➔ Onde ficam todos os comandos (owner, admin, member).

📝 config.js ➔ Configurações do bot.

📝 menu.js ➔ Texto e estrutura do menu de ajuda.

Licença e Disclaimer
Este projeto está licenciado sob a Licença Pública Geral GNU (GPL-3.0). Isso garante que o código-fonte permaneça aberto e acessível a todos. Você pode usar, modificar e distribuir o código, desde que mantenha a licença e os créditos originais.
