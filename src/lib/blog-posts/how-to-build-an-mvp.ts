import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "how-to-build-an-mvp",
  title: "How to Build an MVP: Scope Small, Ship, Learn",
  description:
    "A practical MVP method: find the one workflow that proves someone will pay, cut everything else, ship in weeks, and measure honestly. Plus what MVPs cannot prove.",
  date: "2026-08-19",
  readMinutes: 6,
  category: "Development",
  tags: ["saas", "mvp", "startups"],
  sections: [
    {
      paragraphs: [
        "An MVP is not a smaller, cheaper version of your product. It is the fastest honest test of the assumption most likely to kill it, which for most products is 'will anyone pay for this?' Everything about scoping an MVP follows from that one sentence: you build the single workflow that lets a real user get real value and, ideally, pay real money. Everything else waits.",
        "Most founders get this backwards. They start with the product they imagine at year three, trim ten percent, and call it minimal. Six months later they launch something large, learn one thing, and have no budget left to act on it. The method below is designed to get you to the learning in weeks instead.",
      ],
    },
    {
      heading: "What an MVP is actually for",
      paragraphs: [
        "Products rarely die because the team could not build them. They die because not enough people wanted the thing badly enough to pay, switch, or come back. An MVP exists to test that risk while it is still cheap to be wrong.",
        "So before writing any feature list, write down your riskiest assumption in one line. Not 'the app works' but something like 'clinic owners will pay monthly for automated appointment reminders' or 'freelancers will move invoicing off Excel for this'. If your MVP cannot produce evidence for or against that line, it is scoped wrong, no matter how small it is.",
      ],
    },
    {
      heading: "Find the one workflow that proves payment",
      paragraphs: [
        "Every product has one path where the value actually happens. For an invoicing tool it is: create an invoice, send it, client pays, you get notified. For a booking product it is: customer finds a slot, books, the business sees it. Call this the money workflow. Your MVP is that workflow, complete and reliable, and almost nothing else.",
        "Complete matters. A half-working money workflow teaches you nothing, because users who drop out might be rejecting the idea or might be rejecting the bug. Make the narrow path solid end to end, and put a price on it from day one if the product can carry one. A payment is the only signal that cannot be politely faked; interest, compliments, and even signups all can.",
      ],
    },
    {
      heading: "The cut list: write everything down, then remove",
      paragraphs: [
        "Scoping by addition never ends. Scope by subtraction instead:",
      ],
      list: [
        "Brain-dump every feature you can imagine, unfiltered, into one list.",
        "For each item ask one question: if I remove this, can the money workflow still prove payment? If yes, it leaves the MVP.",
        "Sort the survivors into 'v1', 'after first paying users', and 'probably never'. Be brutal about the middle column; it is where scope creep hides.",
        "Cut whole categories, not just features: admin panels (edit the database directly at first), team roles (single user is fine), integrations (CSV export covers most), native mobile apps (a web app reaches everyone with a link).",
        "Re-run the cut once more a week later. The second pass always finds more.",
      ],
      ordered: true,
    },
    {
      heading: "Build boring, ship fast",
      paragraphs: [
        "The MVP is the wrong place for interesting technology. Use the stack your team already knows, buy instead of build wherever a service exists (payments, email, authentication), and ship one plain web app rather than juggling platforms. If you are torn on that last point, our comparison of [mobile app vs web app](/blog/mobile-app-vs-web-app) covers why web-first wins for most v1s.",
        "Plain does not mean sloppy. The money workflow should feel trustworthy, because you are asking strangers for money. But a clear, unstyled interface that works beats a polished one that ships two months later. Polish is a thing you earn the right to spend on. If you would rather not build it yourself, this scoping-first approach is exactly how our [SaaS development](/saas-development) and [web development](/web-development) teams run early builds.",
      ],
    },
    {
      heading: "Measure like you mean it",
      paragraphs: [
        "Build-measure-learn fails when teams treat it as a slogan. Make it concrete: before launch, write down the one number that answers your riskiest assumption. Usually it is a conversion through the money workflow, such as 'of people who start creating an invoice, how many send one and how many pay after the trial'. Vanity numbers like signups, page views, and social followers feel good and decide nothing.",
        "Then pair the number with conversations. At MVP scale your data is small, so a dozen honest user interviews often teach you more than your analytics dashboard. Ask what they were trying to do, where they hesitated, and what they used before. The metric tells you that something is wrong; users tell you what.",
        "Set a review date in advance, four to six weeks after launch, and decide then: push on, change direction, or stop. A deadline you set while calm protects you from drifting for a year on 'almost there'.",
      ],
    },
    {
      heading: "What an MVP cannot prove",
      paragraphs: [
        "Honesty cuts both ways, so know the limits. An MVP cannot prove long-term retention, because that takes months of real usage. It cannot prove your pricing ceiling, only that some price above zero works. It cannot prove the product scales operationally, or that word of mouth will carry growth. Those answers come later, from the real product.",
        "A failed MVP is also not always a failed idea. If nobody converts, the audience might be wrong, the landing page might explain the product badly, or the price might be aimed at the wrong segment. Before abandoning the idea, check whether the test itself was sound. And a successful MVP is a licence to keep investing, not proof of a business; treat it as one strong signal, not a verdict.",
      ],
    },
    {
      heading: "Sometimes the MVP is not software at all",
      paragraphs: [
        "If your riskiest assumption is pure demand, you may not need to build anything yet. A landing page that explains the product and takes pre-orders or waitlist signups tests interest for a few thousand rupees. A concierge MVP, where you deliver the service manually behind a simple front, tests willingness to pay before any automation exists. Plenty of good SaaS started as a founder, a spreadsheet, and WhatsApp.",
        "The pattern to avoid is using no-code or manual delivery forever out of momentum. These are probes, not products. Once payments are real and repeatable, build the actual workflow properly so it can grow; our note on [custom builds vs website builders](/blog/custom-website-vs-website-builder) covers when that switch pays for itself.",
      ],
    },
  ],
  faq: [
    {
      q: "How long should an MVP take to build?",
      a: "Weeks, not months, once scoping is done. If the plan says four months or more, the scope is almost certainly too big; re-run the cut list. The exception is products with genuine technical risk at the core, where a longer build may itself be the experiment.",
    },
    {
      q: "Should my MVP be free?",
      a: "Charge if the product can possibly carry a price. Free users answer 'is this nice?', paying users answer 'is this worth money?', and only the second question keeps companies alive. A free trial that ends in a real paywall is a fine compromise; permanently free at MVP stage usually just postpones the hard truth.",
    },
    {
      q: "Do I need a mobile app for my MVP?",
      a: "Usually no. A web app reaches every user with a link, ships from one codebase, and updates instantly, which suits the weekly changes an MVP goes through. Build mobile first only when the core value needs the device itself, such as offline field use, background GPS, or push-driven habits.",
    },
    {
      q: "What if people sign up but never come back?",
      a: "That is an activation problem, and it is common. It means the promise landed but the product did not deliver value fast enough on first use. Watch where first sessions stall, shorten the path from signup to the money workflow's payoff, and talk to five users who left. Fix that before adding any new features.",
    },
  ],
  cta: {
    label: "Scope my SaaS",
    href: "/saas-development",
    blurb:
      "Bring the idea and the brain-dump list. We will help you cut it to the workflow that proves payment, then design and build it on a stack that can grow past the MVP.",
  },
  related: ["mobile-app-vs-web-app", "website-development-checklist", "custom-website-vs-website-builder"],
};
