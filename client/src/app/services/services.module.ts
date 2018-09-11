import { NgModule, ModuleWithProviders } from '@angular/core';

import { DataService, StorageService } from './index';


@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
    DataService,
    StorageService
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        DataService,
        StorageService
      ]
    };
  }
}
