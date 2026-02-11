# TODO - Adlam Calendar Clock Web App
# Plan d'implementation complet de A a Z

> **Firebase Project:** `adlam-clock-calendar`
> **Hosting:** Firebase Hosting
> **Date:** 2026-02-10

---

## PHASE 0 - NETTOYAGE (Retirer fonctionnalites mobiles)

### 0.1 Supprimer les ecrans mobile-only
- [ ] Supprimer `src/features/qibla/QiblaScreen.tsx` (capteur magnetometre = mobile)
- [ ] Supprimer `src/features/alarms/AlarmsScreen.tsx` (alarmes fiables = mobile)
- [ ] Supprimer `src/store/useAlarmsStore.ts` (plus utilise)
- [ ] Supprimer `src/screens/HomeScreen.tsx` (legacy duplique)
- [ ] Supprimer `src/screens/AlarmsScreen.tsx` (legacy duplique)
- [ ] Supprimer le dossier `src/screens/` entier

### 0.2 Nettoyer le Router
- [ ] Retirer les imports/routes commentees (qibla, alarms) de `src/app/Router.tsx`
- [ ] Verifier qu'aucun lien mort ne pointe vers `/qibla` ou `/alarms`

### 0.3 Nettoyer le HomeScreen
- [ ] Retirer les cartes Qibla et Alarms de la grille de features dans `src/features/home/HomeScreen.tsx`
- [ ] Remplacer par les nouvelles features web (Editeur Adlam, Generateur PDF, etc.)

### 0.4 Nettoyer les traductions
- [ ] Retirer les cles `feature.qibla.*`, `feature.alarms.*`, `alarms.*`, `nav.qibla`, `nav.alarms` de `src/utils/i18n.ts` (4 langues)
- [ ] Ajouter les nouvelles cles pour les features web

### 0.5 Nettoyer les dependances inutiles
- [ ] Verifier si `react-grid-layout` est utilise, sinon retirer
- [ ] Verifier si `react-hook-form` et `zod` sont utilises, sinon retirer
- [ ] Lancer `npm audit` et corriger les vulnerabilites

---

## PHASE 1 - FIREBASE HOSTING & DEPLOIEMENT

### 1.1 Installer Firebase CLI & SDK
- [ ] `npm install -g firebase-tools` (globalement)
- [ ] `npm install firebase` dans `web-app/`
- [ ] Creer `web-app/src/lib/firebase.ts` avec config Firebase web (depuis la console Firebase)

### 1.2 Initialiser Firebase Hosting
- [ ] `firebase login` (authentification)
- [ ] `firebase init hosting` dans `web-app/`
- [ ] Configurer `firebase.json`:
  ```json
  {
    "hosting": {
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    }
  }
  ```
- [ ] Creer `.firebaserc` avec project ID `adlam-clock-calendar`

### 1.3 Ajouter une webapp dans la console Firebase
- [ ] Aller sur console.firebase.google.com > adlam-clock-calendar
- [ ] Ajouter une application web (icone `</>`)
- [ ] Recuperer les cles `firebaseConfig` (apiKey, authDomain, projectId, etc.)
- [ ] Creer `web-app/src/lib/firebase.ts`:
  ```ts
  import { initializeApp } from 'firebase/app';
  import { getAnalytics } from 'firebase/analytics';

  const firebaseConfig = {
    apiKey: "...",
    authDomain: "adlam-clock-calendar.firebaseapp.com",
    projectId: "adlam-clock-calendar",
    storageBucket: "adlam-clock-calendar.firebasestorage.app",
    messagingSenderId: "883242449351",
    appId: "..."
  };

  export const app = initializeApp(firebaseConfig);
  export const analytics = getAnalytics(app);
  ```

### 1.4 Scripts de deploiement
- [ ] Ajouter dans `package.json`:
  ```json
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:preview": "npm run build && firebase hosting:channel:deploy preview"
  }
  ```
- [ ] Tester `npm run deploy` et verifier le site en ligne

### 1.5 Firebase Analytics
- [ ] Initialiser analytics dans `main.tsx` ou `App.tsx`
- [ ] Ajouter tracking des pages vues (route changes)
- [ ] Ajouter tracking des events cles (changement langue, theme, utilisation clavier)

---

## PHASE 2 - PWA (Progressive Web App)

### 2.1 Manifest Web App
- [ ] Creer `web-app/public/manifest.json`:
  ```json
  {
    "name": "Adlam Calendar Clock",
    "short_name": "AdlamClock",
    "description": "Cultural companion for time, prayer and learning",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1a1a2e",
    "theme_color": "#d97706",
    "icons": [
      { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
- [ ] Ajouter `<link rel="manifest" href="/manifest.json">` dans `index.html`

### 2.2 Icones & Favicon
- [ ] Generer icones PWA (192x192, 512x512) depuis le logo Adlam Clock
- [ ] Creer `public/icons/` avec les icones
- [ ] Ajouter favicon.ico + apple-touch-icon dans `index.html`

### 2.3 Service Worker
- [ ] Installer `vite-plugin-pwa`:
  ```bash
  npm install vite-plugin-pwa -D
  ```
- [ ] Configurer dans `vite.config.ts`:
  ```ts
  import { VitePWA } from 'vite-plugin-pwa';
  export default defineConfig({
    plugins: [react(), VitePWA({ registerType: 'autoUpdate' })]
  });
  ```
- [ ] Definir la strategie de cache (NetworkFirst pour API priere, CacheFirst pour assets)
- [ ] Tester le mode offline

### 2.4 Meta tags SEO
- [ ] Ajouter Open Graph meta tags dans `index.html`
- [ ] Ajouter Twitter Card meta tags
- [ ] Ajouter description, keywords, author
- [ ] Ajouter `<html lang="fr">` dynamique selon la langue

---

## PHASE 3 - FEATURES WEB EXCLUSIVES

### 3.1 Editeur de Texte Adlam ("Word Adlam")
- [ ] Creer `src/features/editor/AdlamEditorScreen.tsx`
- [ ] Zone de texte riche (contenteditable ou lib comme TipTap)
- [ ] Clavier virtuel Adlam integre en bas de l'ecran
- [ ] Translitteration temps reel Latin -> Adlam
- [ ] Barre d'outils: Gras, Italique, Taille police, Alignement
- [ ] Export en PNG (html2canvas ou dom-to-image)
- [ ] Export en PDF (jsPDF ou @react-pdf/renderer)
- [ ] Sauvegarde locale (localStorage) des documents recents
- [ ] Bouton "Partager" (Web Share API)
- [ ] Ajouter la route `/editor` dans Router.tsx
- [ ] Ajouter les traductions (4 langues) dans i18n.ts

### 3.2 Generateur PDF Calendrier de Prieres
- [ ] Creer `src/features/prayer-pdf/PrayerPdfScreen.tsx`
- [ ] Selection mois + annee
- [ ] Selection ville (reutiliser diasporaCities.ts)
- [ ] Selection methode de calcul
- [ ] Appel API Aladhan pour le mois complet
- [ ] Mise en page tableau propre (A4 portrait/paysage)
- [ ] Double affichage dates Gregorien/Hijri
- [ ] Chiffres Adlam optionnels
- [ ] Bouton "Telecharger PDF" (jsPDF + autoTable)
- [ ] Bouton "Imprimer" (window.print avec CSS @media print)
- [ ] Preview du PDF avant telechargement
- [ ] Ajouter la route `/prayer-pdf` dans Router.tsx
- [ ] Ajouter les traductions (4 langues) dans i18n.ts

### 3.3 Convertisseur de Dates Avance
- [ ] Creer `src/features/converter/DateConverterScreen.tsx`
- [ ] Conversion bidirectionnelle: Gregorien <-> Hijri <-> Adlam
- [ ] 3 champs de date synchronises
- [ ] Affichage du jour de la semaine en Adlam/Pulaar
- [ ] Timeline visuelle simple (frise chronologique)
- [ ] Contexte historique: evenements islamiques/culturels associes
- [ ] Bouton copier le resultat
- [ ] Ajouter la route `/converter` dans Router.tsx
- [ ] Ajouter les traductions (4 langues) dans i18n.ts

### 3.4 Bibliotheque d'Apprentissage Etendue (Learning Hub v2)
- [ ] Refactorer `src/features/learning/LearningScreen.tsx`
- [ ] Layout Split View: lecon a gauche, exercice a droite
- [ ] Systeme de lecons progressives (niveau 1, 2, 3)
- [ ] Quiz interactif: reconnaitre les caracteres
- [ ] Audio prononciation au clic (Web Audio API ou fichiers mp3)
- [ ] Progression sauvegardee en localStorage
- [ ] Barre de progression globale
- [ ] Mode "Flash Cards" pour revisions
- [ ] Section mots courants en Pulaar avec traduction

### 3.5 Mode Kiosque Ameliore (Dashboard v2)
- [ ] Ameliorer `src/features/dashboard/DashboardScreen.tsx`
- [ ] Ajout affichage meteo (API OpenWeatherMap ou WeatherAPI)
- [ ] Ajout phase lunaire (calcul local ou API)
- [ ] Widgets configurables (drag & drop ou presets)
- [ ] Mode "screensaver" avec animation etoiles (comme la version Android)
- [ ] Raccourci clavier F11 pour plein ecran natif
- [ ] Option masquer le curseur apres inactivite

---

## PHASE 4 - AMELIORATIONS UI/UX

### 4.1 Systeme de themes culturels complet
- [ ] Porter les 14 themes Android (HOOTONDE, SAHEL, NAGGE, etc.) dans `src/utils/themes.ts`
- [ ] Variables CSS dynamiques par theme
- [ ] Selecteur de theme visuel avec preview (grille de cartes colorees)
- [ ] Persistence du theme choisi

### 4.2 Ameliorer la navigation
- [ ] Ajouter les nouvelles pages web dans la Navbar:
  - Editeur Adlam
  - Generateur PDF
  - Convertisseur
- [ ] Menu hamburger sur mobile avec toutes les pages
- [ ] Breadcrumbs sur desktop
- [ ] Ajouter icones dans le BottomBar mobile (Editeur, Priere, Apprendre)
- [ ] Footer global avec liens utiles, credits, lien Play Store

### 4.3 Page d'accueil (HomeScreen) revisitee
- [ ] Hero section avec horloge analogique animee (pas juste digital)
- [ ] Section "features web" mise en avant (Editeur, PDF, Convertisseur)
- [ ] Section temoignages/communaute (statique)
- [ ] Compteur de la communaute Adlam (nombre de telechargements Play Store)
- [ ] Lien vers l'app Android (badge Play Store)
- [ ] Banner "Installer l'app" (PWA install prompt)

### 4.4 Horloge amelioree
- [ ] Ajouter les skins d'horloge (CLASSIC, NOMAD, ROYAL, etc.) comme sur Android
- [ ] Selecteur de skin dans l'ecran horloge
- [ ] Mode plein ecran (F11) depuis l'ecran horloge
- [ ] Complications optionnelles (date, priere, meteo)

### 4.5 Accessibilite
- [ ] Ajouter Error Boundaries React (catch erreurs globales)
- [ ] Ajouter `aria-label` sur tous les boutons interactifs
- [ ] Support clavier complet (Tab, Enter, Escape)
- [ ] Contraste WCAG AA minimum sur tous les themes
- [ ] Skip-to-content link
- [ ] Focus visible sur tous les elements interactifs

### 4.6 Responsive avance
- [ ] Tester et corriger tablette (768-1024px)
- [ ] Mode paysage mobile
- [ ] Print CSS pour les pages imprimables (calendrier, prieres)

---

## PHASE 5 - QUALITE & TESTS

### 5.1 Configuration des tests
- [ ] Installer Vitest + React Testing Library:
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] Configurer `vitest.config.ts`
- [ ] Ajouter script `"test": "vitest"` dans package.json

### 5.2 Tests unitaires
- [ ] Test `adlamDigits.ts` (conversion chiffres)
- [ ] Test `i18n.ts` (traductions, fallback, getGreetingKey)
- [ ] Test `pulaarTimeConverter.ts`
- [ ] Test `timeTextConverter.ts`
- [ ] Test `hijri-converter` integration
- [ ] Test stores Zustand (useSettingsStore, useEventsStore)

### 5.3 Tests composants
- [ ] Test DigitalClock (render, format 12/24)
- [ ] Test AnalogClock (render, canvas)
- [ ] Test Calendar (navigation mois, highlight today)
- [ ] Test Keyboard (conversion Latin -> Adlam, copier)
- [ ] Test Settings (changement langue, theme, persistance)

### 5.4 Tests E2E (optionnel)
- [ ] Installer Playwright ou Cypress
- [ ] Test navigation complete
- [ ] Test changement de langue
- [ ] Test mode sombre
- [ ] Test PWA install

### 5.5 Linting & Formatting
- [ ] Activer TypeScript strict mode dans `tsconfig.app.json`
- [ ] Configurer Prettier (`prettier.config.js`)
- [ ] Activer les regles ESLint strictes
- [ ] Ajouter `"lint:fix": "eslint . --fix"` dans scripts
- [ ] Pre-commit hook avec lint-staged (optionnel)

---

## PHASE 6 - PERFORMANCE & OPTIMISATION

### 6.1 Bundle optimisation
- [ ] Analyser le bundle avec `npx vite-bundle-visualizer`
- [ ] Verifier le code splitting (lazy routes fonctionnent)
- [ ] Optimiser les imports Lucide (import specifique, pas tout)
- [ ] Verifier tree-shaking de framer-motion

### 6.2 Assets
- [ ] Compresser les fonts Adlam (woff2 au lieu de ttf)
- [ ] Optimiser les images (WebP, tailles appropriees)
- [ ] Preload font critique dans `index.html`:
  ```html
  <link rel="preload" href="/fonts/NotoSansAdlam-Regular.woff2" as="font" type="font/woff2" crossorigin>
  ```

### 6.3 Performance runtime
- [ ] `React.memo` sur les composants lourds (AnalogClock, Calendar grid)
- [ ] `useMemo`/`useCallback` pour les calculs couteux
- [ ] Debounce sur les inputs de recherche/filtrage
- [ ] Lazy load des images et composants lourds

### 6.4 Cache & Offline
- [ ] Cache API Aladhan (react-query staleTime + localStorage fallback)
- [ ] Cache des preferences utilisateur (deja fait via Zustand persist)
- [ ] Offline fallback page pour le Service Worker

---

## PHASE 7 - CI/CD & DEPLOIEMENT AUTOMATISE

### 7.1 GitHub Actions
- [ ] Creer `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to Firebase
  on:
    push:
      branches: [master]
      paths: ['web-app/**']
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
        - run: cd web-app && npm ci && npm run build
        - uses: FirebaseExtended/action-hosting-deploy@v0
          with:
            repoToken: ${{ secrets.GITHUB_TOKEN }}
            firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
            channelId: live
            projectId: adlam-clock-calendar
            entryPoint: web-app
  ```
- [ ] Configurer le secret `FIREBASE_SERVICE_ACCOUNT` dans GitHub

### 7.2 Preview deployments
- [ ] Configurer deploy preview sur les PRs (Firebase preview channels)
- [ ] Ajouter un workflow pour les PRs avec channel temporaire

### 7.3 Domaine personnalise (optionnel)
- [ ] Acheter/configurer un domaine (ex: adlamclock.com)
- [ ] Configurer DNS dans Firebase Hosting
- [ ] Activer SSL automatique

---

## PHASE 8 - FONCTIONNALITES SOCIALES & COMMUNAUTAIRES

### 8.1 Partage
- [ ] Bouton "Partager cette page" (Web Share API)
- [ ] Partage horloge en image (screenshot composant)
- [ ] Partage texte Adlam depuis l'editeur
- [ ] Partage calendrier de prieres en PDF

### 8.2 Lien avec l'app mobile
- [ ] Banner intelligent "Telecharger sur Android" (Smart App Banner)
- [ ] Deep links entre web et app mobile
- [ ] Badge Google Play Store dans le footer

### 8.3 Page "A propos"
- [ ] Creer `src/features/about/AboutScreen.tsx`
- [ ] Histoire du projet Adlam
- [ ] Credits et contributeurs
- [ ] Liens vers ressources Adlam
- [ ] Politique de confidentialite
- [ ] Route `/about` dans Router.tsx

---

## RESUME DES ROUTES FINALES

| Route | Ecran | Statut | Type |
|-------|-------|--------|------|
| `/` | HomeScreen (revisitee) | Existant -> Modifier | Core |
| `/clock` | ClockScreen (avec skins) | Existant -> Ameliorer | Core |
| `/calendar` | CalendarScreen | Existant | Core |
| `/prayer` | PrayerScreen | Existant | Core |
| `/keyboard` | KeyboardScreen | Existant | Core |
| `/dashboard` | DashboardScreen v2 | Existant -> Ameliorer | Core |
| `/learning` | LearningScreen v2 | Existant -> Refactorer | Core |
| `/settings` | SettingsScreen | Existant -> Ameliorer | Core |
| `/editor` | AdlamEditorScreen | **NOUVEAU** | Web |
| `/prayer-pdf` | PrayerPdfScreen | **NOUVEAU** | Web |
| `/converter` | DateConverterScreen | **NOUVEAU** | Web |
| `/about` | AboutScreen | **NOUVEAU** | Web |

### Routes SUPPRIMEES (mobile-only)
| Route | Raison |
|-------|--------|
| `/qibla` | Capteur magnetometre = mobile only |
| `/alarms` | Alarmes fiables = mobile only |

---

## FICHIERS A SUPPRIMER
```
src/features/qibla/QiblaScreen.tsx
src/features/alarms/AlarmsScreen.tsx
src/store/useAlarmsStore.ts
src/screens/HomeScreen.tsx
src/screens/AlarmsScreen.tsx
src/screens/  (dossier entier)
```

## FICHIERS A CREER
```
src/lib/firebase.ts                          # Config Firebase
src/features/editor/AdlamEditorScreen.tsx     # Editeur Adlam
src/features/prayer-pdf/PrayerPdfScreen.tsx   # Generateur PDF prieres
src/features/converter/DateConverterScreen.tsx # Convertisseur dates
src/features/about/AboutScreen.tsx            # Page A propos
public/manifest.json                          # PWA manifest
public/icons/icon-192.png                     # Icone PWA
public/icons/icon-512.png                     # Icone PWA
firebase.json                                 # Config Firebase Hosting
.firebaserc                                   # Firebase project link
.github/workflows/deploy.yml                  # CI/CD
```

## DEPENDANCES A AJOUTER
```bash
npm install firebase                    # Firebase SDK
npm install -D vite-plugin-pwa          # PWA support
npm install jspdf jspdf-autotable       # Generation PDF
npm install html2canvas                 # Export images
npm install @tiptap/react @tiptap/starter-kit  # Editeur riche (optionnel)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom  # Tests
```

## DEPENDANCES A POTENTIELLEMENT RETIRER
```bash
npm uninstall react-grid-layout   # Si non utilise
npm uninstall react-hook-form     # Si non utilise
npm uninstall zod                 # Si non utilise
```

---

## ORDRE DE PRIORITE RECOMMANDE

1. **Phase 0** - Nettoyage (1h) -> Base propre
2. **Phase 1** - Firebase Hosting (1-2h) -> Site en ligne
3. **Phase 2** - PWA (2h) -> Installable
4. **Phase 3.2** - Generateur PDF Prieres (4h) -> Feature web forte
5. **Phase 3.1** - Editeur Adlam (6-8h) -> Feature web unique
6. **Phase 3.3** - Convertisseur Dates (3h) -> Outil utile
7. **Phase 4** - UI/UX ameliorees (4-6h) -> Polish
8. **Phase 3.4** - Learning Hub v2 (4h) -> Education
9. **Phase 5** - Tests (4h) -> Qualite
10. **Phase 6** - Performance (2h) -> Optimisation
11. **Phase 7** - CI/CD (2h) -> Automatisation
12. **Phase 8** - Social (2h) -> Communaute
