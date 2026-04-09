import type { MethodArticle } from "@/lib/methods/types";

export const icfEn: MethodArticle = {
  slug: "icf",
  title: "ICF Construction",
  subtitle:
    "Insulated concrete wall systems that combine fast execution with excellent thermal and acoustic performance.",
  heroImage: {
    index: 1,
    alt: "ICF insulated concrete forms being installed on construction site",
  },
  intro:
    "Insulated Concrete Forms (ICF) are an evolution of modern concrete construction. They unite structural concrete and continuous insulation in one system, creating a building envelope that is durable, energy efficient and fast to assemble. At Longhorn, we work with the Sismo system, an advanced industrial panel solution within the ICF family. Learn more about the technology at sismo-technology.com.",
  sections: [
    {
      id: "how-it-works",
      heading: "How It Works",
      body: [
        "ICF construction uses insulated elements that remain in place after concrete is poured. In the Sismo system, these elements are industrially manufactured panels made from high precision frames. The panels define the shape of the walls, hold reinforcement and create the insulation layer.",
        "After installation, the panels are filled with reinforced concrete, forming a monolithic structure. This creates a wall that has strength, insulation and stability in one continuous element.",
        "Our team handles all stages of the process. We assemble the panels, install reinforcement, coordinate concrete placement and connect the system with the foundation and roof structure to ensure a high performance and seamless building shell.",
      ],
    },
    {
      id: "advantages",
      heading: "Key Advantages",
      body: [
        "Energy efficiency is one of the strongest benefits. Continuous insulation and the thermal mass of concrete help maintain stable indoor temperatures throughout the year, reducing heating and cooling needs.",
        "Construction speed is another important advantage. Sismo panels are light, fast to position and do not require a separate insulation step. This allows earlier progress on site and quicker project completion.",
        "ICF and Sismo structures perform well in demanding conditions. They offer strong resistance to fire, wind, earthquakes and sound transmission. This makes them ideal for the Algarve, where coastal weather and temperature variations are constant factors.",
      ],
    },
    {
      id: "best-for",
      heading: "Best For",
      body: [
        "ICF is ideal for homeowners and developers who want comfort, energy savings and long lasting stability. It is well suited to the Portuguese climate, where excellent thermal performance is an important priority.",
        "It is also an excellent choice for homes near busy roads or coastal areas where soundproofing, durability and resistance to weather are important.",
      ],
    },
  ],
  benefits: [
    "High thermal and acoustic performance",
    "Faster construction compared to traditional masonry",
    "Reduced energy costs due to insulated envelope",
    "Strong resistance to fire, wind and seismic forces",
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

