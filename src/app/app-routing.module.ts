import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent } from './components/menues/menu/menu.component';
import { FooterComponent } from './components/menues/footer/footer.component';
import { LogeoComponent } from './components/acceder/logeo/logeo.component';
import { PortadaComponent } from './components/menues/portada/portada.component';
import { DesconectarComponent } from './components/acceder/logeo/desconectar.component';

const routes : Routes = [
  { path: '', component: MenuComponent, outlet: 'menus' },
  { path: '', component: FooterComponent, outlet: 'footer' },
  { path: 'login', component: LogeoComponent},
  { path: '', component: PortadaComponent},
  { path: 'portada', component: PortadaComponent},
  { path: 'menuFooter/:dato', component: FooterComponent, outlet: 'footer'},
  { path: 'menuRol/:dato', component: MenuComponent, outlet:'menus'},
  { path: 'desconectar', component: DesconectarComponent},
  
  { path: 'menuss', loadChildren: () => import('./components/g-menus/g-menus.module').then(m => m.GMenusModule) },
  { path: 'procesos', loadChildren: () => import('./components/g-procesos/g-procesos.module').then(m => m.GProcesosModule) },
  { path: 'roles', loadChildren: () => import('./components/g-roles/g-roles.module').then(m => m.GRolesModule) },
  { path: 'clientes', loadChildren: () => import('./components/g-clientes/g-clientes.module').then(m => m.GClientesModule) },
  { path: 'compras', loadChildren: () => import('./components/g-compras/g-compras.module').then(m => m.GComprasModule) },
  { path: 'corrales', loadChildren: () => import('./components/g-corrales/g-corrales.module').then(m => m.GCorralesModule) },
  { path: 'guiasenasag', loadChildren: () => import('./components/g-guiasenasag/g-guiasenasag.module').then(m => m.GGuiasenasagModule) },
  { path: 'animales', loadChildren: () => import('./components/g-animales/g-animales.module').then(m => m.GAnimalesModule) },
  { path: 'camara', loadChildren: () => import('./components/g-camara/g-camara.module').then(m => m.GCamaraModule) },
  { path: 'razas', loadChildren: () => import('./components/g-razas/g-razas.module').then(m => m.GRazasModule) },
  { path: 'granjas', loadChildren: () => import('./components/g-granjas/g-granjas.module').then(m => m.GGranjasModule) },
  { path: 'tiposervicios', loadChildren: () => import('./components/g-tiposervicios/g-tiposervicios.module').then(m => m.GTiposerviciosModule) },
  { path: 'serviciofaena', loadChildren: () => import('./components/g-serviciofaena/g-serviciofaena.module').then(m => m.GServiciofaenaModule) },
  { path: 'personas', loadChildren: () => import('./components/g-personas/g-personas.module').then(m => m.GPersonasModule) },
  { path: 'prodcarnicos', loadChildren: () => import('./components/g-prodcarnicos/g-prodcarnicos.module').then(m => m.GProdcarnicosModule) },
  { path: 'tipoprodcarnico', loadChildren: () => import('./components/g-tipoprodcarnico/g-tipoprodcarnico.module').then(m => m.GTipoprodcarnicoModule) },
  { path: 'entregaprodc', loadChildren: () => import('./components/g-entregaprodc/g-entregaprodc.module').then(m => m.GEntregaprodcModule) },
  { path: 'reporguia', loadChildren: () => import('./components/g-reporguia/g-reporguia.module').then(m => m.GReporguiaModule) },
  { path: 'reporserfae', loadChildren: () => import('./components/g-reporserfae/g-reporserfae.module').then(m => m.GReporserfaeModule) },
  { path: 'ventas', loadChildren: () => import('./components/g-ventas/g-ventas.module').then(m => m.GVentasModule) },
  { path: 'reporven', loadChildren: () => import('./components/g-reporven/g-reporven.module').then(m => m.GReporvenModule) },
  { path: 'reporani', loadChildren: () => import('./components/g-reporani/g-reporani.module').then(m => m.GReporaniModule) },
  { path: 'asigmepro', loadChildren: () => import('./components/g-asigmepro/g-asigmepro.module').then(m => m.GAsigmeproModule) },
  { path: 'asigrolusu', loadChildren: () => import('./components/g-asigrolusu/g-asigrolusu.module').then(m => m.GAsigrolusuModule) },
  { path: 'asigrolme', loadChildren: () => import('./components/g-asigrolme/g-asigrolme.module').then(m => m.GAsigrolmeModule) },
  { path: 'reporcom', loadChildren: () => import('./components/g-reporcom/g-reporcom.module').then(m => m.GReporcomModule) },
  { path: 'reporserfaani', loadChildren: () => import('./components/g-reporserfaani/g-reporserfaani.module').then(m => m.GReporserfaaniModule) },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
