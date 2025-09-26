# Database Migration to MariaDB 11.4

## Prerequisites
- MariaDB 11.4, database created
- env: `DATABASE_URL=mysql://user:pass@host:3306/sochi?timezone=Z`

## Install & Generate
```
npm i
npm run prisma:generate
```

## Run Migration Script
```
npm run migrate:db
```

## Notes
- Concurrency 10 (p-map), progress bars
- Dates normalized to ISO
- IDs switch to BigInt; new UUID external keys

## Rollback
- Take snapshot/backup of MariaDB before running
- In failure: truncate tables in reverse dependency order, restore backup

## After
- Point API to MariaDB via Prisma client
- Remove writes to local SQLite


