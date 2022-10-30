import { gql } from "@apollo/client";

export const GET_COMMUNITY_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getCommunityListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;

export const GET_ALL_LIKES_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getLikesByPostId(post_id: $post_id) {
      id
      like
      created_at
      username
    }
  }
`;


export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      title
      username
      community_id
      comment {
        created_at
        id
        post_id
        text
        username
      }
      community {
        created_at
        id
        topic
      }
      likes {
        created_at
        id
        post_id
        username
        like
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      created_at
      id
      image
      title
      username
      community_id
      comment {
        created_at
        id
        post_id
        text
        username
      }
      community {
        created_at
        id
        topic
      }
      likes {
        created_at
        id
        post_id
        username
        like
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostById(post_id: $post_id) {
      body
      created_at
      id
      image
      title
      username
      community_id
      comment {
        created_at
        id
        post_id
        text
        username
      }
      community {
        created_at
        id
        topic
      }
      likes {
        created_at
        id
        post_id
        username
        like
      }
    }
  }
`;
