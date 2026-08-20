import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "website-development-checklist",
  title: "The Website Launch Checklist: Before, During, and After",
  description:
    "A practical website launch checklist in three phases. Domain, hosting, SSL, analytics, backups, SEO basics, and legal pages, in the order they actually matter.",
  date: "2026-08-19",
  readMinutes: 7,
  category: "Development",
  tags: ["web-development", "checklists"],
  sections: [
    {
      paragraphs: [
        "Website launches rarely fail in dramatic ways. They fail in small, dull ones: a contact form that emails nobody, analytics installed a month late, a domain registered under a freelancer's personal account. Every item on this checklist exists because somebody, somewhere, skipped it and paid for it.",
        "The list runs in three phases: before you build, while you build, and launch plus the weeks after. It applies whether you are assembling the site yourself over a weekend or handing a full project to [a development team](/web-development). Work top to bottom; the ordering is most of the value.",
      ],
    },
    {
      heading: "Phase 1: Before you build",
      ordered: true,
      list: [
        "Define the site's one job. Enquiries, orders, bookings, or something else: everything on this list serves that goal, so write it down first.",
        "Register the domain in your own account, in your own name. Never let a developer or platform hold it for you. Our guide to [choosing a domain name](/blog/choosing-a-domain-name-india) helps if you are still deciding.",
        "Choose hosting sized to the site, not to your ambition. A standard business site runs happily on [shared hosting](/hosting); you can upgrade later in an afternoon.",
        "Map the pages and name who writes each one. Missing content delays more launches than missing code.",
        "Gather brand assets in one folder: logo files, colours, fonts, photos, and the exact spellings of names and addresses.",
        "Decide now who maintains the site after launch: you, a staff member, or a paid arrangement.",
      ],
    },
    {
      heading: "Get the boring infrastructure right early",
      paragraphs: [
        "Three pieces of plumbing deserve attention before any design work: the domain, DNS access, and email. Make sure you hold the login for the domain account and know where its DNS is managed, because launch day is a DNS change and you do not want to be hunting for passwords then. If DNS still feels like magic words, our explainer on [DNS records](/blog/dns-records-explained) covers the handful you will actually touch.",
        "Set up business email on your domain early too, so the contact form has a proper destination from day one. SSL is no longer a purchase decision: hosts like ShrotiHost include free Let's Encrypt certificates, so the only thing to check is that HTTPS actually works when the site goes live.",
      ],
    },
    {
      heading: "Phase 2: While you build",
      ordered: true,
      list: [
        "Build on a staging or temporary URL and keep it out of Google with a noindex tag until launch. Remember to remove that tag on launch day.",
        "Check every page on a real phone, not just a shrunken browser window. Most of your visitors will arrive on mobile.",
        "Compress and resize images as you add them. Oversized images are the single most common cause of slow pages.",
        "Build the contact form early and test where submissions land, including the spam folder.",
        "Write a unique title and meta description for every page while the content is fresh in your head.",
        "Create the legal pages: a privacy policy at minimum, plus terms and a refund policy if you sell anything.",
        "Turn on backups before launch, not after. Daily backups are included on ShrotiHost plans, but confirm rather than assume, whoever hosts you.",
      ],
    },
    {
      heading: "Phase 3: The week before launch",
      ordered: true,
      list: [
        "Click through every page and submit every form, on desktop and phone. Fix what you find before adding anything new.",
        "Confirm SSL works and that the site forces HTTPS, so no visitor lands on an insecure version.",
        "Install analytics and verify the site in Google Search Console. You cannot improve what you never measured.",
        "If this replaces an old site, list its URLs and set up redirects to the new pages so you keep your search rankings and inbound links.",
        "Add the small trust details: favicon, social sharing image, and a useful 404 page.",
        "Do a speed pass. Test key pages on a throttled mobile connection; if the site runs on WordPress, our guide to [speeding up WordPress](/blog/speed-up-wordpress-website) is the deeper checklist.",
      ],
    },
    {
      heading: "Launch day",
      ordered: true,
      list: [
        "Point DNS at the live server during a quiet hour for your business, and expect up to a day of propagation for stragglers.",
        "Remove the noindex tag and submit your sitemap in Search Console.",
        "Test the site from a phone on mobile data, not just the office Wi-Fi that has cached everything.",
        "Send a real test through every form, and place a small real order if you sell online. Payment flows behave differently in production.",
        "Confirm the first backup of the live site actually ran.",
      ],
      paragraphs: [
        "If you are starting from zero rather than replacing a site, the full path from empty hosting account to live site is walked step by step in our guide to [hosting a website in India](/blog/how-to-host-a-website-in-india).",
      ],
    },
    {
      heading: "The first month after launch",
      ordered: true,
      list: [
        "Check Search Console weekly for crawl errors and pages Google could not index.",
        "Read the analytics with one question: where do visitors give up? Fix that page first.",
        "Collect typos, broken links, and confusing wording from early visitors and fix them in batches.",
        "Switch on auto-renew for the domain and hosting, and check the payment card on file will not expire soon. Expired domains take good websites offline every day.",
        "Apply software updates promptly if the site runs a CMS: core, themes, and plugins.",
      ],
    },
    {
      heading: "What never comes off the list",
      paragraphs: [
        "A website is not a project that ends, it is a small system that runs. Keep applying updates, keep backups running, and once in a while actually restore one to prove it works. A backup you have never restored is a hope, not a plan.",
        "Revisit the content twice a year: prices, team, services, and photos drift out of date quietly, and stale content costs trust exactly when a customer is deciding whether to call you. If the maintenance side is the part you dread, that is a normal thing to hand off, and a fair question to ask [whoever builds your next site](/web-development) before they start.",
      ],
    },
  ],
  faq: [
    {
      q: "How long does it take to launch a website?",
      a: "The build is rarely the bottleneck. A template based site can be assembled in days and a custom build in weeks, but content, feedback rounds, and approvals set the real timeline. The practical answer: agree the page list and who writes what before the build starts, and the rest of the schedule tends to hold.",
    },
    {
      q: "Do I really need a privacy policy for a small Indian website?",
      a: "If the site collects any personal data, and a contact form or analytics already counts, then yes. India's data protection law applies to businesses handling personal data, and a clear policy also reassures customers. Keep it honest and specific to what you actually collect rather than pasting a generic template unread.",
    },
    {
      q: "When should backups be set up?",
      a: "Before launch, so the very first live version is already protected. Then test a restore at least once. ShrotiHost plans include daily backups, but whoever hosts you, confirm backups exist, know how to restore one yourself, and keep an occasional extra copy somewhere outside the hosting account.",
    },
    {
      q: "What is the most commonly forgotten item on this list?",
      a: "Redirects from the old site's URLs, closely followed by removing the noindex tag on launch day. The first quietly throws away years of search rankings; the second keeps the new site invisible to Google. Both take minutes to do and weeks to notice you missed.",
    },
  ],
  cta: {
    label: "Get help with your launch",
    href: "/web-development",
    blurb:
      "From scope to launch day, we build and ship websites against this same checklist. Tell us what you need and get a quote on a written scope.",
  },
  related: ["custom-website-vs-website-builder", "how-to-host-a-website-in-india", "dns-records-explained"],
};
