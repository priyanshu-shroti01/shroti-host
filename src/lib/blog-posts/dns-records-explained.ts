import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "dns-records-explained",
  title: "DNS Records Explained: A, AAAA, CNAME, MX, and TXT in Plain English",
  description:
    "A plain-English reference to the five DNS records you will actually touch, with real example values and steps for pointing, verifying, and email setup.",
  date: "2026-08-19",
  readMinutes: 7,
  category: "Domains",
  tags: ["dns", "tutorials"],
  sections: [
    {
      paragraphs: [
        "DNS is the internet's phone book. When someone types your domain, their browser asks DNS \"what is the address for this name?\" and DNS answers with records you control. Every record is just a small instruction: this name points to this server, mail for this domain goes here, this text proves I own the domain.",
        "You only ever need a handful of record types in practice: A, AAAA, CNAME, MX, and TXT cover almost everything a website owner does. This guide explains each one with real example values, then walks through the three tasks that bring people to their DNS panel in the first place: pointing a domain at hosting, verifying ownership for a service, and setting up email.",
      ],
    },
    {
      heading: "How a DNS lookup works, in ten seconds",
      paragraphs: [
        "Your domain's registrar stores which nameservers are authoritative for it. Those nameservers hold your records. When a visitor loads your site, their device asks a resolver, the resolver asks your nameservers, and the answer gets cached for a period called the TTL (time to live). That caching is why DNS changes take time to show up everywhere: old answers live on until they expire.",
      ],
    },
    {
      heading: "A record: name to IPv4 address",
      paragraphs: [
        "The A record is the workhorse. It maps a name to an IPv4 address, the four-number kind. When you point a domain at a server, this is usually the record you set.",
        "Example: an A record for example.in with the value 203.0.113.10 means \"send visitors of example.in to the server at 203.0.113.10\". You can create A records for the bare domain (often shown as @ in DNS panels) and for subdomains like shop.example.in, each pointing wherever you like.",
      ],
    },
    {
      heading: "AAAA record: name to IPv6 address",
      paragraphs: [
        "The AAAA record is the same idea for IPv6, the newer, longer address format. Example: example.in AAAA 2001:db8::1. If your host gives you both an IPv4 and an IPv6 address, set both records; devices on IPv6 networks, which includes a large share of Indian mobile connections, will use the AAAA answer directly.",
        "If you only have an IPv4 address, that is fine. Networks fall back to IPv4 automatically, so a missing AAAA record never breaks your site.",
      ],
    },
    {
      heading: "CNAME record: name to another name",
      paragraphs: [
        "A CNAME is an alias. Instead of pointing at an IP address, it points one name at another name, and the lookup continues from there. Example: www.example.in CNAME example.in means \"www is whatever the bare domain is\". Change the A record once and both names follow.",
        "CNAMEs also connect subdomains to external platforms: shop.example.in CNAME shops.myplatform.example follows whatever address the platform publishes, so their infrastructure changes never involve you. One rule to remember: the bare domain itself cannot be a CNAME on standard DNS, because the root of a zone must carry other records too. Point the bare domain with an A record and alias www to it.",
      ],
    },
    {
      heading: "MX record: where your email goes",
      paragraphs: [
        "MX records tell the world which servers accept mail for your domain. Each has a priority number, and lower numbers are tried first. Example: example.in MX 10 mail.example.in, with a backup like MX 20 mail2.example.in. The value must be a name, never a bare IP address.",
        "This separation is the quietly useful part of DNS: your website and your email are independent records, so you can host the site with one company and email with another, or move one without touching the other. If mail suddenly stops arriving after a DNS change, MX records are the first thing to check.",
      ],
    },
    {
      heading: "TXT record: free-form text with jobs",
      paragraphs: [
        "TXT records hold plain text, and two jobs dominate. The first is verification: services like Google Search Console ask you to add a TXT record such as google-site-verification=abc123xyz to prove you control the domain. Anyone can claim a domain in a form; only the real owner can publish a record on it.",
        "The second is email authentication. An SPF record like v=spf1 include:_spf.example.com ~all lists which servers may send mail as your domain, and DKIM and DMARC records build on the same idea. Without them, your legitimate email is far more likely to land in spam folders, so set the values your email provider gives you and keep them.",
      ],
    },
    {
      heading: "Task: point your domain at your hosting",
      ordered: true,
      list: [
        "Find your server's IP address in your hosting welcome email or cPanel. With [ShrotiHost hosting](/hosting) it is in your welcome email.",
        "In your domain's DNS panel, create or edit the A record for @ to that IP address.",
        "Create a record for www: either a CNAME to the bare domain or an A record to the same IP.",
        "Wait for the TTL to expire, then load the site. Free SSL via Let's Encrypt issues automatically once the domain resolves to the server.",
      ],
      paragraphs: [
        "The alternative is changing nameservers at your registrar to your host's nameservers, which hands the whole zone to the host and preconfigures everything. It is simpler, but remember it replaces all your existing records, so note down any custom MX or TXT entries first. The [full walkthrough](/blog/how-to-point-domain-to-hosting) covers both routes.",
      ],
    },
    {
      heading: "Task: verify ownership and set up email",
      ordered: true,
      list: [
        "Copy the exact TXT value the service gives you, including any prefix like google-site-verification=.",
        "Add it as a TXT record on @ (or the subdomain the service specifies) and save.",
        "Return to the service and click verify. If it fails, wait for propagation and retry rather than re-adding the record.",
        "For email, add the MX records your mail provider lists, with their exact priorities, then add the SPF and DKIM TXT records they supply.",
        "Send a test message both directions and check the headers show SPF and DKIM passing.",
      ],
    },
    {
      heading: "TTL and propagation, demystified",
      paragraphs: [
        "Every record has a TTL in seconds that tells resolvers how long to cache the answer. A TTL of 3600 means changes can take up to an hour to reach everyone; 86400 means up to a day. The practical trick: before a planned change like a server move, lower the TTL to 300 a day in advance, make the change, confirm everything works, then raise it back.",
        "\"Propagation\" is not DNS pushing updates around the world. It is simply old cached answers expiring at different times in different places, which is why a friend may see your new site while you still see the old one. Registering your domain where you can edit records easily makes all of this painless; [ShrotiHost domains](/domains) include a full DNS manager, and if you get stuck our team will [set records with you](/contact).",
      ],
    },
  ],
  faq: [
    {
      q: "What is the difference between an A record and a CNAME?",
      a: "An A record points a name at an IP address and ends the lookup. A CNAME points a name at another name, and the lookup continues from that name. Use A records when you know the IP, and CNAMEs when you want a name to follow another name automatically.",
    },
    {
      q: "How long do DNS changes take to work?",
      a: "Up to the TTL of the record you changed, commonly one to twenty-four hours. The change is instant at your nameservers; the wait is old cached answers expiring elsewhere. Lowering the TTL before a planned change shrinks the window to minutes.",
    },
    {
      q: "Can a domain have multiple A records?",
      a: "Yes. Multiple A records on the same name make resolvers rotate between the addresses, a crude form of load balancing. Multiple MX records with different priorities are also normal. What you cannot do is put a CNAME alongside other records on the same name.",
    },
    {
      q: "Where do I actually edit my DNS records?",
      a: "Wherever your nameservers point. If your domain uses your registrar's nameservers, edit records in the registrar's DNS panel. If you switched nameservers to your hosting company, edit them in the hosting panel, such as cPanel's Zone Editor.",
    },
    {
      q: "Will changing my A record break my email?",
      a: "No, as long as your MX records stay untouched. Website and email are separate records, which is exactly why you can move hosting without moving email. Only nameserver changes risk both, because they replace the entire set of records at once.",
    },
  ],
  cta: {
    label: "Get a domain with full DNS control",
    href: "/domains",
    blurb: "Every ShrotiHost domain includes a complete DNS manager for A, AAAA, CNAME, MX, and TXT records, with help a message away.",
  },
  related: ["com-vs-in-domain", "how-to-point-domain-to-hosting", "how-to-host-a-website-in-india"],
};
