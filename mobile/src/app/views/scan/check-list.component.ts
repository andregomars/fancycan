import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UtilityService } from '~/app/services/utility.service';
import { ParamMap } from '@angular/router';
// import { BarcodeScannerService as BarcodeScanner } from "../../services/barcode-scanner.service";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  moduleId: module.id,
})
export class CheckListComponent implements OnInit {
  vcodes: string[];
  sourceText: string;
  checkLog: CheckListFormEntity;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private utilityService: UtilityService
  ) {

  }

  onScanTest() {
    const url = 'https://app.fancycan.com/fleet/checklist/BYD?item=tire2&loc=rear%20left';
    const paramMap = this.utilityService.getUrlParams(url);
    console.log(paramMap);
  }

  onScan() {
    this.barcodeScanner.scan({
      formats: "QR_CODE, EAN_13",
      showFlipCameraButton: true,
      preferFrontCamera: false,
      showTorchButton: true,
      beepOnScan: true,
      torchOn: false,
      resultDisplayDuration: 500,
      orientation: undefined,
      openSettingsIfPermissionWasPreviouslyDenied: true //ios only 
    }).then((result) => {
      this.parseScanText(result.format, result.text);
    }, (errorMessage) => {
        alert({
          title: "Scan Fails",
          message: errorMessage,
          okButtonText: "OK"
        })
      }
    );
  }

  ngOnInit() {
    this.vcodes = this.utilityService.getVehicleCodes();
    this.checkLog = {
      vcode: '',
      item: '',
      location: '',
      type: '',
      value: '',
      condition: ''
    }
  }

  onPropertyCommitted($event: any) {
    this.sourceText = $event.object.source.toString();
    console.log(this.sourceText);
  }

  selectVehicle($event: any) {
    // console.log($event);
  }

  private parseScanText(format: string, text: string) {
    const paramMap = this.utilityService.getUrlParams(text);
    if (paramMap && paramMap.keys && paramMap.keys.length > 0) {
      this.checkLog.item = paramMap.get('item');
      this.checkLog.location = paramMap.get('loc')
    } else {
      const message = `Your scanned ${format} content is invalid. \n ${text}.`;
      alert({
        title: "Scan Fails",
        message: message,
        okButtonText: "OK"
      })
    }
  }
}

// title="https://app.fancycan.com/fleet/checklist/BYD?item=tire2&loc=rear%20left"
export interface CheckListFormEntity {
  vcode: string;
  item: string;
  location: string;
  type: string;
  value: string;
  condition: string;
}
