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
 * Fetches and returns post object for the given post ID
 * @param postId post ID as an integer
 * @returns post object if one was returned successfully by the API
 * @throws SyntaxError if API did not return JSON data
 */
export async function fetchPost(postId: number): Promise<IPost | null> {
  return await fetch(`/api/post/${postId}`).then(r => r.status == 200 ? r.json() : null);
}