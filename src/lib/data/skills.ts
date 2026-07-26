import type { Level } from './proficiency'

export type SkillLevel = 'exceptional' | 'outstanding' | 'advanced' | 'good' | 'basic'

export interface Skill {
  name: string
  level: SkillLevel
  category: string
  /** Key into the icon map in Technologies.svelte. */
  icon?: string
}

export const SKILL_LEVELS: Record<SkillLevel, Level> = {
  exceptional: { label: 'Exceptional', tier: 5 },
  outstanding: { label: 'Outstanding', tier: 4 },
  advanced: { label: 'Advanced', tier: 3 },
  good: { label: 'Good', tier: 2 },
  basic: { label: 'Basic', tier: 1 },
}

/** Display order. A category with no skills is skipped rather than shown empty. */
export const SKILL_CATEGORY_ORDER = [
  'Languages',
  'Web',
  'Styling',
  'Database',
  'DevOps',
  'Hypervisors',
  'Tools',
  'Management',
  'Monitoring',
  'ML/AI',
  'Creative',
  'Mobile',
]

export const SKILLS: Skill[] = [

  // Languages
  { name: 'Go', level: 'exceptional', category: 'Languages', icon: 'go' },
  { name: 'Python', level: 'exceptional', category: 'Languages', icon: 'python' },
  { name: 'TypeScript', level: 'exceptional', category: 'Languages', icon: 'typescript' },
  { name: 'JavaScript', level: 'exceptional', category: 'Languages', icon: 'javascript' },
  { name: 'C#', level: 'exceptional', category: 'Languages', icon: 'csharp' },
  { name: 'Java', level: 'outstanding', category: 'Languages', icon: 'java' },
  { name: 'Lua', level: 'exceptional', category: 'Languages', icon: 'lua' },
  { name: 'PHP', level: 'exceptional', category: 'Languages', icon: 'php' },
  { name: 'Bash/Zsh', level: 'exceptional', category: 'Languages', icon: 'bash' },
  { name: 'Deno', level: 'outstanding', category: 'Languages', icon: 'deno' },
  { name: 'C++', level: 'outstanding', category: 'Languages', icon: 'cplusplus' },
  { name: 'Rust', level: 'advanced', category: 'Languages', icon: 'rust' },
  { name: 'Dart', level: 'advanced', category: 'Languages', icon: 'dart' },
  { name: 'Ruby', level: 'advanced', category: 'Languages', icon: 'ruby' },
  { name: 'Crystal', level: 'advanced', category: 'Languages', icon: 'default' },
  { name: 'Elm', level: 'advanced', category: 'Languages', icon: 'default' },
  { name: 'Haxe', level: 'advanced', category: 'Languages', icon: 'default' },

  // Web
  { name: 'Vue.js', level: 'exceptional', category: 'Web', icon: 'vue' },
  { name: 'React', level: 'exceptional', category: 'Web', icon: 'react' },
  { name: 'Next.js', level: 'exceptional', category: 'Web', icon: 'nextjs' },
  { name: 'Node.js', level: 'exceptional', category: 'Web', icon: 'nodejs' },
  { name: 'Electron', level: 'advanced', category: 'Web', icon: 'electron' },
  { name: 'Three.js', level: 'advanced', category: 'Web', icon: 'threejs' },
  { name: 'p5.js', level: 'outstanding', category: 'Web', icon: 'p5js' },
  { name: 'Flask', level: 'exceptional', category: 'Web', icon: 'flask' },
  { name: 'Sanic', level: 'outstanding', category: 'Web', icon: 'python' },

  // Styling
  { name: 'CSS/SCSS', level: 'exceptional', category: 'Styling', icon: 'css' },
  { name: 'Tailwind', level: 'exceptional', category: 'Styling', icon: 'tailwind' },
  { name: 'Bootstrap', level: 'good', category: 'Styling', icon: 'bootstrap' },

  // Database
  { name: 'PostgreSQL', level: 'exceptional', category: 'Database', icon: 'postgresql' },
  { name: 'MongoDB', level: 'outstanding', category: 'Database', icon: 'mongodb' },
  { name: 'GraphQL', level: 'outstanding', category: 'Database', icon: 'graphql' },
  { name: 'ClickHouse', level: 'exceptional', category: 'Database', icon: 'clickhouse' },
  { name: 'ElasticSearch', level: 'good', category: 'Database', icon: 'elasticsearch' },
  { name: 'ChromaDB', level: 'good', category: 'Database', icon: 'database' },
  { name: 'AWS RDS', level: 'outstanding', category: 'Database', icon: 'aws' },
  { name: 'Redis', level: 'outstanding', category: 'Database', icon: 'redis' },

  // DevOps
  { name: 'Docker', level: 'exceptional', category: 'DevOps', icon: 'docker' },
  { name: 'Kubernetes', level: 'outstanding', category: 'DevOps', icon: 'kubernetes' },
  { name: 'Nginx', level: 'outstanding', category: 'DevOps', icon: 'nginx' },
  { name: 'Apache', level: 'good', category: 'DevOps', icon: 'apache' },
  { name: 'GitHub Actions', level: 'exceptional', category: 'DevOps', icon: 'githubactions' },
  { name: 'Concourse CI', level: 'outstanding', category: 'DevOps', icon: 'concourse' },

  // Hypervisors
  { name: 'AWS', level: 'exceptional', category: 'Hypervisors', icon: 'aws' },
  { name: 'Fly.io', level: 'exceptional', category: 'Hypervisors', icon: 'flyio' },
  { name: 'DigitalOcean', level: 'exceptional', category: 'Hypervisors', icon: 'digitalocean' },
  { name: 'Azure', level: 'advanced', category: 'Hypervisors', icon: 'azure' },
  { name: 'GCP', level: 'good', category: 'Hypervisors', icon: 'gcp' },

  // Tools
  { name: 'Postman', level: 'outstanding', category: 'Tools', icon: 'postman' },
  { name: 'Insomnia', level: 'outstanding', category: 'Tools', icon: 'insomnia' },
  { name: 'OpenAPI', level: 'outstanding', category: 'Tools', icon: 'openapi' },
  { name: 'WebSockets', level: 'outstanding', category: 'Tools', icon: 'websockets' },
  { name: 'Kafka', level: 'advanced', category: 'Tools', icon: 'kafka' },
  { name: 'AWS SQS', level: 'good', category: 'Tools', icon: 'sqs' },

  // Management
  { name: 'Trello', level: 'exceptional', category: 'Management', icon: 'trello' },
  { name: 'Jira', level: 'exceptional', category: 'Management', icon: 'jira' },
  { name: 'Asana', level: 'outstanding', category: 'Management', icon: 'asana' },
  { name: 'YouTrack', level: 'exceptional', category: 'Management', icon: 'youtrack' },

  // Monitoring
  { name: 'Grafana', level: 'exceptional', category: 'Monitoring', icon: 'grafana' },
  { name: 'DataDog', level: 'outstanding', category: 'Monitoring', icon: 'datadog' },
  { name: 'CloudWatch', level: 'outstanding', category: 'Monitoring', icon: 'cloudwatch' },

  // ML/AI
  { name: 'PyTorch', level: 'good', category: 'ML/AI', icon: 'pytorch' },
  { name: 'TensorFlow', level: 'good', category: 'ML/AI', icon: 'tensorflow' },
  { name: 'Diffusers', level: 'advanced', category: 'ML/AI', icon: 'diffusers' },
  { name: 'Transformers', level: 'advanced', category: 'ML/AI', icon: 'transformers' },

  // Creative
  { name: 'Blender', level: 'exceptional', category: 'Creative', icon: 'blender' },
  { name: 'Unity', level: 'exceptional', category: 'Creative', icon: 'unity' },
  { name: 'Unreal Engine', level: 'good', category: 'Creative', icon: 'unreal' },
  { name: 'Godot', level: 'advanced', category: 'Creative', icon: 'godot' },
  { name: 'LOVE2D', level: 'outstanding', category: 'Creative', icon: 'love2d' },
  { name: 'Adobe CC', level: 'exceptional', category: 'Creative', icon: 'adobe' },
  { name: 'Figma', level: 'advanced', category: 'Creative', icon: 'figma' },

  // Mobile
  { name: 'Flutter', level: 'outstanding', category: 'Mobile', icon: 'flutter' },
  { name: 'Cordova', level: 'advanced', category: 'Mobile', icon: 'cordova' },
]
