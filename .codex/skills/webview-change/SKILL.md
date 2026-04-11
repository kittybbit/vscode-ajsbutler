# webview-change

## Purpose

Change webview/UI code without polluting domain/application layers.

## Checklist

- consume DTOs/view models, not parser internals
- keep UI-library-specific types in presentation
- confirm desktop and browser assumptions
- avoid mixing CSV/parse/business logic into component code
