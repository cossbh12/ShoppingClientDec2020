import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PollingComponent } from './components/polling/polling.component';
import { SyncComponent } from './components/sync/sync.component';
import { WebsocketsComponent } from './components/websockets/websockets.component';

const routes: Routes = [
  {
    path: 'sync',
    component: SyncComponent
  },
  {
    path: 'async',
    component: PollingComponent
  },
  {
    path: 'websockets',
    component: WebsocketsComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
