# Courser

Piattaforma globale per la vendita di corsi e libri digitali multilingua. Trasforma il traffico YouTube in prodotti digitali localizzati.

## Documentazione

- [MISSION.md](MISSION.md) — Bussola strategica del progetto
- [ARCHITECTURE.md](ARCHITECTURE.md) — Architettura tecnica
- [ROADMAP.md](ROADMAP.md) — Piano di sviluppo per fasi
- [TECH-STACK.md](TECH-STACK.md) — Scelte tecnologiche
- [MVP-SPEC.md](MVP-SPEC.md) — Specifica dettagliata del MVP

## Struttura Progetto

```
Courser/
├── docs/                  # Documentazione
├── src/
│   ├── pages/             # Pagine Next.js
│   ├── components/        # Componenti React
│   ├── lib/               # Utility, Stripe, DB, auth
│   ├── styles/            # Stili globali
│   └── i18n/              # Traduzioni
├── public/
│   └── locales/           # File traduzione JSON
├── MISSION.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── TECH-STACK.md
├── MVP-SPEC.md
└── README.md
```

## Avvio Rapido

```bash
# Installazione dipendenze
npm install

# Setup database
npx prisma db push

# Variabili d'ambiente (copiare da .env.example)
cp .env.example .env

# Development
npm run dev

# Build produzione
npm run build
```

## Variabili d'Ambiente

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
