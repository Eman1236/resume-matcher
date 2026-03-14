import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity} from './entities/candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesResolver } from './candidates.resolver';
import { SkillsModule } from '../skills/skills.module';
import {CandidateSkillModule} from '../candidate-skills/candidate-skill.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateEntity]),
    SkillsModule,
    CandidateSkillModule
  ],
  providers: [CandidatesService, CandidatesResolver],
})
export class CandidatesModule {}
