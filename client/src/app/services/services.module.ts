import { NgModule, ModuleWithProviders } from '@angular/core';
import { DataService, PromptUpdateService, TransformService } from './index';

@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
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
        // StorageService,
        PromptUpdateService,
        TransformService
      ]
    };
  }
}
