import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MlEngineService } from '../../services/ml-engine.service';
import { IResult } from '../../interfaces/result';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-risk-detail',
  templateUrl: './risk-detail.component.html',
  styleUrls: ['./risk-detail.component.css']
})
export class RiskDetailComponent implements OnInit {

  constructor(private mlEngineService: MlEngineService, private route: ActivatedRoute) {

  }

  result: IResult;
  repaid = 0;
  late = 0;
  hybridDefault = 0;
  default = 0;
  recovery = 0;
  k = 100
  loading = false
  rating: string

  ngOnInit() {
    this.loading = true
    this.route.queryParams.subscribe(params => {
      this.result = this.mlEngineService.compute([+params['estonia'], /*+params['finland'],*/ +params['lithuania'],
      /*+params['germany'], +params['latvia'], /*+params['spain'],*/ +params['interestRate'],
      +params['fullBullet'], +params['bullet'],/* +params['annuity'],*/ +params['devLoan'], +params['bussLoan'],
      +params['bridgeLoan'], +params['land'], +params['residential'], +params['commercial'], /*+params['other'],*/
      +params['ltv'], +params['period'], +params['colValue'],
      +params['stage'], +params['surety'], +params['ref']], this.k);

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
          let defResults = this.mlEngineService.computeDefault(this.mlEngineService.data[vote.index], 5)
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

      this.rating = 'CCC+'
      if (this.repaid > 63.53) {
        this.rating = 'B-'
      }
      if (this.repaid > 73.83) {
        this.rating = 'B'
      }
      if (this.repaid > 77.46) {
        this.rating = 'B+'
      } if (this.repaid > 82.82) {
        this.rating = 'BB-'
      }
      if (this.repaid > 85.41) {
        this.rating = 'BB'
      }
      if (this.repaid > 87.51) {
        this.rating = 'BB+'
      } if (this.repaid > 87.85) {
        this.rating = 'BBB-'
      }
      if (this.repaid > 88.68) {
        this.rating = 'BBB'
      }
      if (this.repaid > 89.00) {
        this.rating = 'BBB+'
      }
      if (this.repaid > 89.37) {
        this.rating = 'A-'
      }
      if (this.repaid > 89.9) {
        this.rating = 'A'
      }
      if (this.repaid > 91.95) {
        this.rating = 'A+'
      }
      if (this.repaid > 93.48) {
        this.rating = 'AA-'
      }
      if (this.repaid > 95.54) {
        this.rating = 'AA'
      } if (this.repaid > 97.96) {
        this.rating = 'AA+'
      }
      if (this.repaid > 98.56) {
        this.rating = 'AAA'
      }
      this.loading = false

    });

  }



}
