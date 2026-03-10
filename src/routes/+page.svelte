<script lang="ts">
    import { onMount } from 'svelte';
    
    let stories: any[] = [];
    let loading = true;
    let error = '';
    
    onMount(async () => {
        try {
            // Cargar todos los cuentos desde /static/stories/
            const response = await fetch('/stories/');
            const files = await response.text();
            
            // Extraer nombres de archivos .json
            const fileNames = files.match(/[0-9]+-[a-z-]+\.json/g) || [];
            
            // Cargar cada cuento
            const loadedStories = await Promise.all(
                fileNames.slice(0, 20).map(async (file: string) => {
                    try {
                        const res = await fetch(`/stories/${file}`);
                        return await res.json();
                    } catch (e) {
                        return null;
                    }
                })
            );
            
            stories = loadedStories.filter(s => s !== null);
            loading = false;
        } catch (e) {
            error = 'Error cargando cuentos: ' + e;
            loading = false;
        }
    });
</script>

<main>
    {#if loading}
        <div class="loading">Cargando cuentos...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <div class="stories-grid">
            {#each stories as story}
                <a href="/story/{story.id || story.meta?.title?.es?.toLowerCase().replace(/ /g, '-')}" class="story-card">
                    <h3>{story.meta?.title?.es || 'Sin título'}</h3>
                    <p>Edad: {story.meta?.ageRange?.[0]}-{story.meta?.ageRange?.[1]} años</p>
                </a>
            {/each}
        </div>
    {/if}
</main>

<style>
    main { padding: 20px; }
    .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .story-card { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        padding: 20px; 
        border-radius: 12px; 
        color: white;
        text-decoration: none;
    }
    .loading, .error { text-align: center; padding: 50px; }
</style>
