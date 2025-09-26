## GitHub Issues (milestones)

Labels: enhancement, priority-critical

1) PROMPT-1: Audit & Blueprint
Title: PROMPT-1: Audit & Blueprint
Labels: enhancement, priority-critical
Body:
- Produce audit of routes, DB schema, env vars, assets, tests
- Add migration matrix and architecture diagram
- Provide roadmap with 5 milestones and ETA

2) PROMPT-2: DB Migration to MariaDB 11.4
Title: PROMPT-2: DB Migration to MariaDB 11.4
Labels: enhancement, priority-critical
Body:
- Design schema, write migration scripts, seeds
- Replace SQLite in API; add pooling/transactions
- Compose service, backups, healthchecks

3) PROMPT-3: Frontend to Vite + SSR + i18n
Title: PROMPT-3: Frontend to Vite + SSR + i18n
Labels: enhancement, priority-critical
Body:
- Migrate CRA → Vite 6 (SWC) with SSR (Router v7 streaming)
- Setup i18next (30 langs, ICU, RTL), code-splitting, PWA images
- Switch Jest → Vitest; add MSW

4) PROMPT-4: Admin Panel & Security
Title: PROMPT-4: Admin Panel & Security
Labels: enhancement, priority-critical
Body:
- Add React-Admin 5 + RA-data-simple-rest + MUI X DataGrid Pro
- Security: Helmet, strict CORS, rate-limit, csurf; JWT refresh rotation
- Hashing: bcrypt → argon2id

5) PROMPT-5: Containers, Observability, E2E
Title: PROMPT-5: Containers, Observability, E2E
Labels: enhancement, priority-critical
Body:
- Compose profiles; multi-arch builds; secrets; healthchecks
- Services: nginx (HTTP/3), redis, minio; move uploads to S3
- Observability: Prometheus/Grafana/Loki/Otel; Playwright e2e + visual

### gh CLI commands (prepare locally)
```bash
gh issue create --title "PROMPT-1: Audit & Blueprint" --label enhancement --label priority-critical --body-file docs/github-issues.md
gh issue create --title "PROMPT-2: DB Migration to MariaDB 11.4" --label enhancement --label priority-critical --body "See roadmap and acceptance criteria in docs/."
gh issue create --title "PROMPT-3: Frontend to Vite + SSR + i18n" --label enhancement --label priority-critical --body "See roadmap and acceptance criteria in docs/."
gh issue create --title "PROMPT-4: Admin Panel & Security" --label enhancement --label priority-critical --body "See roadmap and acceptance criteria in docs/."
gh issue create --title "PROMPT-5: Containers, Observability, E2E" --label enhancement --label priority-critical --body "See roadmap and acceptance criteria in docs/."
```




