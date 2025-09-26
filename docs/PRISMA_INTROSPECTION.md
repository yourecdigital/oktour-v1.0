# Prisma Introspection & Merge Guide

Goal: Introspect both SQLite files and merge into a single MariaDB schema.

## 1) Prepare temp datasources
Create two temp schemas:
- `apps/api/prisma/sqlite-main.prisma` -> datasource points to `./database.sqlite`
- `apps/api/prisma/sqlite-server.prisma` -> datasource points to `./server/database.sqlite`

Example datasource:
```
datasource db {
  provider = "sqlite"
  url      = "file:../../../../database.sqlite"
}
```

## 2) Introspect
```
npx prisma introspect --schema=apps/api/prisma/sqlite-main.prisma
npx prisma introspect --schema=apps/api/prisma/sqlite-server.prisma
```
Compare models (names, nullability, types), consolidate naming.

## 3) Merge to MariaDB schema
Open `apps/api/prisma/schema.prisma` and:
- Convert IDs to BigInt autoincrement
- Add UUID external keys (Char(36))
- Use `@db.Text("longtext")` for i18n content
- Set JSON fields where applicable
- Add `@@index([locale, slug])` for `Tour`
- Create `enum UserRole { ADMIN AGENT CUSTOMER }`

## 4) Generate client
```
npm run prisma:generate
```

## 5) Validate with MariaDB
Run against MariaDB (`DATABASE_URL`), run smoke queries and ensure types match.


