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

  rawRecords = []
  rawDefaultRecords = []
  labels = []
  defaultLabels = []

  knn: any;

  data: any;

  constructor() {
  }


  catchFullRecordsFromFile(): void {
    const records = (recordsData as any).default;

    this.rawRecords = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
    records.forEach(element => {
      this.rawRecords[0].push(element.estonia)
      //this.rawRecords[1].push(element.finland)
      this.rawRecords[1].push(element.lithuania)
      //this.rawRecords[3].push(element.germany)
      this.rawRecords[2].push(element.latvia)
      //this.rawRecords[5].push(element.spain)
      this.rawRecords[3].push(element.interestRate)
      this.rawRecords[4].push(element.fullBullet)
      this.rawRecords[5].push(element.bullet)
      //this.rawRecords[9].push(element.annuity)
      this.rawRecords[6].push(element.devLoan)
      this.rawRecords[7].push(element.bussLoan)
      this.rawRecords[8].push(element.bridgeLoan)
      this.rawRecords[9].push(element.land)
      this.rawRecords[10].push(element.residential)
      //this.rawRecords[15].push(element.commercial)
      //this.rawRecords[16].push(element.other)
      this.rawRecords[11].push(typeof element.ltv == "string" ? +(element.ltv.replace(',', '.')) : element.ltv)
      this.rawRecords[12].push(element.period)
      this.rawRecords[13].push(element.collateralValue)
      this.rawRecords[14].push(element.stage)
      this.rawRecords[15].push(element.suretyship) //mortgage fundedAmount portugal
      this.rawRecords[16].push(element.ref)


      this.labels.push(element.status)
    });
  }

  catchDefaultRecordsFromFile(): void {
    let records = (recordsData as any).default;

    records = records.filter(element => {
      return element.status == 3 || element.status == 5
    })

    this.rawDefaultRecords = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
    records.forEach(element => {
      this.rawDefaultRecords[0].push(element.estonia)
      //this.rawRecords[1].push(element.finland)
      this.rawDefaultRecords[1].push(element.lithuania)
      //this.rawRecords[3].push(element.germany)
      this.rawDefaultRecords[2].push(element.latvia)
      //this.rawRecords[5].push(element.spain)
      this.rawDefaultRecords[3].push(element.interestRate)
      this.rawDefaultRecords[4].push(element.fullBullet)
      this.rawDefaultRecords[5].push(element.bullet)
      //this.rawRecords[9].push(element.annuity)
      this.rawDefaultRecords[6].push(element.devLoan)
      this.rawDefaultRecords[7].push(element.bussLoan)
      this.rawDefaultRecords[8].push(element.bridgeLoan)
      this.rawDefaultRecords[9].push(element.land)
      this.rawDefaultRecords[10].push(element.residential)
      //this.rawRecords[15].push(element.commercial)
      //this.rawRecords[16].push(element.other)
      this.rawDefaultRecords[11].push(typeof element.ltv == "string" ? +(element.ltv.replace(',', '.')) : element.ltv)
      this.rawDefaultRecords[12].push(element.period)
      this.rawDefaultRecords[13].push(element.collateralValue)
      this.rawDefaultRecords[14].push(element.stage)
      this.rawDefaultRecords[15].push(element.suretyship) //mortgage fundedAmount portugal
      this.rawDefaultRecords[16].push(element.ref)


      this.defaultLabels.push(element.status)
    });

  }


  compute(point: any, k: number) {
    const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
    for (let i = 0; i < this.rawRecords.length; i++) {
      this.rawRecords[i].push(point[i])
    }
    const scaledRecords = [];
    this.rawRecords.forEach(element => {
      scaledRecords.push(minmaxScaler.fit_transform(element))
    })
    const X = scaledRecords[0].map((_, colIndex) => scaledRecords.map(row => row[colIndex]));
    point = X.pop()
    this.data = X
    const map = this.generateDistanceMap(point, X, this.labels, k);
    const votes = map.slice(0, k);
    const voteCounts = votes
      // Reduces into an object like {label: voteCount}
      .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
      ;
    const sortedVotes = Object.keys(voteCounts)
      .map(label => ({ label, count: voteCounts[label] }))
      .sort((a, b) => a.count > b.count ? -1 : 1)

    const result = {
      label: sortedVotes[0].label,
      voteCounts,
      votes
    }
    return result
  }

  computeDefault(point: any, k: number) {
    const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
    for (let i = 0; i < this.rawDefaultRecords.length; i++) {
      this.rawDefaultRecords[i].push(point[i])
    }
    const scaledRecords = [];
    this.rawDefaultRecords.forEach(element => {
      scaledRecords.push(minmaxScaler.fit_transform(element))
    })
    for (let i = 0; i < this.rawDefaultRecords.length; i++) {
      this.rawDefaultRecords[i].pop()
    }
    const X = scaledRecords[0].map((_, colIndex) => scaledRecords.map(row => row[colIndex]));

    point = X.pop()

    const map = this.generateDistanceMap(point, X, this.defaultLabels, k);
    const votes = map.slice(0, k);
    const voteCounts = votes
      // Reduces into an object like {label: voteCount}
      .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
      ;
    const sortedVotes = Object.keys(voteCounts)
      .map(label => ({ label, count: voteCounts[label] }))
      .sort((a, b) => a.count > b.count ? -1 : 1)

    const result = {
      label: sortedVotes[0].label,
      voteCounts,
      votes
    }
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

  generateDistanceMap(point, data, labels, k) {

    const map = [];
    let maxDistanceInMap;

    for (let index = 0, len = data.length; index < len; index++) {
      const otherPoint = data[index];
      const otherPointLabel = labels[index];
      const thisDistance = this.distance(point, otherPoint);

      /**
       * Keep at most k items in the map.
       * Much more efficient for large sets, because this
       * avoids storing and then sorting a million-item map.
       * This adds many more sort operations, but hopefully k is small.
       */
      map.push({
        index,
        distance: thisDistance,
        label: otherPointLabel
      });

      // Sort the map so the closest is first
      map.sort((a, b) => a.distance < b.distance ? -1 : 1);

      // If the map became too long, drop the farthest item
      if (map.length > k) {
        map.pop();
      }

      // Update this value for the next comparison
      maxDistanceInMap = map[map.length - 1].distance;


    }

    return map;
  }

  lol(k) {
    let results = []
    let labels2 = []
    this.labels.forEach(element => {
      labels2.push(element)
    })
    for (let p = 0; p < this.rawRecords[0].length; p++) {
      this.catchFullRecordsFromFile()
      this.catchDefaultRecordsFromFile()
      let labels2 = []
      this.labels.forEach(element => {
        labels2.push(element)
      })
      let point = []
      const minmaxScaler = new MinMaxScaler({ featureRange: [0, 1] });
      const scaledRecords = [];
      this.rawRecords.forEach(element => {
        scaledRecords.push(minmaxScaler.fit_transform(element))
      })
      const X = scaledRecords[0].map((_, colIndex) => scaledRecords.map(row => row[colIndex]));
      point = X.splice(p, 1)
      point = point[0]
      let label = labels2.splice(p, 1)
      label = label[0]

      const map = this.generateDistanceMap(point, X, this.labels, k);
      const votes = map.slice(0, k);
      const voteCounts = votes
        // Reduces into an object like {label: voteCount}
        .reduce((obj, vote) => Object.assign({}, obj, { [vote.label]: (obj[vote.label] || 0) + 1 }), {})
        ;
      const sortedVotes = Object.keys(voteCounts)
        .map(label => ({ label, count: voteCounts[label] }))
        .sort((a, b) => a.count > b.count ? -1 : 1)

      results.push({
        label: sortedVotes[0].label,
        voteCounts,
        votes,
        labelReal: label,
        repaid: 0,
        outcome: true
      })
    }
    return results
  }

}
