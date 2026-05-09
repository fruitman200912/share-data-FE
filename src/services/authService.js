/**
 * 인증 서비스 (Mock)
 * 추후 백엔드 API 연결 시 이 파일만 수정하면 됩니다.
 */
import { mockUsers } from '../data/mockData';

const STORAGE_KEY = 'sharedata_auth';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(500);
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    const { password: _, ...userData } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  },

  async signup(name, email, password) {
    await delay(500);
    const exists = mockUsers.find((u) => u.email === email);
    if (exists) throw new Error('이미 사용 중인 이메일입니다.');
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async logout() {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
};
