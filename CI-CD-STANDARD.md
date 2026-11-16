# CI/CD standard

What every a14a repository with code is expected to do.

## 1. Workflow

Every repo has a CI workflow at `.github/workflows/ci.yml` that:

- runs on `pull_request` and on `push` to the default branch;
- declares a top-level `permissions:` block, starting from `contents: read`,
  and grants more only on the job that needs it;
- sets `concurrency` so a new push to a pull request cancels the previous run
  (`cancel-in-progress: true`); runs on the default branch are not cancelled;
- sets `timeout-minutes` on every job;
- installs from the lockfile and fails if it is out of date
  (`bun install --frozen-lockfile`, `npm ci`, `uv sync --locked`,
  `cargo build --locked`).

## 2. Gates

CI fails the pull request unless all of these pass:

| Gate | Bun / TypeScript default |
|---|---|
| Lint and format | `bun run lint:check` (Biome) |
| Type check | `bun run typecheck` |
| Unit tests | `bun run test` |
| Build | `bun run build` |
| Smoke test (web apps) | `bun run test:smoke` (Playwright), or an equivalent check against the built app |
| Secret scan | gitleaks over the pull request's commits |

Other stacks use their equivalent (`ruff` + `pytest`, `go vet` + `go test`,
`cargo clippy` + `cargo test`). If tests exist in the repo, CI runs them.

## 3. Runners

- **Private repositories** run on the self-hosted pool with the full label set:
  `runs-on: [self-hosted, Linux, X64, default]`. Do not use a bare
  `self-hosted`.
- **Public repositories** run on GitHub-hosted runners (`ubuntu-latest`). A
  self-hosted runner must never execute code from a fork pull request.
- A private repository that people outside the organisation can push to is
  treated like a public one.
- A job that cannot run on the pool (it needs another operating system, a
  virtual machine, or a tool the pool does not have) may stay on a
  GitHub-hosted runner, with a comment on `runs-on` that says why.
- Self-hosted runners keep state between jobs. Do not install into the
  runner's shared interpreters or global package directories, do not use
  fixed container names or published ports, and remove any container the job
  starts, also when it fails.

## 4. Supply chain

- Actions from other repositories, including `actions/*`, are pinned to a full
  commit SHA with the version in a trailing comment:
  `uses: owner/action@<sha> # v1.2.3`. Actions inside the same repository
  (`./.github/actions/...`) need no pin.
- Runtime versions are pinned (`bun-version: "1.4.4"`, never `latest`).
- `.github/renovate.json` extends `github>a14a-org/.github`. Renovate then
  keeps action pins and dependencies current. Runtime versions (Node, Bun) are
  grouped and merged by hand.
- Renovate only visits repositories that are in its rollout filter, and only
  auto-merges in repositories on the allow-list in `default.json`. Adding a
  repo to either is a change to this repository.
- Dependabot alerts are enabled, so Renovate can open security pull requests.
- `pull_request_target` is used only for jobs that never check out or run
  pull request code.

## 5. Secrets

- No secrets in the repository. `.env*` files are git-ignored except
  `.env.example` and files that hold only public build-time values.
- Public repositories have GitHub secret scanning and push protection enabled.

## 6. Branch protection

On the default branch:

- changes arrive through a pull request; an approving review is not required;
- the CI job is a required status check. A required check must come from a
  workflow that runs on every pull request: a workflow with a `paths` filter
  never reports on pull requests outside those paths and blocks them;
- force pushes and branch deletion are blocked;
- the rules apply to administrators too;
- "require branches to be up to date" is optional. A repo that turns it on is
  added to the `rebaseWhen` rule in `default.json`, or Renovate auto-merge
  stalls.

## 7. Default branch stays green

A failing workflow on the default branch is fixed or removed, not left red.
Scheduled workflows that fail repeatedly are either repaired or disabled.

## 8. Deployment

- Production apps expose a health endpoint and have a health check configured
  in the deploy platform, so a build that crashes at start is not promoted.
  Renovate auto-merge is withheld from production apps without one.
- Deploy and release jobs use a GitHub environment restricted to the default
  branch.

## Local hooks

Lefthook runs lint and type check on commit and tests on push. Commit
messages follow `type: lowercase description`, with an optional scope
(`chore(deps): ...`, as Renovate writes), and types `feat`, `fix`, `chore`,
`docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`.
