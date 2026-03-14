import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillEntity} from './entities/skill.entity';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkillEntity]),
  ],
  providers: [SkillsService, SkillsResolver],
  exports: [SkillsService]
})
export class SkillsModule {}
