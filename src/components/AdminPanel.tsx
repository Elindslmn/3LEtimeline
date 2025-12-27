import React, { useState } from 'react';
import postsData from '../data/posts.json';

type Post = {
  id: string;
  title: string;
  date: string;
  content: string;
};

const AdminPanel = () => {
  const [posts, setPosts] = useState<Post[]>(postsData);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleAddPost = () => {
    const newPost = {
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
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setEditingPost(null);
  };

  const handleDownload = () => {
    const data = JSON.stringify(posts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={handleAddPost}>Add New Post</button>
      <button onClick={handleDownload}>Download posts.json</button>
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