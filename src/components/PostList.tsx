import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import posts from '../data/posts.json';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PostList = () => {
  const postListRef = useRef(null);

  useEffect(() => {
    const posts = postListRef.current.children;
    gsap.fromTo(
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
  }, []);

  return (
    <ul className="post-list" ref={postListRef}>
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