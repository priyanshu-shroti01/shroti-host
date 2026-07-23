"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, X } from "lucide-react";

const DISMISS_KEY = "announcement-student-program-dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) !== "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center gap-2 bg-brand-purple px-4 py-2.5 text-center text-sm font-medium text-white">
      <GraduationCap size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />
      <Link href="/student" className="underline-offset-2 hover:underline">
        Student? Get dedicated pricing and a free launch subdomain with the Student Program.
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          sessionStorage.setItem(DISMISS_KEY, "1");
          setVisible(false);
        }}
        className="absolute right-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
