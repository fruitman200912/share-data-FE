import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

export default function SignupForm({ onSuccess }) {
  const { signup, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setLocalError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      onSuccess?.();
    } catch {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {displayError && <div className="auth-error">{displayError}</div>}

      <div className="auth-field">
        <label htmlFor="signup-name">이름</label>
        <input
          id="signup-name"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => { clearError(); setLocalError(''); setName(e.target.value); }}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email">이메일</label>
        <input
          id="signup-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => { clearError(); setLocalError(''); setEmail(e.target.value); }}
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password">비밀번호</label>
        <input
          id="signup-password"
          type="password"
          placeholder="6자 이상 입력하세요"
          value={password}
          onChange={(e) => { clearError(); setLocalError(''); setPassword(e.target.value); }}
          required
          minLength={6}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-confirm">비밀번호 확인</label>
        <input
          id="signup-confirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => { clearError(); setLocalError(''); setConfirmPassword(e.target.value); }}
          required
        />
      </div>

      <Button
        type="submit"
        fullWidth
        loading={loading}
        className="auth-submit-btn"
      >
        회원가입
      </Button>
    </form>
  );
}
