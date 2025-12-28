import React, { useState, useEffect } from 'react';
import postsData from '../data/posts.json';

type Post = {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
  externalLink?: string;
};

const AdminPanel = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(postsData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleAddPost = () => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: 'New Post',
      date: new Date().toISOString().slice(0, 10),
      content: 'New post content.',
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
    setEditingPost(null);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={handleAddPost}>Add New Post</button>
      {editingPost && (
        <div>
          <h3>Edit Post</h3>
          <input
            type="text"
            value={editingPost.title}
            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
          />
          <textarea
            value={editingPost.content}
            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={editingPost.imageUrl || ''}
            onChange={(e) =>
              setEditingPost({ ...editingPost, imageUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="External Link"
            value={editingPost.externalLink || ''}
            onChange={(e) =>
              setEditingPost({ ...editingPost, externalLink: e.target.value })
            }
          />
          <button onClick={() => handleUpdatePost(editingPost)}>Update Post</button>
        </div>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleEditPost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
