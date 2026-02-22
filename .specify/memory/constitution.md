# Kayndful Constitution

## Core Principles

### Product & Trust DNA

- Kayndful MUST prioritize emotional safety, clarity, and user respect over delivery speed optimizations.
- All product interaction copy MUST use a human, calm, non-judgmental, and unambiguous tone.
- Personal data MUST be minimized by default: no exact address, no direct contact details (phone, email, URL) in community content.
- Community trust MUST be protected through moderation, reporting, and abuse guardrails.
- Assumption: a reporting UI component exists on mobile; persistent backend moderation is Required going forward.
- Any UX or technical decision that increases harassment risk, PII leakage risk, or user confusion is FORBIDDEN.

### UI Consistency System

- Mobile screens MUST reuse central theme tokens `colors`, `spacing`, and `radius`; hardcoded values are forbidden unless documented.
- The icon system MUST use `Ionicons` consistently (same action = same icon, same size by context).
- Shared components (`Button`, `BackButton`, `FormInput`, `StateCards`, `RequestCard`) MUST be preferred over ad hoc implementations.
- Typography hierarchy MUST remain stable: screen titles use strong weight and high contrast.
- Typography hierarchy MUST remain stable: secondary text uses `colors.brand.muted`.
- Typography hierarchy MUST remain stable: errors use `colors.semantic.danger`.
- Shapes and elevation MUST follow the current style: rounded surfaces, soft shadows, explicit CTAs.
- Navigation MUST remain predictable: explicit Expo Router routes.
- Navigation MUST remain predictable: visible back action on detail screens.
- Navigation MUST remain predictable: no dead-end transitions.
- Assumption: `(tabs)` exists but is partially empty; structural completion is Required going forward.
- Every data screen MUST implement 4 states: loading, empty, error, offline, with retry action.
- User feedback MUST be immediate: success via toast/confirmation.
- User feedback MUST be immediate: failure with actionable message.
- User feedback MUST be immediate: explicit confirmation before irreversible actions.

### Contract-First & Validation-First

- All backend capabilities MUST be exposed through a clear contract: Controller -> input DTO -> Service -> output DTO.
- TypeORM entities MUST NEVER be returned raw when DTO mappers exist; mapper usage is mandatory.
- All API input MUST be validated through DTOs (`class-validator`) before business logic.
- Assumption: global `ValidationPipe` is not explicitly configured; strict activation is Required going forward.
- Business errors MUST use explicit Nest exceptions (`BadRequestException`, `UnauthorizedException`, `NotFoundException`, `ConflictException`) and deterministic messages.
- Protected endpoints MUST use JWT guards (`JwtAuthGuard`) without implicit local exceptions.
- API contract compatibility MUST be preserved; any breaking change requires versioning and a migration plan.
- Required going forward: explicit API versioning (e.g., `/v1`).

### Observability & Debuggability

- Every backend error MUST be traceable with minimum context: module, operation, functional identifier, error type.
- Logs MUST be structured and MUST NOT leak secrets, tokens, passwords, or PII.
- Assumption: structured logging conventions are not yet implemented; Required going forward.
- Critical flows (auth, request creation, point transaction, messaging) MUST be instrumented with success/failure and latency metrics.
- Required going forward.
- All exposed routes MUST remain documented through Swagger/OpenAPI and synchronized with effective DTOs.
- Degraded/offline modes MUST be explicitly detectable (stable error code pattern), on mobile and API sides.

### Quality Gates & Maintainability

- No contribution is mergeable without quality gates: lint, format, and green CI.
- Code MUST respect separation of concerns: mobile = screen orchestration vs UI components vs store/services.
- Code MUST respect separation of concerns: backend = thin controller, business service, TypeORM repository.
- Naming conventions MUST remain uniform: TS/TSX files in `kebab-case` or existing local convention.
- Naming conventions MUST remain uniform: Nest classes in `PascalCase`.
- Naming conventions MUST remain uniform: DTOs suffixed with `Dto`.
- Naming conventions MUST remain uniform: stores named `useXStore`.
- Temporary TODOs MUST include context and a removal plan; permanent placeholders are forbidden.
- Schema/contract changes MUST include tests and migration strategy.
- Assumption: versioned SQL migrations are not yet systematic; Required going forward.
- User backward compatibility is mandatory: no change may break onboarding, requests, messaging, or auth without an explicit plan.

## Constraints & Standards

- Non-negotiable stack: Mobile = React Native + Expo + Expo Router + TypeScript + Zustand.
- Non-negotiable stack: Backend = NestJS + TypeORM + PostgreSQL + JWT + Swagger.
- Performance and resilience: mobile MUST remain usable in degraded network conditions with explicit offline states.
- Performance and resilience: large lists MUST use pagination/incremental loading.
- Performance and resilience: every network action MUST expose loading feedback and retry.
- Security and privacy: secrets only via environment variables; no hardcoded secrets in production.
- Security and privacy: logging passwords, tokens, or PII is forbidden.
- Security and privacy: PII minimization is mandatory (approximate area only, no public exact address).
- Security and privacy: anti-abuse content validation is mandatory for requests.
- Security and privacy: rate limiting on sensitive endpoints (auth, content creation, reporting) is Required going forward.
- Security and privacy: persistent moderation/reporting pipeline is Required going forward.
- Mobile permissions: any sensor permission (location, media) MUST be justified in-app, requested as late as possible, and degraded gracefully on denial.
- Assumption: location/media usage is still partially placeholder-based.
- Mobile accessibility baseline: interactive controls with explicit `accessibilityRole` and labels.
- Mobile accessibility baseline: sufficient text/action contrast.
- Mobile accessibility baseline: consistent touch targets (minimum target 44x44).
- Mobile accessibility baseline: form/error states clearly communicated.

## Development Workflow

- Spec-driven workflow is mandatory for any non-trivial feature: `spec.md` (WHAT/WHY, scenarios, requirements, success criteria).
- Spec-driven workflow is mandatory for any non-trivial feature: `plan.md` (architecture, decisions, impacts).
- Spec-driven workflow is mandatory for any non-trivial feature: `tasks.md` (execution by testable increments).
- Spec-driven workflow is mandatory for any non-trivial feature: implementation.
- No implementation may start without a validated spec and alignment with this constitution.
- Minimum Definition of Done (DoD): spec requirements covered.
- Minimum Definition of Done (DoD): UX consistent with mobile system rules.
- Minimum Definition of Done (DoD): validation and errors handled.
- Minimum Definition of Done (DoD): tests added or updated for critical behavior.
- Minimum Definition of Done (DoD): lint/format/CI passing.
- Minimum Definition of Done (DoD): impacted documentation updated (API, spec artifacts).
- Mandatory PR checklist: cross-screen UI coherence (icons, spacing, typography hierarchy, states, navigation).
- Mandatory PR checklist: API/DTO contract compliance.
- Mandatory PR checklist: security (PII, secrets, auth guards).
- Mandatory PR checklist: backward compatibility.
- Mandatory PR checklist: minimum observability.
- Release/migration rule: any incompatible API/schema change requires migration plan + communication + versioning.
- Release/migration rule: `synchronize: true` MUST NOT be used outside local dev environments.
- Assumption: current configuration still enables `synchronize: true`.

## Governance

- This constitution overrides any local guide, prompt, or team habit.
- Any amendment proposal MUST include concrete problem statement.
- Any amendment proposal MUST include rationale.
- Any amendment proposal MUST include technical/product impact.
- Any amendment proposal MUST include migration plan.
- Any amendment proposal MUST include effective date.
- Amendment ratification requires explicit approval from both mobile and backend maintainers.
- Mandatory enforcement: constitution checklist in PR template.
- Mandatory enforcement: automated CI verification.
- Mandatory enforcement: reviewers are responsible for blocking deviations.
- In case of conflict between delivery speed and constitution, the constitution wins by default.

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
