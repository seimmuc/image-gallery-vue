/** Post object */
export interface IPost {
  id: number
  description: string
  file_url: string
  name?: string
  pools?: Array<IPool>
}

/** Pool object */
export interface IPool {
  name: string
  size: number
  posts?: Array<IPost>
  index?: number
  previd?: number
  nextid?: number
}

/**
 * Collection of pools, each pool object will contain 'posts' attribute with up to 3 first posts in it
 */
export interface IHome {
  pools: Array<IPool>
}

/**
 * Fetches and returns post object with the given post ID
 * @param postId post ID as an integer
 * @returns post object if one was returned successfully by the API
 * @throws SyntaxError if API returned non-JSON data
 */
export async function fetchPost(postId: number): Promise<IPost | null> {
  return await fetch(`/api/post/${postId}`).then(r => r.status == 200 ? r.json() : null);
}

/**
 * Fetches and returns pool object with the given pool name
 * @param poolName name of the pool
 * @returns pool object if one was returned successfully by the API
 * @throws SyntaxError if API returned non-JSON data
 */
export async function fetchPool(poolName: string): Promise<IPool | null> {
  return await fetch(`/api/pool/${poolName}`).then(r => r.status == 200 ? r.json() : null);
}

/**
 * Fetches and returns home object containing gallery's categories
 * @returns home object if one was returned successfully by the API
 * @throws SyntaxError if API returned non-JSON data
 */
export async function fetchHome(): Promise<IHome | null> {
  return await fetch(`/api/home`).then(r => r.status == 200 ? r.json() : null);
}