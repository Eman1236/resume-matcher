export type ParsedResume = {
  name: string;
  title: string | null;
  location: string | null;
  yearsExperience: number | null;
  skills: string[];
};

const LABELS: Record<string, RegExp> = {
  name: /^(?:name|full name|fullname|candidate)\s*[:\-]\s*(.+)$/i,
  title: /^(?:title|job title|position|professional title|role|headline)\s*[:\-]\s*(.+)$/i,
  location: /^(?:location|address|city|based in)\s*[:\-]\s*(.+)$/i,
  summary: /^(?:summary|objective|profile|about)\s*[:\-]\s*(.+)$/i,
  experience: /^(?:experience|work experience|employment)\s*[:\-]?\s*$/i,
  skills: /^(?:skills?|technical skills?|technologies|expertise)\s*[:\-]?\s*$/i,
};

const YEARS_PATTERNS = [
  /(\d+)\s*\+?\s*years?\s*(?:of\s*)?(?:experience|exp\.?)/gi,
  /(?:experience|exp\.?)\s*[:\-]?\s*(\d+)\s*years?/gi,
  /(\d+)\s*years?\s*(?:in\s*)?(?:software|development|engineering)/gi,
];

const COMMON_SKILLS = new Set([
  'typescript', 'javascript', 'react', 'node', 'nodejs', 'graphql', 'postgres', 'postgresql',
  'python', 'java', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'redux',
  'nestjs', 'express', 'mongodb', 'redis', 'rest', 'api', 'agile', 'scrum', 'tdd', 'ci/cd',
]);

function extractByLabel(lines: string[], label: keyof typeof LABELS): string | null {
  const re = LABELS[label];
  if (!re) return null;
  for (const line of lines) {
    const m = line.trim().match(re);
    if (m) return m[1]!.trim() || null;
  }
  return null;
}

function extractYears(text: string): number | null {
  let best: number | null = null;
  for (const re of YEARS_PATTERNS) {
    const m = re.exec(text);
    if (m) {
      const n = parseInt(m[1]!, 10);
      if (n >= 0 && n <= 50 && (best === null || n > best)) best = n;
    }
  }
  return best;
}

function extractSkillsSection(lines: string[]): string[] {
  const skills: string[] = [];
  const skillsLabel = LABELS.skills;
  if (!skillsLabel) return [];
  let inSkills = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    if (skillsLabel.test(line.trim())) {
      inSkills = true;
      continue;
    }
    if (inSkills) {
      if (line.trim() === '' || /^[A-Z][a-z]*\s*[:\-]/.test(line)) break;
      const parts = line.split(/[,;|•\-–—]/).map((s) => s.trim().toLowerCase()).filter(Boolean);
      skills.push(...parts);
    }
  }
  return [...new Set(skills)];
}

function extractSkillsFromFullText(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const skill of COMMON_SKILLS) {
    const re = new RegExp(`\\b${skill.replace(/[./]/g, (c) => (c === '/' ? '\\/' : c))}\\b`, 'i');
    if (re.test(lower)) found.push(skill);
  }
  return found;
}

export function parseResume(text: string): ParsedResume {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const fullText = text.replace(/\s+/g, ' ');

  const name =
    extractByLabel(lines, 'name') ??
    (lines[0] && lines[0].length < 80 && !/^\d|^[\d\s\-\.]+$/.test(lines[0]) ? lines[0] : null) ??
    'Unknown';

  const title =
    extractByLabel(lines, 'title') ??
    extractByLabel(lines, 'summary') ??
    (lines[1] && lines[1].length < 120 ? lines[1] : null) ??
    null;

  const location = extractByLabel(lines, 'location') ?? null;

  const yearsExperience = extractYears(fullText);

  const skillsSection = extractSkillsSection(lines);
  const skillsFromText = extractSkillsFromFullText(text);
  const combined = [...new Set([...skillsSection, ...skillsFromText])].filter(
    (s) => s.length >= 2 && s.length <= 50,
  );

  return {
    name: name.trim(),
    title: title?.trim() ?? null,
    location: location?.trim() ?? null,
    yearsExperience,
    skills: combined,
  };
}
