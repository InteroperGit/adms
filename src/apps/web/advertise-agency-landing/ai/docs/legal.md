# Legal Content Structure (T6, March 2026)
`data/legal/` is gitignored; schema example: `data/_schema/legalContent.example.json`

Block types in `LegalContentSchema`: `p` (text), `ul`, `ol`, `dl` ({term,def}[]), `contact` ({label,field}[] — field is key of `legalData.company`)
Text fields support `{company.X}` tokens + inline HTML; rendered via `dangerouslySetInnerHTML` in `LegalBlockRenderer.tsx`

| JSON file | types module | exports |
|---|---|---|
| `data/legal/privacyPolicy.json` | `src/types/legal/index.ts` | `privacyPolicyContent` |
| `data/legal/userAgreement.json` | `src/types/legal/index.ts` | `userAgreementContent` |
| `data/legal/consent.json` | `src/types/legal/index.ts` | `consentContent` |
