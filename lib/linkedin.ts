/**
 * Simulated LinkedIn API service for Veridex demo
 */

export interface LinkedInCert {
    name: string
    issuer: string
    date: string
}

const MOCK_CERTS_DB: Record<string, string[]> = {
    "alexmorgan": [
        "AWS Certified Solutions Architect",
        "Google Professional Cloud Architect",
        "Microsoft Certified: Azure Fundamentals"
    ],
    "priyasharma": [
        "TensorFlow Developer Certificate",
        "Deep Learning Specialization",
        "Data Science Professional Certificate"
    ],
    "demomaster": [
        "AWS Certified Security - Specialty",
        "Google Professional Data Engineer",
        "CKA: Certified Kubernetes Administrator",
        "Oracle Cloud Infrastructure Architect"
    ],
    "dchen": [
        "Meta Front-End Developer Professional Certificate",
        "UX Design Certificate"
    ],
    "elenarodriguez": [
        "HashiCorp Certified: Terraform Associate",
        "AWS Certified SysOps Administrator"
    ],
    "jrivera": [
        "CompTIA Security+"
    ]
}

/**
 * Simulates fetching certifications from LinkedIn based on a URL or username
 */
export async function fetchLinkedInCertifications(urlOrUsername: string): Promise<string[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!urlOrUsername) return []

    // Extract username from URL if necessary (e.g., linkedin.com/in/username)
    const username = urlOrUsername.split('/').pop()?.toLowerCase() || urlOrUsername.toLowerCase()

    // Return mock data if found, otherwise return a few default ones to make the demo feel "real"
    if (MOCK_CERTS_DB[username]) {
        return MOCK_CERTS_DB[username]
    }

    // Generic fallback for any other "username" to show the feature works
    if (username.length > 3) {
        return [
            "LinkedIn Verified Skill: Software Engineering",
            "Professional Ethics in Tech"
        ]
    }

    return []
}
