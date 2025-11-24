import type { MethodArticle } from "@/lib/methods/types";

export const icfPt: MethodArticle = {
  slug: "icf",
  title: "Construção em ICF",
  subtitle:
    "Sistemas de paredes em betão isolado que combinam rapidez de execução com excelente desempenho térmico e acústico.",
  heroImage: {
    index: 1,
    alt: "Sistema ICF a ser instalado numa obra",
  },
  intro:
    "ICF, ou Insulated Concrete Forms, é uma evolução moderna da construção em betão. O sistema junta betão estrutural e isolamento contínuo num único elemento. Na CÉU utilizamos o sistema Sismo, uma solução industrial avançada da família ICF. Pode saber mais sobre a tecnologia em sismo-technology.com/pt-pt.",
  sections: [
    {
      id: "how-it-works",
      heading: "Como Funciona",
      body: [
        "A construção em ICF utiliza elementos isolantes que permanecem no local após o enchimento de betão. No sistema Sismo, estes elementos são painéis industriais produzidos com quadros de alta precisão. Os painéis definem a forma das paredes, suportam a armadura e criam a camada de isolamento.",
        "Depois de instalados, os painéis são preenchidos com betão armado, formando uma estrutura monolítica. O resultado é uma parede com resistência, isolamento e estabilidade num único elemento contínuo.",
        "A nossa equipa executa todas as etapas. Montamos os painéis, instalamos a armadura, coordenamos o enchimento do betão e integramos o sistema com as fundações e estrutura da cobertura para garantir um edifício de alto desempenho.",
      ],
    },
    {
      id: "advantages",
      heading: "Principais Vantagens",
      body: [
        "A eficiência energética é um dos maiores benefícios. O isolamento contínuo combinado com a massa térmica do betão ajuda a manter temperaturas interiores estáveis durante todo o ano.",
        "A rapidez de construção é outra vantagem importante. Os painéis Sismo são leves, rápidos de posicionar e dispensam uma etapa separada de isolamento. Isto reduz o tempo total de obra.",
        "As estruturas em ICF e Sismo têm ótimo desempenho em condições exigentes. São resistentes ao fogo, vento, sismos e transmissão de som. São ideais para o Algarve, onde o clima costeiro e as variações térmicas são constantes.",
      ],
    },
    {
      id: "best-for",
      heading: "Ideal Para",
      body: [
        "ICF é ideal para proprietários e investidores que procuram conforto, eficiência energética e durabilidade a longo prazo. Funciona muito bem no clima português, onde o desempenho térmico é fundamental.",
        "Também é excelente para casas perto de estradas movimentadas ou zonas costeiras onde isolamento acústico, durabilidade e resistência às condições ambientais são essenciais.",
      ],
    },
  ],
  benefits: [
    "Alto desempenho térmico e acústico",
    "Construção mais rápida que a alvenaria tradicional",
    "Redução dos custos de energia",
    "Grande resistência a fogo, vento e sismos",
  ],
  related: ["traditional", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Parede ICF com armadura em preparação" },
      { index: 3, alt: "Parede ICF concluída com isolamento integrado" },
    ],
  },
};

