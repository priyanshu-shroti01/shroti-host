import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "website-development-cost-in-india",
  title: "Website Development Cost in India: What Drives the Price",
  description:
    "No fake rate card. The real drivers of website development cost in India, the questions an honest quote has to ask, and the red flags in too-cheap offers.",
  date: "2026-08-19",
  readMinutes: 7,
  category: "Development",
  tags: ["web-development", "pricing", "india"],
  sections: [
    {
      paragraphs: [
        "Ask five agencies what a website costs in India and you will get five numbers, sometimes an order of magnitude apart. That is not because four of them are lying. It is because \"a website\" covers everything from a five page brochure site built on a template to a custom e-commerce platform with payments, inventory, and hundreds of products.",
        "So this guide will not hand you a rate card. Published price tables age fast and mostly describe whoever wrote them. What it will do is show you what actually moves the number, the questions a serious quote has to ask, and the warning signs in a quote that looks too good, so you can compare offers on substance instead of on the final figure alone.",
      ],
    },
    {
      heading: "Scope decides more than anything else",
      paragraphs: [
        "Every honest quote starts from scope: how many page types, what those pages have to do, and who updates them afterwards. A five page site that only the developer will ever edit is a fundamentally smaller job than a twenty page site with a blog, a careers section, and a staff member who needs to change content without touching code.",
        "The word \"page\" hides a lot. A pricing page with an interactive calculator is not the same work as a plain text page, even though both count as one line on a proposal. When you compare quotes, compare the described functionality, never the page count.",
      ],
    },
    {
      heading: "Custom build vs template: the biggest fork",
      paragraphs: [
        "The second driver is how the site gets built. A template based build starts from an existing design and adapts it: faster, cheaper, and completely legitimate for most small businesses. A custom build starts from a blank page: research, wireframes, original design, and code written for your exact requirements.",
        "Custom costs several times more because it is several times more work. That is worth paying when your website is the business, when design genuinely differentiates you, or when no template can do what you need. It is worth skipping when you mainly need a professional presence and a way for customers to reach you. Our comparison of [custom websites and website builders](/blog/custom-website-vs-website-builder) goes deeper on that decision.",
      ],
    },
    {
      heading: "E-commerce changes the category",
      paragraphs: [
        "The moment a site sells something, the job changes category. Product catalogues, carts, payment gateway setup, shipping rules, GST invoices, order emails, and refund flows all have to be built and then tested, and testing payments properly takes real time. A store also raises the stakes: a bug on a brochure site is embarrassing, a bug in checkout costs money.",
        "That is why an [e-commerce build](/ecommerce-development) is quoted differently from a company site of the same visual size. If a quote for a store is barely higher than a quote for a brochure site, one of the two projects has been misunderstood.",
      ],
    },
    {
      heading: "Content: the cost everyone forgets",
      paragraphs: [
        "Developers build containers. Someone still has to fill them. Writing page copy, sourcing or shooting photos, preparing product descriptions, and translating content into a second language all take time that either you spend or you pay for. In practice, projects stall on missing content far more often than on missing code.",
        "Ask every prospective developer who produces the content. \"Client provides all content\" is a fair answer, but it belongs in writing before the price means anything, because content added later gets quoted later.",
      ],
    },
    {
      heading: "Integrations: the quiet line items",
      paragraphs: [
        "Most modern sites talk to other systems: WhatsApp chat, a payment gateway, a CRM, a booking calendar, courier APIs, marketing tools. Each integration is a small project of its own, with its own accounts, keys, and failure cases. Well documented services connect quickly; obscure ones do not.",
        "List every tool your business already uses before you ask for quotes. Integrations discovered mid-project are the most common source of budget overruns, and connecting business systems is often the point where a website project quietly grows into [custom software](/custom-software).",
      ],
    },
    {
      heading: "The costs that continue after launch",
      paragraphs: [
        "Development is a one time cost. Running the site is not. The recurring pieces are hosting, the domain, and maintenance. Hosting for a typical business site is genuinely cheap now: ShrotiHost's [shared plans](/hosting) run from ₹39 to ₹159 per month with free SSL and daily backups, and we've broken down [what hosting costs in India](/blog/website-hosting-cost-in-india) separately. A domain at ShrotiHost is about ₹714 for the first year of a .in, or about ₹1,169 for a .com.",
        "Maintenance is the honest wildcard: software updates, security patches, small content changes, the occasional fix. Some businesses handle it in-house, some pay a monthly retainer, some pay per request. None of those is wrong, but choose one deliberately, because an unmaintained site decays whether or not you budgeted for it.",
      ],
    },
    {
      heading: "What an honest quote has to ask you",
      list: [
        "What must the site do, page by page and feature by feature?",
        "Who provides the content, and in which languages?",
        "What does it integrate with: payments, WhatsApp, CRM, couriers, anything else?",
        "Who updates the site after launch, and do they need a CMS to do it?",
        "What does success look like: enquiries, orders, bookings, something else?",
      ],
      paragraphs: [
        "If someone quotes a firm price without asking most of these, they are quoting their standard package, not your project. That can still be fine when your project is standard. It becomes a problem the moment your requirements are anything but.",
      ],
    },
    {
      heading: "Red flags in a too-cheap quote",
      list: [
        "No written scope, so every later request becomes a paid \"extra\" that was never excluded in writing either.",
        "The domain gets registered in the developer's name, which means you do not own your own address.",
        "Hosting is bundled invisibly, with no answer to what happens when you want to leave.",
        "A licensed template sold to you as custom design work.",
        "Silence about who owns the code, the content, and the accounts at the end.",
      ],
      paragraphs: [
        "The cheapest quote is often the most expensive one by year two, once the site needs the things that were quietly left out. At ShrotiHost we quote web projects only against a written scope, through [the enquiry form](/web-development): you describe what the site has to do, and we reply with a price and a list of exactly what it includes.",
      ],
    },
  ],
  faq: [
    {
      q: "How much does a simple business website cost in India?",
      a: "There is no single number that survives contact with real requirements, which is why we won't invent one. A template based site with a handful of pages sits at the bottom of the range; custom design, e-commerce, and integrations each multiply the work. The reliable method is to write one short scope document and collect two or three written quotes against it. The comparison teaches you more than any published price table.",
    },
    {
      q: "Why do quotes for the same website vary so much?",
      a: "Because they are rarely for the same website. One developer assumes a template, another assumes custom design; one includes content writing, another expects you to supply everything; one prices integrations, another discovers them later as extras. Sending every developer the same written scope removes most of the variance.",
    },
    {
      q: "Is a one-time project fee or a monthly plan better?",
      a: "A one-time fee with everything registered in your name suits most businesses: you own the result and only pay ongoing costs for hosting and the domain. Monthly website plans can be legitimate, but ask what happens when you cancel. If the answer is that the site disappears, you were renting, not buying.",
    },
    {
      q: "What should I budget per year to run the site after launch?",
      a: "Three lines: domain renewal, hosting, and maintenance. Shared hosting at ShrotiHost runs ₹39 to ₹159 per month depending on the plan, and monthly billing renews at the same price you started at. Maintenance depends on how you arrange it, from doing updates yourself to a retainer with your developer.",
    },
  ],
  cta: {
    label: "Start a web project",
    href: "/web-development",
    blurb:
      "Describe what your site has to do and get a quote against a written scope. Design, development, and hosting from one team.",
  },
  related: ["custom-website-vs-website-builder", "website-development-checklist", "website-hosting-cost-in-india"],
};
