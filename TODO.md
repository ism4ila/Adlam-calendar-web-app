# Adlam Tech Space - TODO Phases

## Phase 0 - Fondation : Transformer en Adlam Tech Space
### Statut : TERMINE

- [x] **1. i18n** (`src/utils/i18n.ts`)
  - Ajout cles : home.hero.title, home.hero.tagline, home.category.*, home.comingSoon, nav.explore
  - 4 langues (en, fr, ar, adlam)
  - Remplacement "Adlam Calendar Clock" -> "Adlam Tech Space" dans toutes les traductions

- [x] **2. Branding** (`index.html`, `package.json`)
  - Titre, meta description, og:title, twitter:title -> "Adlam Tech Space"
  - package.json name -> "adlam-tech-space"

- [x] **3. Navbar** (`src/components/layout/Navbar.tsx`)
  - Logo : ADLAMCLOCK -> ADLAMTECH
  - Navigation desktop : dropdowns par categories (Temps, Ecriture, Apprentissage, Outils)
  - Menu mobile : groupe par categories avec headers de section

- [x] **4. BottomBar** (`src/components/layout/BottomBar.tsx`)
  - Remplacement Calendar par Explore (icone LayoutGrid, route /explore)

- [x] **5. ExploreScreen** (`src/features/explore/ExploreScreen.tsx`) - NOUVEAU
  - Grille complete de toutes les features groupees par categorie

- [x] **6. Router** (`src/app/Router.tsx`)
  - Route /explore ajoutee avec lazy loading

- [x] **7. HomeScreen** (`src/features/home/HomeScreen.tsx`)
  - Hero : "ADLAM TECH" avec tagline dynamique
  - 4 sections categorie avec Card coloree (amber, violet, teal, yellow)
  - Conservation hero analogique, PWA banner, Play Store banner

- [x] **8. AboutScreen** (`src/features/about/AboutScreen.tsx`)
  - "Adlam Calendar Clock" -> "Adlam Tech Space", initiales "AC" -> "AT"

- [x] **9. Nettoyage references restantes**
  - `vite.config.ts`, `index.html`, `SettingsScreen.tsx`, `flutterwave.ts`
  - Zero references "Adlam Calendar Clock" restantes

### Build Phase 0
- [x] `npm run build` : OK, zero erreurs TypeScript
- [x] `npm run dev` : serveur local OK

---

## Phase 1 - Implementer les 8 features "Coming Soon"
### Statut : TERMINE

- [x] **1. i18n** (`src/utils/i18n.ts`)
  - Remplacement cles `coming.*` par `feature.*.name` + `feature.*.desc` (4 langues)
  - Ajout cles ecran : word.*, games.*, calculator.*, design.*, socialcards.*, fonts.*, translator.*, nanobanana.*

- [x] **2. Adlam Word** (`src/features/word/WordScreen.tsx`)
  - Editeur WYSIWYG contentEditable avec conversion Latin->Adlam en temps reel
  - Toolbar : Bold, Italic, Underline, Alignement, Taille police
  - Toggle mode Adlam on/off
  - Export HTML, Copy, Nouveau document

- [x] **3. Games** (`src/features/games/GamesScreen.tsx`)
  - Jeu de memoire (Memory Match) : associer lettres Adlam <-> Latin
  - 6 paires = 12 cartes, shuffle aleatoire
  - Compteur de coups, detection paires, ecran victoire

- [x] **4. Calculator** (`src/features/calculator/CalculatorScreen.tsx`)
  - Calculatrice complete : +, -, x, /, %, +/-, backspace
  - Double affichage : chiffres arabes + chiffres Adlam
  - Reference des 10 chiffres Adlam en bas

- [x] **5. Design Studio** (`src/features/design/DesignStudioScreen.tsx`)
  - Canvas 1080x1080 avec gradient configurable
  - 8 gradients predefinis + controles texte/couleur/taille
  - Preview live + export PNG via Canvas API

- [x] **6. Social Cards** (`src/features/socialcards/SocialCardsScreen.tsx`)
  - Generateur de cartes 1200x630 (format OG)
  - 6 templates de couleur, citations pre-remplies en Adlam
  - Preview live + export PNG + copie texte

- [x] **7. Fonts** (`src/features/fonts/FontsScreen.tsx`)
  - 5 styles de rendu, controle taille 16-96px
  - Textes exemples Adlam + Character Map (28 caracteres avec code Unicode)

- [x] **8. Translator** (`src/features/translator/TranslatorScreen.tsx`)
  - Translitteration bidirectionnelle Latin <-> Adlam
  - Bouton swap, conversion temps reel, copie resultat

- [x] **9. NanoBanana** (`src/features/nanobanana/NanoBananaScreen.tsx`)
  - Jeu de reflexe : identifier le caractere Adlam correspondant
  - Timer 30 secondes, 4 choix par question, score + feedback visuel

- [x] **10. Routes** (`src/app/Router.tsx`)
  - 8 routes ajoutees avec lazy loading

- [x] **11. Navigation mise a jour**
  - `Navbar.tsx` : categories etendues avec les nouvelles features
  - `ExploreScreen.tsx` : section "Coming Soon" supprimee, categories actives
  - `HomeScreen.tsx` : features integrees, section "Coming Soon" supprimee

### Build Phase 1
- [x] `npm run build` : OK, zero erreurs TypeScript
- [x] 71 fichiers precaches PWA (vs 58 en Phase 0)

---

## Phase 2 - Tests & Qualite
### Statut : TERMINE

- [x] **1. Refactoring** - Extraction logique pure pour testabilite
  - `src/features/translator/transliterate.ts` : maps LATIN_TO_ADLAM/ADLAM_TO_LATIN + `transliterate()`
  - `src/features/calculator/calcEngine.ts` : CalcState, inputDigit, performOperation, clear, backspace, toggleSign, percent

- [x] **2. Tests unitaires - logique pure** (32 tests)
  - `transliterate.test.ts` : latin->adlam, adlam->latin, round-trip, maps, casse, chiffres, vide (13 tests)
  - `calcEngine.test.ts` : addition, soustraction, multiplication, division, div/0, chaine, toggle, percent (19 tests)

- [x] **3. Tests composants** (44 tests)
  - `TranslatorScreen.test.tsx` : titre, saisie, swap, copie clipboard (4 tests)
  - `CalculatorScreen.test.tsx` : affichage 0, titre, digits, addition, clear (5 tests)
  - `GamesScreen.test.tsx` : titre, 12 cartes, flip, moves, reset (6 tests)
  - `NanoBananaScreen.test.tsx` : idle/start, 4 options, game over timer (4 tests)
  - `FontsScreen.test.tsx` : titre, texte Adlam, 5 styles (3 tests)
  - `DesignStudioScreen.test.tsx` : titre, 8 gradients, champ texte (3 tests)
  - `SocialCardsScreen.test.tsx` : titre, 6 templates, citation, auteur (4 tests)
  - `WordScreen.test.tsx` : titre, formatting, alignement, Adlam toggle (5 tests)
  - `Router.test.tsx` : 8 routes rendent le bon composant (8 tests)
  - `Navbar.test.tsx` : 4 categories, dropdown open/close, items corrects (5 tests)

### Build Phase 2
- [x] `npm run test:run` : 146 tests passent (18 fichiers), 0 echecs
- [x] `npx tsc --noEmit` : zero erreurs TypeScript
- [x] Dependency ajoutee : `@testing-library/dom`

---

## Phase 3 - Accessibilite (a11y) & Qualite Code
### Statut : TERMINE

- [x] **1. ESLint a11y plugin** (`eslint.config.js`, `package.json`)
  - Installe `eslint-plugin-jsx-a11y` + `vitest-axe`
  - Configure dans eslint flat config avec `jsxA11y.flatConfigs.recommended`
  - Zero erreurs jsx-a11y apres corrections

- [x] **2. Input.tsx** (`src/components/ui/Input.tsx`)
  - `useId()` pour generer id unique
  - `htmlFor={id}` sur label, `id={id}` sur input
  - `aria-invalid` + `aria-describedby` quand erreur presente

- [x] **3. Modal.tsx** (`src/components/ui/Modal.tsx`)
  - `role="dialog"` + `aria-modal="true"` sur le conteneur modal
  - `aria-labelledby` connecte au titre via `useId()`
  - `aria-label="Close"` sur le bouton X
  - `aria-hidden="true"` sur le backdrop

- [x] **4. Button.tsx** (`src/components/ui/Button.tsx`)
  - `aria-busy={isLoading}` quand chargement actif
  - Spinner avec `role="status"` + `<span class="sr-only">Loading</span>`

- [x] **5. Navbar.tsx** (`src/components/layout/Navbar.tsx`)
  - Boutons dropdown : `aria-haspopup="true"` + `aria-expanded={isOpen}`

- [x] **6. Ecrans features** - aria-labels boutons icones
  - TranslatorScreen : `aria-label="Swap direction"`, `aria-label="Clear"`
  - CalculatorScreen : `aria-label="Backspace"` sur bouton Delete
  - WordScreen : `aria-label` identique au `title` sur tous les boutons toolbar
  - WordScreen : `role="textbox"` + `aria-multiline` + `aria-label` sur editeur
  - GamesScreen : `aria-label` descriptif sur chaque carte memoire
  - NanoBananaScreen : `aria-label={opt.latin}` sur boutons options

- [x] **7. DashboardScreen** (`src/features/dashboard/DashboardScreen.tsx`)
  - Screensaver : `role="button"` + `tabIndex` + `onKeyDown` + `aria-label`

- [x] **8. index.html**
  - Ajout `<meta name="robots" content="index, follow" />`

- [x] **9. Tests a11y** (`src/components/ui/__tests__/a11y.test.tsx`) - 13 tests
  - Input : axe-core clean, htmlFor/id association, aria-invalid/describedby, no aria-invalid without error
  - Modal : axe-core clean, role=dialog + aria-modal, aria-labelledby, close aria-label, backdrop aria-hidden
  - Button : axe-core clean, aria-busy loading, sr-only text, no aria-busy when not loading

- [x] **10. Test existant corrige**
  - `TranslatorScreen.test.tsx` : swap button query mise a jour pour `aria-label="Swap direction"`

### Build Phase 3
- [x] `npm run lint` : zero erreurs jsx-a11y
- [x] `npm run test:run` : 159 tests passent (19 fichiers), 0 echecs
- [x] `npx tsc --noEmit` : zero erreurs TypeScript
- [x] `npm run build` : OK, 71 fichiers precaches PWA
- [x] Dependencies ajoutees : `eslint-plugin-jsx-a11y`, `vitest-axe`

---

## Phase 4 - SEO, i18n completion, Error Handling & Polish
### Statut : TERMINE

- [x] **1. i18n** (`src/utils/i18n.ts`)
  - 14 nouvelles cles x 4 langues (en, fr, ar, adlam)
  - translator.quickRef, word.size*, fonts.charMap, error.*, notFound.*, prayer.error/retry

- [x] **2. Chaines hardcodees corrigees**
  - `TranslatorScreen.tsx` : "Quick Reference" -> i18n
  - `WordScreen.tsx` : "Small/Normal/Large/X-Large" -> i18n
  - `FontsScreen.tsx` : "Character Map" -> i18n

- [x] **3. NotFoundScreen** (`src/features/notfound/NotFoundScreen.tsx`) - NOUVEAU
  - Ecran 404 avec titre, description et lien retour traduits
  - Style gradient amber coherent
  - Router mis a jour : `<Navigate>` -> `<NotFoundScreen />`

- [x] **4. PrayerScreen error handling** (`src/features/prayer/PrayerScreen.tsx`)
  - State `error` ajoute
  - UI Card erreur avec message traduit + bouton Retry
  - Reset erreur avant chargement

- [x] **5. Fichiers SEO**
  - `public/robots.txt` : Allow all + sitemap
  - `public/sitemap.xml` : 20 routes avec priorites

- [x] **6. Memoisation**
  - `HomeScreen.tsx` : `categoryData` -> `useMemo([language])`
  - `Navbar.tsx` : `categories` -> `useMemo([settings.language])`, `toggleDarkMode` -> `useCallback`

- [x] **7. ErrorBoundary refactored**
  - `ErrorFallback` extrait dans fichier separe (`src/components/ErrorFallback.tsx`)
  - Chaines hardcodees remplacees par cles i18n
  - `window.location.href` -> `<Link to="/">`

- [x] **8. Tests**
  - `NotFoundScreen.test.tsx` : 3 tests (titre, description, lien accueil)
  - `Router.test.tsx` : +1 test route 404

### Build Phase 4
- [x] `npx tsc --noEmit` : zero erreurs TypeScript
- [x] `npm run test:run` : 163 tests passent (20 fichiers), 0 echecs
- [x] `npm run build` : OK, 72 fichiers precaches PWA

---

## Phase 5 - CI/CD, Analytics, Auth & Paiements
### Statut : TERMINE

- [x] **1. CI quality gate** (`.github/workflows/`)
  - `tsc --noEmit` + `test:run` ajoutes avant deploy dans les 2 workflows
  - Merge to main : tsc -> test -> build -> deploy live
  - Pull request : tsc -> test -> build -> preview channel

- [x] **2. Firebase Analytics** (`src/lib/firebase.ts`)
  - `getAnalytics` initialise avec `isSupported()` guard
  - `measurementId` ajoute a la config

- [x] **3. Security headers** (`firebase.json`)
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation/microphone/camera desactives
  - Cache images : 1 jour + stale-while-revalidate 7 jours

- [x] **4. AuthButton logout** (`src/components/ui/AuthButton.tsx`)
  - Dropdown au clic sur avatar : nom, email, badge premium
  - Bouton deconnexion avec icone LogOut
  - Click outside pour fermer

- [x] **5. Paiements Mobile Money elargi** (`src/lib/flutterwave.ts`)
  - `payment_options` : mobilemoney (generique) + franco (XOF) + Ghana (GHS) + Kenya (KES) + Uganda + Rwanda + Zambia + card
  - Parametre `currency` ajoute (defaut XOF)

### Build Phase 5
- [x] `npx tsc --noEmit` : zero erreurs TypeScript
- [x] `npm run test:run` : 163 tests passent (20 fichiers), 0 echecs
- [x] `npm run build` : OK, 72 fichiers precaches PWA
