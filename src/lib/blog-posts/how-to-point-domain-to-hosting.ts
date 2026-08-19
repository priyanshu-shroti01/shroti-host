import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "how-to-point-domain-to-hosting",
  title: "How to Point a Domain to Your Hosting (Nameservers and DNS)",
  description:
    "The two ways to connect a domain to hosting: change nameservers or point A/CNAME records. When each is right, honest propagation timelines, and how to verify.",
  date: "2026-08-19",
  readMinutes: 6,
  category: "Guides",
  tags: ["dns", "tutorials", "beginners"],
  sections: [
    {
      paragraphs: [
        "You bought a domain in one place and hosting in another, and now they need to meet. There are exactly two ways to do it: change the domain's nameservers to your host's (the host then controls all DNS), or keep DNS where it is and point individual A or CNAME records at your hosting server. Both end with your domain loading your website.",
        "Which one? If the domain is new or nothing important hangs off it, change the nameservers; it is simpler and everything lives in one panel afterwards. If the domain already runs email or other services you do not want to disturb, point the records instead and leave everything else untouched. This guide walks through both, step by step.",
      ],
    },
    {
      heading: "How a domain finds your hosting",
      paragraphs: [
        "A quick mental model makes every step below obvious. Your registrar is where the domain is registered. The domain's nameservers are the servers the internet asks for its DNS records. And the DNS records are the actual answers: an A record says 'this domain lives at this server IP', a CNAME says 'this name is an alias of that one', an MX record says where email goes.",
        "So 'pointing a domain' just means making the A record for your domain answer with your hosting server's IP. Method 1 does that by moving the whole answer sheet to your host. Method 2 edits one line on the answer sheet where it already is. For a fuller tour of record types, see [DNS records explained](/blog/dns-records-explained).",
      ],
    },
    {
      heading: "Method 1: change the nameservers",
      paragraphs: ["This hands DNS control to your host, so your hosting panel manages everything from then on."],
      list: [
        "Find your host's nameservers in the welcome email or hosting panel. They look like ns1.yourhost.com and ns2.yourhost.com.",
        "Log in at your registrar (wherever you bought the domain) and open the domain's management page.",
        "Find the setting called Nameservers, often under DNS or Domain Settings, and switch it from the default to 'custom'.",
        "Replace the existing entries with your host's nameservers, exactly as given, and save.",
        "In your hosting panel, make sure the domain is added to your account, as the primary domain or an addon, so the server knows to answer for it.",
      ],
      ordered: true,
    },
    {
      heading: "Method 2: point the records, keep your DNS where it is",
      paragraphs: [
        "Here the registrar (or Cloudflare, or wherever your DNS lives) stays in charge, and you edit only the records that concern the website.",
      ],
      list: [
        "Find your hosting server's IP address in your welcome email or in cPanel under General Information.",
        "Open the DNS management page at your registrar.",
        "Edit the A record for @ (the bare domain) to point at that IP, or create it if none exists.",
        "For www, either add a CNAME pointing to your bare domain or a second A record with the same IP.",
        "Leave MX and every other record alone. That is the whole point of this method: email and other services keep working untouched.",
      ],
      ordered: true,
    },
    {
      heading: "Which method should you use?",
      paragraphs: [
        "Change nameservers when the domain is fresh, when you want one panel for everything, or when your host's support may need to manage DNS for you. It is the default we suggest for beginners, and it is how our [hosting guide for India](/blog/how-to-host-a-website-in-india) sets things up end to end.",
        "Point records when the domain already carries live email (Google Workspace, Zoho, and similar), when it has a pile of custom records you do not want to recreate, or when your DNS deliberately lives at Cloudflare. Switching nameservers in those situations means every existing record must be recreated at the new DNS host before anything breaks, and forgetting one usually means broken email.",
        "One thing neither method involves: moving the domain itself. Pointing is free and reversible and the domain stays registered where it is. Actually moving registration is a different process covered in [how to transfer a domain](/blog/how-to-transfer-a-domain).",
      ],
    },
    {
      heading: "Propagation: how long it really takes",
      paragraphs: [
        "DNS changes are not instant everywhere at once, because resolvers around the internet cache old answers until their timers (TTLs) expire. In practice, record edits are often visible within minutes. Nameserver changes typically take longer, commonly a few hours, because registry-level caches are involved.",
        "The honest planning number is: usually minutes to a few hours, up to 48 hours in the worst case. During that window, different people see different versions of your site, and that is normal, not a fault. If you are doing a live migration and downtime matters, lower the TTL on the relevant records a day before the change so caches refresh quickly, and keep the old server running until traffic fully shifts.",
      ],
    },
    {
      heading: "How to verify it worked",
      list: [
        "Use a propagation checker like whatsmydns.net: enter your domain, select A (or NS for a nameserver change), and watch locations around the world flip to the new value.",
        "On your own machine, run 'nslookup yourdomain.com' (or 'dig yourdomain.com' on Mac/Linux) and confirm the IP matches your server.",
        "Load the site in a private browser window, and check both yourdomain.com and www.yourdomain.com.",
        "Once DNS resolves to the new server, issue SSL. On ShrotiHost this is automatic: Let's Encrypt certificates install themselves shortly after the domain points correctly, so the https version should come alive without you doing anything.",
        "If email matters on this domain, send yourself a test message from an outside account and confirm it arrives.",
      ],
      ordered: true,
    },
    {
      heading: "Common mistakes to avoid",
      list: [
        "Editing DNS in the wrong place. After a nameserver change, records at your registrar are ignored; edit them in your hosting panel instead.",
        "Forgetting the www record, so the bare domain works and www does not, or the reverse.",
        "Typos in the IP address. One wrong digit points your domain at a stranger's server.",
        "Switching nameservers on a domain with live email without first recreating the MX records at the new DNS host.",
        "Panicking mid-propagation. Seeing the old site for a few hours usually means caching, not a mistake. Check a propagation tool before changing anything again.",
      ],
      paragraphs: [
        "If you get stuck, this is a five-minute fix for someone who does it daily. ShrotiHost support handles domain pointing as part of [free migration](/hosting), and you can [reach the team](/contact) with your registrar details if DNS refuses to cooperate.",
      ],
    },
  ],
  faq: [
    {
      q: "Do I have to move my domain to my hosting company?",
      a: "No. Pointing a domain and transferring a domain are different things. Pointing just aims DNS at your server and works fine with the domain registered anywhere. Transfer only if you want billing and management in one place; keeping them separate is completely normal.",
    },
    {
      q: "Will changing nameservers break my email?",
      a: "It can, and it is the most common casualty. Nameservers carry all records, including MX, so the new DNS host must have your email records recreated before the switch. If your domain runs live email, either recreate every record first or use the A-record method and leave nameservers alone.",
    },
    {
      q: "Why does the site work on my phone but not my laptop, or for me but not a friend?",
      a: "Caching. Different networks refresh DNS at different times during propagation, so two devices can briefly see two different answers. It resolves itself, usually within hours and at most within about 48. A propagation checker shows you the true state worldwide.",
    },
    {
      q: "Can I use Cloudflare with either method?",
      a: "Yes. With Cloudflare, its nameservers hold your DNS, and inside Cloudflare you point A records at your hosting IP, which is method 2 with an extra layer of caching and protection in front. ShrotiHost already runs Cloudflare in front of its shared platform, so either setup works.",
    },
  ],
  cta: {
    label: "Get fast Indian hosting",
    href: "/hosting",
    blurb:
      "NVMe shared hosting with free SSL, daily backups, and free migration from ₹39/mo. Point your domain and our team will help if DNS misbehaves.",
  },
  related: ["dns-records-explained", "how-to-host-a-website-in-india", "how-to-transfer-a-domain"],
};
