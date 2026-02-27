export function getReviewTypeLabel(type: 'trainer' | 'class' | 'club'): string {
  switch (type) {
    case 'trainer': return 'Тренер';
    case 'class': return 'Занятие';
    case 'club': return 'Клуб';
  }
}

export function getReviewTypeIcon(type: 'trainer' | 'class' | 'club'): string {
  switch (type) {
    case 'trainer': return '\uD83D\uDC64';
    case 'class': return '\uD83C\uDFCB\uFE0F';
    case 'club': return '\uD83C\uDFE2';
  }
}

export function formatStars(rating: number): string {
  return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
}

export function getRatingLabel(rating: number): string {
  if (rating >= 5) return 'Отлично';
  if (rating >= 4) return 'Хорошо';
  if (rating >= 3) return 'Нормально';
  if (rating >= 2) return 'Плохо';
  return 'Ужасно';
}
