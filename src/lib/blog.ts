/**
 * Blog content as structured data — no CMS, no markdown pipeline, fully
 * static-prerendered. Paragraph strings support one inline syntax:
 * [text](href) renders as a link (internal or external), so posts can
 * interlink product pages for SEO without a markdown dependency.
 */

import { libraryPosts } from "@/lib/blog-posts";

export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
};

export type BlogCategory =
  | "Guides"
  | "WordPress"
  | "Business"
  | "Performance"
  | "Domains"
  | "VPS"
  | "Development";

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description — keep ~150 chars. */
  description: string;
  /** ISO date, also shown on the card. */
  date: string;
  /** ISO date of the last substantive update; shown + fed to dateModified. */
  updated?: string;
  readMinutes: number;
  category: BlogCategory;
  /** Lowercase, hyphenated topic tags — power /blog/tag/[tag] archives. */
  tags?: string[];
  sections: PostSection[];
  faq?: { q: string; a: string }[];
  cta: { label: string; href: string; blurb: string };
  related: string[];
};

const basePosts: BlogPost[] = [
  {
    slug: "how-to-host-a-website-in-india",
    title: "How to Host a Website in India: The Complete 2026 Guide",
    description:
      "Everything you need to host a website in India — choosing hosting, registering a domain, pointing DNS, installing SSL, and going live in under an hour.",
    date: "2026-08-10",
    readMinutes: 9,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Getting a website online has three real ingredients: a domain name (your address), hosting (the server your site lives on), and DNS (the wiring that connects the two). Everything else — SSL, email, backups — hangs off those three. This guide walks the whole path, in order, the way we'd set it up ourselves.",
        ],
      },
      {
        heading: "Step 1: Register a domain name",
        paragraphs: [
          "Your domain is your identity, so pick it before anything else. For an Indian audience, a [.in domain](/domains) signals local presence and usually costs less than .com; if you serve a global audience, .com is still the default people type on autopilot.",
          "Keep it short, avoid hyphens and numbers, and check that the name doesn't collide with an existing brand. Register for at least a year — search engines don't care about registration length, but you don't want a renewal surprise mid-launch.",
        ],
      },
      {
        heading: "Step 2: Choose the right hosting type",
        paragraphs: [
          "Most first websites belong on [shared hosting](/hosting) — you rent a slice of a professionally managed server, and the host handles security patches, the web server, and the control panel. It's the best value until your traffic genuinely outgrows it.",
          "If you're running specifically WordPress, [WordPress hosting](/wordpress-hosting) adds one-click installs, LiteSpeed caching, and automatic updates. Agencies managing many client sites should look at [unlimited hosting](/unlimited-hosting) so adding a site never adds a bill, and anyone planning to sell hosting under their own brand wants [reseller hosting](/reseller-hosting).",
        ],
        list: [
          "Portfolio, blog, or small business site → Shared hosting",
          "WordPress or WooCommerce store → WordPress hosting",
          "Agency with many client sites → Unlimited hosting",
          "Selling hosting to your own customers → Reseller hosting",
        ],
      },
      {
        heading: "Step 3: Look for the specs that actually matter",
        paragraphs: [
          "Hosting spec sheets are noisy. Only a few lines change your day-to-day experience: NVMe storage (several times faster than SATA SSDs for database-heavy sites like WordPress), LiteSpeed or nginx rather than bare Apache, free SSL on every plan, daily backups included rather than sold as an add-on, and a renewal price that matches the signup price.",
          "That last one deserves emphasis: the classic hosting trap is a ₹49 first year that renews at ₹299. Read the renewal price before you buy — we publish ours on every plan card because the industry mostly doesn't.",
        ],
      },
      {
        heading: "Step 4: Connect your domain (DNS)",
        paragraphs: [
          "After buying hosting you'll receive nameservers (they look like ns1.yourhost.com). In your domain dashboard, replace the default nameservers with your host's pair and give it up to a few hours to propagate — though it's usually minutes these days.",
          "If you keep DNS at a third party like Cloudflare, point an A record at your server's IP instead, and you get a global CDN and DDoS protection in the same move.",
        ],
      },
      {
        heading: "Step 5: Install SSL and go live",
        paragraphs: [
          "SSL (the padlock) is non-negotiable — browsers mark plain HTTP sites as \"Not secure\" and Google uses HTTPS as a ranking signal. Good hosts issue a free Let's Encrypt certificate automatically the moment your domain points at them; you should never pay for basic SSL in 2026.",
          "From there: install WordPress (or upload your site) from the control panel, set up a professional mailbox on your domain, and turn on daily backups if they aren't already running. Total time from nothing to live, on a prepared host: well under an hour.",
        ],
      },
    ],
    faq: [
      {
        q: "How much does it cost to host a website in India?",
        a: "Entry shared hosting starts around ₹39–₹99/month for a single site with NVMe storage and free SSL. A .in domain adds roughly ₹500–₹700/year. Expect ₹1,000–₹2,000 for your first full year online.",
      },
      {
        q: "Do I need technical skills to host a website?",
        a: "Not with managed shared hosting — the host maintains the server, and tools like cPanel and Softaculous give you one-click WordPress installs. If you can use a web dashboard, you can launch a site.",
      },
      {
        q: "Is Indian hosting slower than international hosting?",
        a: "For an Indian audience it's the opposite — serving from or near India cuts latency dramatically compared to US-only servers, and a CDN like Cloudflare closes the gap for overseas visitors.",
      },
    ],
    cta: {
      label: "Launch your website today",
      href: "/hosting",
      blurb: "NVMe storage, free SSL, daily backups, and the same renewal price every cycle — from ₹39/mo.",
    },
    related: ["what-is-nvme-hosting", "shared-vs-reseller-hosting", "choosing-a-domain-name-india"],
  },
  {
    slug: "what-is-nvme-hosting",
    title: "What Is NVMe Hosting and Why It Makes Your Site Faster",
    description:
      "NVMe vs SATA SSD vs HDD explained honestly — what the numbers really mean, how NVMe pairs with LiteSpeed, and where hosting speed touches SEO and sales.",
    date: "2026-08-03",
    readMinutes: 7,
    category: "Performance",
    sections: [
      {
        paragraphs: [
          "Every hosting company now stamps \"NVMe\" on its plan cards, usually next to a lightning bolt. It has become the kind of spec people repeat without knowing what it changes. Here's the honest version: NVMe is a real, measurable upgrade over older storage — and for a database-driven site like WordPress it matters more than almost any other line on the spec sheet — but it's one ingredient, not a magic switch.",
        ],
      },
      {
        heading: "HDD, SATA SSD, NVMe: what actually changed",
        paragraphs: [
          "A traditional hard drive (HDD) is a spinning platter with a physical read head. Sequential reads manage roughly 100–200 MB/s, but the real killer is seek time: every random read waits milliseconds for the head to physically move. Databases do almost nothing but random reads.",
          "SATA SSDs removed the moving parts, which cut latency to a fraction of a millisecond — but they still speak SATA, an interface designed for spinning disks. SATA III tops out around 550–600 MB/s no matter how fast the flash behind it is.",
          "NVMe drives skip SATA entirely and attach flash directly to the PCIe bus. A PCIe 3.0 NVMe drive reads at up to roughly 3,500 MB/s, PCIe 4.0 doubles that again, and latency drops to tens of microseconds. Just as important on a busy server: SATA's protocol processes a single queue of 32 commands, while NVMe supports tens of thousands of parallel queues — so one site's heavy job doesn't stall every other site's reads.",
        ],
      },
      {
        heading: "Why that shows up on a real website",
        paragraphs: [
          "Your visitors never see a sequential-read benchmark. What they feel is time to first byte (TTFB): the pause between clicking your link and the server beginning to respond. For a WordPress page, that pause is mostly PHP execution plus a burst of small random database reads — exactly the workload where NVMe's low latency and deep queues shine, and where HDDs collapse.",
          "The effect compounds on [shared hosting](/hosting). Storage is a common resource on a shared server; when it's slow, every site on the machine queues behind every other site's disk activity. Fast storage is much of the difference between a shared server that feels dedicated and one that feels crowded.",
        ],
      },
      {
        heading: "The LiteSpeed + NVMe combination",
        paragraphs: [
          "Storage speed and web-server speed multiply rather than add. LiteSpeed is an event-driven web server with a server-level page cache; paired with the free LiteSpeed Cache plugin, [WordPress hosting](/wordpress-hosting) can serve most visitors a prebuilt copy of each page without touching PHP or MySQL at all. That cache lives on disk — so on NVMe, even a cache miss followed by a full page build is quick, and a cache hit is nearly instant. This pairing, more than any single spec, is why two similarly priced plans can feel completely different.",
        ],
      },
      {
        heading: "What speed means for SEO and conversions",
        paragraphs: [
          "Google's Core Web Vitals set concrete targets: Largest Contentful Paint within 2.5 seconds and Interaction to Next Paint under 200 milliseconds. Hosting can't fix a bloated theme, but it controls the server response time everything else stacks on top of — Google recommends keeping TTFB under 800 milliseconds, and a slow server can spend most of your LCP budget before the first byte even arrives.",
          "Be sceptical of anyone promising a rankings jump from storage alone; page experience is one signal among hundreds, and content still dominates. The more reliable payoff is human: visitors on Indian mobile networks give up on slow pages, and every abandoned session is an abandoned enquiry or sale. Fast hosting doesn't guarantee conversions — it stops slow hosting from silently costing you them.",
        ],
      },
      {
        heading: "The honest caveat",
        paragraphs: [
          "NVMe won't rescue a site running forty active plugins, a page builder stacked on a heavy theme, and 4 MB hero images. Those need fixing too, and no hardware hides them. But when you're comparing hosts at similar prices, NVMe versus SATA is one of the few spec-sheet differences you will genuinely feel — treat it as a baseline requirement in 2026, not a premium feature.",
        ],
      },
    ],
    faq: [
      {
        q: "How much faster is NVMe than a SATA SSD?",
        a: "On paper, roughly six to twelve times the sequential throughput — about 3,500–7,000 MB/s versus SATA's ~550 MB/s ceiling — plus vastly deeper command queues. On a real website the honest answer is \"noticeably faster response under load\": the gain is largest for database-heavy sites and busy shared servers, smallest for static pages.",
      },
      {
        q: "Is NVMe hosting more expensive in India?",
        a: "It shouldn't be by much. NVMe drives cost hosts more than SATA, but the gap has narrowed enough that entry shared plans on NVMe start under ₹100/month. If a host charges a steep premium purely for NVMe, compare elsewhere.",
      },
      {
        q: "Will NVMe hosting improve my Google rankings?",
        a: "Indirectly, at most. Core Web Vitals are a lightweight ranking signal, and a faster server makes good LCP scores easier to hit. But content and relevance decide rankings — think of NVMe as removing a handicap, not adding a boost.",
      },
    ],
    cta: {
      label: "Get NVMe hosting in India",
      href: "/hosting",
      blurb: "NVMe storage and LiteSpeed on every plan — the pairing this post is about, from ₹39/mo with free SSL.",
    },
    related: ["speed-up-wordpress-website", "how-to-host-a-website-in-india", "shared-vs-reseller-hosting"],
  },
  {
    slug: "shared-vs-reseller-hosting",
    title: "Shared vs Reseller Hosting: Which One Do You Actually Need?",
    description:
      "Shared and reseller hosting solve different problems. A plain-language guide to which one fits you, when to upgrade, and what master and alpha tiers add.",
    date: "2026-07-21",
    readMinutes: 6,
    category: "Guides",
    sections: [
      {
        paragraphs: [
          "Shared and reseller hosting get compared as if they were rungs on the same ladder, but they answer different questions. Shared hosting asks \"where should my website live?\" Reseller hosting asks \"how do I manage — or sell — hosting for other people?\" Frame it that way and the choice mostly makes itself. This guide covers the details, the edge cases, and the point where switching actually makes sense.",
        ],
      },
      {
        heading: "What shared hosting is (and who it's for)",
        paragraphs: [
          "[Shared hosting](/hosting) is one account on a professionally managed server: your sites, one control panel, one bill. The host patches the operating system, runs the web server, and handles the 3 a.m. problems; you get cPanel, one-click installers, email on your domain, and free SSL. It's the right answer for a portfolio, a business site, a blog, or a WooCommerce store — any situation where every site on the account belongs to you and a single login is a convenience rather than a liability.",
          "Modern shared plans are more generous than their old reputation: multiple websites on one plan, NVMe storage, and comfortable headroom for tens of thousands of monthly visits. Most website owners never need anything else — and buying more \"to be safe\" is the most common way people overspend on hosting.",
        ],
      },
      {
        heading: "What reseller hosting is (and who it's for)",
        paragraphs: [
          "[Reseller hosting](/reseller-hosting) is a pool of resources you slice into fully separate cPanel accounts — each with its own login, its own limits, and its own package, all administered from a WHM panel. Two groups genuinely need this. The first is freelancers and agencies hosting client sites: separate accounts mean one client's compromised plugin can't reach another client's files, a runaway site is contained, and handing a project over is as clean as handing over credentials. The second is entrepreneurs selling hosting under their own brand.",
          "The white-label part is the point: private nameservers, your branding, your prices. Your customers see your company — the upstream host stays invisible.",
        ],
      },
      {
        heading: "The decision in one list",
        list: [
          "All the sites on the account are yours → shared hosting",
          "You build sites for clients and bill them for hosting → reseller hosting",
          "You want a hosting brand with its own plans and prices → reseller hosting",
          "You want to sell reseller accounts to other resellers → master reseller",
          "You want to create master resellers too → alpha reseller",
        ],
        paragraphs: [
          "Those last two tiers — [master reseller](/master-reseller-hosting) and [alpha reseller](/alpha-reseller-hosting) — exist for people building a hosting business with its own resellers underneath it. If that sentence sounds abstract, you don't need them yet; start smaller and upgrade when the structure of your business demands it.",
        ],
      },
      {
        heading: "When to switch from shared to reseller",
        paragraphs: [
          "The usual trigger isn't traffic — it's clients. The moment a second paying client's site lands on your personal shared account, you have a quiet liability: one login, one resource pool, and no clean way to hand a site over or bill for it separately. Reseller hosting fixes the isolation problem and, as a bonus, turns hosting from a line on your costs into a small recurring revenue line.",
          "Going the other way is just as valid: if you bought reseller hosting \"to be professional\" but only host your own projects, you're paying for account-management machinery you never use. A multi-site [shared](/hosting) or [unlimited hosting](/unlimited-hosting) plan is simpler and cheaper. Match the product to the problem, not to the ambition.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I host client websites on shared hosting?",
        a: "Technically yes, and for one or two informal projects it's common. But every client shares your single login and resource pool, which gets awkward for security, billing, and handovers. Reseller hosting gives each client an isolated cPanel account — that's the professional setup.",
      },
      {
        q: "Is reseller hosting profitable with only a few clients?",
        a: "Usually — reseller plans are priced so a handful of modest client fees covers the plan cost, and anything beyond that is margin. At five or ten clients the profit is real but small; the bigger immediate win is isolation and clean client handovers.",
      },
      {
        q: "What's the difference between reseller, master reseller, and alpha reseller?",
        a: "A reseller creates cPanel accounts for end customers. A master reseller can additionally create and sell reseller accounts. An alpha reseller sits one level higher still and can create master resellers. Each tier exists so you can sell to the tier below it.",
      },
    ],
    cta: {
      label: "Explore reseller hosting",
      href: "/reseller-hosting",
      blurb: "White-label cPanel/WHM accounts with private nameservers — your brand, your prices, isolated accounts for every client.",
    },
    related: ["start-a-hosting-business-in-india", "how-to-host-a-website-in-india", "what-is-nvme-hosting"],
  },
  {
    slug: "start-a-hosting-business-in-india",
    title: "How to Start a Hosting Business in India with Reseller Hosting",
    description:
      "A realistic playbook for starting a hosting business in India with white-label reseller hosting — niche, WHMCS billing, pricing, support, and honest margins.",
    date: "2026-07-08",
    readMinutes: 8,
    category: "Business",
    sections: [
      {
        paragraphs: [
          "Reseller hosting lowers the barrier to starting a hosting company to almost nothing: no servers, no data centre, no sysadmin on call. That's genuinely remarkable — and it's also why the field is crowded. What follows is a realistic playbook, including the parts that are actual work. Hosting is a good business for people who already have an audience or a service to attach it to, and a slow grind for people who don't.",
        ],
      },
      {
        heading: "Step 1: Pick a niche, not \"everyone\"",
        paragraphs: [
          "\"Cheap hosting for everyone\" is a battle you lose to companies that own data centres. The resellers who succeed sell to a specific audience they already understand: web designers bundling hosting with client projects, a local business community, WordPress developers, a regional or language market underserved on support. Your niche decides your plans, your prices, and your marketing copy — choose it before you buy anything.",
        ],
      },
      {
        heading: "Step 2: Choose a white-label reseller plan",
        paragraphs: [
          "Your hosting is only as good as the server underneath it, and your customers' complaints land on you, not the upstream host. Look for the same fundamentals you'd demand yourself: NVMe storage, LiteSpeed, free SSL for every account you create, and genuinely white-label branding — private nameservers (ns1.yourbrand.com) and an anonymous server hostname, so nothing leaks the provider behind you. A [reseller plan](/reseller-hosting) with WHM lets you define your own packages and create a separate cPanel account per customer.",
          "Start smaller than your ambition. A reseller plan upgrades in minutes when real customers arrive; months of paid-for overcapacity never come back.",
        ],
      },
      {
        heading: "Step 3: Automate billing with WHMCS",
        paragraphs: [
          "Manual invoicing kills hosting businesses, because hosting billing is recurring, dated, and unforgiving. WHMCS is the industry-standard automation layer: it takes the order, provisions the cPanel account through WHM automatically, invoices on schedule, chases overdue payments, and suspends non-payers — the whole customer lifecycle without you touching it. Many reseller plans bundle a WHMCS licence; if yours doesn't, budget for one, because the alternative is spreadsheet-driven chaos by customer ten.",
        ],
      },
      {
        heading: "Step 4: Price for margin, honestly",
        paragraphs: [
          "Work backwards from your costs: your reseller plan is a fixed monthly amount, so every account you sell above its share of that cost is margin. But don't race to the bottom — undercutting the big brands by a few rupees attracts exactly the customers who leave over a few rupees. Charge market-normal prices and win on what actually differentiates you: personal support, niche expertise, migration and setup help.",
          "Be honest with yourself about scale, too. A reseller business with twenty or thirty customers is a solid side income, not a salary. The path beyond that is the same as any business: retention, referrals, and time.",
        ],
      },
      {
        heading: "Step 5: Support is the product",
        paragraphs: [
          "Your customers chose a small host to get the support the giants won't give — that's your entire moat, and it's a real commitment: DNS confusion, email deliverability, a hacked WordPress at an inconvenient hour. Set expectations you can keep (published support hours beat fake 24×7), write saved answers for the ten questions you'll get weekly, and lean on your upstream host for server-level issues — that escalation path is part of what your reseller fee buys.",
          "When you eventually outgrow selling to end users and want to sell reseller accounts themselves, [alpha reseller hosting](/alpha-reseller-hosting) is the tier built for it. That's a scaling decision for later, though — not a starting point.",
        ],
      },
    ],
    faq: [
      {
        q: "How much does it cost to start a hosting business in India?",
        a: "The essentials are a domain, a reseller hosting plan, and a WHMCS licence if your plan doesn't include one — a few thousand rupees covers your first months properly set up. It's one of the cheapest legitimate businesses to start, which is exactly why a clear niche matters more than capital.",
      },
      {
        q: "Do I need technical skills to run a reseller hosting business?",
        a: "You need comfort with cPanel/WHM and DNS basics — learnable in a weekend of actually doing it. Server administration, the genuinely hard part, stays with your upstream host. The skills that decide success are support and marketing, not sysadmin work.",
      },
      {
        q: "Can my customers tell I'm a reseller?",
        a: "Not if the plan is properly white-labelled: private nameservers, your branding, and an anonymous server hostname mean customers only ever see your company. The one thing you can't white-label is quality — choose the upstream host accordingly.",
      },
    ],
    cta: {
      label: "Start your hosting brand",
      href: "/reseller-hosting",
      blurb: "White-label reseller plans with WHM, private nameservers, and free SSL for every account you create.",
    },
    related: ["shared-vs-reseller-hosting", "what-is-nvme-hosting", "how-to-host-a-website-in-india"],
  },
  {
    slug: "speed-up-wordpress-website",
    title: "10 Ways to Speed Up Your WordPress Website (That Actually Work)",
    description:
      "Ten WordPress speed fixes ranked by impact — LiteSpeed Cache, PHP upgrades, image compression, plugin audits, and the hosting layer underneath them all.",
    date: "2026-06-24",
    readMinutes: 8,
    category: "WordPress",
    sections: [
      {
        paragraphs: [
          "Most WordPress speed advice is a list of forty tweaks with no sense of proportion. These ten are ordered roughly by impact per hour of effort, and the honest headline is that the top three do most of the work. Measure before and after every change — PageSpeed Insights or WebPageTest — so you know what actually moved and what was ritual.",
        ],
      },
      {
        heading: "1–3: Fix the foundation",
        paragraphs: [
          "1. Get the hosting right. No plugin compensates for an overloaded server on slow disks. If your time to first byte regularly sits near the 800 ms ceiling Google recommends staying under, front-end tuning is polishing a slow engine. [WordPress hosting](/wordpress-hosting) on NVMe with LiteSpeed sets the ceiling for everything below.",
          "2. Turn on page caching. A page cache serves visitors a prebuilt copy of each page instead of running PHP and MySQL on every request — for anonymous traffic, easily the single biggest speedup WordPress can get. On a LiteSpeed server, the free LiteSpeed Cache plugin does this at the server level and bundles image optimisation and CSS/JS tuning in the same plugin.",
          "3. Upgrade PHP. Successive PHP 8.x releases have brought real performance gains on WordPress workloads, and old versions stop receiving security patches — PHP 7.4 has been end-of-life since late 2022. Check your version in Site Health, switch it in one click in cPanel, and test forms and checkout afterwards.",
        ],
      },
      {
        heading: "4–6: Shrink what you send",
        paragraphs: [
          "4. Compress and resize images. A hero image straight off a phone camera can outweigh the rest of the page combined. Serve WebP — LiteSpeed Cache or a dedicated plugin converts automatically — and resize to displayed dimensions: a 400-pixel column doesn't need a 4,000-pixel image.",
          "5. Lazy-load below the fold. WordPress lazy-loads images natively; make sure nothing disables it — and never lazy-load the hero image itself, because delaying your Largest Contentful Paint element is self-sabotage.",
          "6. Put a CDN in front. A CDN caches static files close to visitors; Cloudflare's free tier is the usual answer. For a purely Indian audience on Indian hosting the gain is modest — it matters most when your visitors are spread across the world.",
        ],
      },
      {
        heading: "7–8: Cut what you don't need",
        paragraphs: [
          "7. Audit plugins quarterly. Plugin count matters less than plugin weight — one bloated page builder outweighs ten single-purpose plugins. Deactivate one suspect at a time, measure, and delete what stays deactivated: inactive plugins are still a security surface.",
          "8. Choose a lean theme. Demo-everything multipurpose themes load sliders and icon packs on every page. Lean options — GeneratePress, Astra, modern block themes — ship a fraction of the code. Changing themes is real work, so fold it into your next redesign rather than forcing it.",
        ],
      },
      {
        heading: "9–10: Housekeeping",
        paragraphs: [
          "9. Clean the database. Post revisions, expired transients, and orphaned tables from long-deleted plugins accumulate for years. WP-Optimize or LiteSpeed Cache's database tools clear them safely — after a backup, always.",
          "10. Add an object cache on busy sites. For the traffic a page cache can't serve — logged-in users, WooCommerce carts — Redis or Memcached keeps repeated database queries in memory. It shines on stores and membership sites; a quiet blog won't notice it.",
          "If you only do three: page caching, image compression, and a current PHP version on decent hosting. That combination alone takes most WordPress sites from sluggish to solid.",
        ],
      },
    ],
    faq: [
      {
        q: "What's the fastest way to speed up WordPress without plugins?",
        a: "Upgrade PHP to a current 8.x release in your hosting panel and resize your oversized images — both need zero plugins. The next biggest win, server-level page caching, needs exactly one plugin on a LiteSpeed host, not a stack of them.",
      },
      {
        q: "How many plugins is too many for WordPress?",
        a: "There's no magic number — thirty lightweight plugins can outperform five heavy ones. What matters is what each loads on the front end. Audit by deactivating suspects one at a time and measuring the difference, then delete what you don't reactivate.",
      },
      {
        q: "Do I need both a caching plugin and a CDN?",
        a: "They solve different problems: the cache makes your server respond fast, the CDN moves static files closer to distant visitors. Indian site, Indian audience, Indian hosting — the cache matters far more. Global audience — use both.",
      },
    ],
    cta: {
      label: "Host WordPress on LiteSpeed + NVMe",
      href: "/wordpress-hosting",
      blurb: "One-click installs, server-level LiteSpeed caching, and NVMe storage — the foundation this checklist builds on.",
    },
    related: ["what-is-nvme-hosting", "how-to-host-a-website-in-india", "shared-vs-reseller-hosting"],
  },
  {
    slug: "choosing-a-domain-name-india",
    title: ".in vs .com: Choosing the Right Domain Name in India",
    description:
      ".in or .com? An honest guide to choosing a domain name in India — what TLDs really do for SEO, naming rules that age well, and protecting your brand.",
    date: "2026-06-11",
    readMinutes: 6,
    category: "Domains",
    sections: [
      {
        paragraphs: [
          "The .in versus .com question gets asked with far more anxiety than it deserves, mostly because of SEO myths we'll deal with directly below. The short version: both are fine, the choice is about audience and branding rather than rankings, and the name itself matters far more than its ending.",
        ],
      },
      {
        heading: "What .in and .com actually signal",
        paragraphs: [
          ".in is India's country-code TLD, and it does one thing a .com can't: it tells every visitor at a glance that you're an Indian business serving an Indian audience. For a local service, a regional store, or any brand whose Indianness is a feature, that signal is valuable — and the name you actually want is far more likely to still be available.",
          ".com remains the global default: the ending people type on autopilot and the one that carries the most weight abroad. If you plan to sell outside India, raise money, or build a product brand, the .com is worth chasing even if it means adjusting the name. Price rarely settles it — .in typically costs a little less than .com, but both are trivial next to what the brand will be worth to you.",
        ],
      },
      {
        heading: "The SEO truth about TLDs",
        paragraphs: [
          "Let's kill the myths directly: the TLD is not a meaningful ranking factor. Google has said as much repeatedly — a .in doesn't rank worse because of its ending, keywords stuffed into a domain buy you almost nothing, and no extension carries a secret bonus. Content, links, and site quality decide rankings; the ending mostly decides what humans expect before they click.",
          "The one real nuance is geo-targeting. A country-code TLD like .in tells search engines your primary audience is India automatically. A .com is geographically neutral — which isn't a weakness, because you can point it at India yourself in Google Search Console. For ranking in India, either extension works; pick for your audience, not for an algorithm.",
        ],
      },
      {
        heading: "Naming rules that age well",
        list: [
          "Short beats clever — two or three syllables someone can say over the phone",
          "No hyphens or numbers; both get mangled in dictation and word of mouth",
          "Pass the radio test: hear it once, type it correctly",
          "Don't bake in a trend, a technology, or a city you might outgrow",
          "Search the name first — trademark collisions are cheaper to avoid than to fight",
        ],
        paragraphs: [
          "Check social handles in the same sitting. A domain whose matching handles belong to someone else creates low-grade brand confusion forever, and it's much easier to adjust the name now than after the logo is printed.",
        ],
      },
      {
        heading: "Protect the brand, not just the domain",
        paragraphs: [
          "Once you've chosen, spend a little more to close the obvious gaps: register both the .in and the .com if both are free, add common misspellings if your name invites them, and 301-redirect the extras to your main site. A few hundred rupees a year per name prevents the two classic headaches — a competitor camping the sibling extension, and customers emailing the wrong domain.",
          "Then make it hard to lose: enable auto-renew (expired-domain sniping is a real industry and your brand is the prize), lock the domain against unauthorised transfers, and keep the registrant email current — it's how you prove ownership when it matters. All of this takes ten minutes in a [decent domain dashboard](/domains) and is the cheapest insurance your business will ever buy.",
        ],
      },
    ],
    faq: [
      {
        q: "Is a .in domain good for SEO in India?",
        a: "Yes — and so is a .com. TLD choice isn't a meaningful ranking factor. The .in's real advantages are automatic geo-targeting to India and a stronger local-trust signal for Indian visitors; a .com achieves the same targeting with one setting in Search Console.",
      },
      {
        q: "Should I buy both the .in and .com versions of my name?",
        a: "If both are available, yes — the cost is trivial next to the brand's value. Pick one as your primary and 301-redirect the other. It closes off the most common brand-squatting move for a few hundred rupees a year.",
      },
      {
        q: "Are new TLDs like .shop or .tech worth using?",
        a: "They're legitimate and they rank fine, but check the renewal price — many new TLDs pair a cheap first year with a much higher renewal. And be honest about the trust gap: some users still hesitate at unfamiliar endings, especially for anything involving payment.",
      },
    ],
    cta: {
      label: "Find your domain",
      href: "/domains",
      blurb: "Search .in, .com, and dozens of other extensions — with the renewal price shown before you buy.",
    },
    related: ["how-to-host-a-website-in-india", "shared-vs-reseller-hosting", "start-a-hosting-business-in-india"],
  },
];

/** All posts, newest first — the six originals plus the authored library. */
export const blogPosts: BlogPost[] = [...basePosts, ...libraryPosts].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Manual picks first, then same-category fill, up to four. */
export function relatedPosts(post: BlogPost): BlogPost[] {
  const manual = post.related
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => Boolean(p));
  const fill = blogPosts.filter(
    (p) =>
      p.slug !== post.slug && p.category === post.category && !post.related.includes(p.slug),
  );
  return [...manual, ...fill].slice(0, 4);
}

/** URL-safe slug for category/tag archive routes. */
export function taxonomySlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function allCategories(): { name: BlogCategory; slug: string; count: number }[] {
  const seen = new Map<BlogCategory, number>();
  for (const post of blogPosts) seen.set(post.category, (seen.get(post.category) ?? 0) + 1);
  return [...seen.entries()]
    .map(([name, count]) => ({ name, slug: taxonomySlug(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function postsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((p) => taxonomySlug(p.category) === categorySlug);
}

export function allTags(): { name: string; slug: string; count: number }[] {
  const seen = new Map<string, number>();
  for (const post of blogPosts)
    for (const tag of post.tags ?? []) seen.set(tag, (seen.get(tag) ?? 0) + 1);
  return [...seen.entries()]
    .map(([name, count]) => ({ name, slug: taxonomySlug(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function postsByTag(tagSlug: string): BlogPost[] {
  return blogPosts.filter((p) => (p.tags ?? []).some((t) => taxonomySlug(t) === tagSlug));
}
