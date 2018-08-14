import { TestBed, inject } from '@angular/core/testing';

import { PessoaJuridicaService } from './pessoa-juridica.service';

describe('PessoaJuridicaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PessoaJuridicaService]
    });
  });

  it('should be created', inject([PessoaJuridicaService], (service: PessoaJuridicaService) => {
    expect(service).toBeTruthy();
  }));
});
