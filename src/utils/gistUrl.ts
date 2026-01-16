/**
 * Transforms a Gist URL to its raw content URL
 * gist.github.com/user/hash -> gist.githubusercontent.com/user/hash/raw
 *
 * If the URL is already a raw URL or not a gist URL, returns it unchanged
 */
export function toRawGistUrl(url: string): string {
  // Already a raw URL
  if (url.includes('gist.githubusercontent.com')) {
    return url
  }

  // Transform gist.github.com to gist.githubusercontent.com/raw
  const gistMatch = url.match(/^https?:\/\/gist\.github\.com\/([^/]+)\/([^/]+)\/?$/)
  if (gistMatch) {
    const [, user, hash] = gistMatch
    return `https://gist.githubusercontent.com/${user}/${hash}/raw`
  }

  // Return unchanged if not a recognized gist URL
  return url
}

/**
 * Checks if a URL is a valid Gist URL (either regular or raw)
 */
export function isGistUrl(url: string): boolean {
  return url.includes('gist.github.com') || url.includes('gist.githubusercontent.com')
}
