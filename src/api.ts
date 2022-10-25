export interface IPost {
  id: number
  description: string
  file_url: string
  name?: string
  pools?: Array<IPool>
}

export interface IPool {
  name: string
  size: number
  posts?: Array<IPost>
  index?: number
  previd?: number
  nextid?: number
}

export interface IHome {
  // each pool will only have up to 3 first posts in it
  pools: Array<IPool>
}

export async function fetchPost(postId: number): Promise<IPost | null> {
  return await fetch(`/api/post/${postId}`).then(r => r.status == 200 ? r.json() : null);
}