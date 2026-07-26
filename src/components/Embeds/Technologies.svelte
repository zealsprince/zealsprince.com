<script lang="ts">
  import type { Skill } from '$/lib/data/skills'
  import type { Component } from 'svelte'
  import { TIER_WIDTH, tierColor } from '$/lib/data/proficiency'
  import { SKILL_CATEGORY_ORDER, SKILL_LEVELS, SKILLS } from '$/lib/data/skills'

  import {
    SiApache,
    SiApachecordova,
    SiApachekafka,
    SiAsana,
    SiBlender,
    SiBootstrap,
    SiClickhouse,
    SiCplusplus,
    SiCss,
    SiDart,
    SiDatadog,
    SiDeno,
    SiDigitalocean,
    SiDocker,
    SiElasticsearch,
    SiElectron,
    SiFigma,
    SiFlask,
    SiFlutter,
    SiFlydotio,
    SiGithubactions,
    SiGnubash,
    SiGo,
    SiGodotengine,
    SiGooglecloud,
    SiGrafana,
    SiGraphql,
    SiHuggingface,
    SiInsomnia,
    SiJavascript,
    SiJira,
    SiKubernetes,
    SiLua,
    SiMongodb,
    SiNextdotjs,
    SiNginx,
    SiNodedotjs,
    SiOpenapiinitiative,
    SiP5dotjs,
    SiPhp,
    SiPostgresql,
    SiPostman,
    SiPython,
    SiPytorch,
    SiReact,
    SiRedis,
    SiRuby,
    SiRust,
    SiSharp,
    SiTailwindcss,
    SiTensorflow,
    SiThreedotjs,
    SiTrello,
    SiTypescript,
    SiUnity,
    SiUnrealengine,
    SiVite,
    SiVuedotjs,
  } from '@icons-pack/svelte-simple-icons'

  import {
    Code,
    Cpu,
    Database,
    GitBranch,
    Globe,
    MessageSquare,
    Monitor,
    Palette,
    Server,
    Settings,
    Smartphone,
    Zap,
  } from '@lucide/svelte'
  import Button from '../Button.svelte'

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
    css: SiCss,
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
    aws: Server, // No AWS icon in simple-icons v7
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
    sqs: Server, // AWS SQS

    // Project Management
    trello: SiTrello,
    jira: SiJira,
    asana: SiAsana,
    youtrack: Settings, // Fallback to settings icon

    // Monitoring
    datadog: SiDatadog,
    grafana: SiGrafana,
    cloudwatch: Monitor, // AWS CloudWatch

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
  }

  interface Props {
    skills?: Skill[]
  }

  const { skills = SKILLS }: Props = $props()

  // Group and sort skills by category in a single derived
  const groupedSkills = $derived(
    skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
      },
      {} as Record<string, Skill[]>,
    ),
  )

  // Strongest first within each category
  const sortedGroupedSkills = $derived(
    Object.fromEntries(
      Object.entries(groupedSkills).map(([cat, catSkills]) => [
        cat,
        [...catSkills].sort(
          (a, b) => SKILL_LEVELS[b.level].tier - SKILL_LEVELS[a.level].tier,
        ),
      ]),
    ),
  )

  const orderedCategories = $derived(
    SKILL_CATEGORY_ORDER.filter(cat => sortedGroupedSkills[cat]?.length > 0),
  )

  // Track expanded state for each category
  const expandedCategories: Record<string, boolean> = $state({})

  function toggleCategory(category: string) {
    expandedCategories[category] = !expandedCategories[category]
  }

  // Get visible skills for a category (first 3 or all if expanded)
  function getVisibleSkills(category: string) {
    const catSkills = sortedGroupedSkills[category] || []
    const isExpanded = expandedCategories[category]
    return isExpanded ? catSkills : catSkills.slice(0, 3)
  }

  // Check if category has more than 3 items
  function hasMoreItems(category: string) {
    return (sortedGroupedSkills[category] || []).length > 3
  }
</script>

<div class="programming-container">
  <div class="categories-grid">
    {#each orderedCategories as category (category)}
      <div class="category-section">
        <h3 class="category-title">{category}</h3>
        <div class="skills-list">
          {#each getVisibleSkills(category) as skill (skill.name)}
            {@const level = SKILL_LEVELS[skill.level]}
            <div class="skill-item">
              <div class="skill-header">
                {#if skill.icon}
                  {@const IconComponent = iconMap[skill.icon] || iconMap.default}
                  <span class="skill-icon">
                    <IconComponent size={16} />
                  </span>
                {/if}
                <span class="skill-name">{skill.name}</span>
                <span class="skill-level" style="color: {tierColor(level.tier)}">
                  {level.label}
                </span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-progress"
                  style="width: {TIER_WIDTH[level.tier]}; background-color: {tierColor(level.tier)}"
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
            onclick={() => toggleCategory(category)}
          >
            {expandedCategories[category]
              ? 'Show Less'
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
