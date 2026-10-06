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

### Priority 1: Services

- Create cards for световые буквы, вывески, неон, объёмные конструкции,
  and монтаж, limited to services the agency actually provides.
- Explain each service briefly and show a relevant image.
- Link each service to its dedicated page as those pages become available.

Purpose: help visitors choose a service and provide clear navigation to
more detailed information.

### Priority 1: Pricing and examples

- Publish real examples with dimensions, materials, and included work.
- Give a price or a useful price range where the agency can verify it.
- Explain which factors affect cost and what requires a custom estimate.
- Place an inquiry button next to the examples.

Purpose: help buyers assess their budget and request a relevant quote.

### Priority 1: Expanded case studies

Upgrade existing projects with:

- The customer's task and installation context.
- Materials and dimensions.
- Production time.
- Photos of the completed installation.
- A verified outcome, without invented business results.
- An inquiry button for a similar project.

Purpose: demonstrate that the agency can handle the visitor's project.

### Priority 2: How ordering works

Explain the sequence:

1. Inquiry.
2. Measurements.
3. Design approval.
4. Production.
5. Installation.

Clarify what the customer supplies and what the agency handles.

Purpose: reduce uncertainty about starting an order.

### Priority 2: Production and guarantees

- Show real workshop and team photos.
- Explain materials and quality checks.
- Publish actual warranty terms and maintenance options.
- Support quality claims with specific evidence.

Purpose: establish trust through concrete information.

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

### Priority 3: Solutions by business type

- Show relevant examples for shops, cafés, salons, and offices.
- Explain suitable options for each business type.
- Support the recommendations with actual projects.

Purpose: help customers recognize a solution for their own business.

## Suggested homepage order

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
