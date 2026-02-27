// GitHub API Utility

export interface GitHubData {
    publicRepos: number
    totalStars: number
    languages: Record<string, number>
    recentRepos: {
        name: string
        url: string
        updatedAt: string
        description: string | null
        language: string | null
    }[]
    lastActivity: string | null
}

export async function fetchGitHubData(username: string): Promise<GitHubData | null> {
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`)
        if (!userResponse.ok) return null
        const userData = await userResponse.json()

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
        if (!reposResponse.ok) return null
        const reposData = await reposResponse.json()

        let totalStars = 0
        const languages: Record<string, number> = {}

        reposData.forEach((repo: any) => {
            totalStars += repo.stargazers_count
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1
            }
        })

        const recentRepos = reposData.slice(0, 5).map((repo: any) => ({
            name: repo.name,
            url: repo.html_url,
            updatedAt: repo.updated_at,
            description: repo.description,
            language: repo.language,
        }))

        return {
            publicRepos: userData.public_repos,
            totalStars,
            languages,
            recentRepos,
            lastActivity: reposData.length > 0 ? reposData[0].updated_at : null,
        }
    } catch (error) {
        console.error("Error fetching GitHub data:", error)
        return null
    }
}
