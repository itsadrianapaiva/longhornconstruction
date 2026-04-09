import type { MethodArticle } from "@/lib/methods/types";

export const lsfEn: MethodArticle = {
  slug: "lsf",
  title: "LSF Construction",
  subtitle:
    "Light steel framing for precise, fast and efficient construction with clean sites and predictable timelines.",
  heroImage: {
    index: 1,
    alt: "Light steel frame structure being assembled on site",
  },
  intro:
    "Light Steel Frame (LSF) construction brings industrial precision to residential and commercial buildings. Using cold formed steel profiles, the system creates a lightweight but strong structural skeleton that allows fast assembly, clean work and consistent results. At Longhorn Construction we follow North American LSF standards and adapt them to Portuguese conditions and the Algarve climate.",
  sections: [
    {
      id: "how-it-works",
      heading: "How It Works",
      body: [
        "LSF construction uses galvanized steel profiles that are manufactured to exact measurements in controlled factory environments. These profiles arrive on site ready for rapid assembly with minimal cutting or adjustments.",
        "Once placed on the foundation, the steel structure forms the shape of walls, floors and roof. Insulation, cladding and interior finishes are installed around the frame to complete the building envelope. The entire process is dry and clean, with no concrete curing time and fewer weather related delays.",
        "Our in house team applies best practices for thermal bridges, moisture control and structural detailing. This results in a building that is accurate, stable and efficient, with tight tolerances that make finishing stages easier and more consistent.",
      ],
    },
    {
      id: "advantages",
      heading: "Key Advantages",
      body: [
        "LSF is one of the fastest building methods available. Prefabricated components and simple assembly reduce construction time and keep timelines predictable. The dry process also minimizes disruptions during winter or rainy periods.",
        "Its lightweight structure reduces pressure on foundations, often lowering groundwork costs. Steel does not warp, twist or shrink, which ensures long term stability and cleaner finishing.",
        "From a sustainability perspective, steel is fully recyclable and LSF generates very little waste. The precision of factory fabrication means less material loss on site and a cleaner overall construction process.",
      ],
    },
    {
      id: "best-for",
      heading: "Best For",
      body: [
        "LSF is ideal for projects that need fast execution, clean sites and clear scheduling. It works very well for modern designs, complex geometries or projects located in tight urban areas.",
        "It is also an excellent option for coastal regions like the Algarve where controlled installation, corrosion protected materials and lightweight structures help achieve long lasting performance.",
      ],
    },
  ],
  benefits: [
    "Fast construction with predictable timelines",
    "Factory precision for accurate and clean results",
    "Lightweight structure reduces foundation costs",
    "Dry construction with minimal waste on site",
  ],
  related: ["traditional", "icf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Light steel frame structure during assembly" },
      { index: 3, alt: "LSF wall framing with insulation installation" },
    ],
  },
};

