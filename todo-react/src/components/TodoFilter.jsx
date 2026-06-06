const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function TodoFilter({ currentFilter, onChangeFilter }) {
  return (
    <div className="filter-buttons" aria-label="할 일 상태 필터">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={`filter-button${
            currentFilter === filter.value ? ' active' : ''
          }`}
          type="button"
          onClick={() => onChangeFilter(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default TodoFilter
