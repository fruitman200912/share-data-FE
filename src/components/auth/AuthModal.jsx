import { useState } from 'react';
import Modal from '../common/Modal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './Auth.css';

/**
 * 인증 모달 컴포넌트
 * 로그인과 회원가입 폼을 탭으로 전환합니다.
 */
export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');

  const handleSuccess = () => {
    onClose();
    setActiveTab('login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="계정">
      <div className="auth-tabs">
        <button
          className={`auth-tab${activeTab === 'login' ? ' active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          로그인
        </button>
        <button
          className={`auth-tab${activeTab === 'signup' ? ' active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          회원가입
        </button>
      </div>

      {activeTab === 'login' ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <SignupForm onSuccess={handleSuccess} />
      )}
    </Modal>
  );
}
