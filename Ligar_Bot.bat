@echo off
title Gotica Bot - Console de Controle
:main
cls
echo ============================================
echo      GOTICA BOT - PROJETO LEANDRO ROCHA
echo ============================================
echo [1] Ligar Bot (Normal)
echo [2] Instalar/Atualizar Dependencias (npm install)
echo [3] Limpar Sessao (Caso o QR Code de erro)
echo [4] Sair
echo ============================================
set /p opt="Escolha uma opcao: "

if %opt%==1 goto start
if %opt%==2 goto install
if %opt%==3 goto clean
if %opt%==4 exit

:start
echo Iniciando o Bot...
node index.js
pause
goto main

:install
echo Instalando pacotes...
npm install
pause
goto main

:clean
echo Limpando sessao antiga...
rd /s /q session
echo Concluido!
pause
goto main