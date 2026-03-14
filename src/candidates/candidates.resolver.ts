import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';
import { Candidate, SimilarCandidate } from './models';
import { SimilarCandidatesArgs } from './dto/similar-candidates.args';
import { Skill } from '../skills/models/skill.model';

@Resolver(() => Candidate)
export class CandidatesResolver {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Query(() => [Candidate])
  async candidates() {
    return this.candidatesService.findAll();
  }

  @Query(() => Candidate, { nullable: true })
  async candidate(@Args('id') id: string) {
    return this.candidatesService.findOne(Number(id));
  }

  @Query(() => [SimilarCandidate])
  async similarCandidates(@Args() args: SimilarCandidatesArgs) {
    return this.candidatesService.findSimilar(
      Number(args.candidateId),
      args.limit ?? 5,
    );
  }

  @Mutation(() => Candidate)
  async uploadResume(@Args('resumeText') resumeText: string) {
    return this.candidatesService.createFromResume(resumeText);
  }

  @Mutation(() => Candidate)
  async uploadResumeFromPath(@Args('resumePath') resumePath: string) {
    return this.candidatesService.createFromResumePath(resumePath);
  }

  @ResolveField(() => [Skill])
  async skills(@Parent() parent: Candidate) {
    return this.candidatesService.findSkillsByCandidateId(parent.id);
  }
}
