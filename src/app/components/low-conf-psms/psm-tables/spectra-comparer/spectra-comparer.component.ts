import {Component, Input, OnChanges, OnInit} from '@angular/core';

import jQuery from 'jquery';
import $ from 'jquery';

import "../../../../assets/js/lorikeet/specview.js";
import "../../../../assets/js/lorikeet/jquery.flot.js";
import "../../../../assets/js/lorikeet/jquery.flot.selection.js";
import "../../../../assets/js/lorikeet/peptide.js";
import "../../../../assets/js/lorikeet/aminoacid.js";
import "../../../../assets/js/lorikeet/ion.js";
import {Psm} from "../../../../models/psm";
import {ClusterService} from "../../../../services/cluster.service";
import {Spectrum} from "../../../../models/spectrum";
import {Cluster} from "../../../../models/cluster";

@Component({
    selector: 'app-spectra-comparer',
    templateUrl: './spectra-comparer.component.html',
    providers: [Cluster],
    styleUrls: ['./spectra-comparer.component.scss']

})
export class SpectraComparerComponent implements OnChanges{
    @Input() currentPsm:Psm;
    @Input() spectrum:Spectrum;
    private currentClusterId;
    private currentCluster:Cluster;
    private currentSpectrumTitle:string;

    private psm_sequence:string;
    private psm_varMods:any[];
    private psm_ntermMod:number;
    private psm_peaks:any[];
    private psm_charge:number;
    private psm_title:string;
    private psm_precursorMz:number;

    private cluster_peaks:any[];

    constructor(private clusterService: ClusterService) {
        this.psm_varMods = [];
    }


    ngOnChanges() {
        this.currentClusterId = this.currentPsm.clusterId;
        this.currentSpectrumTitle = this.spectrum.title;
        this.resetDataAndRefresh();
    }

    private resetDataAndRefresh():void{

        // this.spectrumTableService.getSpectrum(this.currentPsmTitle).
        // then(spectrum =>{this.currentPsm = spectrum});

        this.psm_sequence = this.currentPsm.peptideSequence;
        // modification index = 14; modification mass = 16.0; modified residue = 'M'
        this.psm_varMods[0] = {index: 14, modMass: 16.0, aminoAcid: 'M'};
        // mass to be added to the N-terminus
        //todo: do we need to add this?
        // this.psm_ntermMod = 164.07;
        this.psm_charge= this.spectrum.charge;
        this.psm_title = this.spectrum.title;

        // peaks in the scan: [m/z, intensity] pairs.
        this.psm_peaks = this.getPsmPeaks(this.spectrum);
        this.getClusterAndRefresh();
    }

    private refreshViewer():void{
        var specviewer = document.getElementById("lorikeet");
        while (specviewer.firstChild) {
            specviewer.removeChild(specviewer.firstChild);
        }

        $("#lorikeet").specview({
            sequence: this.psm_sequence,
            // scanNum: 2441,
            charge: this.psm_charge,
            precursorMz: this.psm_precursorMz,
            fileName: this.psm_title,
            //staticMods: staticMods,
            variableMods: this.psm_varMods,
            ntermMod: this.psm_ntermMod,
            //ctermMod: ctermMod,
            peaks: this.psm_peaks,
            peaks2: this.cluster_peaks
        });
    }

    private getClusterAndRefresh(){
        this.clusterService.getACluster(this.currentClusterId).then(cluster => {
            this.currentCluster = cluster;
            console.log(this.currentCluster);
            console.log(this.spectrum);
            this.cluster_peaks = this.getClusterPeaks(this.currentCluster);
            this.refreshViewer();
        }).catch(this.handleError);
    }

    private getClusterPeaks(cluster:Cluster) :any[]{
        let mzArray = cluster.consensusMz;
        let intensArray = cluster.consensusIntens;

        if(mzArray.length != intensArray.length) {
            console.error("Error, the length of mzArray and intensArray is diffrent");
        }

        let clusterPeaks = [];
        for(var i=0; i<mzArray.length; i++) {
            let apeak = [mzArray[i], intensArray[i]];
            clusterPeaks.push(apeak)
        }
        console.log(clusterPeaks);
        return clusterPeaks;
    }

    private handleError(error: any): void {
        console.log('A error occurred', error);
    }

    private getPsmPeaks(spectrum: Spectrum):any[] {
        let mzArray = spectrum.peaklistMz;
        let intensArray = spectrum.peaklistIntens;

        if(mzArray == null){
            return null;
        }
        if(mzArray.length != intensArray.length) {
            console.error("Error, the length of mzArray and intensArray is diffrent");
        }

        let peaks = [];
        for(var i=0; i<mzArray.length; i++) {
            let apeak = [mzArray[i], intensArray[i]];
            peaks.push(apeak)
        }
        return peaks;
    }
}