import { Component, OnInit } from '@angular/core'
import { ChangeDetectorRef } from '@angular/core'

import { Web3Service } from './../Web3Service'
import { PessoaJuridicaService } from '../pessoa-juridica.service';

import { BnAlertsService } from 'bndes-ux4'

import { LiquidacaoResgate } from './liquidacao-resgate'

@Component({
  selector: 'app-liquidacao-resgate',
  templateUrl: './liquidacao-resgate.component.html',
  styleUrls: ['./liquidacao-resgate.component.css']
})
export class LiquidacaoResgateComponent implements OnInit {

  resgates: LiquidacaoResgate[] = []
  estadoLista: string = "undefined"

  order: string = ''
  reverse: boolean = false

  checkTitleActive: boolean = false
  isActive: boolean[]

  resgatesParaLiquidar: string[] = []

  constructor(private pessoaJuridicaService: PessoaJuridicaService,
    protected bnAlertsService: BnAlertsService,
    private web3Service: Web3Service,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.registrarExibicaoEventos()
    }, 500)
  }

  registrarExibicaoEventos() {
    let self = this
    let resgate: LiquidacaoResgate

    this.web3Service.registraEventosResgate(function (error, event) {
      if (!error) {

        self.pessoaJuridicaService.recuperaResgatesNaoLiquidados().subscribe(
          data => {
            console.log("Encontrou algum dado")
            console.log(data)

            for (var i = 0; i < data.length; i++) {
              resgate = new LiquidacaoResgate()

              if (data && event.transactionHash === data[i].hashOperacao) {
                resgate.cnpj = data[i].cnpjOrigem
                resgate.razaoSocial = data[i].razaoSocialOrigem
                resgate.banco = data[i].bancoOrigem
                resgate.agencia = data[i].agenciaOrigem
                resgate.contaCorrente = data[i].contaCorrenteOrigem
                resgate.contaBlockchain = data[i].contaBlockchainOrigem
                resgate.valorResgate = self.web3Service.converteInteiroParaDecimal(parseInt(event.args.valor))
                resgate.hashID = data[i].hashOperacao
                resgate.dataHora = data[i].dataHora

                self.resgates.push(resgate)
                self.estadoLista = "cheia"
                self.ref.detectChanges()

                console.log(self.resgates)
              } else {
                console.log("Nenhuma empresa encontrada.")
                resgate.razaoSocial = ""
                resgate.banco = 0
                resgate.agencia = 0
                resgate.contaCorrente = 0
                resgate.contaBlockchain = ""
                resgate.hashID = ""
              }

            }
            self.isActive = new Array(self.resgates.length).fill(false)

          },
          error => {
            console.log("Erro ao buscar dados da empresa.")
            resgate.razaoSocial = ""
            resgate.banco = 0
            resgate.agencia = 0
            resgate.contaCorrente = 0
            resgate.contaBlockchain = ""
          })

      } else {
        console.log("Erro no registro de eventos de resgate");
        console.log(error);
      }
    })
    self.estadoLista = "vazia"    
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse
    }
    this.order = value
    this.ref.detectChanges()
  }

  customComparator(itemA, itemB) {
    return itemB - itemA
  }

  check(position, hashID) {
    console.log("Check")
    if (this.isActive[position]) {
      this.checkTitleActive = false

      this.isActive[position] = false
      this.resgatesParaLiquidar.splice(this.resgatesParaLiquidar.indexOf(hashID), 1)
    } else {
      this.isActive[position] = true
      this.resgatesParaLiquidar.push(hashID)
    }

    this.ref.detectChanges()
  }

  checkAll() {
    console.log("CheckALL")
    if (!this.checkTitleActive) {
      this.isActive.fill(true)
      this.checkTitleActive = true
      this.resgatesParaLiquidar = this.resgates.map((resgate: LiquidacaoResgate) => resgate.hashID)
    } else {
      this.isActive.fill(false)
      this.checkTitleActive = false
      this.resgatesParaLiquidar = []
    }
    this.ref.detectChanges()  
  }

  liquidar() {
    console.log("Liquidando os resgates..")

    let self = this;

    for (var i = 0; i < self.resgatesParaLiquidar.length; i++) {
      let hashIdResgate = self.resgatesParaLiquidar[i]

      self.web3Service.liquidaResgate(hashIdResgate, function (result) {
        //result contem o hashID da Liquidacao e deve ser gravado
        self.pessoaJuridicaService.liquidarResgate(hashIdResgate, result).subscribe(
          data => {
            if (data) {
              console.log("Inseriu no bd");

              self.removerDaListaDeExibicao(hashIdResgate)
              self.removerDaListaDeSelecionados(hashIdResgate)

              self.ref.detectChanges()

              let msg = "O resgate foi liquidado com sucesso";
              self.bnAlertsService.criarAlerta("info", "Sucesso", msg, 5)

            } else {
              console.log("Nao inseriu no bd");

              self.registrarExibicaoEventos()
              self.resgatesParaLiquidar = []

              self.ref.detectChanges()

              let msg = " resgates não foram liquidados.";
              this.bnAlertsService.criarAlerta("error", "Erro", msg, 5);
            }
          },
          error => {
            console.log("Erro inserir no bd");
          })
      }, function (error) {
        console.log("Erro ao Liquidar o resgate");
      })
    }

  }

  removerDaListaDeExibicao(hashID: string) {
    for (var i = 0; i < this.resgates.length; i++) {
      if (this.resgates[i].hashID === hashID) {
        this.resgates.splice(this.resgates.indexOf(this.resgates[i]), 1)
      }
    }
  }

  removerDaListaDeSelecionados(hashID) {
    this.resgatesParaLiquidar.splice(this.resgatesParaLiquidar.indexOf(hashID), 1)
    this.isActive.fill(false)
  }

}
