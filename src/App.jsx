import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import { DeadlineProvider } from './contexts/DeadlineContext';
import Header from './components/common/Header';
import Layout from './components/common/Layout';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BoardProvider>
          <DeadlineProvider>
            <Header />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/board/:category" element={<BoardPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/edit/:id" element={<CreatePostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Layout>
            <Footer />
          </DeadlineProvider>
        </BoardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
