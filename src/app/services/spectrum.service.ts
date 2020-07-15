import {Injectable} from "@angular/core";
import {SpectrumInCluster} from "../model/spectrum-in-cluster";
import {Headers, Http} from "@angular/http";
import {Spectrum} from "../model/spectrum";
import {LocalStorageService} from "./local-storage.service";
// import { environment } from '../../environments/environment';
import {ConfigService} from "../services/config.service";
// import 'rxjs/add/operator/toPromise';

@Injectable()

export class SpectrumService {

    private headers = new Headers({'Content-type': 'application/json'});

    constructor(private http: Http,
                private localStorageService: LocalStorageService,
                private configService: ConfigService) {
    }

    public getSpectra(titlesStr: string): Promise<Spectrum[]> {
        return    this.configService.getConfig().then((configJson) => {
            let spectraUrl = configJson.baseUrl.concat("spectrum/titles/", encodeURIComponent(titlesStr));
                   // console.log(spectraUrl);
            let spectra = this.localStorageService.getData("spectra_" + titlesStr);
            if(spectra != null && spectra.length > 0) {
                // console.log(spectra);
                return new Promise(resolve => resolve(spectra));
            }else {
                return this.http.get(spectraUrl)
                    .toPromise()
                    .then(response => {
                        let spectra: Spectrum[] = response.json() as Spectrum[];
                        // console.log(spectra);
                        this.localStorageService.setData("spectra_" +titlesStr, spectra);
                        return spectra
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
        return    this.configService.getConfig().then((configJson) => {
            let spectrumInClusterUrl = configJson.baseUrl.concat("spectrum/", encodeURIComponent(titleStr));
            let spectrum = this.localStorageService.getData("spectrum_" + titleStr);
            if(spectrum != null) {
                return new Promise(resolve => resolve(spectrum));
            }else {
                return this.http.get(spectrumInClusterUrl)
                    .toPromise()
                    .then(response => {
                        let spectrum:Spectrum = response.json().data as Spectrum;
                        this.localStorageService.setData("spectrum_" +titleStr, spectrum);
                        return spectrum;
                    })
                    .catch(this.handleError);
            }
        });
    }

    getPeptide(title : string) : Promise<string>{
        return    this.configService.getConfig().then((configJson) => {
            let peptideUrl = configJson.baseUrl.concat("spectrum/peptide/",encodeURIComponent(title));
            return this.http.get(peptideUrl)
                    .toPromise()
                    .then(response => {
                        let peptide : string = response.json().peptide_sequence;
                        return peptide;
                    }).catch(this.handleError);
        });
    }

    private handleError(error: any): Promise<any> {
        console.log('A error occurred', error);
        return Promise.reject(error.message || error);
    }


}
