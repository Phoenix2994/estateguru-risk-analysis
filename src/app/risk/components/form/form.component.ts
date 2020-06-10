import { Component, OnInit } from '@angular/core';
import { MlEngineService } from '../../services/ml-engine.service';
import { COUNTRIES } from '../../consts/countries';
import { SCHEDULES } from '../../consts/schedules';
import { LOANS } from '../../consts/loans';
import { COLLATERALS } from '../../consts/collaterals';
import { RANKINGS } from '../../consts/rankings';
import { STAGES } from '../../consts/stages';
import { SURETYSHIP } from '../../consts/suretyship';
import { Router } from '@angular/router';
import { REF } from '../../consts/refinancing';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(private mlEngineService: MlEngineService, private router: Router) { }

  countries = COUNTRIES
  schedules = SCHEDULES
  loans = LOANS
  collaterals = COLLATERALS
  rankings = RANKINGS
  stages = STAGES
  suretyship = SURETYSHIP
  refinancing = REF

  selectedCountry: number
  interestRate: number
  selectedSchedule: number
  selectedRef: number
  selectedStage: number
  selectedLoanType: number
  selectedCollateral: number
  selectedSurety: number
  ltv: number
  period: number
  fundedAmount: number
  colValue: number

  flagError = false
  flagFields = false
  flagRate = false
  flagPeriod = false
  flagLtv = false
  flagCol = false

  ngOnInit() {
  }

  evaluateInfo() {
    if (!(this.selectedCountry && this.interestRate && this.selectedSchedule && this.selectedRef && this.selectedLoanType && this.selectedCollateral &&
      this.ltv && this.period && this.colValue && this.selectedStage && this.selectedSurety)) {
      this.flagError = true
      this.flagFields = true
    } else if (this.interestRate < 7 || this.interestRate > 15) {
      this.flagError = true
      this.flagRate = true
    }
    else if (this.period < 1 || this.period > 24) {
      this.flagError = true
      this.flagPeriod = true
    }
    else if (this.ltv > 75 || this.ltv < 10) {
      this.flagError = true
      this.flagLtv = true
    }
    else if (this.colValue < 0) {
      this.flagError = true
      this.flagCol = true
    } else {
      this.router.navigate(['/risk/detail'], {
        queryParams: {
          estonia: this.selectedCountry === 1 ? 1 : 0, finland: this.selectedCountry === 2 ? 1 : 0,
          lithuania: this.selectedCountry === 3 ? 1 : 0, germany: this.selectedCountry === 4 ? 1 : 0,
          latvia: this.selectedCountry === 5 ? 1 : 0, spain: this.selectedCountry === 6 ? 1 : 0, portugal: 0, interestRate: this.interestRate,
          fullBullet: this.selectedSchedule === 1 ? 1 : 0, bullet: this.selectedSchedule === 2 ? 1 : 0, annuity: this.selectedSchedule === 3 ? 1 : 0,
          devLoan: this.selectedLoanType === 1 ? 1 : 0, bussLoan: this.selectedLoanType === 2 ? 1 : 0, bridgeLoan: this.selectedLoanType === 3 ? 1 : 0,
          land: this.selectedCollateral == 1 ? 1 : 0, residential: this.selectedCollateral == 2 ? 1 : 0, commercial: this.selectedCollateral == 3 ? 1 : 0,
          other: this.selectedCollateral == 4 ? 1 : 0,
          ltv: this.ltv, period: this.period, colValue: this.colValue, ref: this.selectedRef === 1 ? 0 : 1,
          stage: this.selectedStage == 1 ? 0 : 1, surety: this.selectedSurety == 1 ? 0 : 1
        }, skipLocationChange: true
      })
    }

  }

}
