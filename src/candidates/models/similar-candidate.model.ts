import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Candidate } from './candidate.model';

@ObjectType()
export class SimilarCandidate {
  @Field(() => Candidate)
  candidate!: Candidate;

  @Field(() => Int)
  overlapScore!: number;
}
