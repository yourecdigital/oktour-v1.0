## PR & Tag Commands (run locally)

```bash
# Create branch and push
git checkout -b feat/mariadb-api
git add .
git commit -m "feat(api): MariaDB migration, Prisma, JWT rotation, S3 presign, OpenAPI, tests, Docker; disable legacy uploads"
git push -u origin feat/mariadb-api

# Open PR (requires gh cli)
gh pr create --title "feat(api): MariaDB migration & new API" --body "Implements MariaDB migration, Prisma schema, JWT rotation, S3 presign, OpenAPI, tests, Docker; disables legacy uploads" --base main --head feat/mariadb-api

# Tag
git tag -a DB-MIGRATION -m "Database migration milestone"
git push origin DB-MIGRATION
```


