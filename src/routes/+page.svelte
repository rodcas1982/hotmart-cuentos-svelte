<script lang="ts">
    import { stories } from '$lib/data/stories';
</script>

<div class="home">
    <header>
        <h1>Biblioteca de Cuentos</h1>
        <p>12 historias bilingües para niños</p>
    </header>
    
    <main class="stories-grid">
        {#each stories as story, i}
            <a href="/story?id={story.id}" class="story-card">
                <div class="card-image">
                    <img src="/images/{story.image}" alt={story.title.es} />
                </div>
                <div class="card-content">
                    <h2>{story.title.es}</h2>
                    <p>{story.title.en}</p>
                </div>
            </a>
        {/each}
    </main>
    
    <footer>
        <p>© Gerardo Rodríguez C</p>
    </footer>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #fafafa;
        min-height: 100vh;
    }
    
    .home {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    header {
        padding: 40px 20px;
        text-align: center;
        background: white;
    }
    
    header h1 {
        font-size: 1.8rem;
        font-weight: 300;
        color: #222;
        margin-bottom: 8px;
    }
    
    header p {
        color: #888;
    }
    
    main {
        flex: 1;
        max-width: 1000px;
        margin: 0 auto;
        padding: 30px 20px;
    }
    
    .stories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
    }
    
    .story-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        text-decoration: none;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        transition: all 0.3s;
    }
    
    .story-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    
    .card-image {
        height: 160px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .card-content {
        padding: 16px;
    }
    
    .card-content h2 {
        font-size: 1rem;
        font-weight: 600;
        color: #222;
        margin-bottom: 4px;
    }
    
    .card-content p {
        font-size: 0.85rem;
        color: #888;
    }
    
    footer {
        padding: 20px;
        text-align: center;
        color: #aaa;
        font-size: 0.8rem;
    }
</style>
