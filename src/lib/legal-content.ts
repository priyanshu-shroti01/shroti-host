/**
 * The four legal documents as markdown-lite strings (## headings, - lists,
 * **bold**), rendered by components/legal/legal-document.tsx. Drafted
 * in-house for an Indian hosting business — plain language; the legal entity,
 * address and Udyam number come from the owner's Udyam certificate; contact
 * points are the real support email, WhatsApp, and WHMCS portal.
 */

export type LegalDoc = {
  title: string;
  intro?: string;
  body: string;
};

export const termsOfService: LegalDoc = {
  title: "Terms of Service",
  body: `
## 1. Acceptance of These Terms
These Terms of Service ("Terms") are an agreement between you and ShrotiHost, a brand of Shroti Enterprises, a micro enterprise registered under India's MSME Udyam scheme (Udyam Registration UDYAM-UP-36-0017127) with its office at Ruheri, Hathras, Uttar Pradesh 204101, India ("we", "us"). By creating an account at portal.shrotihost.in or purchasing any service, you agree to these Terms, our Acceptable Use Policy, Privacy Policy, and Refund Policy. If you do not agree, please do not use our services.

## 2. What We Provide
ShrotiHost has provided web hosting to customers since 2023. Our services include shared hosting, WordPress hosting, unlimited hosting, reseller hosting, master reseller hosting, alpha reseller hosting, and domain name registration. Exact features and pricing are listed on each plan page and confirmed in your order.

## 3. Account Registration
You must provide accurate, current contact and billing information when registering, and keep it up to date — we use it to deliver your service, send invoices, and reach you about problems. You are responsible for keeping your account credentials secure and for all activity under your account. You must be at least 18 years old, or use the service under the supervision of a parent or guardian who accepts these Terms.

## 4. Payment & Billing
All billing is handled through our client portal at portal.shrotihost.in. Invoices are generated before the due date and payable by the payment methods shown at checkout. Services are billed in advance for the term you select. If an invoice remains unpaid after its due date, the service may be suspended, and continued non-payment may lead to termination and deletion of data after reasonable notice. Chargebacks or payment reversals raised without contacting us first may result in immediate suspension.

## 5. Service Delivery & Activation
Most hosting orders are activated automatically once payment is confirmed — typically within minutes. Some orders may be held briefly for a manual fraud or verification review; if we cannot verify an order, we will cancel it and refund any payment received. Domain registrations are submitted to the registry after payment and are usually active shortly afterwards.

## 6. Fair Use on Unmetered Resources
Where a plan is described as "unlimited" or "unmetered", this means we do not bill you per unit of bandwidth or storage — it does not mean infinite resources on shared infrastructure. Resources must be used for normal website hosting. Accounts that consistently consume resources at a level that degrades the service for other customers (for example, using a hosting account primarily for file storage, backups, or streaming) may be asked to reduce usage, upgrade, or move to a suitable plan. We will contact you before taking action except in urgent cases.

## 7. Your Responsibilities
You are responsible for the content you host, for keeping your applications (including WordPress core, themes, and plugins) updated, and for maintaining your own off-server backups of important data. Resellers are responsible for their own clients' compliance with these Terms.

## 8. Service Availability
We aim to keep services online and stable, and we perform maintenance with advance notice where possible. However, no host can guarantee uninterrupted service, and we do not promise a specific uptime percentage unless stated in your plan.

## 9. Suspension & Termination
We may suspend or terminate a service for non-payment, violation of these Terms or the Acceptable Use Policy, a legal requirement, or a security threat to our network. Where practical, we will warn you first and give you a chance to fix the issue. You may cancel any service from the client portal at any time; cancellation takes effect per the request type you choose (immediate or end of billing period).

## 10. Limitation of Liability
Services are provided "as is". To the maximum extent permitted by law, ShrotiHost is not liable for indirect or consequential losses, including lost profits, lost data, or business interruption. Our total liability for any claim is limited to the amount you paid us for the affected service in the three months before the claim arose.

## 11. Governing Law
These Terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the competent courts in India.

## 12. Changes to These Terms
We may update these Terms from time to time. Significant changes will be announced by email or through the client portal, and continued use of the service after a change means you accept the updated Terms.

## 13. Contact
Questions about these Terms: email support@shrotihost.in, WhatsApp +91 95821 29099, or open a ticket at portal.shrotihost.in.

Last updated: August 2026
`,
};

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  body: `
## 1. Overview
This policy explains what personal data ShrotiHost (a brand of Shroti Enterprises, Ruheri, Hathras, Uttar Pradesh 204101, India — Udyam Registration UDYAM-UP-36-0017127) collects, why we collect it, and the choices you have. We keep it simple: we collect what we need to run your hosting services and nothing more, and we never sell your data. We handle personal data in line with India's Digital Personal Data Protection Act, 2023 (DPDP Act).

## 2. Information We Collect
- **Account and billing data** — name, email address, phone number, billing address, and order/invoice history, collected through our WHMCS client portal at portal.shrotihost.in when you register or purchase. Card and payment details are processed by our payment providers; we do not store full card numbers.
- **Support conversations** — tickets, emails, and WhatsApp messages you send us, kept so we can resolve issues and see history when you contact us again.
- **Technical and analytics data** — IP addresses, browser type, and pages visited on our website, plus standard server logs on hosting infrastructure. We use this for security, debugging, and understanding how the site is used.
- **Domain registration data** — the registrant contact details required by domain registries when you register a domain through us.

## 3. How We Use Information
We use your data to provision and operate your services, process payments and send invoices, respond to support requests, notify you about renewals, maintenance, or security issues, prevent fraud and abuse, and improve our website and services. We may send occasional offers about our own services; you can opt out of marketing messages at any time without affecting service emails.

## 4. Data Sharing — We Do Not Sell Your Data
We never sell or rent personal data. We share it only with parties needed to deliver your service: payment processors (to take payment), domain registrars and registries (to register your domains), infrastructure providers (where servers are hosted), and government or law-enforcement authorities when legally required. Each provider receives only what it needs.

## 5. Cookies
Our website and client portal use cookies to keep you logged in and remember preferences such as theme and display currency. We also use Google Analytics 4 to measure site usage; it is configured for cross-domain measurement between shrotihost.in and portal.shrotihost.in, so a visit that moves from the website to the portal is counted once. Analytics data is used in aggregate to understand which pages are useful, never to identify you or to sell to anyone. You can block or delete cookies in your browser or use a content blocker, and you can switch analytics off for this browser with the control at the end of this section; the portal may not work correctly without essential cookies.

## 6. Data Security
We protect data with encrypted connections (HTTPS), access controls limiting who on our team can view customer data, and standard server hardening. No system is perfectly secure, but if we become aware of a breach affecting your personal data, we will notify you and the relevant authorities as required by law.

## 7. Your Rights
Under the DPDP Act 2023 you have the right to access a summary of the personal data we hold about you, correct or update inaccurate data, request erasure of data we no longer need to retain, nominate a person to exercise your rights on your behalf, and raise a grievance about how your data is handled. To exercise any of these rights, email support@shrotihost.in or open a ticket at portal.shrotihost.in. We respond to requests within a reasonable time, and you may escalate unresolved grievances to the Data Protection Board of India.

## 8. Data Retention
We keep account and billing records while your account is active and afterwards as required for tax and legal purposes. Server logs are rotated on a short cycle. Support conversations are retained so we can reference past issues. Job applications and project enquiries submitted through this website are kept for 12 months after submission and then deleted; you can ask for earlier deletion at any time by emailing support@shrotihost.in. When data is no longer needed, it is deleted or anonymised.

## 9. Children
Our services are not directed at children, and we do not knowingly collect personal data from anyone under 18 without verifiable parental consent.

## 10. Changes to This Policy
We may update this policy as our services or the law change. Material changes will be announced by email or via the client portal.

## 11. Contact for Privacy Requests
Email support@shrotihost.in (subject line "Privacy request"), message us on WhatsApp at +91 95821 29099, or open a ticket at portal.shrotihost.in.

Last updated: August 2026
`,
};

export const refundPolicy: LegalDoc = {
  title: "Refund Policy",
  body: `
## 1. Our 7-Day Money-Back Guarantee
We want you to try ShrotiHost with confidence. If you are not satisfied with a hosting plan, you can request a full refund within 7 days of your first purchase — no lengthy justification needed. This guarantee applies to the **first purchase** of any of the following plan families: shared hosting, WordPress hosting, unlimited hosting, reseller hosting, master reseller hosting, and alpha reseller hosting.

## 2. Eligibility
To qualify for the money-back guarantee:
- The refund request must reach us within 7 days of the original order date.
- It must be your first purchase of that service with ShrotiHost — the guarantee applies once per customer, not once per order.
- Your account must be in good standing, with no violation of our Terms of Service or Acceptable Use Policy.

## 3. Non-Refundable Items
- **Domain registrations, renewals, and transfers.** Domains are registered with the registry immediately and cannot be "returned" — this is standard across the industry. If your order combined hosting and a domain, the hosting portion is refundable within the window; the domain fee is not, and the domain remains yours for its registered term.
- **Setup or installation fees**, where charged.
- **Renewal payments.** Renewals of existing services are not covered by the guarantee. If you do not wish to renew, cancel before the renewal invoice is due — you can do this any time from the client portal.
- **Payments already consumed by a chargeback or payment dispute.**

## 4. Purchases Made with Promo Codes
If you purchased with a discount or promo code, any refund is issued for the amount you actually paid, not the plan's list price.

## 5. When the Guarantee Is Void
Refunds will not be issued where the account was suspended or terminated for violating our Terms of Service or Acceptable Use Policy (for example, spam, phishing, or resource abuse), or where the guarantee is being used repeatedly to obtain free service.

## 6. How to Request a Refund
Open a support ticket from your client area at portal.shrotihost.in, choosing the billing department, and tell us the service and order you'd like refunded. Feedback on why you're leaving is appreciated — it helps us improve — but it is not a condition of the refund. If you have trouble accessing the portal, email support@shrotihost.in or message us on WhatsApp at +91 95821 29099 and we'll help.

## 7. Processing Time
Approved refunds are processed within 5–7 working days to the original payment method. Depending on your bank or payment provider, it may take a few additional days for the amount to appear in your account. Where the original payment method cannot receive a refund, we will arrange an alternative with you.

## 8. Cancellation vs. Refund
Cancelling a service stops future billing but does not by itself trigger a refund. If you are within the 7-day window and want your money back, make sure your ticket clearly requests a refund, not just a cancellation.

## 9. Contact
Questions about this policy: support@shrotihost.in, WhatsApp +91 95821 29099, or a ticket at portal.shrotihost.in.

Last updated: August 2026
`,
};

export const acceptableUsePolicy: LegalDoc = {
  title: "Acceptable Use Policy",
  body: `
## 1. Purpose
This policy describes what may and may not be hosted on ShrotiHost's network. It exists to keep the platform fast, secure, and lawful for every customer sharing our infrastructure. It applies to all services — shared, WordPress, unlimited, and all reseller tiers — and resellers are responsible for ensuring their own clients comply.

## 2. Prohibited Content
You may not host or link to:
- Content that is illegal under Indian law, including child sexual abuse material, content promoting terrorism or violence, and material that violates the IT Act, 2000.
- Pirated software, cracked licenses, warez, or copyrighted media distributed without permission.
- Content that facilitates fraud, including fake shops, counterfeit-goods stores, and investment scams.
- Gambling or betting content where prohibited by applicable law.

## 3. Spam & Email Limits
Sending unsolicited bulk email from our network, or advertising a site hosted with us via spam sent from anywhere, is prohibited. Mailing lists must be opt-in with working unsubscribe links. Hourly outbound email limits apply per account to protect our server IP reputation; if you need to send genuine high-volume mail (newsletters, transactional email), use a dedicated email service rather than the hosting server.

## 4. Malware, Phishing & Security Abuse
You may not host malware, viruses, phishing pages, credential-harvesting forms, botnet command-and-control, or tools designed to attack other systems. Compromised accounts (for example, a hacked WordPress site distributing malware) will be suspended to protect other users — we will notify you and help you understand what needs cleaning before reactivation.

## 5. Resource Abuse
Shared infrastructure works because everyone uses it reasonably. The following are not permitted on any plan, including "unlimited" plans:
- Cryptocurrency mining or similar sustained CPU-intensive computation.
- Running open proxies, VPN endpoints, Tor exit nodes, or IRC servers/bots.
- Using hosting accounts primarily as file storage, backup dumps, or media streaming origins rather than for websites.
- Scripts that hold long-running processes, flood networks, or deliberately circumvent resource limits.

## 6. Your Security Responsibilities
Keep your CMS, plugins, and themes updated; use strong, unique passwords; and remove unused installations. Accounts repeatedly compromised through neglected software may be suspended until secured.

## 7. Copyright Complaints & Takedowns
If you believe content hosted on our network infringes your copyright, email support@shrotihost.in with: (a) identification of the copyrighted work, (b) the exact URL of the infringing material, (c) your contact details, and (d) a good-faith statement that the use is unauthorised. We review complaints promptly, notify the account holder, and remove or disable access to infringing material where the complaint is valid. Knowingly false complaints may carry legal consequences for the complainant.

## 8. Reporting Other Violations
To report spam, phishing, malware, or any other abuse originating from our network, contact support@shrotihost.in or WhatsApp +91 95821 29099 with the relevant URLs, headers, or logs. Reports are treated confidentially.

## 9. Enforcement
Depending on severity, we may: issue a warning with time to remedy, suspend the offending site or account, or terminate service immediately for severe violations (such as CSAM, phishing, or active attacks) — in which case no refund is due, per our Refund Policy. Where required, we cooperate with Indian law enforcement. We aim to be proportionate: honest customers with a hacked site get help; deliberate abusers get removed.

## 10. Contact
Questions about this policy: support@shrotihost.in, WhatsApp +91 95821 29099, or a ticket at portal.shrotihost.in.

Last updated: August 2026
`,
};
