import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Skill } from '../../skills/models/skill.model';

@ObjectType()
export class Candidate {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  title!: string ;

  @Field(() => String, { nullable: true })
  location!: string ;

  @Field(() => Int, { nullable: true })
  yearsExperience!: number;

  @Field(() => [Skill])
  skills!: Skill[];
}
