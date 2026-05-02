# Feature Plan: {{Feature Name}}

## Objective

{{Why this slice exists.}}

## Scope

- {{in scope}}

## Out Of Scope

- {{out of scope}}

## Impact Summary

- Change targets: {{files, modules, or boundaries}}
- Affected features: {{features or "none"}}
- Affected tests: {{tests or "none"}}
- Related docs: {{docs or "none"}}
- Breaking-change risk: {{none/low/medium/high and reason}}

## Approval Scope Summary

- Approval status: see TASKS.md `Human Approval`
- Approved scope: {{implementation scope once approved}}
- Scope guard: stop and request additional approval before changing anything
  outside the approved scope

## Milestones

1. {{milestone}}
2. {{milestone}}

## Risks To Control

- {{risk and mitigation}}

## Validation

- code changes: `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, `rtk pnpm run build`
- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  useful
