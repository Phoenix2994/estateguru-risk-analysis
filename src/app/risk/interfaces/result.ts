import { IVoteCounts } from './vote-counts';
import { IVote } from './vote';

export interface IResult {
    label: string;
    voteCounts: IVoteCounts;
    votes: IVote[];
}