import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';
import { Canvas } from '@react-three/fiber';
import DNA from './DNA';

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const postListRef = useRef(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(postsData);
    }
  }, []);

  useEffect(() => {
    if (window.gsap && postListRef.current) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      const posts = postListRef.current.children;
      window.gsap.fromTo(
        posts,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: postListRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, [posts]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ul className="post-list" ref={postListRef}>
          {posts.map((post: any) => (
            <li key={post.id} className="post-list-item">
              <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="post-meta">{post.date}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <DNA />
        </Canvas>
      </div>
    </div>
  );
};

export default PostList;