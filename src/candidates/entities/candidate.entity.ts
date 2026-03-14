import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';
import { CandidateSkill } from '../../candidate-skills/entities/candidate-skill.entity';

@Entity('candidates')
export class CandidateEntity {
  @PrimaryGeneratedColumn()
  @Generated('increment')
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  location!: string | null;

  @Column({ type: 'int', nullable: true })
  years_experience!: number | null;

  @OneToMany(() => CandidateSkill, (cs) => cs.candidate)
  candidateSkills!: CandidateSkill[];
}
