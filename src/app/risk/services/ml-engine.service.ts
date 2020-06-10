import { Injectable } from '@angular/core';
import { KNeighborsClassifier } from 'machinelearn/neighbors';
import * as recordsData from '../../../assets/json/records.json';
import { MinMaxScaler } from 'machinelearn/preprocessing';
import { Type1DMatrix, Type2DMatrix } from 'machinelearn/types';
import { KeyEventsPlugin } from '@angular/platform-browser/src/dom/events/key_events';
import { Subject } from 'rxjs';
import { IResult } from '../interfaces/result';



@Injectable({
  providedIn: 'root'
})
export class MlEngineService {

  rawRecords = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
  test = []
  knn: any;
  k: number;
  data: any;
  labels: any;
  point: any;

  result: IResult

  constructor() {
  }


  catchRecordsFromFile(): any {
    const records = (recordsData as any).default;

    this.rawRecords = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
    records.forEach(element => {
      this.rawRecords[0].push(element.estonia)
      this.rawRecords[1].push(element.finland)
      this.rawRecords[2].push(element.lithuania)
      this.rawRecords[3].push(element.germany)
      this.rawRecords[4].push(element.latvia)
      this.rawRecords[5].push(element.spain)
      this.rawRecords[6].push(element.interestRate)
      this.rawRecords[7].push(element.fullBullet)
      this.rawRecords[8].push(element.bullet)
      this.rawRecords[9].push(element.annuity)
      this.rawRecords[10].push(element.devLoan)
      this.rawRecords[11].push(element.bussLoan)
      this.rawRecords[12].push(element.bridgeLoan)
      this.rawRecords[13].push(element.land)
      this.rawRecords[14].push(element.residential)
      this.rawRecords[15].push(element.commercial)
      this.rawRecords[16].push(element.other)
      this.rawRecords[17].push(typeof element.ltv == "string" ? +(element.ltv.replace(',','.')) : element.ltv)
      this.rawRecords[18].push(element.period)
      this.rawRecords[19].push(element.collateralValue)
      this.rawRecords[20].push(element.stage)
      this.rawRecords[21].push(element.suretyship) //mortgage fundedAmount portugal
      this.rawRecords[22].push(element.ref)


      this.test.push(element.status)
    });
  }


  compute(point: any, k: number) {
    const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
    for (let i = 0; i < 23; i++) {
      this.rawRecords[i].push(point[i])
    }
    const scaledRecords = [];
    this.rawRecords.forEach(element => {
      console.log(element)
      scaledRecords.push(minmaxScaler.fit_transform(element))
    })
    const X = scaledRecords[0].map((_, colIndex) => scaledRecords.map(row => row[colIndex]));
    this.point = X.pop()
    this.k = k
    this.data = X
    this.labels = this.test
    let result = this.predict()
    return result
  }

  /**
 * Calculate the distance between two points.
 * Points must be given as arrays or objects with equivalent keys.
 * @param {Array.<number>} a
 * @param {Array.<number>} b
 * @return {number}
 */
  distance(a, b) {
    return Math.sqrt(
      a.map((aPoint, i) => b[i] - aPoint)
        .reduce((sumOfSquares, diff) => sumOfSquares + (diff * diff), 0)
    );
  }

  generateDistanceMap(point) {

    const map = [];
    let maxDistanceInMap;

    for (let index = 0, len = this.data.length; index < len; index++) {

      const otherPoint = this.data[index];
      const otherPointLabel = this.labels[index];
      const thisDistance = this.distance(point, otherPoint);

      /**
       * Keep at most k items in the map.
       * Much more efficient for large sets, because this
       * avoids storing and then sorting a million-item map.
       * This adds many more sort operations, but hopefully k is small.
       */
      if (!maxDistanceInMap || thisDistance < maxDistanceInMap) {

        // Only add an item if it's closer than the farthest of the candidates
        map.push({
          index,
          distance: thisDistance,
          label: otherPointLabel
        });

        // Sort the map so the closest is first
        map.sort((a, b) => a.distance < b.distance ? -1 : 1);

        // If the map became too long, drop the farthest item
        if (map.length > this.k) {
          map.pop();
        }

        // Update this value for the next comparison
        maxDistanceInMap = map[map.length - 1].distance;

      }
    }

    return map;
  }

  predict() {

    const map = this.generateDistanceMap(this.point);
    const votes = map.slice(0, this.k);
    const voteCounts = votes
      // Reduces into an object like {label: voteCount}
      .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
      ;
    const sortedVotes = Object.keys(voteCounts)
      .map(label => ({ label, count: voteCounts[label] }))
      .sort((a, b) => a.count > b.count ? -1 : 1)

    this.result = {
      label: sortedVotes[0].label,
      voteCounts,
      votes
    }
    console.log(this.result)
    return this.result
  }

}


