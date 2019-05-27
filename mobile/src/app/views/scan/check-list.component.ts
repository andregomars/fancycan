import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UtilityService } from '~/app/services/utility.service';
import { BehaviorSubject } from 'rxjs';
import { Checklist, defaultChecklist } from '~/app/models/checklist';
// import { BarcodeScannerService as BarcodeScanner } from "../../services/barcode-scanner.service";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  moduleId: module.id,
})
export class CheckListComponent implements OnInit, OnDestroy {
  scanDialogTitle = 'Scan Result';
  vcodes: string[];
  sourceText: string;
  checkLog$: BehaviorSubject<Checklist>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private utilityService: UtilityService
  ) {

  }

  onScanTest() {
    const url = 'https://app.fancycan.com/fleet/checklist/BYD?item=tire2&loc=rear%20left';
    const paramMap = this.utilityService.getUrlParams(url);
    this.checkLog$.next({
      vcode: this.checkLog$.getValue().vcode,
      item: paramMap.get('item'),
      location: paramMap.get('loc'),
      type: '',
      value: '',
      condition: ''
    })
  }

  onScan() {
    this.barcodeScanner.scan({
      formats: 'QR_CODE, EAN_13',
      showFlipCameraButton: true,
      preferFrontCamera: false,
      showTorchButton: true,
      beepOnScan: true,
      torchOn: false,
      resultDisplayDuration: 500,
      orientation: undefined,
      openSettingsIfPermissionWasPreviouslyDenied: true //ios only 
    }).then(
      (result) => {
        this.parseScanText(result.format, result.text);
      }, 
      (errorMessage) => {
        this.popScanAlert(errorMessage);
      }
    );
  }

  ngOnInit() {
    this.vcodes = this.utilityService.getVehicleCodes();
    this.checkLog$ = new BehaviorSubject<Checklist>({...defaultChecklist});
  }

  ngOnDestroy() {
    this.checkLog$.unsubscribe();
  }

  onPropertyCommitted($event: any) {
    // console.log($event.propertyName);
  }

  onTapSubmit() {
      alert({
        title: 'Checklist',
        message: 'Submitted successfully!',
        okButtonText: 'OK'
      })
      this.clearChecklist();
  }

  private parseScanText(format: string, text: string) {
    const paramMap = this.utilityService.getUrlParams(text);
    if (paramMap && paramMap.keys && paramMap.keys.length > 0) {
      this.checkLog$.next({
        vcode: this.checkLog$.getValue().vcode,
        item: paramMap.get('item'),
        location: paramMap.get('loc'),
        type: '',
        value: '',
        condition: ''
      });
    } else {
      const message = `Your scanned ${format} content is invalid. \n ${text}.`;
      this.popScanAlert(message);
    }
  }

  private popScanAlert(message: string) {
      alert({
        title: this.scanDialogTitle, 
        message: message,
        okButtonText: 'OK'
      })
  }

  private clearChecklist() {
    this.checkLog$.next({...defaultChecklist});
  }
}

