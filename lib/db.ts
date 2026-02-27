// In-memory data store mirroring the Prisma schema for SQLite
// This provides the same API surface as Prisma client

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "candidate" | "recruiter"
  image: string | null
  createdAt: Date
}

export interface CandidateProfile {
  id: string
  userId: string
  githubUsername: string
  cgpa: number
  overallScore: number
  riskScore: string
  dataCompleteness: number
  lastActiveDate: Date
  resumeText: string | null
}

export interface Skill {
  id: string
  candidateId: string
  name: string
  score: number
  complexityScore: number
  consistencyScore: number
  collaborationScore: number
  recencyScore: number
  impactScore: number
  certificationBonus: number
}

export interface SkillHistory {
  id: string
  skillId: string
  month: string
  score: number
}

export interface Job {
  id: string
  recruiterId: string
  title: string
  description: string
  backendWeight: number | string
  consistencyWeight: number | string
  collaborationWeight: number | string
  recencyWeight: number | string
  impactWeight: number | string
  cgpaWeight: number | string
  minThreshold: number
  cgpaThreshold: number | null
  cgpaCondition: "above" | "below" | null
  createdAt: Date
}

export interface MatchResult {
  id: string
  jobId: string
  candidateId: string
  fitScore: number
  riskLevel: string
  gapSummary: string
}

// ---- In-memory database ----
let users: User[] = []
let candidateProfiles: CandidateProfile[] = []
let skills: Skill[] = []
let skillHistories: SkillHistory[] = []
let jobs: Job[] = []
let matchResults: MatchResult[] = []

function genId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// ---- User operations ----
export const db = {
  user: {
    findByEmail: (email: string) => users.find((u) => u.email === email) || null,
    findById: (id: string) => users.find((u) => u.id === id) || null,
    create: (data: Omit<User, "id" | "createdAt">) => {
      const user: User = { ...data, id: genId(), createdAt: new Date() }
      users.push(user)
      return user
    },
    findAll: () => [...users],
    update: (id: string, data: Partial<User>) => {
      const idx = users.findIndex((u) => u.id === id)
      if (idx === -1) return null
      users[idx] = { ...users[idx], ...data }
      return users[idx]
    },
  },
  candidateProfile: {
    findByUserId: (userId: string) => candidateProfiles.find((p) => p.userId === userId) || null,
    findById: (id: string) => candidateProfiles.find((p) => p.id === id) || null,
    findAll: () => [...candidateProfiles],
    create: (data: Omit<CandidateProfile, "id">) => {
      const profile: CandidateProfile = { ...data, id: genId() }
      candidateProfiles.push(profile)
      return profile
    },
    update: (id: string, data: Partial<CandidateProfile>) => {
      const idx = candidateProfiles.findIndex((p) => p.id === id)
      if (idx === -1) return null
      candidateProfiles[idx] = { ...candidateProfiles[idx], ...data }
      return candidateProfiles[idx]
    },
    upsertByUserId: (userId: string, data: Omit<CandidateProfile, "id" | "userId">) => {
      const existing = candidateProfiles.find((p) => p.userId === userId)
      if (existing) {
        const idx = candidateProfiles.indexOf(existing)
        candidateProfiles[idx] = { ...existing, ...data }
        return candidateProfiles[idx]
      }
      const profile: CandidateProfile = { ...data, id: genId(), userId }
      candidateProfiles.push(profile)
      return profile
    },
  },
  skill: {
    findByCandidateId: (candidateId: string) => skills.filter((s) => s.candidateId === candidateId),
    findById: (id: string) => skills.find((s) => s.id === id) || null,
    create: (data: Omit<Skill, "id">) => {
      const skill: Skill = { ...data, id: genId() }
      skills.push(skill)
      return skill
    },
    update: (id: string, data: Partial<Skill>) => {
      const idx = skills.findIndex((s) => s.id === id)
      if (idx === -1) return null
      skills[idx] = { ...skills[idx], ...data }
      return skills[idx]
    },
    delete: (id: string) => {
      skills = skills.filter((s) => s.id !== id)
    },
  },
  skillHistory: {
    findBySkillId: (skillId: string) => skillHistories.filter((h) => h.skillId === skillId),
    create: (data: Omit<SkillHistory, "id">) => {
      const history: SkillHistory = { ...data, id: genId() }
      skillHistories.push(history)
      return history
    },
  },
  job: {
    findById: (id: string) => jobs.find((j) => j.id === id) || null,
    findByRecruiterId: (recruiterId: string) => jobs.filter((j) => j.recruiterId === recruiterId),
    findAll: () => [...jobs],
    create: (data: Omit<Job, "id" | "createdAt">) => {
      const job: Job = { ...data, id: genId(), createdAt: new Date() }
      jobs.push(job)
      return job
    },
  },
  matchResult: {
    findByJobId: (jobId: string) => matchResults.filter((m) => m.jobId === jobId),
    findByJobAndCandidate: (jobId: string, candidateId: string) =>
      matchResults.find((m) => m.jobId === jobId && m.candidateId === candidateId) || null,
    create: (data: Omit<MatchResult, "id">) => {
      const match: MatchResult = { ...data, id: genId() }
      matchResults.push(match)
      return match
    },
    deleteByJobId: (jobId: string) => {
      matchResults = matchResults.filter((m) => m.jobId !== jobId)
    },
  },
}

// ---- SEED DATA ----
export function seedDatabase() {
  if (users.length > 0) return // already seeded

  // Recruiter
  const recruiter = db.user.create({
    name: "Sarah Chen",
    email: "recruiter@veridex.io",
    password: "password123",
    role: "recruiter",
    image: null,
  })

  // Candidates
  const candidate1 = db.user.create({
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "password123",
    role: "candidate",
    image: null,
  })
  const candidate2 = db.user.create({
    name: "Jordan Rivera",
    email: "jordan@example.com",
    password: "password123",
    role: "candidate",
    image: null,
  })
  const candidate3 = db.user.create({
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "password123",
    role: "candidate",
    image: null,
  })

  // Candidate profiles
  db.candidateProfile.create({
    userId: candidate1.id,
    githubUsername: "alexmorgan",
    cgpa: 9.5,
    overallScore: 82,
    riskScore: "Low",
    dataCompleteness: 95,
    lastActiveDate: new Date("2026-02-15"),
    resumeText: "Experienced Full-Stack Developer with expertise in React, Node.js, and TypeScript. Strong background in building scalable web applications and working with PostgreSQL databases.",
  })
  db.candidateProfile.create({
    userId: candidate2.id,
    githubUsername: "jordanrivera",
    cgpa: 8.0,
    overallScore: 71,
    riskScore: "Medium",
    dataCompleteness: 80,
    lastActiveDate: new Date("2025-11-20"),
    resumeText: null,
  })
  db.candidateProfile.create({
    userId: candidate3.id,
    githubUsername: "priyasharma",
    cgpa: 9.87,
    overallScore: 89,
    riskScore: "Low",
    dataCompleteness: 98,
    lastActiveDate: new Date("2026-02-25"),
    resumeText: "Data Scientist specializing in Machine Learning, Python, and TensorFlow. Proficient in data analysis and building predictive models.",
  })

  // Skills for candidate 1
  const skills1 = [
    { name: "React", score: 88, complexityScore: 85, consistencyScore: 90, collaborationScore: 82, recencyScore: 95, impactScore: 80, certificationBonus: 90 },
    { name: "Node.js", score: 82, complexityScore: 80, consistencyScore: 85, collaborationScore: 78, recencyScore: 88, impactScore: 75, certificationBonus: 70 },
    { name: "TypeScript", score: 90, complexityScore: 88, consistencyScore: 92, collaborationScore: 85, recencyScore: 93, impactScore: 82, certificationBonus: 85 },
    { name: "Python", score: 70, complexityScore: 65, consistencyScore: 72, collaborationScore: 68, recencyScore: 60, impactScore: 70, certificationBonus: 50 },
    { name: "PostgreSQL", score: 75, complexityScore: 70, consistencyScore: 78, collaborationScore: 72, recencyScore: 80, impactScore: 68, certificationBonus: 60 },
  ]
  skills1.forEach((s) => {
    const skill = db.skill.create({ candidateId: candidate1.id, ...s })
    const months = ["Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"]
    months.forEach((m, i) => {
      db.skillHistory.create({ skillId: skill.id, month: m, score: Math.max(40, s.score - 15 + i * 3 + Math.floor(Math.random() * 5)) })
    })
  })

  // Skills for candidate 2
  const skills2 = [
    { name: "Java", score: 78, complexityScore: 75, consistencyScore: 80, collaborationScore: 65, recencyScore: 55, impactScore: 72, certificationBonus: 80 },
    { name: "Spring Boot", score: 72, complexityScore: 70, consistencyScore: 75, collaborationScore: 60, recencyScore: 50, impactScore: 68, certificationBonus: 70 },
    { name: "React", score: 65, complexityScore: 60, consistencyScore: 68, collaborationScore: 62, recencyScore: 70, impactScore: 55, certificationBonus: 40 },
    { name: "Docker", score: 68, complexityScore: 72, consistencyScore: 65, collaborationScore: 58, recencyScore: 48, impactScore: 70, certificationBonus: 60 },
    { name: "AWS", score: 60, complexityScore: 55, consistencyScore: 62, collaborationScore: 50, recencyScore: 45, impactScore: 58, certificationBonus: 75 },
  ]
  skills2.forEach((s) => {
    const skill = db.skill.create({ candidateId: candidate2.id, ...s })
    const months = ["Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"]
    months.forEach((m, i) => {
      db.skillHistory.create({ skillId: skill.id, month: m, score: Math.max(30, s.score - 20 + i * 2 + Math.floor(Math.random() * 8)) })
    })
  })

  // Skills for candidate 3
  const skills3 = [
    { name: "Python", score: 92, complexityScore: 90, consistencyScore: 95, collaborationScore: 88, recencyScore: 96, impactScore: 90, certificationBonus: 95 },
    { name: "Machine Learning", score: 88, complexityScore: 92, consistencyScore: 85, collaborationScore: 80, recencyScore: 90, impactScore: 88, certificationBonus: 85 },
    { name: "TensorFlow", score: 85, complexityScore: 88, consistencyScore: 82, collaborationScore: 78, recencyScore: 88, impactScore: 85, certificationBonus: 80 },
    { name: "React", score: 72, complexityScore: 68, consistencyScore: 75, collaborationScore: 70, recencyScore: 78, impactScore: 65, certificationBonus: 60 },
    { name: "PostgreSQL", score: 78, complexityScore: 75, consistencyScore: 80, collaborationScore: 76, recencyScore: 82, impactScore: 72, certificationBonus: 70 },
  ]
  skills3.forEach((s) => {
    const skill = db.skill.create({ candidateId: candidate3.id, ...s })
    const months = ["Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"]
    months.forEach((m, i) => {
      db.skillHistory.create({ skillId: skill.id, month: m, score: Math.max(50, s.score - 10 + i * 2 + Math.floor(Math.random() * 4)) })
    })
  })

  // Demo Job
  const job = db.job.create({
    recruiterId: recruiter.id,
    title: "Senior Full-Stack Engineer",
    description: "Looking for a senior full-stack engineer with strong backend fundamentals, consistency in contributions, and ability to collaborate across teams.",
    backendWeight: "important",
    consistencyWeight: "important",
    collaborationWeight: "optional",
    recencyWeight: "important",
    impactWeight: "critical",
    cgpaWeight: 0,
    minThreshold: 50,
    cgpaThreshold: 8.5,
    cgpaCondition: "above",
  })

  // Precomputed match results
  db.matchResult.create({
    jobId: job.id,
    candidateId: candidate1.id,
    fitScore: 79,
    riskLevel: "Low",
    gapSummary: "Strong frontend skills; backend experience could be deeper. Good collaboration track record.",
  })
  db.matchResult.create({
    jobId: job.id,
    candidateId: candidate2.id,
    fitScore: 62,
    riskLevel: "Medium",
    gapSummary: "Solid Java/Spring background but declining recency scores. Low collaboration metrics flagged.",
  })
  db.matchResult.create({
    jobId: job.id,
    candidateId: candidate3.id,
    fitScore: 85,
    riskLevel: "Low",
    gapSummary: "Excellent overall profile with strong ML focus. May need ramping on full-stack specifics.",
  })
}

// Auto-seed on import
seedDatabase()
