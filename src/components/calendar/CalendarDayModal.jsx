import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatDate, getDeadlineUrgency, formatRelativeDate } from '../../utils/dateUtils';
import { format } from 'date-fns';
import { Calendar, Plus } from 'lucide-react';
import { ko } from 'date-fns/locale';
import { useDeadline } from '../../hooks/useDeadline';
import './CalendarDayModal.css';

/**
 * 캘린더 날짜 클릭 시 해당 날짜의 일정을 상세히 보여주는 모달
 */
export default function CalendarDayModal({ isOpen, onClose, date, events }) {
  const { createDeadline } = useDeadline();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    time: '23:59',
    priority: 'medium'
  });

  if (!date) return null;

  const dayLabel = format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) {
      alert('제목과 과목을 입력해주세요.');
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = formData.time.split(':');
    const dueDate = new Date(date);
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    await createDeadline({
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      dueDate: dueDate.toISOString(),
      category: 'major', // default
      priority: formData.priority,
    });

    setIsAdding(false);
    setFormData({ title: '', description: '', subject: '', time: '23:59', priority: 'medium' });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setIsAdding(false); onClose(); }} title={dayLabel}>
      <div className="day-modal">
        {events.length === 0 ? (
          <div className="day-modal-empty">
            <div className="day-modal-empty-icon"><Calendar size={48} /></div>
            <p>이 날짜에 등록된 일정이 없습니다.</p>
          </div>
        ) : (
          <div className="day-modal-list">
            {events.map((event) => {
              const urgency = getDeadlineUrgency(event.dueDate);
              return (
                <div key={event.id} className={`day-modal-event ${urgency}`}>
                  <div className={`day-modal-event-indicator ${urgency}`} />
                  <div className="day-modal-event-body">
                    <div className="day-modal-event-title">{event.title}</div>
                    <div className="day-modal-event-desc">{event.description}</div>
                    <div className="day-modal-event-meta">
                      <span className="day-modal-event-subject">{event.subject}</span>
                      <span className={`day-modal-event-due ${urgency}`}>
                        {formatRelativeDate(event.dueDate)} · {formatDate(event.dueDate, 'HH:mm')}
                      </span>
                      <span className={`day-modal-event-priority ${event.priority}`}>
                        {event.priority === 'high' ? '높음' : event.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>
                  </div>
                  {event.completed && <div className="day-modal-event-done">완료</div>}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          {!isAdding ? (
            <Button variant="secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={() => setIsAdding(true)}>
              <Plus size={16} /> 새 과제 등록하기
            </Button>
          ) : (
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="과제 제목" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
              <input 
                type="text" 
                placeholder="과목명 (예: 운영체제)" 
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
              <textarea 
                placeholder="과제 설명" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', minHeight: '60px', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="time" 
                  value={formData.time} 
                  onChange={(e) => setFormData({...formData, time: e.target.value})} 
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                />
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={{ flex: 1, padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                >
                  <option value="high">우선순위: 높음</option>
                  <option value="medium">우선순위: 보통</option>
                  <option value="low">우선순위: 낮음</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button variant="secondary" type="button" onClick={() => setIsAdding(false)}>취소</Button>
                <Button type="submit">등록</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
