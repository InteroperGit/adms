# Sales and SEO improvement plan

Date: 2026-10-06
Business: Рекламастер, Череповец

## Objective

Help visitors understand the agency's services, assess their budget, trust
its work, and submit an inquiry. Build useful service pages that can attract
relevant organic traffic and contribute to qualified leads and sales.

## Current site

The homepage already includes offers, About, projects, reviews, contacts,
and an inquiry form. Individual project pages also exist.

The highest priorities are clear services, pricing guidance, and evidence
of completed work.

Before directing more traffic to the site:

- Replace test offer copy and library photos with real agency content.
- Connect and verify inquiry delivery. Submission is currently disabled
  in `data/content/order-inquiry.json`.
- Confirm claims, prices, turnaround times, and warranty terms before
  publishing them.

## Proposed homepage sections

### Priority 1: Clear introductory section

- Add a visible heading such as:
  “Изготовление вывесок и наружной рекламы в Череповце”.
- Use a real completed-project photo.
- Summarize the main services and the area served.
- Add a primary “Рассчитать стоимость” button linked to the inquiry form.

Purpose: immediately explain what the agency sells and where it works.

Execution tasks (in order):

- [024: Prepare introduction content and photo][intro-content] — content
  contract implemented and archived at user request; copy/photo inputs open.
- [025: Implement the introductory section][intro-section] — layout
  implemented and archived at user request; copy/photo and final review open.
- [026: Verify the introductory section][intro-verification] — responsive,
  keyboard, and no-JavaScript checks performed; archived at user request.
  Acceptance remains pending approved
  copy, a real project photo, and successful remote image loading.

### Priority 1: Services

- Create cards for световые буквы, вывески, неон, объёмные конструкции,
  and монтаж, limited to services the agency actually provides.
- Explain each service briefly and show a relevant image.
- Link each service to its dedicated page as those pages become available.

Purpose: help visitors choose a service and provide clear navigation to
more detailed information.

Execution tasks (in order):

- [027: Prepare services content and images][services-content] — content
  layer implemented; archived at user request 2026-10-07. Agency inputs open.
- [028: Implement the homepage services section][services-section] — layout
  implemented after About; archived at user request 2026-10-07. Agency
  production acceptance remains open; task 028a enabled the requested demo.
- [028a: Enable Services with test images and articles][services-demo] —
  completed 2026-10-07; five visible demo cards and five test article pages.
- [029: Verify the homepage services section][services-verification] — technical
  checks performed; archived at user request 2026-10-07. Final agency content
  and photo acceptance remain open.

These tasks cover the homepage catalog and service links. Task 028a adds
explicit demonstration content and test article pages at the user's request.
Production service content and SEO acceptance remain in Phase 3. Confirmed
service claims and approved relevant photos remain required for production
acceptance; the demo does not establish agency approval.

### Priority 1: Pricing and examples

- Publish real examples with dimensions, materials, and included work.
- Give a price or a useful price range where the agency can verify it.
- Explain which factors affect cost and what requires a custom estimate.
- Place an inquiry button next to the examples.

Purpose: help buyers assess their budget and request a relevant quote.

Execution tasks (in order):

- [032: Prepare demo pricing content and photos][pricing-content] — completed
  2026-10-07; three fictional examples and reused local test illustrations.
- [033: Implement the homepage pricing examples section][pricing-section] —
  completed 2026-10-07; enabled demo after Projects with inquiry links.
- [034: Verify the homepage pricing examples][pricing-verification] — completed
  2026-10-07; demo content, contrast, responsive links and regressions pass.

Current delivery uses fictional examples and test photos with visible demo
notices and fictional-price labels. Missing real material does not block demo
acceptance. Agency-verified prices, specifications, copy, and real photos
remain required for later production acceptance. Inquiry delivery remains a
separate dependency; these tasks verify access to the existing form.

### Priority 1: Expanded case studies

Upgrade existing projects with:

- The customer's task and installation context.
- Materials and dimensions.
- Production time.
- Photos of the completed installation.
- A verified outcome, without invented business results.
- An inquiry button for a similar project.

Purpose: demonstrate that the agency can handle the visitor's project.

Execution tasks (in order):

- [035: Prepare case study content and evidence][case-study-content] — technical
  layer verified; archived at user request 2026-10-07. Agency inputs pending.
- [036: Implement expanded case study pages][case-study-pages] — implemented
  and checked; archived at user request 2026-10-07. Agency acceptance pending.
- [036a: Add Manufacturing and Installation][case-study-process] — completed
  2026-10-07; optional text/image sections and full development preview content.
- [036b: Implement service-specific order forms][service-order-forms] —
  LedLettersForm implemented; archived at user request 2026-10-07.
  Live delivery configuration pending.
- [037: Verify expanded case studies][case-study-verification] — completed
  technical verification 2026-10-07; production evidence/delivery remain open.

Existing project URLs show proposed solutions with planned details, process
and result diagrams, and the restored remote preview images. Unsupported
growth/client claims remain absent. Only the lettering case shows its matching
form. Local layouts/controls pass verification; restored Picsum images failed
to decode in the verification environment. Genuine cases require approved
details, outcomes, attribution, and photographs with rights. These inputs and
inquiry delivery remain separate production dependencies.

### Priority 2: How ordering works

Explain the sequence:

1. Inquiry.
2. Measurements.
3. Design approval.
4. Production.
5. Installation.

Clarify what the customer supplies and what the agency handles.

Purpose: reduce uncertainty about starting an order.

Execution tasks (in order):

- [038: Prepare ordering process content][ordering-content] — content and
  agency-input preparation.
- [039: Implement the ordering process section][ordering-section] — homepage
  implementation after pricing examples.
- [040: Verify the ordering process section][ordering-verification] — technical
  verification completed 2026-10-09; agency copy and inquiry delivery remain
  production dependencies.

### Priority 2: Production and guarantees

- Show real workshop and team photos.
- Explain materials and quality checks.
- Publish actual warranty terms and maintenance options.
- Support quality claims with specific evidence.

Purpose: establish trust through concrete information.

Execution tasks (in order):

- [041: Prepare production and guarantees content][production-content] —
  implemented; archived at user request 2026-10-09. Detailed agency evidence
  and real workshop/team photos remain pending.
- [042: Implement the production and guarantees section][production-section] —
  implemented after OrderingProcess and before Reviews, with hover/focus
  feedback; archived at user request 2026-10-09.
- [042a: Upgrade the customer guarantees presentation][guarantees-presentation] —
  six brief customer cards implemented; archived at user request 2026-10-09.
  Detailed coverage, conditions, claims, and maintenance remain pending.
- [043: Verify production and guarantees][production-verification] — content,
  media, responsive, accessibility, and regression checks. Technical review
  completed 2026-10-09: 75 browser and 24 schema/content/build assertions.
  Six brief cards verified; detailed agency terms and photo rights stay open.

Production acceptance requires agency-confirmed claims, actual warranty and
maintenance terms, and approved real photos with publication rights. Draft
preparation and technical verification do not establish those approvals.
Inquiry delivery remains a separate production dependency.

### Priority 2: FAQ

Answer common questions about:

- Cost and what affects it.
- Production and installation turnaround.
- Design and file requirements.
- Installation arrangements.
- Repairs and maintenance.
- Who handles approvals, where applicable.

Purpose: answer objections before visitors contact the agency. Build this
for customers; do not assume it will generate Google FAQ rich results.

Execution tasks (in order):

- [044: Prepare FAQ content][faq-content] — implemented 2026-10-09 with nine
  reusable draft answers, strict validation and publication approval gates.
  Agency approval remains pending; no answers are currently publishable.
- [045: Implement the FAQ section][faq-section] — implemented 2026-10-09
  after Reviews and before Contacts/inquiry with native disclosures and
  approval gating. User-requested demo shows nine preliminary answers;
  disabling demo omits all current drafts. Agency approval remains pending.
- [046: Verify the FAQ section][faq-verification] — completed 2026-10-09:
  119 browser assertions, 16 layout/theme/text cases, no-JavaScript and
  content/publication checks pass. Named FAQ landmark added. Existing
  neighboring CTA overflow at 320px/200% remains; delivery unverified.

### Priority 3: Solutions by business type

- Show relevant examples for shops, cafés, salons, and offices.
- Explain suitable options for each business type.
- Support the recommendations with actual projects.

Purpose: help customers recognize a solution for their own business.

## Suggested homepage order

Current user adjustment: keep the offers carousel first, followed by
Introduction. Alternate section backgrounds by rendered odd/even order.

1. Introduction.
2. Services.
3. Selected projects.
4. Pricing examples.
5. Ordering process.
6. Production and guarantees.
7. Reviews.
8. FAQ.
9. Inquiry form.
10. Contacts.

Keep promotional offers as a secondary section when there is a real offer
to promote.

## Dedicated service pages for SEO

Start with the three most commercially important services. Candidate
routes are:

- `/services/svetovye-bukvy/`
- `/services/vyveski/`
- `/services/neon/`

Validate search demand and business priorities before finalizing keywords
and the publication order.

Each service page should include:

- A specific service explanation.
- Available options and materials.
- Pricing factors and verified examples.
- Relevant completed projects.
- Service-specific FAQ.
- A clear inquiry button.

Write useful, distinct content for each service and link between relevant
services and projects. Follow Google's guidance on helpful content and
descriptive internal links:

- [Google SEO Starter Guide][seo-guide]
- [Google FAQ rich result guidance][faq-guidance]

## Technical SEO and implementation tasks

- Confirm and configure the production domain in Astro. Canonical URLs
  currently depend on the missing `site` configuration.
- Add a sitemap.
- Verify indexing through Google Search Console and Yandex Webmaster.
- Give each service page a specific title, description, and visible H1.
- Keep business details consistent across the website and business listings.
- Build new sections as mostly static Astro components to preserve speed.
- Follow the existing content structure, validation patterns, and applicable
  project rules when implementing the plan.

## Delivery sequence

### Phase 1: Conversion foundations

- Fix inquiry delivery and verify successful receipt.
- Replace test offers with real agency content.
- Publish the introduction and services sections.
- Expand selected projects with verified details and real photos.

### Phase 2: Buyer questions and trust

- Add pricing examples.
- Add the ordering process.
- Add production and guarantee information.
- Add FAQ.

### Phase 3: Organic acquisition

- Publish the prioritized dedicated service pages.
- Complete production-domain and indexing setup.
- Link service pages to relevant projects and homepage sections.
- Expand the pages with useful case studies over time.
- Add business-type solutions when enough relevant evidence is available.

## Measurement

Measure successful inquiries, qualified leads, and resulting sales, rather
than relying only on visits.

- Track successful form submissions after delivery is verified.
- Track phone clicks separately from completed inquiries.
- Record which inquiries become qualified leads and sales.
- Compare organic performance by service page.
- Use the results to prioritize further content and conversion improvements.

[seo-guide]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
[faq-guidance]: https://developers.google.com/search/blog/2023/08/howto-faq-changes
[intro-content]: ../fixed/20261006/024-introduction-content-and-photo.md
[intro-section]: ../fixed/20261006/025-introduction-section.md
[intro-verification]: ../fixed/20261006/026-introduction-verification.md
[services-content]: ../fixed/20261007/027-services-content-and-images.md
[services-section]: ../fixed/20261007/028-services-section.md
[services-demo]: ../fixed/20261007/028a-services-demo-content-and-pages.md
[services-verification]: ../fixed/20261007/029-services-verification.md
[pricing-content]: ../fixed/20261007/032-pricing-content-and-examples.md
[pricing-section]: ../fixed/20261007/033-pricing-examples-section.md
[pricing-verification]: ../fixed/20261007/034-pricing-examples-verification.md
[case-study-content]: ../fixed/20261007/035-case-study-content-and-evidence.md
[case-study-pages]: ../fixed/20261007/036-expanded-case-study-pages.md
[case-study-process]: ../fixed/20261007/036a-case-study-manufacturing-and-installation.md
[service-order-forms]: ../fixed/20261007/036b-service-specific-order-forms.md
[case-study-verification]: ../fixed/20261007/037-case-study-verification.md
[ordering-content]: ../fixed/20261009/038-ordering-process-content.md
[ordering-section]: ../fixed/20261009/039-ordering-process-section.md
[ordering-verification]: ../fixed/20261009/040-ordering-process-verification.md
[production-content]: ../fixed/20261009/041-production-and-guarantees-content.md
[production-section]: ../fixed/20261009/042-production-and-guarantees-section.md
[guarantees-presentation]: ../fixed/20261009/042a-customer-guarantees-presentation.md
[production-verification]: ../fixed/20261009/043-production-and-guarantees-verification.md
[faq-content]: ../fixed/20261009/044-faq-content.md
[faq-section]: ../fixed/20261009/045-faq-section.md
[faq-verification]: ../fixed/20261009/046-faq-verification.md
