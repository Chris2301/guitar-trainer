# CLAUDE.md

## Project

**web-configurator** — AI-generated web configurator.

## Tech Stack

- **Backend**: Java 21, Spring Boot, Maven
- **Frontend**: Angular v21, Taiga UI, SCSS, NgRx Signal Store
- **Database**: PostgreSQL
- **Infrastructure**: k3s/k3d, Helm, Docker, Traefik
- **Registry**: Self-hosted Harbor
- **Secrets**: HashiCorp Vault
- **GitOps**: ArgoCD (staging/production), Makefiles (local)
- **Monitoring**: Grafana + Prometheus + Loki + Tempo, collected by Alloy

## Cloud Native — Stateless by Default

- All services MUST be stateless and horizontally scalable
- No server-side sessions or sticky sessions
- No local file storage for persistent data — use database or object storage
- Externalize config via environment variables or ConfigMaps
- Single-node k3s cluster, single replica per service (~32GB RAM) — be resource-conscious

## Language & Conventions

- All code (variables, methods, classes, constants) MUST be in English — including domain terms
- Keep code simple and readable
- Use meaningful variable and function names
- Prefer YAML/JSON for configuration files — no TOML, INI, or .properties files

## Git Workflow

- Main branch: `develop`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`
- Keep commits focused on a single change
- Under 72 characters, English, lowercase after type prefix

## Communication

- Respond in the same language the user writes in (e.g. Dutch if they write Dutch)
- Be concise — skip unnecessary explanation
- Ask before making large architectural decisions

## Testing — Strict TDD

- Follow TDD: RED (failing test) → GREEN (minimal code to pass) → REFACTOR
- Unit tests first, then integration/E2E tests
- Backend: JUnit 5 + Mockito for unit, @SpringBootTest for integration, `mvn verify`
- Frontend: Angular test framework for unit, Playwright for E2E
- Run all tests before committing

## Code Quality

- No dead code or unused imports
- Follow existing code style and patterns
- Prefer editing existing files over creating new ones
