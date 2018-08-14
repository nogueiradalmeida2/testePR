import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {path: 'login', component: BnTelaLoginComponent},
  {path: 'busca', component: BuscaResultadosComponent , canActivate: [AuthenticationGuard]},
  {path: 'regulamento/:tipo/:id', component: RegulamentoComponent, canActivate: [AuthenticationGuard]},
  {path: '**', component: PaginaNaoEncontradaComponent, canActivate: [AuthenticationGuard]}
];

export const rotas= RouterModule.forRoot(appRoutes);
