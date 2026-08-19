# 44_CONTENT_CALENDAR

**Project:** ShrotiHost
**Status:** Live — updated 2026-08-19

The blog's job is long-term topical authority in five clusters, each feeding a
commercial page. Quality over count, no filler, no invented statistics
(enforced in every post's authoring rules — see `docs/redesign-plan-phase2.md`).

## Published (21 posts)

| Cluster | Posts |
|---|---|
| Hosting | how-to-host-a-website-in-india · what-is-nvme-hosting · speed-up-wordpress-website · how-to-choose-web-hosting · what-is-litespeed-hosting · website-hosting-cost-in-india |
| Domains | choosing-a-domain-name-india · com-vs-in-domain · dns-records-explained · how-to-transfer-a-domain · how-to-point-domain-to-hosting |
| VPS | what-is-a-vps · vps-vs-shared-hosting · when-to-upgrade-to-vps |
| Development | website-development-cost-in-india · custom-website-vs-website-builder · website-development-checklist · mobile-app-vs-web-app · how-to-build-an-mvp |
| Business | shared-vs-reseller-hosting · start-a-hosting-business-in-india |

Every post links to its cluster's service page and at least two sibling posts;
service pages should link back to their cluster's cornerstone post.

## Next batches (priority order)

Prioritized by commercial relevance × search intent × internal-link value.
Write only when they can be done to the same standard.

**Batch 2 — hosting depth:** how to install WordPress (tutorial),
how to improve hosting performance, what is cPanel, email hosting on your
domain, how to migrate hosting without downtime (pairs with free migration).

**Batch 3 — domains depth:** what is DNS (cornerstone above records post),
A record vs CNAME deep-dive, DNS propagation explained, best domain
extension for Indian businesses (expands .com vs .in).

**Batch 4 — VPS (time to launch):** deploy a Node.js app on a VPS, secure a
VPS, Linux VPS starter guide, VPS RAM sizing. Ship alongside or after the VPS
product launch so CTAs convert.

**Batch 5 — development depth:** e-commerce website cost drivers,
WooCommerce vs custom store, web application development guide, how to choose
a web development company, app development process, MVP cost drivers.

**Explicitly not planned:** location doorway pages (until served locations
are confirmed by the owner), mass programmatic pages, competitor-rewrite
articles, any post needing statistics we can't verify.

## Update policy

Prices referenced in posts are the live ones from lib/plans — when pricing
changes, update the affected posts and set their `updated` field (feeds
`dateModified` schema + the visible "Updated" stamp) instead of publishing
duplicates. Review the cost articles quarterly.
