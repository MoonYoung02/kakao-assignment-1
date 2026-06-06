import { addDays, formatDate } from '../utils/date.js'

function DateNavigation({ selectedDate, onChangeDate }) {
  return (
    <section className="date-navigation" aria-label="날짜 선택">
      <button
        className="date-navigation-button"
        type="button"
        aria-label="이전 날짜"
        onClick={() => onChangeDate(addDays(selectedDate, -1))}
      >
        &lt;
      </button>
      <p className="selected-date">{formatDate(selectedDate)}</p>
      <button
        className="date-navigation-button"
        type="button"
        aria-label="다음 날짜"
        onClick={() => onChangeDate(addDays(selectedDate, 1))}
      >
        &gt;
      </button>
    </section>
  )
}

export default DateNavigation
