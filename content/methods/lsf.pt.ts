import type { MethodArticle } from "@/lib/methods/types";

export const lsfPt: MethodArticle = {
  slug: "lsf",
  title: "Construção em LSF",
  subtitle:
    "Light Steel Frame para uma construção precisa, rápida e eficiente, com obra limpa e prazos previsíveis.",
  heroImage: {
    index: 1,
    alt: "Estrutura LSF a ser montada em obra",
  },
  intro:
    "O Light Steel Frame (LSF) traz precisão industrial para projetos residenciais e comerciais. Utiliza perfis de aço leve moldados a frio que criam uma estrutura resistente, leve e rápida de montar. Na Longhorn Construction seguimos as melhores práticas norte americanas e adaptamos o sistema às condições de Portugal e ao clima do Algarve.",
  sections: [
    {
      id: "how-it-works",
      heading: "Como Funciona",
      body: [
        "A construção em LSF utiliza perfis de aço galvanizado fabricados com medidas exatas em ambiente controlado. Estes perfis chegam à obra prontos para montagem, quase sem necessidade de cortes ou ajustes.",
        "Após a colocação na fundação, a estrutura define paredes, pisos e cobertura. O isolamento, os revestimentos e os acabamentos interiores são aplicados à volta da estrutura, criando um edifício completo. Todo o processo é seco, limpo e com menos atrasos causados pelo clima.",
        "A nossa equipa própria aplica detalhes corretos de ponte térmica, controlo de humidade e desempenho estrutural. O resultado é um edifício estável, preciso e eficiente, com tolerâncias apertadas que facilitam os acabamentos.",
      ],
    },
    {
      id: "advantages",
      heading: "Principais Vantagens",
      body: [
        "O LSF é um dos métodos de construção mais rápidos. As peças pré-fabricadas e a montagem simples reduzem o tempo total de obra e mantêm prazos previsíveis. O processo seco permite trabalhar mesmo em períodos mais húmidos.",
        "A leveza da estrutura reduz a carga sobre as fundações, muitas vezes diminuindo custos iniciais. O aço não empena, não torce e não encolhe, garantindo estabilidade ao longo dos anos e facilitando a execução dos acabamentos.",
        "Do ponto de vista ambiental, o aço é totalmente reciclável e o LSF gera muito pouco desperdício. A precisão da fábrica reduz o consumo de materiais e mantém o estaleiro organizado.",
      ],
    },
    {
      id: "best-for",
      heading: "Ideal Para",
      body: [
        "LSF é ideal para projetos que exigem rapidez, obra limpa e prazos bem definidos. Funciona muito bem em arquiteturas modernas, formas complexas ou locais com espaço reduzido.",
        "É também uma excelente opção para zonas costeiras como o Algarve, onde materiais protegidos contra corrosão, montagem controlada e estruturas leves contribuem para um desempenho sólido e duradouro.",
      ],
    },
  ],
  benefits: [
    "Construção rápida e com prazos previsíveis",
    "Precisão de fábrica e acabamentos mais limpos",
    "Estrutura leve que reduz custos de fundação",
    "Processo seco com mínimo desperdício em obra",
  ],
  related: ["traditional", "icf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Estrutura LSF durante montagem" },
      { index: 3, alt: "Painel LSF com instalação de isolamento" },
    ],
  },
};

