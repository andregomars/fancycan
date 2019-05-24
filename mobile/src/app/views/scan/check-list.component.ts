import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UtilityService } from '~/app/services/utility.service';
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
      alert({
        title: "You Scanned ",
        message: "Format: " + result.format + ",\nContent: " + result.text,
        okButtonText: "OK"
      });
    }, (errorMessage) => {
      console.log("Error when scanning " + errorMessage);
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
