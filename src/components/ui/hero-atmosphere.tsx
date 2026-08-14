/**
 * The shared hero atmosphere: brand glow from above + the foreshortened
 * grid floor below (the site's grid-texture motif carried into perspective).
 * Static texture, not motion — extracted from the homepage hero so every
 * hero shares one implementation.
 *
 * The host element must be `relative` and `overflow-hidden`: the floor
 * plane extends past the bottom edge and relies on the container to clip.
 */
export function HeroAtmosphere() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-30 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{ perspective: "600px" }}
      >
        <div
          className="absolute -inset-x-[20%] -bottom-[60%] -top-[40%]"
          style={{
            transform: "rotateX(62deg)",
            backgroundImage:
              "linear-gradient(to right, var(--color-border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-strong) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>
    </>
  );
}
