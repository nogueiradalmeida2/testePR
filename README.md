# coin-app
Aplicação BNDESCoin

Instalação e uso do BNDES Coin

Para instalar o BNDES Coin na sua máquina:

    •	Pré-requisitos:
    o	Última versão estável do Mongo DB instalado
    o	Última versão estável do NodeJS instalado
    o	GIT instalado
    o	Última versão do Truffle instalado (npm install -g truffle)

    •	Dê um git clone na aplicação BNDES Coin no GitHub (https://github.com/vanessaalm/coin-app).

    •	Baixe e configure o BNDES-UX ()

    •	Entre no Git Bash e digite:
    git config --global url."https://github.com/".insteadOf git@github.com: 
    git config --global url."https://".insteadOf git://

    •	Execute o comando npm install dentro da pasta Front.

    •	Inicie o truffle executando o comando truffle develop dentro da pasta back-blockchain.

    •	Instale os contratos usando o comando migrate do Truffle.

    •	Instale o Google Chrome e o Metamask.

Para executar o BNDES Coin na sua máquina:

    •	Inicie um nó local do Ethereum usando o comando truffle develop

    •	Inicie o Mongo DB

    •	Entre na pasta Back e execute o comando node server.js

    •	Entre na pasta Front e inicie a aplicação com o comando npm start

    •	Crie 3 contas no Metamask – Account 1 é o BNDES, Account 2 e Account 3 são Beneficiários/Fornecedores.

    •	Se desejar, edite os nomes das contas para facilitar a identificação no Metamask.

Para usar as funcionalidades do BNDES Coin:

    •	Associação de Cliente: Selecione a conta 2 no Metamask, entre no menu Cliente -> Associar Conta, preencha o CNPJ para identificar o cliente, e escolha o subcrédito que deseja. Usuário do caso de uso: Cliente. A fazer: campos obrigatórios e formatação dos campos.

    •	Associação de Fornecedor: Selecione a conta 3 no Metamask, entre no menu Fornecedor -> Associar Conta, preencha o CNPJ para identificar o fornecedor, e preencha os dados exigidos. Usuário do caso de uso: Fornecedor. A fazer: campos obrigatórios e formatação dos campos.

    •	Liberação de recursos: Selecione a conta 1 no Metamask, digite o número de um CNPJ que já tenha sido cadastrado, preencha as outras informações e grave. Usuário do caso de uso: BNDES. A fazer: campos obrigatórios e formatação dos campos.

    •	Transferência de recursos: Selecione a conta 2 ou 3 no Metamask, digite o número de um CNPJ que já tenha sido cadastrado (que não seja da conta 1), preencha as outras informações e grave. Usuário do caso de uso: Cliente ou Fornecedor do cliente. A fazer: funcionamento similar a funcionalidade de Liberação. 

    •	Resgate: Selecione a conta 1 no Metamask, digite o número de um CNPJ que já tenha sido cadastrado e que tenha saldo em BNDES Coin, preencha as outras informações e grave. Usuário do caso de uso: Cliente ou Fornecedor do cliente. No futuro será apenas o Fornecedor do Cliente. A fazer: funcionamento similar a funcionalidade de Liberação. 

    •	Dashboard de identificação de pessoa jurídica: Consulta as pessoas jurídicas cadastradas na blockchain através do Cadastro de Pessoa Jurídica. Usuário do caso de uso: Todos. A fazer: Incluir Razão Social e ajustar formatação.

    •	Dashboard de transações: Consulta as transações realizadas através da Liberação de recursos, Transferência de recursos e Resgate. Usuário do caso de uso: Todos. A fazer: Ajustar formatação
