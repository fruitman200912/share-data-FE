import Calendar from '../components/calendar/Calendar';
import DeadlineList from '../components/deadline/DeadlineList';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-welcome">
        <h1>ShareData</h1>
        <p>정보를 공유하고 과제를 관리하세요.</p>
      </div>
      <div className="home-content">
        <Calendar />
        <DeadlineList />
      </div>
    </div>
  );
}
