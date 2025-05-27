<script lang="ts">
  import {
    Code,
    Database,
    Globe,
    Palette,
    Smartphone,
    Server,
    Cpu,
    Zap,
    Monitor,
    Settings,
    GitBranch,
    MessageSquare,
  } from "@lucide/svelte";

  import {
    SiGo,
    SiPython,
    SiTypescript,
    SiJavascript,
    SiSharp,
    SiLua,
    SiPhp,
    SiGnubash,
    SiCplusplus,
    SiRust,
    SiDart,
    SiRuby,
    SiVuedotjs,
    SiReact,
    SiNextdotjs,
    SiVite,
    SiNodedotjs,
    SiElectron,
    SiThreedotjs,
    SiP5dotjs,
    SiFlask,
    SiCss3,
    SiTailwindcss,
    SiBootstrap,
    SiPostgresql,
    SiMongodb,
    SiGraphql,
    SiClickhouse,
    SiElasticsearch,
    SiAmazon,
    SiDocker,
    SiKubernetes,
    SiNginx,
    SiApache,
    SiPytorch,
    SiTensorflow,
    SiBlender,
    SiUnity,
    SiUnrealengine,
    SiFigma,
    SiFlutter,
    SiApachecordova,
    SiDeno,
    SiGithubactions,
    SiTrello,
    SiJira,
    SiAsana,
    SiPostman,
    SiInsomnia,
    SiOpenapiinitiative,
    SiRedis,
    SiApachekafka,
    SiDatadog,
    SiGrafana,
    SiGodotengine,
    SiHuggingface,
    SiDigitalocean,
    SiFlydotio,
    SiGooglecloud,
  } from "@icons-pack/svelte-simple-icons";

  import Button from "../Button.svelte";
  import type { Component } from "svelte";

  // Define the skill data structure
  interface Skill {
    name: string;
    level: "exceptional" | "outstanding" | "advanced" | "good" | "basic";
    category: string;
    icon?: string; // Icon key for mapping
  }

  // Map icon names to actual Svelte components
  const iconMap: Record<string, Component | any> = {
    // Programming Languages
    go: SiGo,
    python: SiPython,
    typescript: SiTypescript,
    javascript: SiJavascript,
    csharp: SiSharp,
    java: Code, // Fallback to generic code icon
    lua: SiLua,
    php: SiPhp,
    bash: SiGnubash,
    cplusplus: SiCplusplus,
    rust: SiRust,
    dart: SiDart,
    ruby: SiRuby,
    deno: SiDeno,

    // Web Technologies
    vue: SiVuedotjs,
    react: SiReact,
    nextjs: SiNextdotjs,
    vite: SiVite,
    nodejs: SiNodedotjs,
    electron: SiElectron,
    threejs: SiThreedotjs,
    p5js: SiP5dotjs,
    flask: SiFlask,

    // Styling
    css: SiCss3,
    tailwind: SiTailwindcss,
    bootstrap: SiBootstrap,

    // Databases
    postgresql: SiPostgresql,
    mongodb: SiMongodb,
    graphql: SiGraphql,
    clickhouse: SiClickhouse,
    elasticsearch: SiElasticsearch,
    redis: SiRedis,

    // DevOps & CI/CD
    docker: SiDocker,
    kubernetes: SiKubernetes,
    nginx: SiNginx,
    apache: SiApache,
    githubactions: SiGithubactions,
    concourse: GitBranch, // Fallback to git branch icon

    // Hypervisors & Cloud Platforms
    aws: SiAmazon,
    azure: Server, // Fallback to generic server icon
    gcp: SiGooglecloud,
    digitalocean: SiDigitalocean,
    flyio: SiFlydotio,

    // Tools & APIs
    postman: SiPostman,
    insomnia: SiInsomnia,
    openapi: SiOpenapiinitiative,
    websockets: MessageSquare, // Fallback to message icon
    kafka: SiApachekafka,
    sqs: SiAmazon, // AWS SQS

    // Project Management
    trello: SiTrello,
    jira: SiJira,
    asana: SiAsana,
    youtrack: Settings, // Fallback to settings icon

    // Monitoring
    datadog: SiDatadog,
    grafana: SiGrafana,
    cloudwatch: SiAmazon, // AWS CloudWatch

    // ML/AI & Creative
    pytorch: SiPytorch,
    tensorflow: SiTensorflow,
    diffusers: SiHuggingface,
    transformers: SiHuggingface,
    blender: SiBlender,
    unity: SiUnity,
    unreal: SiUnrealengine,
    godot: SiGodotengine,
    love2d: Code, // Fallback to code icon
    adobe: Palette, // Fallback to palette icon for creative tools
    figma: SiFigma,

    // Mobile
    flutter: SiFlutter,
    cordova: SiApachecordova,

    // Fallback icons
    default: Code,
    database: Database,
    web: Globe,
    styling: Palette,
    mobile: Smartphone,
    devops: Server,
    hypervisors: Server,
    languages: Cpu,
    creative: Palette,
    ml: Zap,
    tools: Settings,
    monitoring: Monitor,
  };

  // Default skills - you can override this via props
  export let skills: Skill[] = [
    // Programming Languages - Exceptional/Outstanding
    { name: "Go", level: "exceptional", category: "Languages", icon: "go" },
    {
      name: "Python",
      level: "exceptional",
      category: "Languages",
      icon: "python",
    },
    {
      name: "TypeScript",
      level: "exceptional",
      category: "Languages",
      icon: "typescript",
    },
    {
      name: "JavaScript",
      level: "exceptional",
      category: "Languages",
      icon: "javascript",
    },
    { name: "C#", level: "exceptional", category: "Languages", icon: "csharp" },
    { name: "Java", level: "outstanding", category: "Languages", icon: "java" },
    { name: "Lua", level: "exceptional", category: "Languages", icon: "lua" },
    { name: "PHP", level: "exceptional", category: "Languages", icon: "php" },
    {
      name: "Bash/Zsh",
      level: "exceptional",
      category: "Languages",
      icon: "bash",
    },
    { name: "Deno", level: "outstanding", category: "Languages", icon: "deno" },

    // Programming Languages - Advanced
    {
      name: "C++",
      level: "outstanding",
      category: "Languages",
      icon: "cplusplus",
    },
    { name: "Rust", level: "advanced", category: "Languages", icon: "rust" },
    { name: "Dart", level: "advanced", category: "Languages", icon: "dart" },
    { name: "Ruby", level: "advanced", category: "Languages", icon: "ruby" },
    {
      name: "Crystal",
      level: "advanced",
      category: "Languages",
      icon: "default",
    },
    { name: "Elm", level: "advanced", category: "Languages", icon: "default" },
    { name: "Haxe", level: "advanced", category: "Languages", icon: "default" },

    // Web Technologies
    { name: "Vue.js", level: "exceptional", category: "Web", icon: "vue" },
    { name: "React", level: "exceptional", category: "Web", icon: "react" },
    { name: "Next.js", level: "exceptional", category: "Web", icon: "nextjs" },
    { name: "Node.js", level: "exceptional", category: "Web", icon: "nodejs" },

    {
      name: "Electron",
      level: "advanced",
      category: "Web",
      icon: "electron",
    },
    { name: "Three.js", level: "advanced", category: "Web", icon: "threejs" },
    { name: "p5.js", level: "outstanding", category: "Web", icon: "p5js" },
    { name: "Flask", level: "exceptional", category: "Web", icon: "flask" },
    { name: "Sanic", level: "outstanding", category: "Web", icon: "python" },

    // Styling & CSS
    {
      name: "CSS/SCSS",
      level: "exceptional",
      category: "Styling",
      icon: "css",
    },
    {
      name: "Tailwind",
      level: "exceptional",
      category: "Styling",
      icon: "tailwind",
    },
    {
      name: "Bootstrap",
      level: "good",
      category: "Styling",
      icon: "bootstrap",
    },

    // Databases
    {
      name: "PostgreSQL",
      level: "exceptional",
      category: "Database",
      icon: "postgresql",
    },
    {
      name: "MongoDB",
      level: "outstanding",
      category: "Database",
      icon: "mongodb",
    },
    {
      name: "GraphQL",
      level: "outstanding",
      category: "Database",
      icon: "graphql",
    },
    {
      name: "ClickHouse",
      level: "exceptional",
      category: "Database",
      icon: "clickhouse",
    },
    {
      name: "ElasticSearch",
      level: "good",
      category: "Database",
      icon: "elasticsearch",
    },
    { name: "ChromaDB", level: "good", category: "Database", icon: "database" },
    {
      name: "AWS RDS",
      level: "outstanding",
      category: "Database",
      icon: "aws",
    },
    {
      name: "Redis",
      level: "outstanding",
      category: "Database",
      icon: "redis",
    },

    // DevOps & Infrastructure
    {
      name: "Docker",
      level: "exceptional",
      category: "DevOps",
      icon: "docker",
    },
    {
      name: "Kubernetes",
      level: "outstanding",
      category: "DevOps",
      icon: "kubernetes",
    },
    { name: "Nginx", level: "outstanding", category: "DevOps", icon: "nginx" },
    { name: "Apache", level: "good", category: "DevOps", icon: "apache" },
    {
      name: "GitHub Actions",
      level: "exceptional",
      category: "DevOps",
      icon: "githubactions",
    },
    {
      name: "Concourse CI",
      level: "outstanding",
      category: "DevOps",
      icon: "concourse",
    },

    // Hypervisors & Cloud Platforms
    { name: "AWS", level: "exceptional", category: "Hypervisors", icon: "aws" },
    {
      name: "Fly.io",
      level: "exceptional",
      category: "Hypervisors",
      icon: "flyio",
    },
    {
      name: "DigitalOcean",
      level: "exceptional",
      category: "Hypervisors",
      icon: "digitalocean",
    },
    {
      name: "Azure",
      level: "advanced",
      category: "Hypervisors",
      icon: "azure",
    },
    { name: "GCP", level: "good", category: "Hypervisors", icon: "gcp" },

    // Tools & APIs
    {
      name: "Postman",
      level: "outstanding",
      category: "Tools",
      icon: "postman",
    },
    {
      name: "Insomnia",
      level: "outstanding",
      category: "Tools",
      icon: "insomnia",
    },
    {
      name: "OpenAPI",
      level: "outstanding",
      category: "Tools",
      icon: "openapi",
    },
    {
      name: "WebSockets",
      level: "outstanding",
      category: "Tools",
      icon: "websockets",
    },
    { name: "Kafka", level: "advanced", category: "Tools", icon: "kafka" },
    { name: "AWS SQS", level: "good", category: "Tools", icon: "sqs" },

    // Project Management
    {
      name: "Trello",
      level: "exceptional",
      category: "Management",
      icon: "trello",
    },
    {
      name: "Jira",
      level: "exceptional",
      category: "Management",
      icon: "jira",
    },
    {
      name: "Asana",
      level: "outstanding",
      category: "Management",
      icon: "asana",
    },
    {
      name: "YouTrack",
      level: "exceptional",
      category: "Management",
      icon: "youtrack",
    },

    // Monitoring
    {
      name: "Grafana",
      level: "exceptional",
      category: "Monitoring",
      icon: "grafana",
    },
    {
      name: "DataDog",
      level: "outstanding",
      category: "Monitoring",
      icon: "datadog",
    },
    {
      name: "CloudWatch",
      level: "outstanding",
      category: "Monitoring",
      icon: "cloudwatch",
    },

    // Creative & ML
    {
      name: "PyTorch",
      level: "good",
      category: "ML/AI",
      icon: "pytorch",
    },
    {
      name: "TensorFlow",
      level: "good",
      category: "ML/AI",
      icon: "tensorflow",
    },
    {
      name: "Diffusers",
      level: "advanced",
      category: "ML/AI",
      icon: "diffusers",
    },
    {
      name: "Transformers",
      level: "advanced",
      category: "ML/AI",
      icon: "transformers",
    },
    {
      name: "Blender",
      level: "exceptional",
      category: "Creative",
      icon: "blender",
    },
    {
      name: "Unity",
      level: "exceptional",
      category: "Creative",
      icon: "unity",
    },
    {
      name: "Unreal Engine",
      level: "good",
      category: "Creative",
      icon: "unreal",
    },
    {
      name: "Godot",
      level: "advanced",
      category: "Creative",
      icon: "godot",
    },
    {
      name: "LOVE2D",
      level: "outstanding",
      category: "Creative",
      icon: "love2d",
    },
    {
      name: "Adobe CC",
      level: "exceptional",
      category: "Creative",
      icon: "adobe",
    },
    { name: "Figma", level: "advanced", category: "Creative", icon: "figma" },

    // Mobile
    {
      name: "Flutter",
      level: "outstanding",
      category: "Mobile",
      icon: "flutter",
    },
    { name: "Cordova", level: "advanced", category: "Mobile", icon: "cordova" },
  ];

  // Color mapping for proficiency levels
  const levelColors = {
    exceptional: "var(--color-primary)",
    outstanding: "#2563eb",
    advanced: "#059669",
    good: "#d97706",
    basic: "#dc2626",
  };

  // Width mapping for visual bars
  const levelWidths = {
    exceptional: "100%",
    outstanding: "90%",
    advanced: "75%",
    good: "60%",
    basic: "40%",
  };

  // Level display names
  const levelNames = {
    exceptional: "Exceptional",
    outstanding: "Outstanding",
    advanced: "Advanced",
    good: "Good",
    basic: "Basic",
  };

  // Level priority for sorting (higher number = higher skill)
  const levelPriority = {
    exceptional: 5,
    outstanding: 4,
    advanced: 3,
    good: 2,
    basic: 1,
  };

  // Group and sort skills by category
  $: groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  // Sort skills within each category by level (highest first)
  $: Object.keys(groupedSkills).forEach((category) => {
    groupedSkills[category].sort(
      (a, b) => levelPriority[b.level] - levelPriority[a.level],
    );
  });

  // Category order for consistent display
  const categoryOrder = [
    "Languages",
    "Web",
    "Styling",
    "Database",
    "DevOps",
    "Hypervisors",
    "Tools",
    "Management",
    "Monitoring",
    "ML/AI",
    "Creative",
    "Mobile",
  ];

  $: orderedCategories = categoryOrder.filter(
    (cat) => groupedSkills[cat]?.length > 0,
  );

  // Track expanded state for each category
  let expandedCategories: Record<string, boolean> = {};

  // Toggle expand/collapse for a category
  function toggleCategory(category: string) {
    expandedCategories[category] = !expandedCategories[category];
    expandedCategories = { ...expandedCategories }; // Trigger reactivity
  }

  // Get visible skills for a category (first 3 or all if expanded)
  function getVisibleSkills(category: string) {
    const skills = groupedSkills[category] || [];
    const isExpanded = expandedCategories[category];
    return isExpanded ? skills : skills.slice(0, 3);
  }

  // Check if category has more than 3 items
  function hasMoreItems(category: string) {
    return (groupedSkills[category] || []).length > 3;
  }
</script>

<div class="programming-container">
  <div class="categories-grid">
    {#each orderedCategories as category}
      <div class="category-section">
        <h3 class="category-title">{category}</h3>
        <div class="skills-list">
          {#each getVisibleSkills(category) as skill}
            <div class="skill-item">
              <div class="skill-header">
                {#if skill.icon}
                  <span class="skill-icon">
                    <svelte:component
                      this={iconMap[skill.icon] || iconMap.default}
                      size={16}
                    />
                  </span>
                {/if}
                <span class="skill-name">{skill.name}</span>
                <span
                  class="skill-level"
                  style="color: {levelColors[skill.level]}"
                >
                  {levelNames[skill.level]}
                </span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-progress"
                  style="width: {levelWidths[
                    skill.level
                  ]}; background-color: {levelColors[skill.level]}"
                ></div>
              </div>
            </div>
          {/each}
        </div>
        {#if hasMoreItems(category)}
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            on:click={() => toggleCategory(category)}
          >
            {expandedCategories[category]
              ? "Show Less"
              : `Show All (${groupedSkills[category].length})`}
          </Button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .programming-container {
    margin: 1.5rem 0;
    padding: 1rem;
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius);
    background: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--color-secondary)
    );
  }

  .categories-grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr;
  }

  .category-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .category-title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    margin: 0;
    padding-bottom: 0.375rem;
    border-bottom: 2px solid
      color-mix(in srgb, var(--color-primary) 30%, transparent);
  }

  .skills-list {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 1fr;
  }

  .skill-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .skill-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-size-sm);
  }

  .skill-icon {
    font-size: 1rem;
    line-height: 1;
    width: 1rem;
    text-align: center;
  }

  .skill-name {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    flex: 1;
    font-size: 0.9rem;
  }

  .skill-level {
    font-size: 0.75rem;
    font-weight: var(--font-weight-normal);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.9;
  }

  .skill-bar {
    height: 2px;
    background-color: color-mix(
      in srgb,
      var(--color-secondary) 25%,
      transparent
    );
    border-radius: 1px;
    overflow: hidden;
  }

  .skill-progress {
    height: 100%;
    border-radius: 1px;
  }

  /* Responsive design */
  @media (min-width: 600px) {
    .skills-list {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }

  @media (min-width: 900px) {
    .programming-container {
      margin: 2rem 0;
      padding: 1.5rem;
    }

    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.75rem;
    }

    .skills-list {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 1200px) {
    .categories-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }
</style>
