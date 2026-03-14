import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateSkill} from './entities/candidate-skill.entity';

export type CandidateSkillGql = {
    candidateId: number,
    skillId: number,
    level: number | null
};

function toCandidateSkillGql(row: CandidateSkill): CandidateSkillGql {
    return {
        candidateId: row.candidateId,
        skillId: row.skillId,
        level: row.level
    };
}

@Injectable()
export class CandidateSkillService {
    constructor(
        @InjectRepository(CandidateSkill)
        private readonly candidateSkillRepo: Repository<CandidateSkill>,
    ) { }

    async findAll(): Promise<CandidateSkillGql[]> {
        const rows = await this.candidateSkillRepo.find();
        return rows.map(toCandidateSkillGql);
    }

    async findOneBySkill(id: number): Promise<CandidateSkillGql | null> {
        const row = await this.candidateSkillRepo.findOne({ where: { skillId: id } });
        return row ? toCandidateSkillGql(row) : null;
    }

    async findOneByCandidate(id: number): Promise<CandidateSkillGql | null> {
        const row = await this.candidateSkillRepo.findOne({ where: { candidateId: id } });
        return row ? toCandidateSkillGql(row) : null;
    }

    async findSkillsByCandidateId(candidateId: number): Promise<{id: number, name: string} []>{
        const rows = await this.candidateSkillRepo.find({
            where: { candidateId },
            relations: ['skill'],
          });
          return rows
            .map((cs) => ({ id: cs.skill.id, name: cs.skill.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }


    async createCandidateSkill(skillId: number, candidateId: number): Promise<CandidateSkillGql> {
        const row = await this.candidateSkillRepo.create({ candidateId: candidateId, skillId: skillId });
        const saved = await this.candidateSkillRepo.save(row);
        return toCandidateSkillGql(saved);
    }

}
