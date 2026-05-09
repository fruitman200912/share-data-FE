import { formatRelativeDate, getDeadlineUrgency, formatDate } from '../../utils/dateUtils';
import { useDeadline } from '../../hooks/useDeadline';

/**
 * 개별 과제 마감 카드 컴포넌트
 */
export default function DeadlineCard({ deadline, index = 0 }) {
  const { toggleComplete } = useDeadline();
  const urgency = getDeadlineUrgency(deadline.dueDate);
  const relativeDate = formatRelativeDate(deadline.dueDate);

  return (
    <div
      className={`deadline-card ${urgency}${deadline.completed ? ' completed' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`deadline-check${deadline.completed ? ' checked' : ''}`}
        onClick={() => toggleComplete(deadline.id)}
        role="checkbox"
        aria-checked={deadline.completed}
        tabIndex={0}
      />
      <div className="deadline-card-body">
        <div className="deadline-card-title">{deadline.title}</div>
        <div className="deadline-card-desc">{deadline.description}</div>
        <div className="deadline-card-meta">
          <span className="deadline-card-subject">{deadline.subject}</span>
          <span className={`deadline-card-due ${urgency}`}>
            {relativeDate} · {formatDate(deadline.dueDate, 'M/d HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
}
