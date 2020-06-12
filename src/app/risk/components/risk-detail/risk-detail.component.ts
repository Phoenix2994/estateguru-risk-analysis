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
  k = 25

  ngOnInit() {
    this.mlEngineService.catchRecordsFromFile();
    this.route.queryParams.subscribe(params => {
      this.result = this.mlEngineService.compute([+params['estonia'], /*+params['finland'],*/ +params['lithuania'],
      /*+params['germany'],*/ +params['latvia'], /*+params['spain'],*/ +params['interestRate'],
      +params['fullBullet'], +params['bullet'],/* +params['annuity'],*/ +params['devLoan'], +params['bussLoan'],
      +params['bridgeLoan'], +params['land'], +params['residential'], /*+params['commercial'], +params['other'],*/
      +params['ltv'], +params['period'], +params['colValue'],
      +params['stage'], +params['surety'], +params['ref']], this.k);

      this.result.votes.forEach(vote => {
        if (vote.label == 1) {
          this.repaid += 1 / (vote.distance)
        } else if (vote.label == 2) {
          this.repaid += 0.93 / (vote.distance)
          this.default += 0.07 * 0.52 / (vote.distance)
          this.recovery += 0.07 * 0.48 / (vote.distance)
        } else if (vote.label == 3) {
          this.recovery += 1 / (vote.distance)
        } else if (vote.label == 4) {
          this.default += 0.52 / (vote.distance)
          this.recovery += 0.48 / (vote.distance)
        } else {
          this.default += 1 / (vote.distance)
        }
      })

      console.log(this.result)
      let repaid = this.repaid
      let defa = this.default
      let rec = this.recovery

      this.repaid = +((repaid * 100 / (repaid + rec + defa)).toFixed(2))
      this.recovery = +((rec * 100 / (repaid + rec + defa)).toFixed(2))
      this.default = +((defa * 100 / (repaid + rec + defa)).toFixed(2))

    });

  }



}
