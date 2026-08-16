import { redirect } from "next/navigation";

// /legal has no content of its own — the four documents live at
// /legal/terms, /legal/privacy, /legal/refund-policy, and /legal/aup.
// Terms is the canonical entry point for anyone who trims the URL.
export default function LegalIndex() {
  redirect("/legal/terms");
}
