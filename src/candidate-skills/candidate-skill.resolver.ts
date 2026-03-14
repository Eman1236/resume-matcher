import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { CandidateSkillService } from './candidate-skill.service';
import { CandidateSkill } from './entities/candidate-skill.entity';

@Resolver(() => CandidateSkill)
export class CandidateSkillResolver {
    constructor(private readonly candidateSkillService: CandidateSkillService) { }

    @Query(() => [CandidateSkill])
    async skills() {
        return this.candidateSkillService.findAll();
    }

    @Query(() => CandidateSkill)
    async FindOneBySkill(@Args('id') id: number) {
        return this.candidateSkillService.findOneBySkill(id);
    }

    @Query(() => CandidateSkill)
    async FindOneByCandidate(@Args('id') id: number) {
        return this.candidateSkillService.findOneByCandidate(id);
    }

    @Mutation(() => CandidateSkill)
    async createCandidateSkill(@Args('candidateId') candidateId: number, @Args('skillId') skillId: number) {
        return this.candidateSkillService.createCandidateSkill(skillId,candidateId);
    }
}