export interface Project {
  slug: string;
  title: string;
  category: string;
  status: 'Production' | 'In Development' | 'Planning';
  overview: string;
  problem: string[];
  solution: string[];
  techStack: {
    backend?: string[];
    frontend?: string[];
    infrastructure?: string[];
    other?: string[];
  };
  results: string[];
  github?: string;
  link?: string;
}

export const projectsWithPages: Project[] = [
  {
    slug: 'life-hub',
    title: 'Life Hub',
    category: 'AI',
    status: 'Production',
    overview: 'Personal AI assistant platform that streamlines daily tasks, health tracking, and productivity management through intelligent automation and natural language interaction.',
    problem: [
      'Fragmented personal data across multiple apps and services',
      'Time-consuming manual tracking of health metrics and habits',
      'Difficult to maintain consistency in productivity routines',
      'No unified interface for managing daily life aspects'
    ],
    solution: [
      'Built centralized dashboard with Claude AI integration for natural language commands',
      'Implemented automated health metric tracking with trend analysis',
      'Created smart reminder system that adapts to user behavior patterns',
      'Developed cross-platform sync for seamless access across devices'
    ],
    techStack: {
      backend: ['Node.js', 'Express', 'PostgreSQL', 'Claude API'],
      frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      infrastructure: ['AWS EC2', 'RDS', 'S3', 'CloudWatch'],
      other: ['Docker', 'GitHub Actions', 'Jest']
    },
    results: [
      'Reduced daily task management time by 60%',
      'Achieved 95% habit tracking consistency over 3 months',
      'Processed 10,000+ natural language commands with 98% accuracy',
      'Zero downtime deployment with automated CI/CD pipeline'
    ],
    github: 'https://github.com/yourusername/life-hub',
    link: 'https://lifehub.example.com'
  },
  {
    slug: 'ghost',
    title: 'GHOST',
    category: 'AI',
    status: 'In Development',
    overview: 'AI-powered code review assistant that provides context-aware suggestions, identifies potential bugs, and enforces coding standards across multiple programming languages.',
    problem: [
      'Manual code reviews are time-consuming and inconsistent',
      'Junior developers need more guidance on best practices',
      'Subtle bugs and security issues often slip through reviews',
      'Coding standards enforcement varies across team members'
    ],
    solution: [
      'Integrated Claude AI for intelligent code analysis and suggestions',
      'Built custom AST parsing for deep code understanding',
      'Implemented real-time feedback system in popular IDEs',
      'Created configurable rule engine for team-specific standards'
    ],
    techStack: {
      backend: ['Python', 'FastAPI', 'Redis', 'Claude API'],
      frontend: ['VS Code Extension API', 'TypeScript', 'React'],
      infrastructure: ['Docker', 'Kubernetes', 'PostgreSQL'],
      other: ['Tree-sitter', 'pytest', 'ESLint']
    },
    results: [
      'Reduced code review time by 40% in beta testing',
      'Caught 85% of common bugs before human review',
      'Improved code quality scores by 30% across test team',
      'Successfully analyzed 50,000+ lines of code daily'
    ],
    github: 'https://github.com/yourusername/ghost'
  },
  {
    slug: 'accu',
    title: 'ACCU',
    category: 'DevOps',
    status: 'Production',
    overview: 'Automated infrastructure monitoring and cost optimization platform that provides real-time insights, predictive alerts, and actionable recommendations for cloud resources.',
    problem: [
      'Cloud costs spiraling without clear visibility',
      'Manual monitoring leads to delayed incident response',
      'Resource waste from over-provisioned infrastructure',
      'Lack of predictive insights for capacity planning'
    ],
    solution: [
      'Built real-time monitoring dashboard with custom metrics',
      'Implemented ML-based anomaly detection for early warning',
      'Created automated cost optimization recommendations',
      'Developed infrastructure-as-code templates for best practices'
    ],
    techStack: {
      backend: ['Go', 'gRPC', 'TimescaleDB', 'Prometheus'],
      frontend: ['Next.js', 'TypeScript', 'Recharts', 'Tailwind'],
      infrastructure: ['AWS', 'Terraform', 'EKS', 'CloudWatch'],
      other: ['Grafana', 'Alert Manager', 'GitHub Actions']
    },
    results: [
      'Reduced cloud costs by 35% through optimization',
      'Achieved 99.9% uptime with predictive alerting',
      'Cut incident response time from 15min to 2min average',
      'Monitoring 200+ microservices across 5 AWS regions'
    ],
    github: 'https://github.com/yourusername/accu',
    link: 'https://accu.example.com'
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsWithPages.find(project => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projectsWithPages.map(project => project.slug);
}
