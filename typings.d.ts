type Like = {
    created_at: string,
    id: number,
    post_id: number,
    like: boolean,
    username: string,
}

type Community = {
    created_at: string,
    id: number,
    topic: string,
}

type Comments = {
    created_at: string,
    id: number,
    post_id: number,
    text: string,
    username: string,
}

type Post = {
    created_at: string,
    id: number,
    title: string,
    username: string,
    body: string,
    image: string,
    community_id: number,
    likes: Like[],
    comment: Comments[],
    community: Community[],
}
