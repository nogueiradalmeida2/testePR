export class PessoaJuridica {
  id: number;
  razaoSocial: string;
  cnpj: string;
  dadosBancarios: {
    banco: number;
    agencia: number;
    contaCorrente: string;
  }
  contaBlockchain: string;
}
