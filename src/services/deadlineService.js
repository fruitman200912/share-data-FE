/**
 * 과제/기한 서비스 (Mock)
 * 추후 백엔드 API 연결 시 이 파일만 수정하면 됩니다.
 */
import { mockDeadlines } from '../data/mockData';

const STORAGE_KEY = 'sharedata_deadlines';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getDeadlines() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [...mockDeadlines];
}

function saveDeadlines(deadlines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deadlines));
}

export const deadlineService = {
  async getAll() {
    await delay(300);
    return getDeadlines().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  },

  async getUpcoming(days = 3) {
    await delay(300);
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + days);
    limit.setHours(23, 59, 59, 999);

    return getDeadlines()
      .filter((d) => {
        const due = new Date(d.dueDate);
        return due >= now && due <= limit;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  },

  async create(deadlineData) {
    await delay(400);
    const deadlines = getDeadlines();
    const newDeadline = {
      id: `dl-${Date.now()}`,
      ...deadlineData,
      completed: false,
    };
    deadlines.push(newDeadline);
    saveDeadlines(deadlines);
    return newDeadline;
  },

  async toggleComplete(id) {
    await delay(200);
    const deadlines = getDeadlines();
    const idx = deadlines.findIndex((d) => d.id === id);
    if (idx !== -1) {
      deadlines[idx].completed = !deadlines[idx].completed;
      saveDeadlines(deadlines);
    }
    return deadlines[idx];
  },

  async delete(id) {
    await delay(300);
    const deadlines = getDeadlines().filter((d) => d.id !== id);
    saveDeadlines(deadlines);
  },
};
