import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFile } from 'fs/promises';
import { resolve, relative } from 'path';
import { CandidateEntity } from './entities/candidate.entity';
import { parseResume } from './resume-parser';
import { SkillsService } from '../skills/skills.service';
import { CandidateSkillService } from '../candidate-skills/candidate-skill.service';
import { CandidateSkill } from '../candidate-skills/entities/candidate-skill.entity';


export type CandidateGql = {
  id: number;
  name: string;
  title: string | null;
  location: string | null;
  yearsExperience: number | null;
};

function toCandidateGql(row: CandidateEntity): CandidateGql {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    location: row.location,
    yearsExperience: row.years_experience,
  };
}

const skillAliases: Record<string, string> = {
  js: "javascript",
  node: "nodejs",
  postgres: "postgresql",
  postgresql: "postgresql",
  ts: "typescript",
  py: "python",
};

function normalizeSkill(input: string): string {
  let normalized = input
    .toLowerCase()
    .trim()
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s/g, "");

  return skillAliases[normalized] || normalized;
}

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly candidateRepo: Repository<CandidateEntity>,
    private readonly skillService: SkillsService,
    private readonly candidateSkillService: CandidateSkillService
  ) { }

  async findAll(): Promise<CandidateGql[]> {
    const rows = await this.candidateRepo.find({
      order: { id: 'ASC' },
    });
    return rows.map(toCandidateGql);
  }

  async findOne(id: number): Promise<CandidateGql | null> {
    const row = await this.candidateRepo.findOne({ where: { id } });
    return row ? toCandidateGql(row) : null;
  }

  async findSkillsByCandidateId(candidateId: number): Promise<{ id: number; name: string }[]> {
    return await this.candidateSkillService.findSkillsByCandidateId(candidateId);
  }

  async createFromResumePath(resumePath: string): Promise<CandidateGql> {
    const baseDir = resolve(process.env.RESUME_DIR ?? process.cwd());
    const resolved = resolve(baseDir, resumePath);
    const rel = relative(baseDir, resolved);
    if (rel.startsWith('..') || rel.includes('..')) {
      throw new Error('Resume path must be under the allowed directory');
    }
    const resumeText = await readFile(resolved, 'utf-8');
    return this.createFromResume(resumeText);
  }

  async createFromResume(resumeText: string): Promise<CandidateGql> {
    const parsed = parseResume(resumeText);
    const candidate = this.candidateRepo.create({
      name: parsed.name,
      title: parsed.title,
      location: parsed.location,
      years_experience: parsed.yearsExperience,
    });
    const saved = await this.candidateRepo.save(candidate);
    const level = 5;
    for (const skillName of parsed.skills) {
      const normalized = normalizeSkill(skillName);
      if (!normalized) continue;
      let skill = await this.skillService.findOneByName(normalized);
      if (!skill) {
        skill = await this.skillService.createSkill(normalized);
      }
      await this.candidateSkillService.createCandidateSkill(
        skill.id,
        saved.id
      );
    }
    return toCandidateGql(saved);
  }
 
  async findSimilar(
    candidateId: number,
    limit: number,
  ): Promise<{ candidate: CandidateGql; overlapScore: number }[]> {
    const qb = this.candidateRepo
      .createQueryBuilder('c2')
      .innerJoin(
        CandidateSkill,
        'cs2',
        'cs2.candidate_id = c2.id AND cs2.candidate_id <> :candidateId',
        { candidateId },
      )
      .innerJoin(
        'candidate_skills',
        'cs1',
        'cs1.skill_id = cs2.skill_id AND cs1.candidate_id = :candidateId',
        { candidateId },
      )
      .select('c2.id', 'id')
      .addSelect('c2.name', 'name')
      .addSelect('c2.title', 'title')
      .addSelect('c2.location', 'location')
      .addSelect('c2.years_experience', 'years_experience')
      .addSelect('COUNT(cs2.skill_id)', 'overlap_score')
      .groupBy('c2.id')
      .addGroupBy('c2.name')
      .addGroupBy('c2.title')
      .addGroupBy('c2.location')
      .addGroupBy('c2.years_experience')
      .orderBy('overlap_score', 'DESC')
      .addOrderBy('c2.id', 'ASC')
      .limit(limit);

    const raw = await qb.getRawMany<{
      id: number;
      name: string;
      title: string | null;
      location: string | null;
      years_experience: number | null;
      overlap_score: string;
    }>();

    return raw.map((row) => ({
      candidate: toCandidateGql({
        id: row.id,
        name: row.name,
        title: row.title,
        location: row.location,
        years_experience: row.years_experience,
      } as CandidateEntity),
      overlapScore: Number(row.overlap_score),
    }));
  }
}
