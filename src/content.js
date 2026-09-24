export const links = {
  github: 'https://github.com/paulofontes-cyber',
  linkedin: 'https://www.linkedin.com/in/profpe/',
  email: 'mailto:prof.paulo.e@gmail.com',
}

export const projects = [
  {
    number: '01',
    category: 'BACK-END · FULL STACK',
    title: 'Reports Platform',
    summary:
      'Relatórios de grande volume, processados em segundo plano e entregues por uma interface web.',
    detail:
      'Uma arquitetura com API, fila de jobs, workers e armazenamento de objetos. O fluxo permite acompanhar o processamento e baixar o relatório quando estiver pronto.',
    tags: [
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'BullMQ',
      'Redis',
      'MinIO',
      'Docker',
    ],
    links: [
      {
        label: 'Explorar API',
        url: 'https://github.com/UNIT-Residencia-2-Squad-5/ReportsAPI',
      },
      {
        label: 'Ver interface',
        url: 'https://github.com/UNIT-Residencia-2-Squad-5/ReportsFrontend',
      },
    ],
    visual: 'reports',
  },
  {
    number: '02',
    category: 'DESIGN · LIDERANÇA FRONT-END',
    title: 'Portal de carreiras JotaNunes',
    summary:
      'Uma experiência web para explorar vagas e acompanhar candidaturas na JotaNunes Construtora.',
    detail:
      'Criei o design e liderei o desenvolvimento do front-end na residência, organizando os fluxos de vagas e candidaturas em uma interface responsiva.',
    tags: ['Design de interface', 'Liderança', 'React', 'TypeScript', 'Vite'],
    links: [
      {
        label: 'Ver protótipo no Figma',
        url: 'https://www.figma.com/proto/uxwuNwpQgbfX5eOc4Ju85K/JOTANUNES?node-id=117-1192&starting-point-node-id=117%3A1192',
      },
    ],
    visual: 'jotanunes',
  },
  {
    number: '03',
    category: 'RESIDÊNCIA · SERVIÇO PÚBLICO',
    title: 'Portal SVO',
    summary:
      'Nova interface para o Serviço de Verificação de Óbitos da Fundação de Saúde Parreiras Horta.',
    detail:
      'No desafio da residência, desenvolvi uma interface responsiva para tornar mais claro o acesso a serviços, notícias e informações de atendimento.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Interface web'],
    links: [
      {
        label: 'Ver site',
        url: 'https://paulofontes-cyber.github.io/Website-SVO/index.html',
      },
      {
        label: 'Ver repositório',
        url: 'https://github.com/paulofontes-cyber/Website-SVO',
      },
    ],
    visual: 'svo',
  },
  {
    number: '04',
    category: 'PESQUISA · INTERFACE',
    title: 'Interface de pesquisa',
    summary:
      'Protótipo de painéis para alunos, professores e coordenação em um projeto de iniciação científica.',
    detail:
      'Exploração de jornadas e telas para autoavaliação, gestão de competências e visualização de relatórios em diferentes perfis.',
    tags: ['Interface web', 'Dashboards', 'Pesquisa aplicada'],
    links: [
      {
        label: 'Ver repositório',
        url: 'https://github.com/paulofontes-cyber/IC_INTERFACE_V1',
      },
    ],
    visual: 'research',
  },
]

export const experience = [
  {
    period: '4 residências',
    role: 'Residência Tecnológica',
    company: 'Porto Digital',
    highlight: 'LIDEREI 2 DE 4 RESIDÊNCIAS',
    description:
      'Na parceria com a Fundação de Saúde Parreiras Horta, desenvolvi uma nova interface para o site do SVO. No projeto da JotaNunes Construtora, criei o design e liderei o desenvolvimento do front-end.',
  },
  {
    period: '2025',
    role: 'ADS - Trust & Safety',
    company: 'MKIT (Hong Kong) Holdings Limited',
    description:
      'Curadoria de anúncios em português e inglês, aplicação de políticas, treinamento de bot automático e colaboração em melhorias dos processos de revisão.',
  },
  {
    period: '2023 — 2025',
    role: 'Community Manager Assistant',
    company: 'Amino Apps',
    description:
      'Projetos da comunidade, tradução EN–PT, moderação, design e liderança de equipes.',
  },
  {
    period: '2024',
    role: 'Tradutor freelancer',
    company: 'RWS Group',
    description:
      'Revisão e tradução para português com atenção à qualidade e à precisão (localização).',
  },
]

export const skills = [
  {
    title: 'Back-end',
    items: [
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Express',
      'Java',
      'Python',
      'APIs REST',
    ],
  },
  {
    title: 'Dados & infraestrutura',
    items: ['PostgreSQL', 'SQL', 'Redis', 'BullMQ', 'MinIO', 'Docker', 'Git'],
  },
  { title: 'Front-end', items: ['React', 'Vite', 'HTML', 'CSS', 'Bootstrap'] },
  {
    title: 'IA & cloud',
    items: [
      'IA aplicada ao desenvolvimento',
      'OpenAI Codex',
      'Gemini',
      'Google Cloud',
    ],
  },
]
