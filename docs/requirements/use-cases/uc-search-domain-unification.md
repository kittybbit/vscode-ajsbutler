# UC: Search Domain Unification

## Goal

Define the future behavior contract for a shared search capability only if list
and flow viewers need the same query semantics outside their current
presentation-local implementations.

## Trigger

A future slice identifies at least two non-table consumers that need equivalent
matching, result navigation, or query validation.

## Inputs

- Loaded JP1/AJS definition represented by normalized units.
- User query text and optional query mode.
- Searchable unit fields such as name, comment, absolute path, parameter key,
  and parameter value.

## Outputs

- Stable match results independent of a specific UI framework.
- Optional reveal or focus hints that presentation layers can apply.
- Validation result for unsupported query modes or invalid regular
  expressions.

## Rules

- Do not introduce a shared application search use case while only the table
  presentation needs richer matching.
- Keep rendering concerns, table row access, React Flow camera behavior, and
  TanStack fuzzy ranking out of the shared contract.
- Equivalent queries should produce equivalent matches across consumers once a
  shared use case exists.
- Invalid queries must fail safely without changing the loaded document state.

## Acceptance Notes

- The first implementation decision must name the consumers that justify
  shared search.
- Existing list partial-match behavior and current-scope flow search must not
  regress.
- Desktop and web extension compatibility remain explicit.

## Risks Or Edge Cases

- Prematurely moving presentation-specific matching into application code would
  make the domain boundary less clear.
- Large definitions may require explicit performance limits before richer
  query modes are added.
