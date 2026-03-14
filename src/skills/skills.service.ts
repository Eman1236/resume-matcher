import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity} from './entities/skill.entity';
import { Skill } from './models/skill.model';

// export type SkillGql = {
//     id: number;
//     name: string;
// };

function toSkillGql(row: SkillEntity): Skill {
    return {
        id: row.id,
        name: row.name
    };
}

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(SkillEntity)
        private readonly skillRepo: Repository<SkillEntity>,
    ) { }

    async findAll(): Promise<Skill[]> {
        const rows = await this.skillRepo.find({
            order: { id: 'ASC' },
        });
        return rows.map(toSkillGql);
    }

    async findOne(id: number): Promise<Skill | null> {
        const row = await this.skillRepo.findOne({ where: { id } });
        return row ? toSkillGql(row) : null;
    }

    async findOneByName(name: string): Promise<Skill | null> {
        const row = await this.skillRepo.findOne({ where: { name: name } });
        return row ? toSkillGql(row) : null;
    }

    async createSkill(name: string): Promise<Skill> {
        const row = await this.skillRepo.create({ name: name });
        const saved = await this.skillRepo.save(row);
        return toSkillGql(saved);
    }

}
