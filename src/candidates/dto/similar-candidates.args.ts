import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SimilarCandidatesArgs {
  @Field()
  candidateId!: string;

  @Field(() => Int, { defaultValue: 5, nullable: true })
  limit?: number;
}
