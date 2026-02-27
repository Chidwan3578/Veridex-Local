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
  leetcodeUsername: string | null
  leetcodeScore: number | null
  leetcodeRank: number | null
  linkedinUrl: string | null
  linkedinCertificationsCount: number | null
  linkedinCertifications: string | null
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
    password: "pass",
    role: "recruiter",
    image: null,
  })

  // Candidates
  const candidate1 = db.user.create({
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "pass",
    role: "candidate",
    image: null,
  })
  const candidate2 = db.user.create({
    name: "Jordan Rivera",
    email: "jordan@example.com",
    password: "pass",
    role: "candidate",
    image: null,
  })
  const candidate3 = db.user.create({
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "pass",
    role: "candidate",
    image: null,
  })
  const candidate4 = db.user.create({
    name: "David Chen",
    email: "david@example.com",
    password: "pass",
    role: "candidate",
    image: null,
  })
  const candidate5 = db.user.create({
    name: "Elena Rodriguez",
    email: "elena@example.com",
    password: "pass",
    role: "candidate",
    image: null,
  })

  // Candidate profiles
  db.candidateProfile.create({
    userId: candidate1.id,
    githubUsername: "alexmorgan",
    cgpa: 9.5,
    overallScore: 88,
    riskScore: "Low",
    dataCompleteness: 98,
    lastActiveDate: new Date("2026-02-15"),
    leetcodeUsername: "alex_m_codes",
    leetcodeScore: 2150,
    leetcodeRank: 12000,
    linkedinUrl: "https://linkedin.com/in/alexmorgan-dev",
    linkedinCertificationsCount: 7,
    linkedinCertifications: "AWS Certified Solutions Architect, Google Professional Cloud Architect, Microsoft Certified: Azure Fundamentals",
    resumeText: "Senior Full-Stack Developer with expertise in React, Node.js, and Cloud Infrastructure. Proven track record of leading technical teams and delivering high-impact features.",
  })
  db.candidateProfile.create({
    userId: candidate2.id,
    githubUsername: "jordanrivera",
    cgpa: 8.0,
    overallScore: 71,
    riskScore: "Medium",
    dataCompleteness: 80,
    lastActiveDate: new Date("2025-11-20"),
    leetcodeUsername: "jrivera",
    leetcodeScore: 1200,
    leetcodeRank: 150000,
    linkedinUrl: "https://linkedin.com/in/jrivera",
    linkedinCertificationsCount: 1,
    linkedinCertifications: null,
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
    leetcodeUsername: "psharma",
    leetcodeScore: 2400,
    leetcodeRank: 5000,
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    linkedinCertificationsCount: 8,
    linkedinCertifications: "TensorFlow Developer Certificate, Deep Learning Specialization, Data Science Professional Certificate",
    resumeText: "Data Scientist specializing in Machine Learning, Python, and TensorFlow. Proficient in data analysis and building predictive models.",
  })
  db.candidateProfile.create({
    userId: candidate4.id,
    githubUsername: "dchen_dev",
    cgpa: 8.9,
    overallScore: 82,
    riskScore: "Low",
    dataCompleteness: 90,
    lastActiveDate: new Date("2026-01-10"),
    leetcodeUsername: "dchen_lc",
    leetcodeScore: 1800,
    leetcodeRank: 45000,
    linkedinUrl: "https://linkedin.com/in/dchen",
    linkedinCertificationsCount: 4,
    linkedinCertifications: "Meta Front-End Developer Professional Certificate, UX Design Certificate",
    resumeText: "Frontend expert specialized in Next.js and Tailwind. Strong eye for design and performance optimization.",
  })
  db.candidateProfile.create({
    userId: candidate5.id,
    githubUsername: "erodriguez",
    cgpa: 9.2,
    overallScore: 78,
    riskScore: "High",
    dataCompleteness: 85,
    lastActiveDate: new Date("2025-12-05"),
    leetcodeUsername: "elena_codes",
    leetcodeScore: 1100,
    leetcodeRank: 200000,
    linkedinUrl: "https://linkedin.com/in/elenarodriguez",
    linkedinCertificationsCount: 2,
    linkedinCertifications: "HashiCorp Certified: Terraform Associate, AWS Certified SysOps Administrator",
    resumeText: "DevOps Engineer with experience in Kubernetes, Docker, and CI/CD pipelines. Passionate about automation.",
  })

  // Demo Master Profile
  const demoMaster = db.user.create({
    name: "Demo Master",
    email: "demo@veridex.io",
    password: "pass",
    role: "candidate",
    image: null,
  })

  db.candidateProfile.create({
    userId: demoMaster.id,
    githubUsername: "demomaster",
    cgpa: 9.9,
    overallScore: 94,
    riskScore: "Low",
    dataCompleteness: 100,
    lastActiveDate: new Date(),
    leetcodeUsername: "demomaster_lc",
    leetcodeScore: 2850,
    leetcodeRank: 120,
    linkedinUrl: "https://linkedin.com/in/demomaster",
    linkedinCertificationsCount: 12,
    linkedinCertifications: "AWS Certified Security - Specialty, Google Professional Data Engineer, CKA: Certified Kubernetes Administrator, Oracle Cloud Infrastructure Architect",
    resumeText: "Elite Software Engineer with expertise in distributed systems, AI, and cloud architecture. LeetCode Guardian and multi-certified cloud professional.",
  })

  // Skills for everyone
  const allCandidates = [
    {
      id: demoMaster.id, skills: [
        { name: "System Design", score: 96, complexityScore: 98, consistencyScore: 95, collaborationScore: 92, recencyScore: 98, impactScore: 95, certificationBonus: 95 },
        { name: "Algorithms", score: 98, complexityScore: 99, consistencyScore: 98, collaborationScore: 90, recencyScore: 99, impactScore: 94, certificationBonus: 90 },
        { name: "Cloud Architecture", score: 92, complexityScore: 90, consistencyScore: 92, collaborationScore: 95, recencyScore: 90, impactScore: 92, certificationBonus: 100 },
      ]
    },
    {
      id: candidate1.id, skills: [
        { name: "React", score: 88, complexityScore: 85, consistencyScore: 90, collaborationScore: 82, recencyScore: 95, impactScore: 80, certificationBonus: 90 },
        { name: "Node.js", score: 82, complexityScore: 80, consistencyScore: 85, collaborationScore: 78, recencyScore: 88, impactScore: 75, certificationBonus: 70 },
        { name: "TypeScript", score: 90, complexityScore: 88, consistencyScore: 92, collaborationScore: 85, recencyScore: 93, impactScore: 82, certificationBonus: 85 },
      ]
    },
    {
      id: candidate2.id, skills: [
        { name: "Java", score: 78, complexityScore: 75, consistencyScore: 80, collaborationScore: 65, recencyScore: 55, impactScore: 72, certificationBonus: 80 },
        { name: "Spring Boot", score: 72, complexityScore: 70, consistencyScore: 75, collaborationScore: 60, recencyScore: 50, impactScore: 68, certificationBonus: 70 },
      ]
    },
    {
      id: candidate3.id, skills: [
        { name: "Python", score: 92, complexityScore: 90, consistencyScore: 95, collaborationScore: 88, recencyScore: 96, impactScore: 90, certificationBonus: 95 },
        { name: "Machine Learning", score: 88, complexityScore: 92, consistencyScore: 85, collaborationScore: 80, recencyScore: 90, impactScore: 88, certificationBonus: 85 },
      ]
    },
    {
      id: candidate4.id, skills: [
        { name: "React", score: 94, complexityScore: 88, consistencyScore: 96, collaborationScore: 85, recencyScore: 98, impactScore: 88, certificationBonus: 80 },
        { name: "Next.js", score: 92, complexityScore: 90, consistencyScore: 92, collaborationScore: 80, recencyScore: 95, impactScore: 85, certificationBonus: 70 },
      ]
    },
    {
      id: candidate5.id, skills: [
        { name: "Kubernetes", score: 85, complexityScore: 92, consistencyScore: 80, collaborationScore: 75, recencyScore: 82, impactScore: 90, certificationBonus: 90 },
        { name: "Docker", score: 88, complexityScore: 85, consistencyScore: 88, collaborationScore: 80, recencyScore: 85, impactScore: 82, certificationBonus: 85 },
      ]
    },
  ]

  allCandidates.forEach((c) => {
    c.skills.forEach((s) => {
      const skill = db.skill.create({ candidateId: c.id, ...s })
      const months = ["Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"]
      months.forEach((m, i) => {
        db.skillHistory.create({ skillId: skill.id, month: m, score: Math.max(40, s.score - 15 + i * 3 + Math.floor(Math.random() * 5)) })
      })
    })
  })

  // Create 5 Jobs
  db.job.create({
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
  db.job.create({
    recruiterId: recruiter.id,
    title: "AI/ML Scientist",
    description: "Join our core AI team to build next-gen LLM applications. Strong Python and ML mathematical foundations required.",
    backendWeight: "optional",
    consistencyWeight: "important",
    collaborationWeight: "important",
    recencyWeight: "critical",
    impactWeight: "critical",
    cgpaWeight: 0,
    minThreshold: 60,
    cgpaThreshold: 9.0,
    cgpaCondition: "above",
  })
  db.job.create({
    recruiterId: recruiter.id,
    title: "Frontend Architect",
    description: "Lead our design system implementation and performance optimization across all web properties. Expert-level React/Next.js needed.",
    backendWeight: "optional",
    consistencyWeight: "critical",
    collaborationWeight: "important",
    recencyWeight: "important",
    impactWeight: "important",
    cgpaWeight: 0,
    minThreshold: 55,
    cgpaThreshold: null,
    cgpaCondition: null,
  })
  db.job.create({
    recruiterId: recruiter.id,
    title: "DevOps Lead",
    description: "Scale our global infrastructure using Kubernetes and Terraform. Focus on security, reliability, and developer experience.",
    backendWeight: "important",
    consistencyWeight: "important",
    collaborationWeight: "critical",
    recencyWeight: "important",
    impactWeight: "critical",
    cgpaWeight: 0,
    minThreshold: 50,
    cgpaThreshold: 7.5,
    cgpaCondition: "above",
  })
  db.job.create({
    recruiterId: recruiter.id,
    title: "Data Engineer",
    description: "Design and maintain high-volume data pipelines. Expertise in Spark, Kafka, and distributed systems is essential.",
    backendWeight: "critical",
    consistencyWeight: "important",
    collaborationWeight: "optional",
    recencyWeight: "important",
    impactWeight: "important",
    cgpaWeight: 0,
    minThreshold: 50,
    cgpaThreshold: 8.0,
    cgpaCondition: "above",
  })

  // Precomputed match results for the first job to ensure demo consistency
  const firstJob = db.job.findAll()[0]
  db.matchResult.create({
    jobId: firstJob.id,
    candidateId: candidate1.id,
    fitScore: 79,
    riskLevel: "Low",
    gapSummary: "Strong frontend skills; backend experience could be deeper. Good collaboration track record.",
  })
  db.matchResult.create({
    jobId: firstJob.id,
    candidateId: candidate2.id,
    fitScore: 62,
    riskLevel: "Medium",
    gapSummary: "Solid Java/Spring background but declining recency scores. Low collaboration metrics flagged.",
  })
  db.matchResult.create({
    jobId: firstJob.id,
    candidateId: candidate3.id,
    fitScore: 85,
    riskLevel: "Low",
    gapSummary: "Excellent overall profile with strong ML focus. May need ramping on full-stack specifics.",
  })
}

// Auto-seed on import
seedDatabase()
