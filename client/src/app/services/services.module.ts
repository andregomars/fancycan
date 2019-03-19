import { NgModule, ModuleWithProviders } from '@angular/core';
import { TransformUtility } from 'fancycan-utility';
import { DataService, PromptUpdateService, TransformService } from './index';

@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
    TransformUtility,
    DataService,
    // StorageService,
    PromptUpdateService,
    TransformService
  ]
})
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        DataService,
        TransformUtility,
        // StorageService,
        PromptUpdateService,
        TransformService
      ]
    };
  }
}
