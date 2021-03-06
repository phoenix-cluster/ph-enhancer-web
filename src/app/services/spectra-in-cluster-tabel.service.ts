import {Injectable} from "@angular/core";
import {SpectrumInCluster} from "../model/spectrum-in-cluster";
import {Headers, Http} from "@angular/http";
import {environment} from "../../environments/environment";
import {LocalStorageService} from "./local-storage.service";
import {ConfigService} from "../services/config.service";

// import 'rxjs/add/operator/toPromise';

@Injectable()

export class SpectraInClusterTableService {


    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private configService: ConfigService) {
    }

    getSpectra(titlesStr: string): Promise<SpectrumInCluster[]> {
        return    this.configService.getConfig().then((configJson) => {
                let spectraUrl = configJson.baseUrl.concat("spectrumInCluster/titles/", encodeURIComponent(titlesStr));
                let spectraInCluster = this.localStorageService.getData("spec_cluster" + titlesStr);
                if (spectraInCluster != null) {
                    return new Promise(resolve => resolve(spectraInCluster));
                } else {
                    return this.http.get(spectraUrl)
                        .toPromise()
                        .then(response => {
                            let spectra: SpectrumInCluster[] = response.json() as SpectrumInCluster[];
                            try {
                                this.localStorageService.setData("spec_cluster" + titlesStr, spectra);
                            } catch (e) {
                                localStorage.clear();
                                this.localStorageService.setData("spec_cluster" + titlesStr, spectra);
                            }
                            return spectra;
                        })
                        .catch(this.handleError);
                }
            });
    }

    // getSpectraTitleList(listLen: number): Promise<string[]> {
    //     return this.http.get(this.spectraTitleListUrl)
    //         .toPromise()
    //         .then(response => {
    //             let strs: string[] = response.json().data as string[];
    //             console.log(strs.slice(0, listLen));
    //             return strs.slice(0, listLen)
    //         })
    //         .catch(this.handleError);
    // }

    getSpectrumInCluster(titleStr: string): Promise<SpectrumInCluster> {
            let spectrumInCluster = this.localStorageService.getData("spec_cluster" + titleStr);
            if (spectrumInCluster != null) {
                return new Promise(resolve => resolve(spectrumInCluster));
            } else {
                return this.configService.getConfig().then((configJson) => {
                        let spectrumInClusterUrl = configJson.baseUrl.concat("spectrumInCluster/", encodeURIComponent(titleStr));
                        return this.http.get(spectrumInClusterUrl)
                        .toPromise()
                        .then(response => {
                            let spectrum: SpectrumInCluster = response.json() as SpectrumInCluster;
                            try {
                                this.localStorageService.setData("spec_cluster" + titleStr, spectrum);
                            } catch (e) {
                                localStorage.clear();
                                this.localStorageService.setData("spec_cluster" + titleStr, spectrum);
                            }
                        return spectrum;
                        })
                        .catch(this.handleError);
                    });
            }
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
