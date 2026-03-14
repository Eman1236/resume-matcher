import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CandidatesModule } from './candidates/candidates.module';
import { SkillsModule } from './skills/skills.module';
import { CandidateSkillModule } from './candidate-skills/candidate-skill.module';
import { CandidateEntity } from './candidates/entities/candidate.entity';
import { SkillEntity } from './skills/entities/skill.entity';
import { CandidateSkill } from './candidate-skills/entities/candidate-skill.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('PG_CONNECTION_STRING');
        if (!url) throw new Error('PG_CONNECTION_STRING env var is required');
        return {
          type: 'postgres',
          url,
          entities: [CandidateEntity, SkillEntity, CandidateSkill],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    CandidatesModule,
    SkillsModule,
    CandidateSkillModule
  ],
})
export class AppModule {}
