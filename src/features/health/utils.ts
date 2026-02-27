import type { Contraindication, FamilyMember, DocumentItem, FavoriteItem } from './types';

// === Contraindication helpers ===

export function getSeverityLabel(severity: Contraindication['severity']): string {
  switch (severity) {
    case 'high': return 'Высокая';
    case 'medium': return 'Средняя';
    case 'low': return 'Низкая';
    default: return severity;
  }
}

export function getSeverityBadgeVariant(severity: Contraindication['severity']): 'error' | 'warning' | 'info' {
  switch (severity) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'info';
  }
}

// === Family helpers ===

const RELATIONSHIP_LABELS: Record<FamilyMember['relationship'], string> = {
  spouse: 'Супруг(а)',
  child: 'Ребёнок',
  parent: 'Родитель',
  other: 'Другое',
};

export function getRelationshipLabel(rel: FamilyMember['relationship']): string {
  return RELATIONSHIP_LABELS[rel];
}

// === Document helpers ===

const DOC_TYPE_LABELS: Record<DocumentItem['type'], string> = {
  certificate: 'Справка',
  contract: 'Договор',
  policy: 'Политика',
  receipt: 'Квитанция',
  medical: 'Мед. документ',
};

export function getDocTypeLabel(type: DocumentItem['type']): string {
  return DOC_TYPE_LABELS[type];
}

export function getDocTypeIcon(type: DocumentItem['type']): string {
  switch (type) {
    case 'certificate': return '\uD83D\uDCC4';
    case 'contract': return '\uD83D\uDCCB';
    case 'policy': return '\uD83D\uDCDC';
    case 'receipt': return '\uD83E\uDDFE';
    case 'medical': return '\uD83C\uDFE5';
    default: return '\uD83D\uDCC1';
  }
}

// === Favorite helpers ===

export function getFavoriteIcon(type: FavoriteItem['type']): string {
  return type === 'trainer' ? '\uD83D\uDC64' : '\uD83C\uDFCB\uFE0F';
}
