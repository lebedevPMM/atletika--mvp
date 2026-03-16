
import React, { useState, useCallback, useRef } from 'react';
import { ScreenName } from '../types';
import {
  Calendar,
  CreditCard,
  Shield,
  Heart,
  Check,
  ArrowRight,
  Loader2,
  LogOut,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

// --- Types ---

interface OfferAcceptScreenProps {
  onNavigate: (screen: ScreenName) => void;
  isDocsUpdated?: boolean;
  offerVersion?: string;
}

interface OfferAcceptance {
  offerId: string;
  offerVersion: string;
  acceptedAt: string;
  pdConsentAt: string;
  healthDisclaimerAt: string;
  phone: string;
  userId: string;
}

interface DocChange {
  type: 'new' | 'changed' | 'removed';
  text: string;
}

// --- Mock Data ---

const OFFER_VERSION = '1.0';
const OFFER_DATE = '15.03.2026';
const OFFER_ID = 'atletika-offer-v1';

const SUMMARY_ITEMS = [
  {
    icon: Calendar,
    title: 'Бронирование',
    description: 'Бесплатная отмена за 4 часа до занятия',
    color: 'text-t-accent',
    bgColor: 'bg-t-accent/10',
  },
  {
    icon: CreditCard,
    title: 'Абонемент и оплата',
    description: 'Условия заморозки, переноса и возврата',
    color: 'text-t-accent',
    bgColor: 'bg-t-accent/10',
  },
  {
    icon: Shield,
    title: 'Ваши данные',
    description: 'Защищены по ФЗ-152, не передаём третьим лицам',
    color: 'text-t-success',
    bgColor: 'bg-t-success/10',
  },
  {
    icon: Heart,
    title: 'Здоровье',
    description: 'Подтвердите отсутствие противопоказаний',
    color: 'text-t-warning',
    bgColor: 'bg-t-warning/10',
  },
] as const;

const MOCK_DOC_CHANGES: DocChange[] = [
  { type: 'new', text: 'Добавлена услуга SPA-зоны' },
  { type: 'changed', text: 'Срок отмены бронирования: 2ч → 4ч' },
  { type: 'changed', text: 'Обновлена политика заморозки абонемента' },
];

const FULL_OFFER_TEXT = `ПУБЛИЧНАЯ ОФЕРТА
на оказание физкультурно-оздоровительных услуг

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Настоящий документ является публичной офертой (далее — «Оферта») ООО «Атлетика+» (ОГРН 1234567890123, ИНН 1234567890), именуемого в дальнейшем «Исполнитель», адресованной неопределённому кругу физических лиц (далее — «Клиент»).

1.2. Акцептом настоящей Оферты является совершение Клиентом конклюдентных действий: нажатие кнопки «Принимаю условия» в мобильном приложении Atletika+ после прохождения авторизации по номеру телефона и OTP-коду.

2. ПРЕДМЕТ ДОГОВОРА
2.1. Исполнитель обязуется предоставить Клиенту доступ к физкультурно-оздоровительным услугам (групповые занятия, персональные тренировки, SPA-зона) согласно выбранному тарифу.

3. БРОНИРОВАНИЕ И ОТМЕНА
3.1. Клиент вправе бронировать занятия через приложение.
3.2. Бесплатная отмена возможна не позднее чем за 4 (четыре) часа до начала занятия.
3.3. Отмена менее чем за 4 часа — списание занятия с абонемента.

4. ОПЛАТА И ВОЗВРАТ
4.1. Стоимость услуг определяется действующим прейскурантом.
4.2. Заморозка абонемента: до 14 дней в рамках срока действия (по заявлению).
4.3. Возврат неиспользованных средств — в течение 10 рабочих дней.

5. ОТВЕТСТВЕННОСТЬ СТОРОН
5.1. Исполнитель не несёт ответственности за ухудшение состояния здоровья Клиента, если Клиент не сообщил о противопоказаниях.
5.2. Клиент обязан информировать Исполнителя об изменениях состояния здоровья.

6. ПОРЯДОК РАСТОРЖЕНИЯ
6.1. Клиент вправе расторгнуть договор в любое время, направив заявление через приложение или в письменной форме.
6.2. Исполнитель вправе расторгнуть договор при нарушении Клиентом правил клуба.

7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
7.1. Настоящая Оферта действует бессрочно с момента публикации.
7.2. Исполнитель вправе вносить изменения с уведомлением Клиентов за 14 дней.
7.3. Все споры разрешаются в соответствии с законодательством Российской Федерации.`;

// --- Component ---

const OfferAcceptScreen: React.FC<OfferAcceptScreenProps> = ({
  onNavigate,
  isDocsUpdated = false,
  offerVersion = OFFER_VERSION,
}) => {
  // --- State ---
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [pdAccepted, setPdAccepted] = useState(false);
  const [healthAccepted, setHealthAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);

  const canProceed = offerAccepted && pdAccepted && healthAccepted && !isLoading;

  // Count checked for progress indicator
  const checkedCount = [offerAccepted, pdAccepted, healthAccepted].filter(Boolean).length;

  // --- Handlers ---

  const handleAccept = useCallback(() => {
    if (!canProceed) return;
    setIsLoading(true);

    const now = new Date().toISOString();
    const acceptance: OfferAcceptance = {
      offerId: OFFER_ID,
      offerVersion,
      acceptedAt: now,
      pdConsentAt: now,
      healthDisclaimerAt: now,
      phone: '+7 (XXX) XXX-XX-XX', // Mock
      userId: 'mock-user-id',
    };

    // Mock API call — log the acceptance data
    console.log('[OfferAccept] Acceptance saved:', JSON.stringify(acceptance, null, 2));

    setTimeout(() => {
      setIsLoading(false);
      onNavigate('auth_permissions');
    }, 600);
  }, [canProceed, offerVersion, onNavigate]);

  const handleDecline = useCallback(() => {
    setShowDeclineConfirm(true);
  }, []);

  const confirmDecline = useCallback(() => {
    setShowDeclineConfirm(false);
    onNavigate('auth_phone');
  }, [onNavigate]);

  const toggleText = useCallback(() => {
    setIsTextExpanded((prev) => {
      const next = !prev;
      if (next && textRef.current) {
        setTimeout(() => {
          textRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      return next;
    });
  }, []);

  // --- Sub-Components ---

  const VersionBadge = () => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-tk-full bg-t-bg-surface text-t-text-muted text-xs font-medium border border-t-border">
      <FileText className="w-3 h-3" />
      v{offerVersion} от {OFFER_DATE}
    </span>
  );

  const DocChangeBadge = ({ type }: { type: DocChange['type'] }) => {
    const config = {
      new: { label: 'НОВОЕ', className: 'bg-t-success/15 text-t-success' },
      changed: { label: 'ИЗМЕНЕНО', className: 'bg-t-warning/15 text-t-warning' },
      removed: { label: 'УДАЛЕНО', className: 'bg-t-error/15 text-t-error' },
    };
    const c = config[type];
    return (
      <span className={`inline-block px-2 py-0.5 rounded-tk-sm text-[10px] font-bold uppercase tracking-wider ${c.className}`}>
        {c.label}
      </span>
    );
  };

  // --- Render ---

  return (
    <div className="bg-t-bg min-h-screen flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-tk-md bg-t-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-t-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-t-text leading-tight">
                Пользовательское соглашение
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <VersionBadge />
            {isDocsUpdated && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-tk-full bg-t-warning/15 text-t-warning text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                Обновлено
              </span>
            )}
          </div>
        </div>

        {/* Docs Updated Section */}
        {isDocsUpdated && (
          <div className="mb-6 p-4 rounded-tk-lg bg-t-warning/5 border border-t-warning/20 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-t-warning" />
              <h3 className="text-sm font-bold text-t-text">Что изменилось</h3>
            </div>
            <div className="space-y-2.5">
              {MOCK_DOC_CHANGES.map((change, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <DocChangeBadge type={change.type} />
                  <span className="text-sm text-t-text-secondary leading-snug">
                    {change.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="rounded-tk-lg bg-t-bg-elevated border border-t-border shadow-tk-card p-5 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-t-text-muted mb-4">
            Ключевые условия
          </h2>
          <div className="space-y-4">
            {SUMMARY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3.5 animate-in fade-in slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${150 + i * 80}ms`, animationFillMode: 'both' }}
                >
                  <div className={`w-10 h-10 rounded-tk-md ${item.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-t-text leading-snug">{item.title}</h3>
                    <p className="text-xs text-t-text-muted leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Full Text */}
        <div className="mb-6">
          <button
            onClick={toggleText}
            className="w-full flex items-center justify-between px-4 py-3 rounded-tk-md bg-t-bg-elevated border border-t-border text-sm font-medium text-t-text-secondary hover:text-t-text transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Полный текст соглашения
            </span>
            {isTextExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div
            ref={textRef}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isTextExpanded ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 rounded-tk-md bg-t-bg-surface border border-t-border">
              <pre className="text-xs text-t-text-muted leading-relaxed whitespace-pre-wrap font-sans">
                {FULL_OFFER_TEXT}
              </pre>
              <div className="mt-4 pt-3 border-t border-t-border flex items-center gap-2">
                <button
                  onClick={() => onNavigate('document_view')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-t-accent hover:text-t-accent-secondary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Открыть полную версию
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-4">
          {/* Checkbox 1: Offer Agreement */}
          <label
            className={`flex items-start gap-3.5 p-4 rounded-tk-lg border cursor-pointer transition-all duration-200 ${
              offerAccepted
                ? 'border-t-accent/40 bg-t-accent/5'
                : 'border-t-border bg-t-bg-elevated hover:border-t-accent/20'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-tk-sm border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                offerAccepted
                  ? 'bg-t-accent border-t-accent scale-100'
                  : 'border-t-border bg-t-bg-surface'
              }`}
            >
              {offerAccepted && (
                <Check className="w-4 h-4 text-t-bg animate-in zoom-in-50 duration-150" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={offerAccepted}
              onChange={() => setOfferAccepted(!offerAccepted)}
            />
            <div className="flex-1">
              <span className="text-sm font-semibold text-t-text block leading-snug">
                Принимаю условия оферты
              </span>
              <span className="text-xs text-t-text-muted leading-relaxed block mt-1">
                Ознакомлен(а) с{' '}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavigate('document_view');
                  }}
                  className="text-t-accent underline underline-offset-2 hover:text-t-accent-secondary transition-colors"
                >
                  публичной офертой
                </button>{' '}
                и правилами клуба (ГК РФ ст. 435-443)
              </span>
            </div>
          </label>

          {/* Checkbox 2: Personal Data Consent */}
          <label
            className={`flex items-start gap-3.5 p-4 rounded-tk-lg border cursor-pointer transition-all duration-200 ${
              pdAccepted
                ? 'border-t-accent/40 bg-t-accent/5'
                : 'border-t-border bg-t-bg-elevated hover:border-t-accent/20'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-tk-sm border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                pdAccepted
                  ? 'bg-t-accent border-t-accent scale-100'
                  : 'border-t-border bg-t-bg-surface'
              }`}
            >
              {pdAccepted && (
                <Check className="w-4 h-4 text-t-bg animate-in zoom-in-50 duration-150" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={pdAccepted}
              onChange={() => setPdAccepted(!pdAccepted)}
            />
            <div className="flex-1">
              <span className="text-sm font-semibold text-t-text block leading-snug">
                Даю согласие на обработку персональных данных
              </span>
              <span className="text-xs text-t-text-muted leading-relaxed block mt-1">
                В соответствии с{' '}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavigate('auth_privacy');
                  }}
                  className="text-t-accent underline underline-offset-2 hover:text-t-accent-secondary transition-colors"
                >
                  политикой обработки ПДн
                </button>{' '}
                (ФЗ-152)
              </span>
            </div>
          </label>

          {/* Checkbox 3: Health Disclaimer */}
          <label
            className={`flex items-start gap-3.5 p-4 rounded-tk-lg border cursor-pointer transition-all duration-200 ${
              healthAccepted
                ? 'border-t-warning/40 bg-t-warning/5'
                : 'border-t-border bg-t-bg-elevated hover:border-t-warning/20'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-tk-sm border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                healthAccepted
                  ? 'bg-t-warning border-t-warning scale-100'
                  : 'border-t-border bg-t-bg-surface'
              }`}
            >
              {healthAccepted && (
                <Check className="w-4 h-4 text-t-bg animate-in zoom-in-50 duration-150" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={healthAccepted}
              onChange={() => setHealthAccepted(!healthAccepted)}
            />
            <div className="flex-1">
              <span className="text-sm font-semibold text-t-text block leading-snug">
                Подтверждаю отсутствие противопоказаний
              </span>
              <span className="text-xs text-t-text-muted leading-relaxed block mt-1">
                Не имею медицинских ограничений для занятий физической культурой (ФЗ-329)
              </span>
            </div>
          </label>
        </div>

        {/* Progress Hint */}
        {checkedCount > 0 && checkedCount < 3 && (
          <p className="text-xs text-t-text-muted text-center mb-2 animate-in fade-in duration-200">
            Отмечено {checkedCount} из 3
          </p>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="px-6 pb-6 pt-3 bg-t-bg border-t border-t-border/50 safe-area-bottom">
        {/* Accept Button */}
        <button
          onClick={handleAccept}
          disabled={!canProceed}
          className={`w-full py-4 rounded-tk-md font-bold shadow-tk-card transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm ${
            canProceed
              ? 'bg-t-accent text-t-bg hover:opacity-90'
              : 'bg-t-bg-surface text-t-text-muted cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Сохраняю...
            </>
          ) : (
            <>
              {isDocsUpdated ? 'Принимаю обновлённые условия' : 'Принимаю условия'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Decline Button */}
        <button
          onClick={handleDecline}
          disabled={isLoading}
          className="w-full mt-2.5 py-3 text-sm font-medium text-t-text-muted hover:text-t-error transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Отказаться и выйти
        </button>
      </div>

      {/* Decline Confirmation Dialog */}
      {showDeclineConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowDeclineConfirm(false)}
        >
          <div
            className="w-full max-w-md mx-4 mb-8 p-6 bg-t-bg-elevated rounded-tk-lg border border-t-border shadow-tk-card animate-in slide-in-from-bottom-8 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-tk-md bg-t-error/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-t-error" />
              </div>
              <h3 className="text-base font-bold text-t-text">Отказаться от условий?</h3>
            </div>
            <p className="text-sm text-t-text-muted leading-relaxed mb-5">
              Без принятия условий использование приложения невозможно. Вы будете возвращены на экран входа.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclineConfirm(false)}
                className="flex-1 py-3 rounded-tk-md bg-t-bg-surface border border-t-border text-sm font-semibold text-t-text hover:bg-t-bg-elevated transition-colors"
              >
                Остаться
              </button>
              <button
                onClick={confirmDecline}
                className="flex-1 py-3 rounded-tk-md bg-t-error/10 border border-t-error/20 text-sm font-semibold text-t-error hover:bg-t-error/20 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferAcceptScreen;
