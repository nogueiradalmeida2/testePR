#!/bin/sh

#Defina suas variaveis ANTES de executar o script
origem_fontes_git=/Users/lucianabastos/git/coin-app2/coin-app
destino_docker=/docker_dsve

#Prepara o diretorio docker
rm -rf $destino_docker
mkdir $destino_docker
cp -R $origem_fontes_git/docker/* $destino_docker

#Prepara os arquivos do rootfs para a imagem
cp -R /Users/lucianabastos/git/coin-app2/coin-app/* $destino_docker/backend/rootfs/app/

#Substitui os arquivos de configuracao 
cp $origem_fontes_git/Back/config_PRD.json $destino_docker/backend/rootfs/app/Back/config.json
cp $origem_fontes_git/Front/package_PRD.json $destino_docker/backend/rootfs/app/Front/package.json
cp $origem_fontes_git/BD/PJ_PRD.json $destino_docker/backend/rootfs/app/BD/PJ.json

#Constroi/builda o frontend
cd $destino_docker/backend/rootfs/app/Front
ng build --env=prod
cp -R $destino_docker/backend/rootfs/app/Front/dist/* $destino_docker/frontend/www/

#Constroi/builda o backend
cd $destino_docker/backend/rootfs/app/Back
npm install

#Constroi o diretorio build do Truffle para ABI do smartcontract
cd $destino_docker/backend/rootfs/app/Back-Blockchain/
#rm -rf build
#truffle migrate --reset

#TODO
#geth attach http://vrt1281:9545
#personal.unlockAccount("0xd636349f5d7e03037e0f224c9b1ac3ccf104f4a5", "senhahhhh")
#truffle migrate --network rinkeby
#copiar o endereco gerado para o BNDESCoin: para o Back/config_PRD.json
cd /

#Configura permissoes e cria diretorios
mkdir -p $destino_docker/volumes/backend/data 			
mkdir -p $destino_docker/volumes/backend/logs
chmod 777 $destino_docker/volumes/backend/logs
chmod 777 $destino_docker/volumes/backend/data 
#mkdir -p /docker/backend/volumes/backend/data/ /docker/backend/volumes/backend/logs
#
#Limpeza de arquivos/diretorios desnecessarios
cd $destino_docker/
rm Preparacao.txt 
rm bndes-token-docker.tgz 
rm prepara_dir.sh 
cd $destino_docker/backend/rootfs/app
rm -rf Front/
rm -rf BNDESTokenApp/
rm -rf docker/
rm BD/bd-inicializado.marcador 
rm startCoin*
rm copie_os_fontes_para_ca
rm pessoa-juridica.service.spec.ts
rm README.md
rm Rotas.ts 
#
echo '0) Caso precise preservar o estado, mongoexport das 3 collections para guardar o estado do banco'
echo ' '
echo '1) Caso precise preservar o estado, restaure o diretorio build Rinkeby da epoca (ABI, etc.)'
echo ' '
echo '2) Configure o nome da sua imagem e versao no docker-compose.yml (no diretorio $destino_docker na sua workstation)'
echo ' '
echo '3) Faca o "docker-compose build" no diretorio $destino_docker (antes de enviar para o servidor)'
echo ' '
echo '4A) Faca o "docker-compose push" (para enviar para o servidor DSV-I)'
echo ' '
echo '4B) Faca o "docker save ..." (para enviar para o servidor DSV-E)'
echo ' '
echo '5) Faca o "docker-compose down" (no servidor - desligando)'
echo ' '
echo '6) Configure o nome da sua imagem e versao no docker-compose.yml (no servidor)'
echo ' '
echo '6A) Faca o "docker-compose pull" (no servidor DSV-I - atualizando)'
echo ' '
echo '6B) Faca o "docker load" (no servidor DSV-E - atualizando)'
echo ' '
echo '7) Faca o "docker-compose up / docker-compose up -d " (no servidor - ligando)'
echo ' '
echo '8) Restaure as collections do Mongo'
echo ' '
echo '9) pkill node'
echo ' '