import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { UtilityService } from '~/app/services/utility.service';
import { BehaviorSubject } from 'rxjs';
import { Vehicle, defaultVehicle } from '~/app/models/vehicle';

@Component({
  selector: 'app-vehicle-setting',
  templateUrl: './vehicle-setting.component.html',
  styleUrls: ['./vehicle-setting.component.css'],
  moduleId: module.id,
})
export class VehicleSettingComponent implements OnInit, OnDestroy {
  scanDialogTitle = 'Scan Result';
  conditionOpts = ['Please Select', 'Fair', 'Good', 'Very Good', 'Excellent'];
  defaultFCode = '6005';
  vcodes: string[];
  vehicle: Vehicle;
  isIgnored = true;

  sourceText: string;
  vehicle$: BehaviorSubject<Vehicle>;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private utilityService: UtilityService
  ) {

  }

  onScanTest() {
    const url = 'https://app.fancycan.com/vehicle/panel/6001?ports=60011,60012'
    const paramMap = this.utilityService.getUrlQueryParams(url);
    const segments = this.utilityService.getUrlPrimarySegments(url);
    const vcode = segments && segments.length > 0 ? segments[segments.length - 1].path : '';
    this.vehicle$.next({
      vcode: vcode,
      vin: '',
      identifier: paramMap.get('ports'),
      picture: ''
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
    this.vehicle$ = new BehaviorSubject<Vehicle>({...defaultVehicle});
  }

  ngOnDestroy() {
    this.vehicle$.unsubscribe();
  }

  onTapSubmit() {
      alert({
        title: 'Vehicle Setting',
        message: 'Vehicle is added!',
        okButtonText: 'OK'
      })
      this.clearVehicleSetting();
  }

  private parseScanText(format: string, text: string) {
    const paramMap = this.utilityService.getUrlQueryParams(text);
    const segments = this.utilityService.getUrlPrimarySegments(text);
    const vcode = segments && segments.length > 0 ? segments[segments.length - 1].path : '';
    if (paramMap && segments) {
      this.vehicle$.next({
        vcode: vcode,
        vin: '',
        identifier: paramMap.get('ports'),
        picture: ''
      })
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

  private clearVehicleSetting() {
    this.vehicle$.next({...defaultVehicle});
  }
}

