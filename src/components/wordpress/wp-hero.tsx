import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { WpInstallDemo } from "./wp-install-demo";

export function WpHero() {
  return (
    <div className="relative overflow-hidden">
      <HeroAtmosphere />
      <Container className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Badge>WordPress Hosting</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            WordPress, tuned to run fast.
          </h1>
          <p className="mt-4 max-w-md text-lg text-text-secondary">
            One-click install, LiteSpeed Cache, and AccelerateWP — built specifically for
            WordPress, not bolted onto generic hosting.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#compare" size="lg">
              Choose a plan
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="https://portal.shrotihost.in/submitticket.php" variant="secondary" size="lg">
              Migrate my site free
            </Button>
          </div>
        </Reveal>
        {/* The install demo is the dominant visual — tilt makes it a physical
            object in the hero space, same treatment as the homepage deploy card. */}
        <Reveal delay={0.1}>
          <Tilt3D maxTilt={3.5}>
            <WpInstallDemo />
          </Tilt3D>
        </Reveal>
      </Container>
    </div>
  );
}
