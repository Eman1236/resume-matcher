import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CandidateEntity } from '../../candidates/entities/candidate.entity';
import { SkillEntity } from '../../skills/entities/skill.entity';

@Entity('candidate_skills')
export class CandidateSkill {
  @PrimaryColumn({ name: 'candidate_id' })
  candidateId!: number;

  @PrimaryColumn({ name: 'skill_id' })
  skillId!: number;

  @Column({ type: 'int', nullable: true })
  level!: number | null;

  @ManyToOne(() => CandidateEntity, (c) => c.candidateSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate!: CandidateEntity;

  @ManyToOne(() => SkillEntity, (s) => s.candidateSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skill!: SkillEntity;
}
