# MaapSetu — Legal Metrology verification (SIH 2026)

Prototype for **SIH26036**: online verification, digital stamping and lifecycle management of weighing and measuring instruments.

This is a last-mile workflow app for traders, Legal Metrology Officers (LMOs), Government Approved Test Centres (GATCs), state administrators, and the public. It is designed to sit beside the national [e-Maap](https://emaap.gov.in/) portal, not replace licences, model approval or packaged-commodity registration.

## Run locally

```bash
cd maapsetu
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Trader | shop@maapsetu.gov.in | Shop@123 |
| LMO | lmo@maapsetu.gov.in | Lmo@123 |
| GATC | gatc@maapsetu.gov.in | Gatc@123 |
| Admin | admin@maapsetu.gov.in | Admin@123 |

Public verify (no login): `VC/TS/HYD/2025/00011`

## What works in this prototype

- Role-based login and trader self-registration
- Instrument register (shop scale, weighbridge, fuel dispenser)
- Verification / re-verification applications with demo fee
- Admin assignment and auto-assign (weighbridge → GATC, others → LMO)
- Field inspection with photo, GPS, MPE vs observed error
- Auto-issued QR verification certificate and SHA-256 integrity hash
- Public certificate check and print view
- Pendency / expiry dashboards and a failed-inspection enforcement note

## Stack

Next.js (App Router), Prisma, SQLite, JWT cookies, Tailwind CSS v4.

See `docs/ARCHITECTURE.md` for security and deployment notes.
