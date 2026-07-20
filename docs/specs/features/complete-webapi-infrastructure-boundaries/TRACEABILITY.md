# Traceability: Complete WebAPI Infrastructure Boundaries

| Concern            | Owner    | SPECS         | Slice | Validation    |
| ------------------ | -------- | ------------- | ----- | ------------- |
| Endpoint/manual    | Existing | Origin        | N/A   | OpenAPI/mock  |
| Beta evidence      | Existing | Non-Goals     | N/A   | Smoke record  |
| Port/DTO/errors    | This     | Requirements  | TBD   | App/contract  |
| Transport/auth/map | This     | Requirements  | TBD   | Adapter tests |
| Host selection     | This     | Requirements  | TBD   | Host tests    |
| Privacy            | Both     | Compatibility | TBD   | Privacy tests |

`Existing` means `import-definition-via-webapi`; `This` means the current
architecture feature. The features share privacy validation but do not share
endpoint, beta-exit, or implementation ownership.
