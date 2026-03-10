<script lang="ts">
    import { onMount } from 'svelte';
    
    // Datos hardcoded de ejemplo (siempre funcionan)
    const stories = [
        { id: 'el-pequeno-valiente', title: 'El Pequeño Valiente', age: '3-6' },
        { id: 'luna-honesta', title: 'Luna la Honesta', age: '3-6' },
        { id: 'max-amistad', title: 'Max y la Amistad', age: '4-7' },
        { id: 'sofia-naturaleza', title: 'Sofia Respeta la Naturaleza', age: '4-7' },
        { id: 'tito-compartir', title: 'Tito Aprende a Compartir', age: '3-5' },
    ];
</script>

<main>
    <h1>📚 Biblioteca de Cuentos</h1>
    <p>Cuentos interactivos para niños</p>
    
    <div class="stories">
        {#each stories as story}
            <a href="/story/{story.id}" class="card">
                <h3>{story.title}</h3>
                <span>Edad: {story.age} años</span>
            </a>
        {/each}
    </div>
    
    <p style="margin-top: 30px; opacity: 0.7">Total: {stories.length} cuentos</p>
</main>

<style>
    main { 
        padding: 40px 20px; 
        max-width: 800px; 
        margin: 0 auto;
        font-family: system-ui, sans-serif;
    }
    h1 { color: #667eea; text-align: center; }
    p { text-align: center; color: #666; }
    .stories { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
        gap: 20px; 
        margin-top: 30px;
    }
    .card { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px 20px;
        border-radius: 16px;
        color: white;
        text-decoration: none;
        text-align: center;
        transition: transform 0.2s;
    }
    .card:hover { transform: scale(1.05); }
    .card h3 { margin: 0 0 10px 0; font-size: 1.1rem; }
    .card span { font-size: 0.85rem; opacity: 0.9; }
</style>
