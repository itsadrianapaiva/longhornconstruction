import type { MethodArticle } from "@/lib/methods/types";

export const traditionalEn: MethodArticle = {
  slug: "traditional",
  title: "Traditional Construction",
  subtitle:
    "Classic reinforced concrete and masonry structures, executed with strict control over quality, budget, and schedule.",
  heroImage: {
    index: 1,
    alt: "Traditional concrete and masonry construction in progress",
  },
  intro:
    "Traditional construction using reinforced concrete and masonry remains one of the most reliable and proven methods for building durable structures. At CEU Construction, we combine time-tested techniques with modern quality control and project management to deliver exceptional results.",
  sections: [
    {
      id: "how-it-works",
      heading: "How It Works",
      body: [
        "Traditional construction begins with reinforced concrete foundations and structural frames, followed by masonry walls using concrete blocks or brick. This method has been refined over decades and is well-understood by builders, engineers, and architects worldwide.",
        "Our in-house team handles every stage: from excavation and foundation work through structural framing, wall construction, and finishing. We use owned machinery and coordinated crews to maintain consistent quality and avoid delays caused by subcontractor dependencies.",
        "The result is a robust, long-lasting structure with excellent fire resistance, sound insulation, and thermal mass properties that help regulate interior temperatures naturally.",
      ],
    },
    {
      id: "advantages",
      heading: "Key Advantages",
      body: [
        "Traditional construction offers unmatched durability and longevity. Concrete and masonry structures can last for generations with minimal maintenance, making them an excellent long-term investment for homeowners and developers.",
        "This method is also highly versatile. It accommodates complex architectural designs, custom finishes, and modifications during construction. Local tradespeople are familiar with these techniques, which simplifies future repairs or renovations.",
        "From a regulatory perspective, traditional construction is universally accepted and well-documented in building codes across Portugal and Europe, ensuring straightforward permitting and inspections.",
      ],
    },
    {
      id: "best-for",
      heading: "Best For",
      body: [
        "Traditional construction is ideal for projects that prioritize durability, custom design flexibility, and alignment with local building practices. It works well for both residential villas and commercial buildings across the Algarve and Vicentine Coast.",
        "If your project requires complex shapes, vaulted ceilings, or integration with existing masonry structures, traditional methods provide the proven tools and techniques to achieve your vision with confidence.",
      ],
    },
  ],
  benefits: [
    "Proven durability with decades of performance history",
    "Excellent fire resistance and sound insulation",
    "Versatile design options and easy future modifications",
    "Universally accepted in building codes and regulations",
  ],
  related: ["icf", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Reinforced concrete framework construction" },
      { index: 3, alt: "Traditional masonry wall construction process" },
    ],
  },
};
