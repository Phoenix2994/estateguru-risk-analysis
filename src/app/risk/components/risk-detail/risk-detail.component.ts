import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MlEngineService } from '../../services/ml-engine.service';
import { IResult } from '../../interfaces/result';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { computeStyle } from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-risk-detail',
  templateUrl: './risk-detail.component.html',
  styleUrls: ['./risk-detail.component.css']
})
export class RiskDetailComponent implements OnInit {

  constructor(private mlEngineService: MlEngineService, private route: ActivatedRoute) {

  }

  result: IResult;
  repaid: number;
  late: number;
  hybridDefault: number;
  default: number;
  recovery: number;
  k = 100
  loading = false
  rating: string
  ratingVar: string


  ngOnInit() {
    this.loading = true
    this.rating = this.compute(false)
    this.mlEngineService.catchFullRecordsFromFile()
    this.mlEngineService.catchDefaultRecordsFromFile()
    this.ratingVar = this.compute(true)


    this.loading = false

  }

  compute(flagVar: boolean): string {
    let rating = ''
    this.repaid = 0;
    this.late = 0;
    this.hybridDefault = 0;
    this.default = 0;
    this.recovery = 0;
    this.route.queryParams.subscribe(params => {
      this.result = this.mlEngineService.compute([+params['estonia'], /*+params['finland'],*/ +params['lithuania'],
    /*+params['germany'], +params['latvia'], /*+params['spain'],*/ +params['interestRate'],
      +params['fullBullet'], +params['bullet'],/* +params['annuity'],*/ +params['devLoan'], +params['bussLoan'],
      +params['bridgeLoan'], +params['land'], +params['residential'], +params['commercial'], /*+params['other'],*/
      +params['ltv'], +params['period'], +params['colValue'],
      +params['stage'], +params['surety'], +params['ref']], this.k, flagVar);
      this.result.votes.forEach(vote => {
        if (vote.label == 1) {
          this.repaid += Math.exp(-vote.distance)
        }/* else if (vote.label == 2) {
        // TODO
        
        this.repaid += 0.93 / (vote.distance)
        this.default += 0.07 * 0.52 / (vote.distance)
        this.recovery += 0.07 * 0.48 / (vote.distance)
      } */
        else if (vote.label == 3) {
          this.recovery += Math.exp(-vote.distance)
        } else if (vote.label == 4) {
          let defResults = this.mlEngineService.computeDefault(this.mlEngineService.data[vote.index], 5, flagVar)
          let recovery = 0
          let def = 0
          defResults.votes.forEach(defVote => {
            if (defVote.label == 3) {
              recovery += Math.exp(-defVote.distance)
            } else {
              def += Math.exp(-defVote.distance)
            }
          });
          this.recovery += (recovery / (recovery + def)) * Math.exp(-vote.distance)
          this.default += (def / (recovery + def)) * Math.exp(-vote.distance)
        } else {
          this.default += Math.exp(-vote.distance)
        }
      })

      console.log(this.result)
      let repaid = this.repaid
      let defa = this.default
      let rec = this.recovery

      this.repaid = +((repaid * 100 / (repaid + rec + defa)).toFixed(2))
      this.recovery = +((rec * 100 / (repaid + rec + defa)).toFixed(2))
      this.default = +((defa * 100 / (repaid + rec + defa)).toFixed(2))

      if (flagVar) {
        rating = 'BBB'
        if (this.repaid > 74.76) {
          rating = 'BBB+'
        }
        if (this.repaid > 79.91) {
          rating = 'A-'
        }
        if (this.repaid > 85.8) {
          rating = 'A'
        }
        if (this.repaid > 89.49) {
          rating = 'A+'
        }
        if (this.repaid > 90.16) {
          rating = 'AA-'
        }
        if (this.repaid > 92.91) {
          rating = 'AA'
        } if (this.repaid > 94.52) {
          rating = 'AA+'
        }
        if (this.repaid > 96.72) {
          rating = 'AAA'
        }
      } else {
        rating = 'B'
        if (this.repaid > 62.36) {
          rating = 'B+'
        } if (this.repaid > 74.61) {
          rating = 'BB-'
        }
        if (this.repaid > 80.22) {
          rating = 'BB'
        }
        if (this.repaid > 84.24) {
          rating = 'BB+'
        } if (this.repaid > 85.51) {
          rating = 'BBB-'
        }
        if (this.repaid > 87.73) {
          rating = 'BBB'
        }
        if (this.repaid > 88.68) {
          rating = 'BBB+'
        }
        if (this.repaid > 89.3) {
          rating = 'A-'
        }
        if (this.repaid > 91.46) {
          rating = 'A'
        }
        if (this.repaid > 93.08) {
          rating = 'A+'
        }
        if (this.repaid > 94.96) {
          rating = 'AA-'
        }
        if (this.repaid > 95.52) {
          rating = 'AA'
        } if (this.repaid > 96.49) {
          rating = 'AA+'
        }
        if (this.repaid > 98.27) {
          rating = 'AAA'
        }
      }

    });
    return rating
  }

}




