import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CandidateSkill {

  @Field(() => Int)
  candidateId!: number;

  @Field(() => Int)
  skillId!: number;

  @Field(() => Int, { nullable: true })
  level!: number | null;

  @Field(() => String) // <-- add skillName
  skillName!: string;

}