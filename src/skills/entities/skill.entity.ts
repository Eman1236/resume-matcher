import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';
import { CandidateSkill } from '../../candidate-skills/entities/candidate-skill.entity'

@Entity('skills')
export class SkillEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id!: number;

  @Column({ type: 'text', unique: true })
  name!: string;

  @OneToMany(() => CandidateSkill, (cs) => cs.skill)
  candidateSkills!: CandidateSkill[];
}


