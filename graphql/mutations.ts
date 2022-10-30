import { gql } from "@apollo/client";

export const ADD_POST = gql`
  mutation MyMutation(
    $body: String
    $image: String
    $community_id: ID
    $title: String
    $username: String
  ) {
    insertPost(
      body: $body
      image: $image
      community_id: $community_id
      title: $title
      username: $username
    ) {
      body
      community_id
      created_at
      id
      image
      title
      username
    }
  }
`;

export const ADD_COMMUNITY = gql`
  mutation MyMutation($topic: String!) {
    insertCommunity(topic: $topic) {
      created_at
      id
      topic
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      created_at
      id
      post_id
      username
      text
    }
  }
`;

export const ADD_LIKE = gql`
mutation MyMutation($post_id: ID!, $username: String!, $like: Boolean!) {
    insertLike(post_id: $post_id, like: $like, username: $username) {
      created_at
      id
      post_id
      username
      like
    }
  }
`