import type { MethodArticle } from "@/lib/methods/types";

export const traditionalEn: MethodArticle = {
  slug: "traditional",
  title: "Traditional Construction",
  subtitle:
    "Reinforced concrete and masonry combined with the character and authenticity of Portuguese architecture.",
  heroImage: {
    index: 1,
    alt: "Traditional Portuguese architecture with concrete and masonry",
  },
  intro:
    "Traditional construction in Portugal is more than concrete and masonry. It is a method that preserves the architectural identity of the region, from whitewashed walls and natural stone details to roof tiles, arches and classic proportions. At Longhorn Construction, we combine proven structural techniques with a deep respect for Portuguese style to build homes that feel authentic, solid and timeless.",
  sections: [
    {
      id: "how-it-works",
      heading: "How It Works",
      body: [
        "Traditional construction begins with reinforced concrete foundations and structural frames. Masonry walls using concrete blocks, brick or natural stone are introduced to define the shape and character of the building. These methods have been used and refined in Portugal for decades, creating a reliable and familiar construction process.",
        "What sets Longhorn apart is our attention to traditional Portuguese architecture. We integrate elements such as curved walls, exterior plaster textures, wooden details, terracotta roof tiles and the proportions that define the Algarve and southern Portugal.",
        "Our in-house team manages every stage, from excavation to finishing. By using our own machinery and coordinated crews, we ensure quality, consistency and full alignment with both structural standards and architectural authenticity.",
      ],
    },
    {
      id: "advantages",
      heading: "Key Advantages",
      body: [
        "Traditional construction offers long-lasting durability. Concrete and masonry structures age well, require low maintenance and create a stable, comfortable indoor environment thanks to their thermal mass.",
        "It is also the most flexible method for achieving authentic Portuguese architectural details. Whether your project includes arches, stonework, vaulted ceilings or classic exterior forms, traditional construction handles complexity with ease.",
        "Because this method is deeply rooted in Portuguese building culture, it aligns naturally with local regulations, craftsmanship and future maintenance needs. Any renovation or expansion remains simple and compatible with regional standards.",
      ],
    },
    {
      id: "best-for",
      heading: "Best For",
      body: [
        "Traditional construction is ideal for clients who want a home that respects the architectural identity of Portugal while benefiting from modern engineering and quality control.",
        "It is a strong choice for villas, rural properties, holiday homes and any project that requires a timeless aesthetic, complex shapes or authentic Algarve details.",
      ],
    },
  ],
  benefits: [
    "Durable concrete and masonry structure with long lifespan",
    "Authentic Portuguese architectural details and finishes",
    "Excellent fire resistance and natural thermal mass",
    "Flexible design and easy future modifications",
  ],
  related: ["icf", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Reinforced concrete framework in traditional construction" },
      { index: 3, alt: "Traditional Portuguese masonry with regional finishes" },
    ],
  },
};

