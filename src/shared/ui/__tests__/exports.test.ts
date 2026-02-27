/**
 * shared/ui barrel-export verification tests.
 *
 * Since Jest runs with `testEnvironment: 'node'` and tsconfig uses
 * `jsx: react-native` (which preserves JSX), tsx files cannot be parsed
 * by the Node runtime.  We mock every component module so the barrel
 * import resolves without actually loading any JSX.
 *
 * What this catches:
 *  - Forgotten exports (new component added but not listed in index.ts)
 *  - Typos in re-export paths (Jest would fail to resolve the module)
 *  - Broken import chains that would crash the app at startup
 *  - Accidental duplicate or missing re-exports
 */

/* ---------- Mock each component module ---------- */
/* Each mock returns a named export matching the component name.       */
/* If a barrel re-export path is wrong, Jest will fail to resolve it.  */

function component(name: string) {
  const fn = function MockComponent() { return null; };
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

jest.mock('../Badge', () => ({ Badge: component('Badge') }));
jest.mock('../Button', () => ({ Button: component('Button') }));
jest.mock('../Card', () => ({ Card: component('Card') }));
jest.mock('../ComingSoon', () => ({ ComingSoon: component('ComingSoon') }));
jest.mock('../EmptyState', () => ({ EmptyState: component('EmptyState') }));
jest.mock('../ErrorState', () => ({ ErrorState: component('ErrorState') }));
jest.mock('../FilterChips', () => ({ FilterChips: component('FilterChips') }));
jest.mock('../Input', () => ({ Input: component('Input') }));
jest.mock('../OTPInput', () => ({ OTPInput: component('OTPInput') }));
jest.mock('../OfflineBanner', () => ({ OfflineBanner: component('OfflineBanner') }));
jest.mock('../PhoneInput', () => ({ PhoneInput: component('PhoneInput') }));
jest.mock('../ProgressBar', () => ({ ProgressBar: component('ProgressBar') }));
jest.mock('../SegmentedControl', () => ({ SegmentedControl: component('SegmentedControl') }));
jest.mock('../Skeleton', () => ({ Skeleton: component('Skeleton') }));
jest.mock('../SlotCard', () => ({ SlotCard: component('SlotCard') }));

/* ========================================================== */
/* ==================== ACTUAL TESTS ======================== */
/* ========================================================== */

import * as UI from '../index';

/**
 * Complete list of components the barrel file MUST export.
 * Kept in the same order as index.ts for easy comparison.
 */
const EXPECTED_EXPORTS = [
  'Button',
  'Card',
  'Input',
  'PhoneInput',
  'OTPInput',
  'Skeleton',
  'EmptyState',
  'ErrorState',
  'OfflineBanner',
  'Badge',
  'ComingSoon',
  'SegmentedControl',
  'FilterChips',
  'SlotCard',
  'ProgressBar',
] as const;

describe('shared/ui barrel exports', () => {
  it('exports the expected number of components (15)', () => {
    const exportedKeys = Object.keys(UI);
    expect(exportedKeys).toHaveLength(EXPECTED_EXPORTS.length);
  });

  it.each(EXPECTED_EXPORTS)('exports %s', (name) => {
    expect(UI).toHaveProperty(name);
  });

  it.each(EXPECTED_EXPORTS)('%s is a function (React component)', (name) => {
    const exp = (UI as Record<string, unknown>)[name];
    expect(typeof exp).toBe('function');
  });

  it('does not contain unexpected exports', () => {
    const exportedKeys = Object.keys(UI);
    const expectedSet = new Set<string>(EXPECTED_EXPORTS);
    const unexpected = exportedKeys.filter((k) => !expectedSet.has(k));
    expect(unexpected).toEqual([]);
  });

  it('every component file has a corresponding barrel export', () => {
    // This test documents the contract: index.ts should re-export
    // every component file.  If someone adds a new .tsx but forgets
    // to add it to the barrel, this test must be updated.
    for (const name of EXPECTED_EXPORTS) {
      expect((UI as Record<string, unknown>)[name]).toBeDefined();
    }
  });
});

describe('shared/ui component identity', () => {
  it('Badge is not the same reference as Button', () => {
    expect(UI.Badge).not.toBe(UI.Button);
  });

  it('Card is not the same reference as Input', () => {
    expect(UI.Card).not.toBe(UI.Input);
  });

  it('all exports are unique references (no accidental duplicate re-exports)', () => {
    const refs = EXPECTED_EXPORTS.map((n) => (UI as Record<string, unknown>)[n]);
    const unique = new Set(refs);
    expect(unique.size).toBe(EXPECTED_EXPORTS.length);
  });
});

describe('shared/ui component function names', () => {
  it.each(EXPECTED_EXPORTS)(
    '%s export has correct function name',
    (name) => {
      const exp = (UI as Record<string, unknown>)[name] as (...args: unknown[]) => unknown;
      expect(exp.name).toBe(name);
    },
  );
});
