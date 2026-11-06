const careersData = [
  {
    title: 'Data Scientist',
    description:
      'Harness data and machine learning to uncover deep patterns, build predictive systems, and drive ethical, high-impact algorithmic decisions across diverse industries.',
    baseSalaryRange: { min: 900000, max: 2800000 },
    demandLevel: 'High',
    isRemoteFriendly: true,
    accessibilityFeatures: [
      'Screen Reader Friendly',
      'Asynchronous Workflows',
      'Quiet Workstations',
      'Flexible Pacing'
    ],
    welcomesNonTraditional: true,
    deiRating: 4.8,
    idealTraits: {
      analytical: 5,
      creative: 3,
      social: 2,
      technical: 5
    },
    roadmap: [
      {
        phase: 'Phase 1: Foundations & Analytical Tooling',
        milestones: [
          'Master Python programming, vectors, and algorithmic data structures',
          'Applied statistics, Bayesian inference, and hypothesis testing',
          'Relational database querying (SQL) and data manipulation with Pandas'
        ]
      },
      {
        phase: 'Phase 2: Production ML & Algorithmic Storytelling',
        milestones: [
          'Build end-to-end Machine Learning pipelines with Scikit-Learn and PyTorch',
          'Deploy reproducible model endpoints using FastAPI, Docker, and MLflow',
          'Communicate model fairness, bias audits, and executive insights visually'
        ]
      }
    ],
    skills: [
      {
        name: 'Python & Scientific Computing',
        importance: 'Critical MUST',
        category: 'Programming'
      },
      {
        name: 'Statistical Modeling & Machine Learning',
        importance: 'Critical MUST',
        category: 'Data Science'
      },
      {
        name: 'SQL & Data Engineering Pipelines',
        importance: 'High MUST/GOOD',
        category: 'Data Engineering'
      },
      {
        name: 'Fairness Auditing & Model Interpretability',
        importance: 'Medium GOOD/BONUS',
        category: 'Ethics & AI'
      }
    ]
  },
  {
    title: 'UX Designer',
    description:
      'Champion inclusive, accessible human-centered digital experiences. Transform user insights into intuitive interfaces that welcome individuals of all abilities and backgrounds.',
    baseSalaryRange: { min: 700000, max: 2400000 },
    demandLevel: 'High',
    isRemoteFriendly: true,
    accessibilityFeatures: [
      'High-Contrast Workspaces',
      'Voice-to-Text Support',
      'Sensory-Friendly Pacing',
      'Universal Design Focus'
    ],
    welcomesNonTraditional: true,
    deiRating: 4.9,
    idealTraits: {
      analytical: 3,
      creative: 5,
      social: 5,
      technical: 2
    },
    roadmap: [
      {
        phase: 'Phase 1: Empathetic Research & Interaction Foundations',
        milestones: [
          'Conduct inclusive user interviews and participatory design workshops',
          'Synthesize qualitative findings into journey maps and accessible archetypes',
          'Low-fidelity wireframing and structured information architecture'
        ]
      },
      {
        phase: 'Phase 2: Token-Driven Design Systems & Accessibility Audits',
        milestones: [
          'Architect modular, scalable design systems with Figma components and tokens',
          'Perform rigorous WCAG 2.2 AA accessibility evaluations and keyboard nav tests',
          'Run moderated usability tests with assistive technology users and iterate'
        ]
      }
    ],
    skills: [
      {
        name: 'Figma & Scalable Design Systems',
        importance: 'Critical MUST',
        category: 'UI/UX Tools'
      },
      {
        name: 'Inclusive Research & Journey Mapping',
        importance: 'Critical MUST',
        category: 'User Research'
      },
      {
        name: 'WCAG 2.2 Accessibility Auditing',
        importance: 'High MUST/GOOD',
        category: 'Accessibility'
      },
      {
        name: 'Micro-interactions & Prototyping',
        importance: 'Medium GOOD/BONUS',
        category: 'Interactive Design'
      }
    ]
  },
  {
    title: 'Software Engineer',
    description:
      'Engineer robust, resilient software systems and cloud-native applications. Solve challenging architectural problems with clean, scalable, and maintainable code.',
    baseSalaryRange: { min: 800000, max: 3200000 },
    demandLevel: 'High',
    isRemoteFriendly: true,
    accessibilityFeatures: [
      'Screen Magnification Compatible',
      'Dark Mode & Custom Theming',
      'Asynchronous Code Reviews',
      'Neurodivergent Friendly'
    ],
    welcomesNonTraditional: true,
    deiRating: 4.7,
    idealTraits: {
      analytical: 4,
      creative: 3,
      social: 3,
      technical: 5
    },
    roadmap: [
      {
        phase: 'Phase 1: Core CS, Modern Languages, & Web APIs',
        milestones: [
          'Master modern JavaScript/TypeScript, algorithms, and modular design patterns',
          'Build resilient REST & WebSocket services with Node.js and Express',
          'Design ACID-compliant relational schemas and document databases'
        ]
      },
      {
        phase: 'Phase 2: Cloud Architecture & High-Scale Systems',
        milestones: [
          'Containerize microservices with Docker and deploy automated CI/CD pipelines',
          'Write comprehensive unit, integration, and end-to-end automated tests',
          'Implement caching, distributed logging, and performance telemetry'
        ]
      }
    ],
    skills: [
      {
        name: 'Modern JavaScript / TypeScript & Node.js',
        importance: 'Critical MUST',
        category: 'Programming'
      },
      {
        name: 'System Design & Database Architecture',
        importance: 'Critical MUST',
        category: 'Architecture'
      },
      {
        name: 'Automated Testing (Unit & Integration)',
        importance: 'High MUST/GOOD',
        category: 'Quality Assurance'
      },
      {
        name: 'Cloud Services & Containerization (Docker)',
        importance: 'Medium GOOD/BONUS',
        category: 'Cloud & DevOps'
      }
    ]
  },
  {
    title: 'Product Manager',
    description:
      'Sit at the intersection of business, technology, and user experience. Guide cross-functional teams to build products that solve real human problems and drive sustainable value.',
    baseSalaryRange: { min: 1000000, max: 3500000 },
    demandLevel: 'High',
    isRemoteFriendly: true,
    accessibilityFeatures: [
      'Flexible Collaborative Schedules',
      'Multi-Modal Visual & Written Communication',
      'Speech-to-Text Transcription Support',
      'Structured Focus Blocks'
    ],
    welcomesNonTraditional: true,
    deiRating: 4.6,
    idealTraits: {
      analytical: 4,
      creative: 4,
      social: 5,
      technical: 3
    },
    roadmap: [
      {
        phase: 'Phase 1: Discovery, Strategy & Product Framing',
        milestones: [
          'Uncover latent customer problems through qualitative interviews and analytics',
          'Author concise Product Requirement Documents (PRDs) and user stories',
          'Align cross-functional teams around outcome-based north star OKRs'
        ]
      },
      {
        phase: 'Phase 2: Agile Execution, Launch & Growth Experimentation',
        milestones: [
          'Lead agile ceremonies, sprint planning, and backlog refinement',
          'Coordinate multi-department go-to-market strategies with Marketing and Support',
          'Design multivariate A/B experiments and optimize user adoption funnels'
        ]
      }
    ],
    skills: [
      {
        name: 'Product Discovery & PRD Authoring',
        importance: 'Critical MUST',
        category: 'Product Strategy'
      },
      {
        name: 'Stakeholder Influence & Empathy',
        importance: 'Critical MUST',
        category: 'Leadership'
      },
      {
        name: 'Product Telemetry & A/B Experimentation',
        importance: 'High MUST/GOOD',
        category: 'Analytics'
      },
      {
        name: 'Technical Architecture Fundamentals',
        importance: 'Medium GOOD/BONUS',
        category: 'Engineering Literacy'
      }
    ]
  },
  {
    title: 'Technical Writer',
    description:
      'Bridge complex engineering concepts and diverse human audiences. Craft elegant, accessible documentation, API references, and interactive learning guides.',
    baseSalaryRange: { min: 650000, max: 2000000 },
    demandLevel: 'Stable',
    isRemoteFriendly: true,
    accessibilityFeatures: [
      'Asynchronous Collaboration',
      'Screen Reader Verified Docs',
      'Low Sensory Distraction',
      'Ergonomic Workflows'
    ],
    welcomesNonTraditional: true,
    deiRating: 5.0,
    idealTraits: {
      analytical: 4,
      creative: 4,
      social: 3,
      technical: 4
    },
    roadmap: [
      {
        phase: 'Phase 1: Docs-as-Code & Developer Tutorials',
        milestones: [
          'Translate architectural diagrams and codebases into step-by-step guides',
          'Establish inclusive terminology guidelines and plain-language style guides',
          'Version and test documentation repositories with Git, CI/CD, and Markdown'
        ]
      },
      {
        phase: 'Phase 2: API Tooling & Developer Experience',
        milestones: [
          'Generate and maintain interactive API documentation with OpenAPI/Swagger',
          'Gather community feedback to eliminate documentation dead-ends',
          'Coordinate SDK documentation releases alongside core engineering teams'
        ]
      }
    ],
    skills: [
      {
        name: 'Docs-as-Code Toolchains (Git, Markdown, SSGs)',
        importance: 'Critical MUST',
        category: 'Tooling'
      },
      {
        name: 'API Reference Documentation (OpenAPI/REST)',
        importance: 'Critical MUST',
        category: 'Technical Writing'
      },
      {
        name: 'Information Architecture & Plain Language Standards',
        importance: 'High MUST/GOOD',
        category: 'Content Strategy'
      },
      {
        name: 'Basic Scripting & Code Exploration (Python/JS)',
        importance: 'Medium GOOD/BONUS',
        category: 'Developer Experience'
      }
    ]
  }
];

// Helper to generate dynamic upcoming available slots
const getUpcomingSlots = (offsetHoursList) => {
  const now = new Date();
  return offsetHoursList.map((hours) => {
    const d = new Date(now.getTime() + hours * 3600 * 1000);
    // Align to top of hour
    d.setMinutes(0, 0, 0);
    return d;
  });
};

const mentorsData = [
  {
    name: 'Dr. Sarah Chen',
    pronouns: 'she/her',
    role: 'Staff Research Scientist',
    company: 'DeepMind',
    experienceYears: 11,
    skills: ['Deep Learning', 'AI Ethics', 'Research Mentorship', 'Python', 'STEM Advocacy'],
    mentorshipFocus: ['Women in Tech', 'First-gen Tech', 'Career Transitioners'],
    availableSlots: getUpcomingSlots([24, 30, 48, 54, 72]),
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Marcus Johnson',
    pronouns: 'he/him',
    role: 'Senior Product Designer',
    company: 'Spotify',
    experienceYears: 8,
    skills: ['Design Systems', 'Inclusive UX', 'Audio Design', 'Portfolio Review', 'Figma'],
    mentorshipFocus: ['Bootcamp Grads', 'Career Transitioners', 'First-gen Tech'],
    availableSlots: getUpcomingSlots([26, 32, 50, 56, 76]),
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Priya Patel',
    pronouns: 'they/them',
    role: 'Engineering Manager & Distributed Systems Lead',
    company: 'Stripe',
    experienceYears: 9,
    skills: ['Distributed Architecture', 'API Design', 'Engineering Leadership', 'Neurodiversity Advocacy'],
    mentorshipFocus: ['LGBTQ+', 'Women in Tech', 'Career Transitioners'],
    availableSlots: getUpcomingSlots([28, 34, 52, 58, 80]),
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

module.exports = {
  careersData,
  mentorsData
};

