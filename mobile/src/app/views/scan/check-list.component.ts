import { Component, OnInit } from '@angular/core';
// import { BarcodeScanner } from "nativescript-barcodescanner";

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
  moduleId: module.id,
})
export class CheckListComponent implements OnInit {
  constructor(
    // private barcodeScanner: BarcodeScanner
  ) {

  }

  onScan() {
    // this.barcodeScanner.scan({
    //   formats: "QR_CODE, EAN_13",
    //   showFlipCameraButton: true,
    //   preferFrontCamera: false,
    //   showTorchButton: true,
    //   beepOnScan: true,
    //   torchOn: false,
    //   resultDisplayDuration: 500,
    //   orientation: undefined,
    //   openSettingsIfPermissionWasPreviouslyDenied: true //ios only 
    // }).then((result) => {
    //   alert({
    //     title: "You Scanned ",
    //     message: "Format: " + result.format + ",\nContent: " + result.text,
    //     okButtonText: "OK"
    //   });
    // }, (errorMessage) => {
    //   console.log("Error when scanning " + errorMessage);
    // }
    // );
  }

  ngOnInit() {
  }

}
