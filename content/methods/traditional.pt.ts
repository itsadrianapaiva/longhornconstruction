import type { MethodArticle } from "@/lib/methods/types";

export const traditionalPt: MethodArticle = {
  slug: "traditional",
  title: "Construção Tradicional",
  subtitle:
    "Betão armado e alvenaria combinados com a autenticidade da arquitetura tradicional portuguesa.",
  heroImage: {
    index: 1,
    alt: "Arquitetura tradicional portuguesa em betão e alvenaria",
  },
  intro:
    "A construção tradicional em Portugal é mais do que betão e alvenaria. É uma forma de preservar a identidade arquitetónica da região, desde as paredes caiadas até à pedra natural, telha portuguesa, arcos e proporções clássicas. Na Longhorn Construction unimos técnicas estruturais comprovadas com total respeito pela arquitetura portuguesa, criando casas sólidas, autênticas e intemporais.",
  sections: [
    {
      id: "how-it-works",
      heading: "Como Funciona",
      body: [
        "A construção tradicional começa com fundações e estrutura em betão armado. As paredes em alvenaria, com blocos de betão, tijolo ou pedra natural, definem a forma e a personalidade da casa. Estes métodos são utilizados em Portugal há décadas e são amplamente reconhecidos pela sua fiabilidade.",
        "O diferencial da Longhorn é a atenção aos detalhes da arquitetura tradicional portuguesa. Integramos elementos como paredes curvas, rebocos típicos, detalhes em madeira, cantarias, telha portuguesa e as proporções que caracterizam o Algarve e o sul do país.",
        "A nossa equipa própria gere todas as etapas, desde a escavação até aos acabamentos finais. Com maquinaria própria e equipas coordenadas, garantimos qualidade, consistência e total alinhamento entre a estrutura moderna e a estética tradicional.",
      ],
    },
    {
      id: "advantages",
      heading: "Principais Vantagens",
      body: [
        "A construção tradicional oferece durabilidade e longevidade. Estruturas em betão e alvenaria envelhecem bem, exigem pouca manutenção e proporcionam conforto térmico graças à sua massa térmica natural.",
        "É também o método mais flexível para alcançar detalhes genuinamente portugueses. Arcos, cantarias, tetos abobadados, fachadas clássicas e outros elementos tradicionais são facilmente executados.",
        "Como este método faz parte da cultura construtiva portuguesa, enquadra-se perfeitamente nas normas locais, nos métodos de obra e nas necessidades futuras de manutenção ou ampliação.",
      ],
    },
    {
      id: "best-for",
      heading: "Ideal Para",
      body: [
        "Construção tradicional é ideal para quem procura uma casa que respeite a identidade arquitetónica de Portugal, aliando-a a engenharia moderna e controlo de qualidade.",
        "É uma escolha forte para moradias, quintas, segundas residências ou qualquer projeto que exija estética intemporal, formas complexas ou detalhes típicos do Algarve.",
      ],
    },
  ],
  benefits: [
    "Estrutura durável com longa vida útil",
    "Acabamentos e detalhes genuinamente portugueses",
    "Excelente resistência ao fogo e conforto térmico",
    "Flexibilidade total de design e fácil adaptação futura",
  ],
  related: ["icf", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Estrutura em betão armado na construção tradicional" },
      {
        index: 3,
        alt: "Alvenaria tradicional portuguesa com acabamentos regionais",
      },
    ],
  },
};
