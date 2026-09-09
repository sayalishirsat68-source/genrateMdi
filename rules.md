# AI Coding Assistant Operational Rules & Development Standards

> **File Purpose**: This document establishes the non-negotiable rules, development standards, architectural boundaries, and operational guidelines that **every AI coding assistant and developer must strictly adhere to** when modifying or extending **genraticMed - Rx Vault**.

---

## The Cardinal Rule

> [!CAUTION]
> ### 1. NEVER BREAK EXISTING FUNCTIONALITY UNLESS EXPLICITLY REQUESTED
> - **Preserve Existing Behaviors**: Every refactor, feature addition, or style change must leave existing flows, modals, tab navigations, and data calculations fully operational.
> - **Mock Data Integrity**: Never wipe, corrupt, or arbitrarily alter fields in `src/data/mockData.ts` without updating dependent components.
> - **Regression Checklist**: Always verify that all existing tabs (`explore`, `compare`, `rx-vault`, `cart`, `profile`) and all 8 interactive modals render without syntax or runtime exceptions before concluding a task.

---

## 2. Coding Standards

### 2.1 TypeScript Strictness
- **No `any`**: The use of `any` is strictly prohibited. Use explicit union types, generics, or `unknown` with runtime type narrowing.
- **Single Source of Truth for Types**: All domain entities must be defined in `src/types.ts`. Component-specific props may be declared in the component file if not reused elsewhere.
- **Clean Type Checking**: All code edits must compile cleanly under `npm run lint` (`tsc --noEmit`).

```typescript
// ✅ RECOMMENDED: Explicit types with domain alignment
interface PrescriptionCardProps {
  prescription: Prescription;
  onRefill: (id: string) => void;
  isQueued?: boolean;
}

// ❌ PROHIBITED: Using any or untyped callback
interface BadCardProps {
  prescription: any;
  onRefill: (data: any) => void;
}
```

### 2.2 React 19 Best Practices
- **Functional Components Only**: Use React functional components with explicit typing: `React.FC<Props>` or direct parameter destructuring with types.
- **Hook Discipline**:
  - Keep hook dependencies accurate in `useEffect`, `useCallback`, and `useMemo`.
  - Avoid unnecessary re-renders; memoize expensive calculations (e.g., bio-equivalence percentage comparisons or dosage conversions).
- **State Management**:
  - Keep state as local as possible.
  - Lift state to `App.tsx` only when shared across top-level screens or global modals (e.g., `cartItems`, toast alerts).

### 2.3 Error Handling & Edge Cases
- Provide explicit fallback UI for empty arrays (e.g., "No Refills in Queue" when cart is empty).
- Wrap asynchronous operations (e.g., OCR processing, API calls, simulated network latency) in `try / catch / finally` blocks with user-facing toast feedback.
- Never let unhandled promise rejections bubble to the window level.

---

## 3. Folder Structure & Organization Rules

```
genrateMdi/
├── .env.example          # Template for required environment variables
├── index.html            # Entry HTML with Google Fonts & Material Symbols imports
├── metadata.json         # AI Studio applet capabilities and configuration
├── package.json          # Project scripts and dependencies
├── tsconfig.json         # TypeScript compiler configuration
├── vite.config.ts        # Vite configuration with @ path alias and Tailwind plugin
├── public/               # Static assets, fallback logos, PDF mock templates
├── src/
│   ├── main.tsx          # Application entry point mounting React root
│   ├── App.tsx           # Top-level shell, tab routing, modal lifecycle, and toast manager
│   ├── index.css         # Tailwind v4 @theme design tokens, CSS variables, and base styles
│   ├── types.ts          # Central domain TypeScript interfaces and union types
│   ├── components/       # Screen components and reusable UI widgets
│   │   ├── Header.tsx           # Sticky clinical brand header and notification badge
│   │   ├── BottomNav.tsx        # Fixed bottom navigation bar with badge counter
│   │   ├── RxVaultScreen.tsx    # Primary vault dashboard (tabs: Rx, Vitals, Docs, Doctors)
│   │   ├── CompareScreen.tsx    # Bio-equivalence pharmacokinetic comparison engine
│   │   ├── ExploreScreen.tsx    # Medication catalog and alternative discovery
│   │   ├── CartScreen.tsx       # Refill dispatch queue and autonomous drone order flow
│   │   ├── ProfileScreen.tsx    # Patient tier, ABHA identity pass, and savings metrics
│   │   └── Modals.tsx           # Global modals (QR pass, OCR camera, PDF viewer, CoA, etc.)
│   ├── data/
│   │   └── mockData.ts   # Curated clinical mock records, vitals history, and drug catalog
│   └── (future) services/ # API clients, Gemini AI integrations, and local storage managers
```

### Folder Placement Rules:
1. **New Screens / Top-Level Views**: Place inside `src/components/` and name ending with `Screen.tsx` (e.g., `AnalyticsScreen.tsx`).
2. **Modals**: Modularize new modals or keep them cleanly exported from `src/components/Modals.tsx` until refactored into a `src/components/modals/` directory.
3. **Domain Types**: Always add to `src/types.ts`. Do not disperse fundamental domain interfaces across component files.
4. **Data Seeders / Fixtures**: Place inside `src/data/`.
5. **Services / Utilities**: Place inside `src/services/` or `src/utils/` when introduced.

---

## 4. Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **React Components** | PascalCase | `RxVaultScreen.tsx`, `DosageGuideModal.tsx` |
| **Component Files** | PascalCase matching component name | `BottomNav.tsx` |
| **Custom Hooks** | camelCase prefixed with `use` | `usePharmacokinetics.ts`, `useCart.ts` |
| **TypeScript Types / Interfaces** | PascalCase | `Prescription`, `ClinicalDocument`, `TabType` |
| **TypeScript Enums / Union Types** | PascalCase or kebab-case literals | `'explore' \| 'compare' \| 'rx-vault'` |
| **Constants & Mock Data** | UPPER_SNAKE_CASE | `INITIAL_PRESCRIPTIONS`, `VITALS_DATA` |
| **Utility Functions** | camelCase | `calculateParityPercentage()`, `formatCurrency()` |
| **CSS Variables / Theme Tokens** | kebab-case prefixed with category | `--color-surface-card`, `--font-headline-md` |

---

## 5. UI/UX Consistency Rules

### 5.1 Design System & Color Palette
- **Strict Design Token Usage**: Always use the semantic tokens declared in `src/index.css` `@theme`. Avoid arbitrary hex codes in inline styles or raw Tailwind classes.
  - Primary Surface: `bg-surface`, `bg-surface-card`, `bg-surface-canvas`, `bg-surface-container-low`
  - Text: `text-on-surface`, `text-on-surface-variant`, `text-on-primary`
  - Crisp Borders: `border-border-crisp`, `border-border-strong`
  - Clinical Status:
    - **Verified**: `bg-status-verified-bg text-status-verified border-status-verified-border`
    - **Critical / Refill Alert**: `bg-status-critical-bg text-status-critical border-status-critical-border`
    - **Pending / Warning**: `bg-status-pending-bg text-status-pending border-status-pending-border`
    - **Isolated / Secondary**: `bg-status-isolated-bg text-status-isolated border-status-isolated-border`

### 5.2 Viewport & Mobile Geometry
- **Mobile-First Container**: The primary container must remain constrained to `max-w-md mx-auto` to preserve phone-aspect ergonomic layouts on desktop screens.
- **Touch Target Sizing**: All interactive buttons, icon triggers, and form chips must have a minimum bounding box of **44x44px** for clinical touch accuracy.
- **Safe-Area Inset Respect**: Use `pb-safe` and `pt-safe` classes alongside bottom navigation offset (`pb-24`) to ensure content is never concealed by OS bars or navigation notches.

### 5.3 Typography
- Body and UI Text: `"Inter", sans-serif` (`font-sans`, `text-body-md`, `text-body-sm`).
- Hashes, Dosages, ABHA IDs, Batch Codes: `"JetBrains Mono", monospace` (`font-mono`, `text-code-sm`).

### 5.4 Iconography Standards
- Use `<span className="material-symbols-outlined text-[SIZE]px">ligature_name</span>` for medical and clinical actions.
- Ensure all icons are paired with accessible `aria-label` or neighboring descriptive text for screen readers.

---

## 6. Git Commit Rules

Follow the **Conventional Commits** specification (`<type>(<optional scope>): <subject>`):

### Permitted Commit Types:
- `feat`: A new user-facing feature or screen capability.
- `fix`: A bug fix or visual layout correction.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves rendering or calculation performance.
- `docs`: Documentation updates only (e.g., modifying `decisions.md` or `rules.md`).
- `chore`: Build process, dependencies, configuration, or tooling updates.
- `style`: Formatting, spacing, linting changes without logic alterations.

### Commit Format Rules:
1. **Imperative, Present Tense**: "add prescription scanner", not "added prescription scanner".
2. **No Capitalization at Start**: `feat: add drone delivery tracking card`.
3. **No Period at End**: Keep subject lines clean and under 72 characters.
4. **Atomic Commits**: Keep commits focused on a single logical change.

```bash
# ✅ GOOD COMMIT EXAMPLES
feat(vault): add pharmacokinetic bio-parity chart modal
fix(cart): correct calculation of total brand vs generic savings
docs(adr): record decision on server-side gemini api capability
chore(deps): update vite to latest minor release

# ❌ BAD COMMIT EXAMPLES
changes
fixed stuff and updated UI
WIP
```

---

## 7. Security and Environment Variable Rules

### 7.1 Secret Hygiene
- **Never Commit Secrets**: Never write API keys, database credentials, or auth tokens directly into code or Git-tracked files.
- **`.env.example` Synchronization**: When introducing a new environment variable, immediately document it in `.env.example` with clear comments.
- **Allowed Environment Variables**:
  - `GEMINI_API_KEY`: Injected by AI Studio runtime or specified in local `.env`.
  - `APP_URL`: Base hosting URL for self-referential links and callbacks.

### 7.2 Patient Data & Privacy (HIPAA / ABHA Compliance)
- All patient information currently displayed (`Robert C.`, ABHA `#GM-PAT-88410`) is **synthetic mock data**.
- When interfacing with live APIs or Gemini prompt engineering, never pass unredacted Personally Identifiable Information (PII) or Protected Health Information (PHI) unless explicitly authorized and anonymized.
- Sanitize all user inputs before rendering to prevent Cross-Site Scripting (XSS).

---

## 8. Verification & Delivery Protocol

Before reporting any coding task as complete, perform this 5-step checklist:

1. [ ] **Syntax & Types**: Code contains no TypeScript compilation errors (`tsc --noEmit`).
2. [ ] **No Dead Imports**: Unused imports or dangling variables have been cleaned up.
3. [ ] **Visual Layout Check**: The mobile container (`max-w-md mx-auto`) looks balanced and maintains padding above the bottom navigation bar.
4. [ ] **Interactive Verification**: Modals open and close smoothly; tab switching does not unmount unexpected state.
5. [ ] **Context Files Updated**: Update `changelog.md` and `memory.md` whenever features, endpoints, or fixes are introduced.
