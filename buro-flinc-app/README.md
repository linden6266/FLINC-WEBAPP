# Buro Flinc Digital Workplace App

Een moderne, interactieve werkplek-applicatie voor Buro Flinc, gebouwd met Vue 3, TypeScript en Tailwind CSS.

## ✨ Functionaliteiten

### 🏠 Dashboard
- Gepersonaliseerd welkomstbericht
- Nieuwsfeed met recente updates
- Snelkoppelingen naar belangrijke tools (SharePoint, Teams, Planning, BOOST)
- Aankomende events en deadlines
- Team widget
- Quiz van de week

### 📰 Nieuws & Verhalen
- Volledige nieuwsfeed met filters (Alles, Nieuws, Successen, Verjaardagen, Events)
- Like en reageer functionaliteit
- Gedetailleerde nieuwsartikelen met comments
- Categorieën met kleurcodering

### 💬 Chat & Community
- Contact lijst met online status
- Real-time chat interface
- Quick polls en vragen
- Team channels

### 🎮 Spel & Quiz
- Interactieve kennisquiz over Buro Flinc
- Progress tracking
- Score berekening
- Leaderboard met rankings
- Uitgebreide antwoord review

### 🔍 Zoeken
- Universele zoekfunctionaliteit
- Zoek mensen, documenten en nieuws
- Filters per categorie
- Populaire zoekopdrachten
- Highlight van zoekresultaten

### ⚙️ Instellingen
- Profielbeheer
- Notificatie voorkeuren
- Favoriete tegels personaliseren
- Thema selectie (Light/Dark)
- Taal en tijdzone instellingen

## 🎨 Design

De app gebruikt het Buro Flinc kleurenschema:
- **Oranje** (#FF6B35) - Primaire accentkleur
- **Blauw** (#004E89, #1A659E) - Secundaire kleuren
- **Geel** (#FFB81C) - Highlight kleur
- **Grijs** (#F5F5F5, #2C3E50) - Achtergrond en tekst

## 🚀 Aan de slag

### Installatie

```bash
npm install
```

### Development Server

```bash
npm run dev
```

De app draait op `http://localhost:5173`

### Build voor Productie

```bash
npm run build
```

### Preview Productie Build

```bash
npm run preview
```

## 🏗️ Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next Generation Frontend Tooling
- **Vue Router** - Official Router
- **Pinia** - State Management
- **Tailwind CSS** - Utility-first CSS Framework
- **Lucide Vue** - Beautiful & consistent icons

## 📁 Project Structuur

```
src/
├── components/          # Herbruikbare componenten
│   ├── Header.vue
│   ├── NavigationBar.vue
│   ├── NewsCard.vue
│   └── QuickTile.vue
├── views/              # Pagina views
│   ├── HomeView.vue
│   ├── NieuwsView.vue
│   ├── NieuwsDetailView.vue
│   ├── ChatView.vue
│   ├── SpelView.vue
│   ├── ZoekenView.vue
│   └── InstellingenView.vue
├── stores/             # Pinia state management
│   ├── userStore.ts
│   ├── newsStore.ts
│   └── quizStore.ts
├── router/             # Vue Router configuratie
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
```

## 📱 Responsive Design

De app is volledig responsive en geoptimaliseerd voor:
- 📱 Mobile (Teams mobile app)
- 💻 Tablet
- 🖥️ Desktop

## 🔧 Configuratie

### Tailwind Config
Zie `tailwind.config.js` voor custom kleuren en thema instellingen.

### Router
Zie `src/router/index.ts` voor route configuratie.

### State Management
Drie hoofdstores:
- `userStore` - Gebruikersinformatie en notificaties
- `newsStore` - Nieuws items en interacties
- `quizStore` - Quiz vragen en leaderboard

## 🎯 Toekomstige Features

- [ ] Dark mode implementatie
- [ ] Microsoft Teams SSO integratie
- [ ] Microsoft Graph API integratie
- [ ] Real-time chat met SignalR
- [ ] Push notificaties
- [ ] Offline support (PWA)
- [ ] Meerdere talen support
- [ ] Geavanceerde analytics

## 📄 Licentie

© 2025 Buro Flinc. Alle rechten voorbehouden.

## 👥 Contact

Voor vragen of feedback, neem contact op met het Digital Innovation team.

---

Gebouwd met ❤️ voor Buro Flinc
