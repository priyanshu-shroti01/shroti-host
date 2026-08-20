import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "how-to-transfer-a-domain",
  title: "How to Transfer a Domain: Step by Step, Without Downtime",
  description:
    "Move your domain to a new registrar with zero downtime: unlock, EPP code, the 60-day rule, and the DNS trick that keeps your site and email running.",
  date: "2026-08-19",
  readMinutes: 6,
  category: "Domains",
  tags: ["domains", "migration"],
  sections: [
    {
      paragraphs: [
        "A domain transfer moves your domain from one registrar to another: the company you pay each year changes, your domain name does not. Done properly, your website and email keep running through the entire process, because a transfer does not touch your DNS records unless you let it.",
        "The whole thing takes about fifteen minutes of your time plus a waiting period of up to five to seven days, and most of the horror stories trace back to two avoidable mistakes: transferring too close to expiry, or letting DNS change mid-transfer. This guide walks the safe path in order, including the one preparation step that guarantees zero downtime.",
      ],
    },
    {
      heading: "What a transfer is (and what it is not)",
      paragraphs: [
        "Three separate things get mixed up in every transfer conversation. Your registrar is where the domain is registered and billed. Your DNS is the set of [records](/blog/dns-records-explained) that point the name at servers. Your hosting is where the website's files actually live. A domain transfer changes only the first one.",
        "That means a transfer is the wrong tool for some jobs. Want to move your website to a new host? Point your DNS at the new server; the domain can stay where it is, and [ShrotiHost migrates sites free](/hosting) anyway. Unhappy only with renewal prices or a clunky panel? That is exactly what a transfer fixes.",
      ],
    },
    {
      heading: "Know the 60-day rules before you start",
      paragraphs: [
        "Registries enforce a transfer lock for 60 days after a domain is first registered and after any previous transfer, so a brand-new or freshly moved domain has to wait out that window. Many registrars also apply a 60-day lock after you change the registrant's name or email, which surprises people who tidy up their contact details right before transferring. If you plan to update contacts, do it after the move.",
        "Timing matters at the other end of the calendar too. A transfer can take up to a week to complete, so do not start one in the final days before expiry. If expiry is close, renew at your current registrar first, then transfer calmly; for most common extensions the transfer adds a year of registration on top of the time you already have, so nothing is wasted.",
      ],
    },
    {
      heading: "The zero-downtime trick: settle DNS first",
      paragraphs: [
        "Downtime during transfers is almost always a DNS problem, not a transfer problem. Your site stays up as long as the nameservers answering for your domain keep answering. So before you begin, check where your DNS actually lives. If your nameservers belong to your hosting company or a third party, the transfer will not affect them at all and you can skip ahead.",
        "The risky case is when your DNS runs on the old registrar's own nameservers, because some registrars stop serving DNS once a domain leaves. The fix is simple: before initiating the transfer, recreate every record identically at your new provider or your host, switch nameservers, and confirm the site and email still work. With DNS settled and unchanged in content, the transfer itself becomes an invisible paperwork exercise. Take a screenshot of your full record list either way; it is the cheapest insurance in this whole process.",
      ],
    },
    {
      heading: "The transfer, step by step",
      ordered: true,
      list: [
        "Confirm eligibility: the domain is more than 60 days old, more than a couple of weeks from expiry, and your registrant email is one you can actually receive.",
        "Back up your DNS: export or screenshot every record, and settle nameservers as described above if they belong to the old registrar.",
        "Unlock the domain: in the old registrar's panel, turn off the transfer lock (sometimes labelled registrar lock or theft protection).",
        "Get the EPP code: request the authorization code, also called the auth or transfer code. Registrars must provide it, usually instantly in the panel or by email.",
        "Start the transfer at the new registrar: search the domain on the [transfer page](/domains), enter the EPP code, and pay. The fee typically includes a year's extension.",
        "Approve and wait: watch for confirmation emails at both registrars. Approving at the old registrar can complete the move in minutes; if you do nothing, it completes automatically within about five to seven days.",
        "Verify completion: check the new registrar shows the domain active, your site loads, and email arrives.",
      ],
    },
    {
      heading: "After the transfer: a five-minute checklist",
      list: [
        "Re-enable the transfer lock and turn on WHOIS privacy if you use it, since privacy settings do not always carry over",
        "Check the new expiry date and set auto-renew the way you want it",
        "Confirm your nameservers and records match your pre-transfer screenshot exactly",
        "Send yourself a test email and load the site over https to confirm SSL is untouched",
        "Update the payment method and contact email so renewal notices reach you",
      ],
    },
    {
      heading: "Common snags and how to clear them",
      paragraphs: [
        "Transfer rejected or EPP code invalid: codes can expire or get mistyped, so request a fresh one and paste it carefully. Domain still locked: some registrars take a few minutes to release the lock after you toggle it, so wait and retry. Approval email never arrives: it goes to the registrant contact on file, which is why step one checks that address; update it at the old registrar if it is stale, then allow for any resulting lock.",
        "And if the old registrar drags its feet, know your position: registrars are required to release a domain when the holder provides a valid authorization code, and deliberate obstruction is against the rules of every major registry. Persistence, a support ticket citing the transfer policy, and patience resolve nearly every case. If you are moving your domain to ShrotiHost and hit a wall, [contact us](/contact) and we will chase it with you.",
      ],
    },
    {
      heading: "Transferring .in domains",
      paragraphs: [
        "The process for .in is the same shape: unlock, get the authorization code, initiate at the new registrar, confirm. The .in registry runs its own policies, but the practical rules you care about match the gTLD experience closely, including locks on very new domains and completion within a few days. If you are still weighing which extension your business should live on long term, our [.com vs .in comparison](/blog/com-vs-in-domain) walks through it.",
      ],
    },
  ],
  faq: [
    {
      q: "Will my website go down during the transfer?",
      a: "Not if your DNS keeps working, and that is fully in your control. If your nameservers belong to your host or a third party, nothing changes. If they belong to the old registrar, move your records to new nameservers before starting, keep every value identical, and visitors will never notice.",
    },
    {
      q: "How long does a domain transfer take?",
      a: "Up to five to seven days if nobody acts, because the old registrar's approval window has to lapse. Explicitly approving the transfer at the old registrar usually completes it within minutes to hours. The waiting period exists as an anti-theft safeguard.",
    },
    {
      q: "Do I lose the time remaining on my registration?",
      a: "No. For common extensions the transfer adds a year on top of your existing expiry date, so transferring a domain with eight months left leaves you with a year and eight months. The transfer fee is effectively a renewal, not an extra charge.",
    },
    {
      q: "What happens to my email during a transfer?",
      a: "Nothing, as long as your MX records survive unchanged. Email follows DNS, not the registrar. Copy your records exactly if you change nameservers, and mail flows throughout. Only deleting or mistyping MX records interrupts it.",
    },
    {
      q: "Can I transfer a domain that expires this week?",
      a: "Do not risk it. Renew at your current registrar first, then transfer once the pressure is off. A transfer started days before expiry can complete after the domain lapses, and recovering an expired domain costs far more than one renewal.",
    },
  ],
  cta: {
    label: "Transfer your domain to ShrotiHost",
    href: "/domains",
    blurb: "Bring your domain to the same panel as your hosting: free DNS management, honest renewal pricing, and real humans if a transfer snags.",
  },
  related: ["dns-records-explained", "choosing-a-domain-name-india", "com-vs-in-domain"],
};
