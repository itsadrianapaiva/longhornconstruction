import type { MethodArticle } from "@/lib/methods/types";

export const icfEn: MethodArticle = {
  slug: "icf",
  title: "ICF Construction",
  subtitle:
    "Insulated concrete wall systems that combine speed of execution with excellent thermal and acoustic performance.",
  heroImage: {
    index: 1,
    alt: "ICF insulated concrete forms being installed on construction site",
  },
  intro:
    "Insulated Concrete Forms (ICF) represent a modern evolution in concrete construction. By combining structural concrete with integrated insulation, ICF systems deliver superior energy efficiency, speed of construction, and long-term durability in a single building envelope.",
  sections: [
    {
      id: "how-it-works",
      heading: "How It Works",
      body: [
        "ICF construction uses modular foam forms that stay in place after concrete is poured, creating a permanent insulated sandwich wall. The foam panels interlock like building blocks, forming the exact shape of your walls. Steel reinforcement is placed inside, then concrete is poured to create a monolithic structure.",
        "This system combines the structural strength of reinforced concrete with continuous insulation on both sides of the wall. The result is a building envelope that eliminates thermal bridges, reduces air infiltration, and provides exceptional soundproofing.",
        "Our team has extensive experience with ICF installation. We handle formwork assembly, concrete placement, and integration with foundations and roof systems to ensure a seamless, high-performance building shell.",
      ],
    },
    {
      id: "advantages",
      heading: "Key Advantages",
      body: [
        "ICF construction dramatically reduces energy costs. The continuous insulation and thermal mass of concrete work together to maintain stable interior temperatures year-round, cutting heating and cooling demands by up to 50% compared to traditional methods.",
        "Construction speed is another major benefit. ICF walls can be erected and poured faster than traditional masonry, and the integrated insulation eliminates a separate insulation installation step. This compressed schedule means earlier project completion and faster return on investment.",
        "ICF structures also excel in extreme conditions. They offer superior resistance to fire, earthquakes, hurricanes, and sound transmission—making them ideal for coastal locations like the Algarve where wind, salt air, and temperature swings are common challenges.",
      ],
    },
    {
      id: "best-for",
      heading: "Best For",
      body: [
        "ICF is perfect for energy-conscious homeowners and developers seeking sustainable, low-maintenance buildings. It's especially valuable in Portugal's climate, where hot summers and cool winters make thermal performance a top priority.",
        "If your project emphasizes comfort, energy efficiency, and speed of construction, ICF delivers on all fronts. It's also an excellent choice for buildings near busy roads or coastal areas where soundproofing and weather resistance are essential.",
      ],
    },
  ],
  benefits: [
    "Superior thermal and acoustic insulation performance",
    "Faster construction compared to traditional methods",
    "Reduced energy costs (up to 50% savings on heating/cooling)",
    "Exceptional resistance to fire, wind, and seismic forces",
  ],
  related: ["traditional", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "ICF wall construction with steel reinforcement" },
      { index: 3, alt: "Completed ICF insulated concrete wall system" },
    ],
  },
};
