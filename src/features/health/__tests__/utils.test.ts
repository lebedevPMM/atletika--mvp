import {
  getSeverityLabel,
  getSeverityBadgeVariant,
  getRelationshipLabel,
  getDocTypeLabel,
  getDocTypeIcon,
  getFavoriteIcon,
} from '../utils';

// === getSeverityLabel ===

describe('getSeverityLabel', () => {
  it('returns "Высокая" for high', () => {
    expect(getSeverityLabel('high')).toBe('Высокая');
  });

  it('returns "Средняя" for medium', () => {
    expect(getSeverityLabel('medium')).toBe('Средняя');
  });

  it('returns "Низкая" for low', () => {
    expect(getSeverityLabel('low')).toBe('Низкая');
  });
});

// === getSeverityBadgeVariant ===

describe('getSeverityBadgeVariant', () => {
  it('returns "error" for high', () => {
    expect(getSeverityBadgeVariant('high')).toBe('error');
  });

  it('returns "warning" for medium', () => {
    expect(getSeverityBadgeVariant('medium')).toBe('warning');
  });

  it('returns "info" for low', () => {
    expect(getSeverityBadgeVariant('low')).toBe('info');
  });
});

// === getRelationshipLabel ===

describe('getRelationshipLabel', () => {
  it('returns "Супруг(а)" for spouse', () => {
    expect(getRelationshipLabel('spouse')).toBe('Супруг(а)');
  });

  it('returns "Ребёнок" for child', () => {
    expect(getRelationshipLabel('child')).toBe('Ребёнок');
  });

  it('returns "Родитель" for parent', () => {
    expect(getRelationshipLabel('parent')).toBe('Родитель');
  });

  it('returns "Другое" for other', () => {
    expect(getRelationshipLabel('other')).toBe('Другое');
  });
});

// === getDocTypeLabel ===

describe('getDocTypeLabel', () => {
  it('returns "Справка" for certificate', () => {
    expect(getDocTypeLabel('certificate')).toBe('Справка');
  });

  it('returns "Договор" for contract', () => {
    expect(getDocTypeLabel('contract')).toBe('Договор');
  });

  it('returns "Политика" for policy', () => {
    expect(getDocTypeLabel('policy')).toBe('Политика');
  });

  it('returns "Квитанция" for receipt', () => {
    expect(getDocTypeLabel('receipt')).toBe('Квитанция');
  });

  it('returns "Мед. документ" for medical', () => {
    expect(getDocTypeLabel('medical')).toBe('Мед. документ');
  });
});

// === getDocTypeIcon ===

describe('getDocTypeIcon', () => {
  it('returns 📄 for certificate', () => {
    expect(getDocTypeIcon('certificate')).toBe('📄');
  });

  it('returns 📋 for contract', () => {
    expect(getDocTypeIcon('contract')).toBe('📋');
  });

  it('returns 📜 for policy', () => {
    expect(getDocTypeIcon('policy')).toBe('📜');
  });

  it('returns 🧾 for receipt', () => {
    expect(getDocTypeIcon('receipt')).toBe('🧾');
  });

  it('returns 🏥 for medical', () => {
    expect(getDocTypeIcon('medical')).toBe('🏥');
  });
});

// === getFavoriteIcon ===

describe('getFavoriteIcon', () => {
  it('returns 👤 for trainer', () => {
    expect(getFavoriteIcon('trainer')).toBe('👤');
  });

  it('returns 🏋️ for class', () => {
    expect(getFavoriteIcon('class')).toBe('🏋️');
  });
});
