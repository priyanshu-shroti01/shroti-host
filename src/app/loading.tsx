import { LogoLoader } from "@/components/ui/logo-loader";

/** Route-transition fallback — shown only while a navigation is pending. */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LogoLoader variant="packet" />
    </div>
  );
}
