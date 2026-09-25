# CLAUDE.md

AI entrypoint for `@jorgebodega/typeorm-seeding`. Humans start at [README.md](README.md); usage, compatibility, branches and development commands live there and are not repeated here.

Sibling repo: `jorgebodega/typeorm-factory`; this repo uses it in tests.

## Working rules

- Every change is made in this repo **and** in `typeorm-factory` as one task: paired PRs with the same branch and commit message. If one repo needs nothing, it is a no-op, not a separate task.
- Before any Renovate or TypeORM update, read the changelog for supported features that let us delete our own code, and record the result in the PR body.
- Aim for the simplest solution. No new abstractions without a concrete need.
- Never merge, push to `next`/`main`/`N.x`, or run the Release workflow without an explicit instruction.

## Layout

| Path | Purpose |
| --- | --- |
| `src/cli.ts`, `src/commands/seed.command.ts` | `typeorm-seeding seed` CLI (commander + ora) |
| `src/seeder.ts` | abstract `Seeder` |
| `src/helpers/` | `useDataSource`, `useSeeders` |
| `src/datasource/` | process-wide `DataSourceManager` |
| `src/utils/commandUtils.ts` | wraps the TypeORM internals `CommandUtils.loadDataSource` and `importClassesFromDirectories` |
| `src/errors/` | typed errors wrapping `cause` |
| `test/` | Jest suites against sqlite `:memory:` (needs `--experimental-vm-modules`, which the scripts set) |

## Conventions

- Run tools through the pnpm scripts in README → Development. `pnpm checks` and `pnpm test:ci` must pass, and `pnpm lint:fix` sorts imports.
- Biome formatting: tabs, double quotes, semicolons, width 120. `@tsconfig/strictest`; no `any`. No code comments.
- Conventional Commits, header ≤ 100 characters, body lines ≤ 200.
- Shared tooling files must stay byte-identical with `typeorm-factory`: `.commitlintrc`, `.github/workflows/*`, `.github/renovate.json`, `.releaserc.json`, `biome.json`, `jest.config.ts`, `pnpm-workspace.yaml`, `tsconfig.json`.
- GitHub Actions are pinned to commit SHAs, with the version as a trailing comment (`uses: owner/action@<sha> # vX.Y.Z`).
- The required status checks on `next` and `main` are the job names `format`, `lint`, `typecheck`, `test`, `Test coverage` and `commitlint`. Renaming a job means updating branch protection in both repos, or every PR blocks forever.
- Dependencies are pinned to exact versions (`saveExact: true` in `pnpm-workspace.yaml`; pnpm 12 ignores non-auth settings in `.npmrc`). New versions are only picked up once they are 7 days old, through pnpm `minimumReleaseAge` and Renovate `minimumReleaseAge`. The only exemption is our own `@jorgebodega/*` packages.
- Renovate targets `next` plus the `N.x` maintenance branches. On `N.x` it only opens vulnerability-fix PRs.
- Releases: semantic-release commits `package.json` and `CHANGELOG.md` back as `chore: release <version> [skip ci]`. The push bypasses the required checks through the `RELEASE_TOKEN` secret in the `release` environment (a fine-grained PAT with Contents read & write, deployment branches `main`, `next`, `*.x`). Do not switch the release job back to `GITHUB_TOKEN`.
