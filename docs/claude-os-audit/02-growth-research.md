# Claude OS audit — Growth & Research (2026-08-23)

Skills: growth/growth-analysis, research/competitor-analysis, research/research-intelligence (lead-research read, not applicable). Live fetches of Hostinger, BigRock, HostGator.in; MilesWeb from knowledge (blocked by bot challenge).

## Scorecard (1–5)
UX 3 · Visual hierarchy 4 · Pricing clarity 4 · Trust 2 · Speed signals 3 · Content/SEO 4 · Support paths 2 · Mobile 3 · Accessibility 4.

## Funnel (reconstructed)
Entry (organic/direct/WhatsApp, unmeasured — **no analytics on the site**; portal has GA4 `G-TGFE8BKY0X`) → Home hero "Build. Deploy. Scale." (no price/product; demo ends at a login page) → /hosting cards (₹39, renewal-same, "Save 56%") → WHMCS portal (domain boundary, no linker/UTM; 4–5 steps, 1–2 s each, Lagom theme). Secondary: domains search (clean), Build enquiry → CSV with no notification.

## Competitor matrix (shared hosting, 2026-08-23)
| Dimension | ShrotiHost | Hostinger | BigRock | HostGator.in | MilesWeb[K] |
|---|---|---|---|---|---|
| UX/path | 3 | 5 | 4 | 3 | 4 |
| Pricing clarity | 4 | 3 (48-mo headline) | 3 | 2 | 3 |
| Trust | 2 (4.1/5, 12 reviews; no entity) | 5 (4.7/71k) | 4 | 4 | 4 |
| Speed signals | 3 | 4 | 3 | 3 | 3 |
| Content/SEO | 4 | 5 | 4 | 3 | 4 |
| Support paths | 2 (WhatsApp+ticket) | 4 | 5 | 5 | 5 |
| Guarantee | 7-day MBG | 30-day | 30-day | 30-day | 30-day |
| Free domain | No | Yes | Yes | Yes | Yes |

Wedge: "same renewal price, monthly, no lock-in" is real and defensible — not the hero message today. Table stakes to match: 30-day guarantee (or visible reason), uptime on card, phone/chat, free domain on annual, company identity.

## Findings (prioritized)
1. HIGH — No analytics on site; attribution dies at the portal boundary. Fix: GA4 `G-TGFE8BKY0X` via next/script in layout with cross-domain linker (shrotihost.in, portal.shrotihost.in); `select_plan` event on "Choose" click (line, plan, cycle); UTM params on `productUrl`.
2. HIGH — Status page renders fabricated uptime bars (`status-board.tsx` hard-coded `uptimeBars`). Fix: remove the chart; "Live uptime history coming soon" or real monitor feed.
3. HIGH — Trustpilot thin (4.1/5, 12 reviews, an unaddressed allegation) while site says "Real, verified reviews". Fix: print real aggregate next to the link; retitle "What customers say"; replace weakest quotes with a portfolio case note; reply publicly offsite.
4. HIGH — No company identity (legal name, address, GSTIN, phone) anywhere; Organization schema lacks address/telephone/sameAs. Fix: footer identity line (business supplies real values) + schema fields. **[needs owner data]**
5. HIGH — Home hero doesn't sell hosting; demo dead-ends at login; "AI-Powered Infra" badge unsubstantiated. Fix: primary CTA "See plans — from ₹39/mo" (→ /hosting#compare); celebration CTA → /hosting#compare "Get this setup from ₹39/mo"; badge → "Daily Backups"; "Interactive demo" label on the launch card.
6. HIGH — Hand-off friction (brand break to Lagom, 4–5 portal steps, slow portal). Site-side: add "Next: pick a domain and billing cycle on our secure portal" under plan CTAs. Portal-side: finish/activate ShrotiHost theme; restate chosen plan on the domain step.
7. MEDIUM — Two overlapping discounts with no end date (permanent strike-through + "40% OFF" code). Fix: promo copy "40% off the listed ₹39/mo price on your first month" and set expiresAt, or deactivate until a real date exists.
8. MEDIUM — Cycle toggle offers no prepay incentive; "Save 56%" identical on all cycles. Fix: badge copy "56% off regular price"; product decision on annual discount/free domain.
9. MEDIUM — 7-day MBG and 99.9% uptime less visible/weaker than competitors. Fix: add "99.9% uptime target" to assurance strip; business decision on 30-day MBG.
10. MEDIUM — First-visit overlay stack on mobile (announcement + 2.5s modal + sticky CTA + FAB). Fix: welcome-offer delay ≥20 s and skip when `has-mobile-cta` body class present (or trigger at 50% scroll).
11. MEDIUM — Three of seven Hosting nav items are "coming soon". Fix: move them out of primary nav (keep footer).
12. MEDIUM — Pre-sales routes to ticket form; no phone; "24/7" unverifiable. Fix: sales path → WhatsApp prefilled; soften plan copy to "Priority support (WhatsApp + tickets)" unless 24/7 is real.
13. MEDIUM — Build/careers leads land in CSV with no notification. Fix: optional webhook (`ENQUIRY_WEBHOOK_URL`) after CSV write (email/WhatsApp relay); success copy "We reply within one business day".
14. MEDIUM — Money-page titles lack modifiers. Fix: e.g. "Shared Hosting in India from ₹39/mo — NVMe + LiteSpeed"; same pattern for WordPress/Unlimited/Reseller; default title add "India".
15. MEDIUM — JS weight on money path (home 274 KB br); `HostingScene` bundled on mobile though hidden. Fix: `next/dynamic({ssr:false})` gated on `(min-width:1024px)` for scenes.
16. MEDIUM — Portal checkout shows "Tax @ 15.00%" (GST on hosting is 18%). **[WHMCS ops task]**; make "excl. taxes" say "excl. 18% GST" once confirmed.
17. MEDIUM — No free domain on any cycle (all competitors bundle one). **[product decision]**
18. LOW — Comparison table generalisations ("SSH: Not on shared plans") are untrue for majors. Fix: "Varies by host" + dated footnote.
19. LOW — Hero demo fakes "Domain available"/"Launched". Fix: "Interactive demo" label.
20. LOW — Currency switcher fixed rates undisclosed. Fix: caption "Approx. conversion; billed in INR".
21. LOW — "Free WHMCS Billing Software" needs qualifier (which licence). **[owner to confirm]**
22. LOW — Home `keywords` meta is dead weight; Organization lacks sameAs. Fix: drop keywords; add sameAs (Trustpilot).

First three to ship: analytics + linker + select_plan; remove fabricated uptime; hero CTA leading with "from ₹39/mo, same price on renewal".
