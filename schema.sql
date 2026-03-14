CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  location TEXT,
  years_experience INT
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS candidate_skills (
  candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  skill_id INT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level INT,
  PRIMARY KEY (candidate_id, skill_id)
);

-- Seed a few example candidates and skills
INSERT INTO skills (name) VALUES
  ('typescript'),
  ('javascript'),
  ('react'),
  ('graphql'),
  ('postgres')
ON CONFLICT (name) DO NOTHING;

INSERT INTO candidates (name, title, location, years_experience) VALUES
  ('Alice Johnson', 'Senior TypeScript Engineer', 'London', 7),
  ('Bob Smith', 'Fullstack Developer (React/Node)', 'Berlin', 5),
  ('Carol Lee', 'Backend Engineer (GraphQL/Postgres)', 'Remote', 6),
  ('David Kim', 'Frontend Engineer', 'London', 4),
  ('Eve Martinez', 'Software Engineer', 'New York', 3)
ON CONFLICT DO NOTHING;

-- Link candidates to skills (id assumptions are fine for demo)
INSERT INTO candidate_skills (candidate_id, skill_id, level)
SELECT c.id, s.id, 5
FROM candidates c
JOIN skills s ON s.name = 'typescript'
WHERE c.name IN ('Alice Johnson', 'Bob Smith', 'Eve Martinez')
ON CONFLICT DO NOTHING;

INSERT INTO candidate_skills (candidate_id, skill_id, level)
SELECT c.id, s.id, 5
FROM candidates c
JOIN skills s ON s.name = 'javascript'
WHERE c.name IN ('Alice Johnson', 'Bob Smith', 'David Kim', 'Eve Martinez')
ON CONFLICT DO NOTHING;

INSERT INTO candidate_skills (candidate_id, skill_id, level)
SELECT c.id, s.id, 5
FROM candidates c
JOIN skills s ON s.name = 'react'
WHERE c.name IN ('Alice Johnson', 'Bob Smith', 'David Kim')
ON CONFLICT DO NOTHING;

INSERT INTO candidate_skills (candidate_id, skill_id, level)
SELECT c.id, s.id, 5
FROM candidates c
JOIN skills s ON s.name = 'graphql'
WHERE c.name IN ('Alice Johnson', 'Carol Lee')
ON CONFLICT DO NOTHING;

INSERT INTO candidate_skills (candidate_id, skill_id, level)
SELECT c.id, s.id, 5
FROM candidates c
JOIN skills s ON s.name = 'postgres'
WHERE c.name IN ('Carol Lee', 'Eve Martinez')
ON CONFLICT DO NOTHING;
