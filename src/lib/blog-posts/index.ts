import type { BlogPost } from "@/lib/blog";
import { post as comVsInDomain } from "@/lib/blog-posts/com-vs-in-domain";
import { post as customWebsiteVsWebsiteBuilder } from "@/lib/blog-posts/custom-website-vs-website-builder";
import { post as dnsRecordsExplained } from "@/lib/blog-posts/dns-records-explained";
import { post as howToBuildAnMvp } from "@/lib/blog-posts/how-to-build-an-mvp";
import { post as howToChooseWebHosting } from "@/lib/blog-posts/how-to-choose-web-hosting";
import { post as howToPointDomainToHosting } from "@/lib/blog-posts/how-to-point-domain-to-hosting";
import { post as howToTransferADomain } from "@/lib/blog-posts/how-to-transfer-a-domain";
import { post as mobileAppVsWebApp } from "@/lib/blog-posts/mobile-app-vs-web-app";
import { post as vpsVsSharedHosting } from "@/lib/blog-posts/vps-vs-shared-hosting";
import { post as websiteDevelopmentChecklist } from "@/lib/blog-posts/website-development-checklist";
import { post as websiteDevelopmentCostInIndia } from "@/lib/blog-posts/website-development-cost-in-india";
import { post as websiteHostingCostInIndia } from "@/lib/blog-posts/website-hosting-cost-in-india";
import { post as whatIsAVps } from "@/lib/blog-posts/what-is-a-vps";
import { post as whatIsLitespeedHosting } from "@/lib/blog-posts/what-is-litespeed-hosting";
import { post as whenToUpgradeToVps } from "@/lib/blog-posts/when-to-upgrade-to-vps";

/**
 * Individually-authored posts, one file each (the launch content library).
 * Rebuilt by hand when posts are added — keep imports alphabetical.
 */
export const libraryPosts: BlogPost[] = [
  comVsInDomain,
  customWebsiteVsWebsiteBuilder,
  dnsRecordsExplained,
  howToBuildAnMvp,
  howToChooseWebHosting,
  howToPointDomainToHosting,
  howToTransferADomain,
  mobileAppVsWebApp,
  vpsVsSharedHosting,
  websiteDevelopmentChecklist,
  websiteDevelopmentCostInIndia,
  websiteHostingCostInIndia,
  whatIsAVps,
  whatIsLitespeedHosting,
  whenToUpgradeToVps,
];
