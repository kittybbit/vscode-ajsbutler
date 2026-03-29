# Architecture

## Target layering

- Domain
- Application
- Infrastructure
- Presentation

## Dependency direction

Domain <- Application <- Infrastructure / Presentation

## Transitional note

The repository currently contains mixed responsibilities.
Migration should be incremental and use-case driven.

## Initial extraction priority

1. ParseAjsDefinition
2. BuildUnitList
3. ExportUnitListCsv
4. BuildFlowGraph
5. ShowUnitDefinition
