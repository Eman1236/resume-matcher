import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CandidateSkillService } from './candidate-skill.service';
import { CandidateSkillResolver } from './candidate-skill.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateSkill]),
  ],
  providers: [CandidateSkillService, CandidateSkillResolver],
  exports: [CandidateSkillService]
})
export class CandidateSkillModule {}
