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
  results = [];
  colValue: number

  flagError = false
  flagFields = false
  flagRate = false
  flagPeriod = false
  flagLtv = false
  flagCol = false

  ngOnInit() {
    this.mlEngineService.catchFullRecordsFromFile()
    this.mlEngineService.catchDefaultRecordsFromFile()
    //this.test()
    //this.eval()
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

  go() {
    this.router.navigate(['/risk/detail'], {
      queryParams: {
        estonia: 0, finland: 0,
        lithuania: 0, germany: 0,
        latvia: 1, spain: 0, portugal: 0, interestRate: 13,
        fullBullet: 1, bullet: 0, annuity: 0,
        devLoan: 0, bussLoan: 1, bridgeLoan: 0,
        land: 0, residential: 0, commercial: 1,
        other: 0,
        ltv: 65, period: 12, colValue: 450000, ref: 1,
        stage: 0, surety: 0
      }, skipLocationChange: true
    })
  }

  eval() {
    let values = []
    let thresh = 0.5
    let threshes = []
    let rate = 0
    let failss = 0
    let ranks = []
    let defFails = []

    let ops = this.results.length
    let computed = 0
    this.results.sort((a, b) => b.repaid - a.repaid);
    this.results.forEach(element => {
      ranks.push(element)
    });

    while (computed < ops) {
      for (let element of ranks) {
        if (element.outcome == false) {
          failss += 1
        }
      }
      rate = (failss / ranks.length) * 100
      console.log(thresh)
      if (rate > thresh) {
        ranks.pop()
        if (ranks.length == 0) {
          ranks = []
          this.results.forEach(element => {
            ranks.push(element)
          });
          thresh += 0.5
        }
      } else {
        console.log(ranks[ranks.length - 1].repaid)
        values.push(ranks[ranks.length - 1].repaid)
        defFails.push(failss)
        defFails.push(ranks.length)
        threshes.push(thresh)
        console.log(failss)
        computed = ranks.length
        //computed += ranks.length
        //this.results.splice(0, ranks.length)
        ranks = []
        this.results.forEach(element => {
          ranks.push(element)
        });
        thresh += 0.5
      }
      failss = 0
    }
    console.log(values)
    console.log(threshes)
    console.log(defFails)
  }
  
  test(){
    let results = this.mlEngineService.lol(100);
    results.forEach(element => {
      let repaid1 = 0
      let defau = 0
      let recovery = 0
      element.votes.forEach(vote => {
        if (vote.label == 1) {
          repaid1 += Math.exp(-vote.distance)
        }/* else if (vote.label == 2) {
          // TODO
          
          repaid1 += 0.93 / (vote.distance)
          this.default += 0.07 * 0.52 / (vote.distance)
          this.recovery += 0.07 * 0.48 / (vote.distance)
        } */
        else if (vote.label == 3) {
          recovery += Math.exp(-vote.distance)
        } else if (vote.label == 4) {
          defau += Math.exp(-vote.distance)
        } else {
          defau += Math.exp(-vote.distance)
        }
      })

      let repaid = repaid1
      let defa = defau
      let rec = recovery

      repaid1 = +((repaid * 100 / (repaid + rec + defa)).toFixed(2))
      recovery = +((rec * 100 / (repaid + rec + defa)).toFixed(2))
      defau = +((defa * 100 / (repaid + rec + defa)).toFixed(2))

      element.repaid = repaid1
      if (element.labelReal != 1) {
        element.outcome = false
      }

    })
    results.forEach(element => {
      this.results.push(element)
    });
  }

}




