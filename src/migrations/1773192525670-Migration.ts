import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773192525670 implements MigrationInterface {
    name = 'Migration1773192525670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skills" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate_skills" ("candidate_id" SERIAL NOT NULL, "skill_id" SERIAL NOT NULL, "level" integer, CONSTRAINT "PK_7a47825b1d04e8710c83f1a1043" PRIMARY KEY ("candidate_id", "skill_id"))`);
        await queryRunner.query(`CREATE TABLE "candidates" ("id" SERIAL NOT NULL, "name" text NOT NULL, "title" text, "location" text, "years_experience" integer, CONSTRAINT "PK_140681296bf033ab1eb95288abb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidate_skills" ADD CONSTRAINT "FK_bb3474452a29e2537ebd0ea22f8" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate_skills" ADD CONSTRAINT "FK_c84d2943849a7f0f8bec796572d" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_skills" DROP CONSTRAINT "FK_c84d2943849a7f0f8bec796572d"`);
        await queryRunner.query(`ALTER TABLE "candidate_skills" DROP CONSTRAINT "FK_bb3474452a29e2537ebd0ea22f8"`);
        await queryRunner.query(`DROP TABLE "candidates"`);
        await queryRunner.query(`DROP TABLE "candidate_skills"`);
        await queryRunner.query(`DROP TABLE "skills"`);
    }

}
