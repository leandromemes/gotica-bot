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

### Instalação no Termux

1 - Abra o Termux e execute os comandos abaixo para instalar as dependências.

```bash
pkg upgrade -y && pkg update -y && pkg install git -y && pkg install nodejs-lts -y && pkg install ffmpeg -y

```

2 - Habilite o acesso da pasta storage no Termux.

```bash
termux-setup-storage

```
3 - Escolha uma pasta de sua preferência para colocar os arquivos do bot.

Pastas mais utilizadas:

/sdcard

/storage/emulated/0

/storage/emulated/0/Download

No nosso exemplo, vamos para a /sdcard.

```bash
cd /sdcard

```
4 - Clone o repositório.

```bash
git clone https://github.com/leandromemes/gotica-bot.git

```
5 - Entre na pasta que foi clonada.

```bash
cd gotica-bot

```
6 - Habilite permissões de leitura e escrita (faça apenas 1x esse passo).

```bash
chmod -R 755 ./*

```
7 - Execute o bot.

```bash
npm start

```
8 - Insira o número de telefone e pressione `enter`.

9 - Informe o código que aparece no Termux no seu WhatsApp (vá em **Dispositivos Conectados** > **Conectar um Dispositivo** > **Conectar sem escanear o QR Code**).

10 - Aqui você pode configurar de duas formas (10.1 ou 10.2):

10.1 - Primeira forma: aguarde 10 segundos, depois digite `CTRL + C` para parar o bot.

Depois, configure o arquivo `src/config.js` que está dentro da pasta `src`.

```javascript
// Prefixo dos comandos
exports.PREFIX = "/";

// Nome do bot (mude se preferir).
exports.BOT_NAME = "Gótica Bot";

// Número do bot. Coloque o número do bot
// (apenas números, exatamente como está no WhatsApp).
exports.BOT_NUMBER = "558112345678";

// Número do dono do bot. Coloque o número do dono do bot
// (apenas números, exatamente como está no WhatsApp).
exports.OWNER_NUMBER = "5521950502020";

// LID do dono do bot.
// Para obter o LID do dono do bot, use o comando <prefixo>get-lid @marca ou +telefone do dono.
exports.OWNER_LID = "219999999999999@lid";

```
10.2 - Segunda forma: configure o número do dono do bot e número do bot pelo próprio WhatsApp, com os comandos:

`/numero-dono +55 11 99999999`

e

`/numero-bot +55 11 88888888`

Lembre-se de trocar os números acima pelos seus números, obviamente e tbm ver se o seu prefixo é a barra /.

11 - Inicie o bot novamente.

```bash
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

```
## Funcionalidades

O Gótica Bot inclui uma vasta gama de comandos administrativos, de moderação de grupo e de membro, como:

| Contexto | Funcionalidades Principais |
| :--- | :--- |
| **Dono** | Controle de infraestrutura, desligar/ligar o bot, alterar configurações globais. |
| **Admin** | Banir, promover/rebaixar, anti-link, anti-mídia, anti-sticker, agendamento de mensagens, boas-vindas. |
| **Membro** | Busca CEP, Comandos de diversão/brincadeiras, conversão de mídias (sticker para imagem e vice-versa), comandos de utilidade. |

## Personalização

* **Menu de Comandos:** O menu fica no arquivo `src/menu.js`.
* **Mensagens de Grupo:** As mensagens de boas-vindas e saída de grupo ficam no arquivo `src/messages.js`.

## Estrutura de Pastas

* 📁 `assets` ➔ Arquivos de mídia (logo, stickers, etc.)
* 📁 `database` ➔ Arquivos de dados (auto-responder, configurações de grupo).
* 📁 `src` ➔ Código Fonte Principal
    * 📁 `commands` ➔ Onde ficam todos os comandos (owner, admin, member).
    * 📝 `config.js` ➔ Configurações do bot.
    * 📝 `menu.js` ➔ Texto e estrutura do menu de ajuda.

## Licença e Disclaimer

Este projeto está licenciado sob a Licença Pública Geral GNU (GPL-3.0). Isso garante que o código-fonte permaneça aberto e acessível a todos. Você pode usar, modificar e distribuir o código, desde que mantenha a licença e os créditos originais.
