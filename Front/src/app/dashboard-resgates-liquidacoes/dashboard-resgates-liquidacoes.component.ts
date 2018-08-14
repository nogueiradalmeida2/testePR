declare var google: any;

import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DashboardResgatesLiquidacoes } from './DashboardResgatesLiquidacoes';
import { Web3Service } from './../Web3Service';
import { PessoaJuridicaService } from '../pessoa-juridica.service';

import { BnAlertsService } from 'bndes-ux4';

import { LiquidacaoResgate } from '../liquidacao-resgate/liquidacao-resgate'
import { Resgate } from '../resgate/Resgate'

@Component({
  selector: 'app-dashboard-resgates-liquidacoes',
  templateUrl: './dashboard-resgates-liquidacoes.component.html',
  styleUrls: ['./dashboard-resgates-liquidacoes.component.css']
})
export class DashboardResgatesLiquidacoesComponent implements OnInit {

  public pieChartData: any = {
    chartType: 'PieChart',
    dataTable: [
      ['tipo', 'valores'],
      ['Solicitação de Resgate', 0],
      ['Liquidação de Resgate', 0]
    ],
    options: { 'title': 'Tipos de Transações' },
  };

  public barChartData: any = {
    chartType: 'Bar',
    data: {},
    dataTable: [
      ['Tipo', 'Volume'],
      ['Solicitação Resgate', 0],
      ['Liquidação Resgate', 0]
    ]
  };

  public contadorLiberacao: number;
  public contadorResgate: number;
  public contadorTransferencia: number;
  public contadorLiquidacao: number;

  public volumeLiberacao: number;
  public volumeResgate: number;
  public volumeTransferencia: number;
  public volumeLiquidacao: number;

  listaResgates: DashboardResgatesLiquidacoes[] = undefined;
  p: number = 1;
  order: string = 'dataHora';
  reverse: boolean = true

  razaoSocialBNDES: string = "Banco Nacional De Desenvolvimento Econômico E Social";

  @ViewChild('pieChart') pieChart;
  @ViewChild('barChart') barChart;

  constructor(private pessoaJuridicaService: PessoaJuridicaService, protected bnAlertsService: BnAlertsService,
    private web3Service: Web3Service, private ref: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
    this.contadorResgate = 0;
    this.contadorLiquidacao = 0;

    this.volumeResgate = 0;
    this.volumeLiquidacao = 0;

    setTimeout(() => {
      this.listaResgates = []

      this.recuperaEventosResgates();
      this.recuperaEventosLiquidacoes();
    }, 1500)

  }

  atualizaGrafico() {
    if (this.pieChart != undefined && this.barChart != undefined) {
      if (this.pieChart.wrapper != undefined && this.barChart != undefined) {
        let pieDataTable = this.pieChart.wrapper.getDataTable();
        let barDataTable = this.barChart.wrapper.getDataTable();

        pieDataTable.setValue(0, 1, this.contadorResgate)
        pieDataTable.setValue(1, 1, this.contadorLiquidacao)

        barDataTable.setValue(0, 1, this.volumeResgate)
        barDataTable.setValue(1, 1, this.volumeLiquidacao)

        this.pieChart.redraw();
        this.barChart.redraw();
      }
    }
  }

  recuperaEventosResgates() {

    let self = this;

    this.web3Service.registraEventosResgate(function (error, event) {
      if (!error) {

        self.pessoaJuridicaService.buscaResgateNaoLiquidadoPorHash(event.transactionHash).subscribe(
          data => {
            console.log("Encontrou algum dado")

            let resgate = new Resgate()

            if (data) {
              console.log("Algum resgate foi encontrado.")
              resgate.cnpjOrigem = data.cnpjOrigem
              resgate.razaoSocialOrigem = data.razaoSocialOrigem
              resgate.bancoOrigem = data.bancoOrigem
              resgate.agenciaOrigem = data.agenciaOrigem
              resgate.contaCorrenteOrigem = data.contaCorrenteOrigem
              resgate.contaBlockchainOrigem = data.contaBlockchainOrigem
              resgate.valor = self.web3Service.converteInteiroParaDecimal(parseInt(event.args.valor))
              resgate.hashID = data.hashOperacao
              resgate.isLiquidado = data.isLiquidado

              let status;
              if (resgate.isLiquidado) {
                status = "Liquidado"
              } else {
                status = "Não Liquidado"
              }

              let valorResgatado = self.web3Service.converteInteiroParaDecimal(event.args.valor);

              let resgateDash: DashboardResgatesLiquidacoes;
              resgateDash = {
                deCnpj: event.args.cnpj, razaoSocialOrigem: resgate.razaoSocialOrigem, paraCnpj: "BNDES",
                razaoSocialDestino: self.razaoSocialBNDES, valor: valorResgatado, tipo: "Resgate",
                status: status, hashID: event.transactionHash, dataHora: null
              };



              self.contadorResgate++;
              self.volumeResgate += (valorResgatado);

              self.pieChartData.dataTable[1][1] = self.contadorResgate;
              self.barChartData.dataTable[1][1] = self.volumeResgate;

              self.atualizaGrafico()

              self.web3Service.getBlockTimestamp(event.blockHash,
                function (error, result) {
                  if (!error) {
                    resgateDash.dataHora = new Date(result.timestamp * 1000);
                    self.ref.detectChanges();
                  } else {
                    console.log("Erro ao recuperar data e hora do bloco");
                    console.error(error);
                  }
                });

              // Colocar dentro da zona do Angular para ter a atualização de forma correta
              self.zone.run(() => {
                self.listaResgates.push(resgateDash);
              });

              console.log("inseriu resg " + resgateDash.hashID);
              console.log("contador resg " + self.contadorResgate);
              console.log("volume resg " + self.volumeResgate);

              self.ref.detectChanges();

            } else {
              console.log("Nenhum resgate foi encontrado.")
            }
          }, error => {
            console.log("Não foi possível encontrar os resgates")
          })
      } else {
        console.log("Erro no registro de eventos de resgate");
        console.log(error);
      }

    });
  }

  recuperaEventosLiquidacoes() {

    let self = this;

    this.web3Service.registraEventosLiquidacaoResgate(function (error, event) {
      if (!error) {

        let eventoLiquidacao = event
        let resgate: LiquidacaoResgate

        self.pessoaJuridicaService.buscaLiquidacaoResgatePorHash(eventoLiquidacao.transactionHash).subscribe(
          data => {
            console.log("Encontrou algum dado")

            resgate = new LiquidacaoResgate()
            let valorResgate

            if (data) {
              console.log("Alguma empresa encontrada.")

              self.web3Service.registraEventosResgate(function (error, result) {
                if (!error && data.hashOperacao === result.transactionHash) {

                  valorResgate = self.web3Service.converteInteiroParaDecimal(parseInt(result.args.valor))

                  console.log("resgate.valorResgate=" + valorResgate);

                  let status;
                  if (data.isLiquidado) {
                    status = "Liquidado"
                  } else {
                    status = "Não Liquidado"
                  }

                  let liquidacao: DashboardResgatesLiquidacoes;
                  liquidacao = {
                    deCnpj: "BNDES", 
                    razaoSocialOrigem: self.razaoSocialBNDES, 
                    paraCnpj: data.cnpjOrigem,
                    razaoSocialDestino: data.razaoSocialOrigem, 
                    valor: valorResgate, 
                    tipo: "Liquidação Resgate",
                    status: status, 
                    hashID: event.transactionHash, 
                    dataHora: null
                  };


                  self.contadorLiquidacao++;

                  self.web3Service.getBlockTimestamp(event.blockHash,
                    function (error, result) {
                      if (!error) {
                        liquidacao.dataHora = new Date(result.timestamp * 1000);
                        self.ref.detectChanges();
                      } else {
                        console.log("Erro ao recuperar data e hora do bloco");
                        console.error(error);
                      }
                    });

                  // Colocar dentro da zona do Angular para ter a atualização de forma correta
                  self.zone.run(() => {
                    self.listaResgates.push(liquidacao);
                  });

                  self.volumeLiquidacao += 1 * valorResgate;
                  console.log("self.volumeLiquidacao=" + self.volumeLiquidacao);

                  self.pieChartData.dataTable[2][1] = self.contadorLiquidacao;
                  self.barChartData.dataTable[2][1] = self.volumeLiquidacao;
                  self.ref.detectChanges();
                } else {
                  console.log("Erro ao recuperar os registro de evento resgates")
                }
              });

            } else {
              console.log("Nenhuma empresa encontrada.")
              resgate.razaoSocial = ""
              resgate.banco = 0
              resgate.agencia = 0
              resgate.contaCorrente = 0
              resgate.contaBlockchain = ""
              resgate.hashID = ""
            }

            console.log(resgate)
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
        console.log("Não foi possível recuperar os resgates")
      }
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    this.ref.detectChanges();
  }

  customComparator(itemA, itemB) {
    return itemB - itemA;
  }

}
