<svelte:head>
  <title>Andrew Lake - zealsprince</title>
</svelte:head>

<div class="landing-container">
  <header>
    <h1>Andrew Lake</h1>
    <h2>zealsprince</h2>
  </header>

  <nav class="tabs">
    <!-- Tabs will go here - kind to emulate a music player type feel where switching between projects and tabs plays a different song, displays a different vibe (with B-sides) -->
    <button>Andrew</button> <!-- A-side: Andrew (Professinal CV link, very tame) / B-side: zealsprince more the real feel of the site -->
    <button>Project B</button>
    <button>Project C</button>
  </nav>
</div>

<style>
  .landing-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
  }

  header {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: #777;
  }

  .tabs button {
    background-color: #333;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    margin: 0 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .tabs button:hover {
    background-color: #555;
  }
</style>
