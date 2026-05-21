import { Octokit } from '@octokit/rest'

export async function validateGitHubToken(
  token: string,
  repoUrl: string
): Promise<{ valid: boolean; error?: string }> {
  let owner: string, repo: string
  try {
    ;({ owner, repo } = parseRepoUrl(repoUrl))
  } catch {
    return {
      valid: false,
      error:
        'Invalid repository URL. Use the format: https://github.com/username/repo-name',
    }
  }

  try {
    const octokit = new Octokit({ auth: token })
    await octokit.repos.get({ owner, repo })
    return { valid: true }
  } catch (err: unknown) {
    const status = (err as { status?: number }).status
    if (status === 401) {
      return {
        valid: false,
        error:
          'Invalid or expired personal access token. Go to GitHub → Settings → Developer settings → Personal access tokens and create a new one with "repo" scope.',
      }
    }
    if (status === 404) {
      return {
        valid: false,
        error: `Repository "${owner}/${repo}" not found. Make sure the repo exists and your token has access to it.`,
      }
    }
    return {
      valid: false,
      error: `GitHub connection failed (HTTP ${status ?? 'unknown'}). Check your token has "repo" scope.`,
    }
  }
}

export function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/)
  if (!match) throw new Error('Invalid GitHub repository URL')
  return { owner: match[1], repo: match[2] }
}

export async function createBlogPR({
  token,
  repoUrl,
  slug,
  title,
  content,
}: {
  token: string
  repoUrl: string
  slug: string
  title: string
  content: string
}): Promise<{ prUrl: string; prNumber: number }> {
  const octokit = new Octokit({ auth: token })
  const { owner, repo } = parseRepoUrl(repoUrl)

  // Get default branch
  const repoInfo = await octokit.repos.get({ owner, repo })
  const defaultBranch = repoInfo.data.default_branch

  // Get latest commit SHA
  const ref = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  })
  const latestSha = ref.data.object.sha

  // Create new branch
  const branchName = `blog/${slug}-${Date.now()}`
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: latestSha,
  })

  // Create file
  const filePath = `content/blog/${slug}.mdx`
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add blog post: ${title}`,
    content: Buffer.from(content).toString('base64'),
    branch: branchName,
  })

  // Create PR
  const pr = await octokit.pulls.create({
    owner,
    repo,
    title: `Blog: ${title}`,
    body: `## New Blog Post\n\n**Title:** ${title}\n\n**File:** \`${filePath}\`\n\nThis PR was created automatically by SEO Pilot.`,
    head: branchName,
    base: defaultBranch,
  })

  return {
    prUrl: pr.data.html_url,
    prNumber: pr.data.number,
  }
}
