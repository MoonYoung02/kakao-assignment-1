export function getDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTodayString() {
  return getDateString(new Date())
}

export function addDays(dateString, dayOffset) {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + dayOffset)

  return getDateString(date)
}

export function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}
