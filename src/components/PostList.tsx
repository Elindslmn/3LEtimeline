import React from 'react';
import { Link } from 'react-router-dom';
import posts from '../data/posts.json';

const PostList = () => {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-list-item">
          <h2>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="post-meta">{post.date}</p>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
