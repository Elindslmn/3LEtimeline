import React from 'react';
import { useParams } from 'react-router-dom';
import posts from '../data/posts.json';

const Post = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post">
      <h1>{post.title}</h1>
      <p className="post-meta">{post.date}</p>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default Post;
