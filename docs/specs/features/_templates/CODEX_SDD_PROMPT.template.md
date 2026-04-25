# Codex Prompt: Create Repository-Native SDD Documents

You are working in this repository using Specification Driven Development.

Follow the existing repository documentation structure:

- docs/specs/roadmap.md
- docs/requirements/use-cases/\_template.md
- docs/specs/features/\_templates/PLANS.template.md
- docs/specs/features/\_templates/SPECS.template.md
- docs/specs/features/\_templates/TASKS.template.md
- docs/specs/features/\_templates/ADR.template.md
- docs/specs/features/\_templates/TRACEABILITY.template.md

Create repository-native SDD documents for the following feature:

Feature:
{{Feature Name}}

Goal:
{{Feature goal}}

Instructions:

1. Inspect existing documentation style before writing.
2. Use the existing use-case template for requirements.
3. Create feature documents under:
   docs/specs/features/{{feature-slug}}/
4. Generate:
   - PLANS.md
   - SPECS.md
   - TASKS.md
   - ADR.md if an architectural decision is needed
   - TRACEABILITY.md if requirements mapping is useful
5. Keep documents concise, repository-specific, and implementation-ready.
6. Align with DDD and Clean Architecture.
7. Preserve VS Code 1.75 compatibility when relevant.
8. Prefer evolutionary design over rewrite-oriented plans.

Output:

- List created files.
- Summarize key decisions.
- Identify open questions.
