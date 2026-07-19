# Domain Rules

This directory stores shared JP1/AJS domain contracts that multiple
application use cases may consume.

Domain rules describe stable product meaning rather than a user-triggered
workflow. They remain independent of parser trees, VS Code APIs, UI framework
types, implementation file paths, and migration sequencing.

Current domain rules:

- [Normalize AJS Document](./normalize-ajs-document.md)
- [Interpret JP1 Parameters](./interpret-jp1-parameters.md)
- [Generate AJS Commands](./generate-ajs-commands.md)

User/application workflows belong under `docs/requirements/use-cases/`.
Feature-local implementation decisions belong under `docs/specs/features/`.
