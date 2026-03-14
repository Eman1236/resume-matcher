import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SkillsService} from './skills.service';
import { Skill } from './models/skill.model';

@Resolver(() => Skill)
export class SkillsResolver {
    constructor(private readonly skillsService: SkillsService) { }

    @Query(() => [Skill])
    async skills(): Promise<Skill[]> {
        return this.skillsService.findAll();
    }

    @Query(() => Skill, { nullable: true })
    async skillFindOne(@Args('id') id: string): Promise<Skill | null> {
        return this.skillsService.findOne(Number(id));
    }

    @Query(() => Skill, { nullable: true })
    async skillFindByName(@Args('name') name: string): Promise<Skill | null> {
        return this.skillsService.findOneByName(name);
    }

    @Mutation(() => Skill)
    async createSkill(
        @Args('name', { type: () => String }) name: string
    ): Promise<Skill> {
        return this.skillsService.createSkill(name);
    }
}