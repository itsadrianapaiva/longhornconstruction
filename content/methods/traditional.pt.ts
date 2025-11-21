import type { MethodArticle } from "@/lib/methods/types";

export const traditionalPt: MethodArticle = {
  slug: "traditional",
  title: "Construcao Tradicional",
  subtitle:
    "Estruturas classicas em betao armado e alvenaria, executadas com controlo rigoroso de qualidade, orcamento e prazo.",
  heroImage: {
    index: 1,
    alt: "Construcao tradicional em betao e alvenaria em execucao",
  },
  intro:
    "A construcao tradicional em betao armado e alvenaria continua a ser um dos metodos mais fiaveis e testados para edificar estruturas duradouras. Na CEU Construction, combinamos tecnicas comprovadas com controlo de qualidade moderno e gestao de projeto para entregar resultados excecionais.",
  sections: [
    {
      id: "how-it-works",
      heading: "Como Funciona",
      body: [
        "A construcao tradicional comeca com fundacoes e estruturas em betao armado, seguidas de paredes em alvenaria de blocos de betao ou tijolo. Este metodo foi refinado ao longo de decadas e e bem compreendido por construtores, engenheiros e arquitetos em todo o mundo.",
        "A nossa equipa interna gere todas as etapas: desde escavacao e fundacoes ate estrutura, paredes e acabamentos. Usamos maquinaria propria e equipas coordenadas para manter qualidade consistente e evitar atrasos causados por dependencias de subempreiteiros.",
        "O resultado e uma estrutura robusta e duradoura com excelente resistencia ao fogo, isolamento acustico e propriedades de massa termica que ajudam a regular as temperaturas interiores naturalmente.",
      ],
    },
    {
      id: "advantages",
      heading: "Vantagens Principais",
      body: [
        "A construcao tradicional oferece durabilidade e longevidade inigualаveis. Estruturas em betao e alvenaria podem durar geracoes com manutencao minima, tornando-as num excelente investimento a longo prazo para proprietarios e promotores.",
        "Este metodo tambem e altamente versatil. Acomoda designs arquitetonicos complexos, acabamentos personalizados e modificacoes durante a construcao. Os profissionais locais estao familiarizados com estas tecnicas, o que simplifica reparacoes ou renovacoes futuras.",
        "Do ponto de vista regulamentar, a construcao tradicional e universalmente aceite e bem documentada nos codigos de construcao em Portugal e na Europa, garantindo licenciamentos e inspecoes diretas.",
      ],
    },
    {
      id: "best-for",
      heading: "Ideal Para",
      body: [
        "A construcao tradicional e ideal para projetos que priorizam durabilidade, flexibilidade de design personalizado e alinhamento com praticas de construcao locais. Funciona bem tanto para moradias residenciais como edificios comerciais no Algarve e Costa Vicentina.",
        "Se o seu projeto requer formas complexas, tetos abobadados ou integracao com estruturas de alvenaria existentes, os metodos tradicionais fornecem as ferramentas e tecnicas comprovadas para alcancar a sua visao com confianca.",
      ],
    },
  ],
  benefits: [
    "Durabilidade comprovada com decadas de historico",
    "Excelente resistencia ao fogo e isolamento acustico",
    "Opcoes de design versateis e modificacoes futuras faceis",
    "Universalmente aceite nos codigos e regulamentos de construcao",
  ],
  related: ["icf", "lsf"],
  extraImageGroup: {
    afterSectionId: "best-for",
    images: [
      { index: 2, alt: "Construcao de estrutura em betao armado" },
      { index: 3, alt: "Processo de construcao de parede em alvenaria tradicional" },
    ],
  },
};
