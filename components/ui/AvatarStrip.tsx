// Server component: renders a decorative row of small circular avatars.
// Falls back to gradient circles if no images are available.

import Image from "next/image";

type AvatarStripProps = {
  count?: number;
};

export function AvatarStrip({ count = 7 }: AvatarStripProps) {
  // Generate avatar sources from /media/testimonials/
  const avatars = Array.from({ length: count }, (_, i) => ({
    src: `/media/testimonials/avatar${i + 1}.svg`,
    alt: "", // decorative
  }));

  return (
    <div
      className="flex items-center gap-1 mt-4"
      aria-hidden="true"
    >
      {avatars.map((avatar, idx) => (
        <div
          key={idx}
          className="relative w-7 h-7 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/20 bg-gradient-to-br from-slate-300 to-slate-400"
        >
          <Image
            src={avatar.src}
            alt={avatar.alt}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
