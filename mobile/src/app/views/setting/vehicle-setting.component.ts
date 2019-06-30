import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarcodeScanner } from "nativescript-barcodescanner";
import { BehaviorSubject } from 'rxjs';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { takePicture, requestPermissions, isAvailable } from "nativescript-camera";

import { Vehicle, defaultVehicle } from '~/app/models/vehicle';
import { UtilityService } from '~/app/services/utility.service';

@Component({
  selector: 'app-vehicle-setting',
  templateUrl: './vehicle-setting.component.html',
  styleUrls: ['./vehicle-setting.component.css'],
  moduleId: module.id,
})
export class VehicleSettingComponent implements OnInit, OnDestroy {
  scanDialogTitle = 'Scan Result';
  cameraDialogTitle = 'Camera Result';
  conditionOpts = ['Please Select', 'Fair', 'Good', 'Very Good', 'Excellent'];
  defaultFCode = '6005';
  vcodes: string[];
  vehicle: Vehicle;
  isIgnored = true;

  sourceText: string;
  vehicle$: BehaviorSubject<Vehicle>;

  imageTaken: ImageAsset;
  saveToGallery: boolean = true;
  keepAspectRatio: boolean = true;
  width: number = 300;
  height: number = 300;

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
        this.popAlert(this.scanDialogTitle, errorMessage);
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

  onTapRemovePhoto() {
      this.imageTaken = null;
  }

  onTapResetSetting() {
      alert({
        title: 'Vehicle Setting',
        message: 'Current setting is cleared!',
        okButtonText: 'OK'
      })
      this.imageTaken = null;
      this.clearVehicleSetting();
  }
  
  // >> camera-module-photo-code
  onTakePhoto() {
    if(!isAvailable()) {
      this.popAlert(this.cameraDialogTitle, 'Camera is not allowed on this device!');
      return;
    }

    let options = {
        width: this.width,
        height: this.height,
        keepAspectRatio: this.keepAspectRatio,
        saveToGallery: this.saveToGallery
    };

    requestPermissions()
      .then((isAllowed: boolean) => {
        takePicture(options)
          .then(imageAsset => {
              this.imageTaken = imageAsset;
              console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
          }).catch(err => {
              console.log(err.message);
          });
        });
      }
  // << camera-module-photo-code

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
      this.popAlert(this.scanDialogTitle, message);
    }
  }

  private popAlert(title: string, message: string) {
      alert({
        title: title, 
        message: message,
        okButtonText: 'OK'
      })
  }

  private clearVehicleSetting() {
    this.vehicle$.next({...defaultVehicle});
  }
}
