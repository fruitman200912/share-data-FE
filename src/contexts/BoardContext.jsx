import { createContext, useReducer, useCallback } from 'react';
import { boardService } from '../services/boardService';

export const BoardContext = createContext(null);

const initialState = {
  posts: [],
  currentPost: null,
  categories: [],
  isLoading: false,
  error: null,
};

function boardReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, isLoading: false };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload, isLoading: false };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts], isLoading: false };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost,
        isLoading: false
      };
    case 'REMOVE_POST':
      return { ...state, posts: state.posts.filter((p) => p.id !== action.payload), isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  const loadCategories = useCallback(async () => {
    const categories = await boardService.getCategories();
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  }, []);

  const loadPosts = useCallback(async (category) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const posts = category
        ? await boardService.getPostsByCategory(category)
        : await boardService.getAllPosts();
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const loadPost = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.getPostById(id);
      dispatch({ type: 'SET_CURRENT_POST', payload: post });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.createPost(postData);
      dispatch({ type: 'ADD_POST', payload: post });
      return post;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const updatePost = useCallback(async (id, postData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const post = await boardService.updatePost(id, postData);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    await boardService.deletePost(id);
    dispatch({ type: 'REMOVE_POST', payload: id });
  }, []);

  const toggleLike = useCallback(async (postId, userId) => {
    try {
      const post = await boardService.toggleLike(postId, userId);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const addComment = useCallback(async (postId, commentData) => {
    try {
      const post = await boardService.addComment(postId, commentData);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (postId, commentId) => {
    try {
      const post = await boardService.deleteComment(postId, commentId);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const searchPosts = useCallback(async (query, category) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const posts = await boardService.searchPosts(query, category);
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  return (
    <BoardContext.Provider
      value={{ ...state, loadCategories, loadPosts, loadPost, createPost, updatePost, deletePost, toggleLike, addComment, deleteComment, searchPosts }}
    >
      {children}
    </BoardContext.Provider>
  );
}
