# Traceability: Standardize Serialization And Composition Root

| Boundary        | Req                 | Spec   | Plan | Test        |
| --------------- | ------------------- | ------ | ---- | ----------- |
| Host to webview | Plain DTO/JSON      | Req    | TBD  | Round-trip  |
| Webview to host | Valid event DTO     | Req    | TBD  | Bridge      |
| Desktop compose | Bootstrap/lifecycle | Req    | TBD  | Activation  |
| Web compose     | Browser-safe choice | Compat | TBD  | Web/build   |
| All payloads    | No object leaks     | Accept | TBD  | Ref/runtime |
