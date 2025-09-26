## Roadmap (PROMPT-1 → PROMPT-5)

### Milestone PROMPT-1: Audit & Blueprint (this PR)
- Deliver audit of routes, DB schema, env vars, assets, tests
- Provide migration matrix and architecture diagram
- Produce roadmap and GitHub issue templates
- ETA: 6 hours

### Milestone PROMPT-2: DB Migration to MariaDB 11.4
- Design schema, write migration scripts, seed
- Replace SQLite in API, add pooling, transactions
- Add Docker services for db + init, backups
- ETA: 12 hours

### Milestone PROMPT-3: Frontend to Vite + SSR + i18n
- Migrate CRA → Vite 6 (SWC), set SSR (Router v7 streaming)
- Setup i18next (30 langs, ICU, RTL), code-split, PWA images
- Replace Jest → Vitest, add MSW; keep RTL
- ETA: 16 hours

### Milestone PROMPT-4: Admin Panel & Security Hardening
- Add React-Admin 5 + RA-data-simple-rest + MUI X DataGrid Pro
- Security: Helmet, strict CORS, rate-limit, csurf, JWT refresh
- Auth: switch bcrypt → argon2id
- ETA: 14 hours

### Milestone PROMPT-5: Containers, CDN, Observability & E2E
- docker-compose profiles, multi-arch builds, secrets, healthchecks
- Add nginx (HTTP/3, Brotli), redis, minio; move uploads
- Observability: Prometheus/Grafana/Loki/Otel; Playwright e2e + visual
- ETA: 18 hours

Total ETA: 66 hours




