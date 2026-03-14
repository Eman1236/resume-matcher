## Resume Matcher (TS + GraphQL + Postgres)

Resume Matcher is a NestJS-based backend application designed to parse resumes, extract candidate information, manage skills, and match candidates based on skill overlap. The system uses PostgreSQL as the database and GraphQL (Apollo Server) as the API interface.

### Stack

- **Runtime**: Node.js + TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: Postgres

### Scripts

- `npm run start:dev` – start the dev server with watch
- `npm run build` – compile TypeScript to `dist`
- `npm run start:prod` – run the compiled server

### Reflecting entity changes in the DB (TypeORM migrations)

1. **Apply existing migrations** (creates/updates tables):
   ```bash
   npm run migration:run
   ```
   Uses `PG_CONNECTION_STRING` from `.env`. The first run creates the `migrations` table and runs `InitialSchema` (tables match your entities).

2. **Generate a new migration** after you change entities:
   ```bash
   npm run migration:generate -n "AddEmailToCandidate"
   ```
   The migration file is always created in `src/migrations/` (TypeORM adds a timestamp prefix). Then run `npm run migration:run` to apply it.

3. **Other commands**
   - `npm run migration:show` – list migrations and whether they’re applied
   - `npm run migration:revert` – undo the last migration

### Env

Create a `.env` file:

```bash
PG_CONNECTION_STRING=postgres://user:password@localhost:5432/resume_matcher
PORT=4000
RESUME_DIR=./resumes
```

Architecture
------------

The project follows a **modular, service-oriented architecture**.

### Layers

1.  **Entities (Database Layer)**
    
    *   Represent database tables using TypeORM entities.
            
2.  **Services (Business Logic Layer)**
    
    *   Handle domain logic including:
        
        *   Skill normalization (Postgres, postgresSQL → postgresql)
            
        *   Creating candidates and linking skills
            
        *   Calculating candidate similarity scores
            
3.  **Resolvers (GraphQL Layer)**
    
    *   Expose service functionality via GraphQL queries and mutations.
        
    *   Models are decorated with @ObjectType() for schema generation.
  

### Modules
1. **Candidate Module**(Handles all the data and logic concerning the candidates)
2. **Skills Module**(Handles all the data and logic concerning the skills)
3. **Candidate Skill Module**(links skills and candidate information)

### How to get results
1. **Upload a Resume (From File Path)**
Use the **uploadResumeFromPath** mutation to create a candidate by uploading a resume. This will automatically parse the resume and create candidate, skills, and link them to the candidate.
``` graphql
mutation{
  uploadResumeFromPath(resumePath:"john-doe.txt"){
    id
    name
    title
    location
    yearsExperience
    skills{
      id
      name
    }
  }
}
```
Sample Response
```json
{
  "data": {
    "uploadResumeFromPath": {
      "id": 4,
      "name": "John Doe",
      "title": "Software Engineer II",
      "location": "New jersey, USA",
      "yearsExperience": 5,
      "skills": [
        {
          "id": 25,
          "name": "api"
        },
        {
          "id": 19,
          "name": "css"
        },
        {
          "id": 9,
          "name": "docker"
        },
        {
          "id": 20,
          "name": "express"
        },
        {
          "id": 22,
          "name": "git"
        },
        {
          "id": 4,
          "name": "graphql"
        },
        {
          "id": 18,
          "name": "html"
        },
        {
          "id": 15,
          "name": "javascript"
        },
        {
          "id": 21,
          "name": "mongodb"
        },
        {
          "id": 6,
          "name": "nodejs"
        },
        {
          "id": 14,
          "name": "postgresql"
        },
        {
          "id": 17,
          "name": "react"
        },
        {
          "id": 24,
          "name": "rest"
        },
        {
          "id": 23,
          "name": "restapi"
        },
        {
          "id": 5,
          "name": "typescript"
        }
      ]
    }
  }
}
```
2. **Find Similar Candidate**
Once a candidate is created, you can find similar candidates based on overlapping skills using the **similarCandidates** query.
``` graphql
query {
  similarCandidates(candidateId: 4, limit: 2) {
    overlapScore
    candidate {
      id
      name
      title
      skills{
        name
      }
    }
  }
}
```
Sample Response
```json
{
  "data": {
    "similarCandidates": [
      {
        "overlapScore": 15,
        "candidate": {
          "id": 3,
          "name": "James Wilson",
          "title": "Software Engineer",
          "skills": [
            {
              "name": "api"
            },
            {
              "name": "css"
            },
            {
              "name": "docker"
            },
            {
              "name": "express"
            },
            {
              "name": "git"
            },
            {
              "name": "graphql"
            },
            {
              "name": "html"
            },
            {
              "name": "javascript"
            },
            {
              "name": "mongodb"
            },
            {
              "name": "nodejs"
            },
            {
              "name": "postgresql"
            },
            {
              "name": "react"
            },
            {
              "name": "rest"
            },
            {
              "name": "restapi"
            },
            {
              "name": "typescript"
            }
          ]
        }
      },
      {
        "overlapScore": 5,
        "candidate": {
          "id": 1,
          "name": "Priya Sharma",
          "title": "Backend Engineer (GraphQL/Postgres)",
          "skills": [
            {
              "name": "agile"
            },
            {
              "name": "aws"
            },
            {
              "name": "cicd"
            },
            {
              "name": "databasedesign"
            },
            {
              "name": "docker"
            },
            {
              "name": "graphql"
            },
            {
              "name": "java"
            },
            {
              "name": "nodejs"
            },
            {
              "name": "postgresql"
            },
            {
              "name": "postgressql"
            },
            {
              "name": "python"
            },
            {
              "name": "scrum"
            },
            {
              "name": "sql"
            },
            {
              "name": "typescript"
            }
          ]
        }
      }
    ]
  }
}
```
   



