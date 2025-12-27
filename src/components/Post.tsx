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
      {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      {post.externalLink && (
        <a href={post.externalLink} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      )}
    </div>
  );
};

export default Post;