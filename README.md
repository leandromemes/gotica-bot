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

