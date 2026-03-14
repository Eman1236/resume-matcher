import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { CandidateEntity } from './candidates/entities/candidate.entity';
import { SkillEntity } from './skills/entities/skill.entity';
import { CandidateSkill } from './candidate-skills/entities/candidate-skill.entity';

const url = process.env.PG_CONNECTION_STRING;
if (!url) throw new Error('PG_CONNECTION_STRING env var is required');

export default new DataSource({
  type: 'postgres',
  url,
  entities: [CandidateEntity, SkillEntity, CandidateSkill],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  synchronize: false,
});
