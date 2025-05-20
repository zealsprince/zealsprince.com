<script lang="ts">
  import Content from "@/components/Content.svelte";
  export let data: { html: string; gallery: string[]; frontmatter: any };

  // Placeholder for B-side p5.js sketch
  // You can replace this with a real p5.js or ThreeJS sketch
  import p5 from "p5";

  function sketch(p: p5) {
    p.setup = () => {
      p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
      p.background(16, 16, 20);
    };
    p.draw = () => {
      p.background(16, 16, 20, 240);
      p.rotateY(-p.millis() / 1200);
      p.noStroke();
      p.ambientLight(40, 0, 80);
      p.pointLight(255, 0, 180, 0, 0, 300);
      p.specularMaterial(200, 0, 180);
      p.torus(120, 32, 64, 32);
    };
  }

  const landingVisual = document.getElementById("landing-visual");
  if (landingVisual) {
    // eslint-disable-next-line new-cap
    const p5Instance = new p5(sketch, landingVisual);

    p5Instance.windowResized = () => {
      p5Instance.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  }
</script>

<div id="landing-visual"></div>

<Content {data} />
