/**
 * 게시판 서비스 (Mock)
 * 추후 백엔드 API 연결 시 이 파일만 수정하면 됩니다.
 */
import { mockPosts, boardCategories } from '../data/mockData';

const STORAGE_KEY = 'sharedata_posts';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getPosts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [...mockPosts];
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export const boardService = {
  async getCategories() {
    await delay(200);
    return [...boardCategories];
  },

  async getPostsByCategory(category) {
    await delay(300);
    const posts = getPosts();
    return posts
      .filter((p) => p.category === category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAllPosts() {
    await delay(300);
    return getPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getPostById(id) {
    await delay(200);
    const posts = getPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) throw new Error('게시물을 찾을 수 없습니다.');
    return { ...post, views: post.views + 1 };
  },

  async createPost(postData) {
    await delay(400);
    const posts = getPosts();
    const newPost = {
      id: `post-${Date.now()}`,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    posts.unshift(newPost);
    savePosts(posts);
    return newPost;
  },

  async updatePost(id, postData) {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');
    
    posts[idx] = {
      ...posts[idx],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    savePosts(posts);
    return posts[idx];
  },

  async deletePost(id) {
    await delay(300);
    const posts = getPosts().filter((p) => p.id !== id);
    savePosts(posts);
  },

  async toggleLike(postId, userId) {
    await delay(200);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');
    
    if (!posts[idx].likedUsers) posts[idx].likedUsers = [];
    
    const likedIndex = posts[idx].likedUsers.indexOf(userId);
    if (likedIndex > -1) {
      posts[idx].likedUsers.splice(likedIndex, 1);
      posts[idx].likes = Math.max(0, posts[idx].likes - 1);
    } else {
      posts[idx].likedUsers.push(userId);
      posts[idx].likes += 1;
    }
    savePosts(posts);
    return posts[idx];
  },

  async addComment(postId, commentData) {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');
    
    if (!posts[idx].comments) posts[idx].comments = [];
    const newComment = {
      id: `comment-${Date.now()}`,
      ...commentData,
      createdAt: new Date().toISOString()
    };
    posts[idx].comments.push(newComment);
    savePosts(posts);
    return posts[idx];
  },

  async deleteComment(postId, commentId) {
    await delay(300);
    const posts = getPosts();
    const idx = posts.findIndex((p) => p.id === postId);
    if (idx === -1) throw new Error('게시물을 찾을 수 없습니다.');
    
    if (posts[idx].comments) {
      posts[idx].comments = posts[idx].comments.filter(c => c.id !== commentId);
      savePosts(posts);
    }
    return posts[idx];
  },

  async searchPosts(query, category) {
    await delay(300);
    let posts = getPosts();
    if (category) posts = posts.filter((p) => p.category === category);
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        (p.content && p.content.toLowerCase().includes(q))
    );
  },
};
