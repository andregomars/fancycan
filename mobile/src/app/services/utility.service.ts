import { Injectable } from "@angular/core";
import { DefaultUrlSerializer, ParamMap, UrlTree, PRIMARY_OUTLET, UrlSegment } from "@angular/router";

import { DeviceType } from "tns-core-modules/ui/enums";
import { device } from "tns-core-modules/platform";
import { getString } from "tns-core-modules/application-settings";

// From https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression/201378#201378
const regex: any = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

@Injectable()
export class UtilityService {
    constructor(
        private urlSerializer: DefaultUrlSerializer
    ) {}

    isValidEmail(email: String) {
        if (!email)
            return false;

        return regex.test(email);
    }

    isTablet() {
        return device.deviceType === DeviceType.Tablet;
    }

    buildVehicleStateSpnList(vehicleState: any, spnProfileList: any[]): any[] {
        const spns = [];
        for (const key in vehicleState) {
            if (key.startsWith('spn')) {
                const spn = key.substring(3).trim();
                const spnProfile = spnProfileList.find(profile => profile.SPNNo === +spn);
                if (spnProfile) {
                    spns.push({
                        spn: spn,
                        name: spnProfile.SPNName,
                        value: vehicleState[key],
                        unit: spnProfile.Unit
                    });
                }
            }
        }

        return spns;
    }

    getVehicleCodes(): string[] {
        return this.getFromCache('vehicleCodes');
    }

    getSpnProfile(): string[] {
        return this.getFromCache('spnProfile');
    }

    getUrlQueryParams(url: string): ParamMap {
        const urlTree = this.getUrlTree(url);
        return urlTree.queryParamMap;
    }

    getUrlPrimarySegments(url: string): UrlSegment[] {
        const urlTree = this.getUrlTree(url);
        let segments = [];
        if (urlTree.root && urlTree.root.children) {
            const primaryGroup = urlTree.root.children[PRIMARY_OUTLET];
            if (primaryGroup) {
                segments = primaryGroup.segments;
            }
        }
        return segments;
    }
    

    private getUrlTree(url: string): UrlTree {
        if (!url) {
            return null;
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
            url = url.replace('http://', '').replace('https://', '');
        }

        return this.urlSerializer.parse(unescape(url));
    }

    private getFromCache(key: string): any {
    	return JSON.parse(getString(key));
    }
}
