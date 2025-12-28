import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import postsData from '../data/posts.json';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : postsData;
    const currentPost = posts.find((p: any) => p.id === id);
    setPost(currentPost);
  }, [id]);

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
