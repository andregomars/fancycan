import { NgModule, ModuleWithProviders } from '@angular/core';

import { DataService, StorageService, PromptUpdateService } from './index';


@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
    DataService,
    StorageService,
    PromptUpdateService
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        DataService,
        StorageService,
        PromptUpdateService
      ]
    };
  }
}
