<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    const stories = newStories;
    let story: Story = stories[0];
    let currentPage = 0;
    let lang: 'es' | 'en' = 'es';
    let isFlipping = false;
    let fontSize = 18;
    
    // Variables de personalización
    let nombreNino = '';
    let animalFavorito = '';
    let colorFavorito = '';
    let showPersonalizacion = true;
    let personalizado = false;
    
    const coloresDisponibles = [
        { id: 'rojo', hex: '#FF6B6B', nombre: 'Rojo' },
        { id: 'azul', hex: '#667eea', nombre: 'Azul' },
        { id: 'verde', hex: '#11998e', nombre: 'Verde' },
        { id: 'amarillo', hex: '#F7971E', nombre: 'Amarillo' },
        { id: 'morado', hex: '#8E2DE2', nombre: 'Morado' },
        { id: 'rosa', hex: '#F5576C', nombre: 'Rosa' },
    ];
    
    let gradient = 'linear-gradient(135deg, #FF6B6B, #FFE66D)';
    
    onMount(() => {
        const id = $page.params.id;
        const found = stories.find(s => s.id === id);
        if (found) story = found;
    });
    
    function iniciarCuento() {
        if (nombreNino && animalFavorito && colorFavorito) {
            // Buscar el color seleccionado
            const color = coloresDisponibles.find(c => c.id === colorFavorito);
            if (color) {
                // Crear gradiente con el color favorito
                gradient = `linear-gradient(135deg, ${color.hex}, ${adjustColor(color.hex, 30)})`;
            }
            showPersonalizacion = false;
            personalizado = true;
        }
    }
    
    // Ajustar color para hacer gradiente
    function adjustColor(hex: string, amount: number): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (num & 0x0000FF) + amount);
        return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }
    
    function replaceVariables(text: string): string {
        if (!personalizado) return text;
        return text
            .replace(/{NOMBRE_NIÑO}/g, nombreNino)
            .replace(/{ANIMAL_FAVORITO}/g, animalFavorito);
    }
    
    $: pages = story?.pages || [];
    $: totalPages = pages.length;
    $: currentContent = replaceVariables(pages[currentPage]?.[lang] || '');
    
    function nextPage() {
        if (currentPage < totalPages - 1) { isFlipping = true; setTimeout(() => { currentPage++; isFlipping = false; }, 150); }
    }
    function prevPage() {
        if (currentPage > 0) { isFlipping = true; setTimeout(() => { currentPage--; isFlipping = false; }, 150); }
    }
    function toggleLang() { lang = lang === 'es' ? 'en' : 'es'; }
    function changeFontSize(delta: number) { fontSize = Math.max(14, Math.min(28, fontSize + delta)); }
    function downloadPDF() { window.print(); }
</script>

<div class="story-container" style="background: {gradient}">
    {#if showPersonalizacion}
        <!-- Pantalla de personalización -->
        <div class="personalizacion">
            <h1>🎭 Personaliza tu cuento</h1>
            <p>Ingresa los datos para hacer el cuento único</p>
            
            <div class="form-group">
                <label>Nombre del niño/niña:</label>
                <input type="text" bind:value={nombreNino} placeholder="Ej: Martín" />
            </div>
            
            <div class="form-group">
                <label>Animal favorito:</label>
                <input type="text" bind:value={animalFavorito} placeholder="Ej: Perro, Gato, León" />
            </div>
            
            <div class="form-group">
                <label>Color favorito:</label>
                <div class="colores">
                    {#each coloresDisponibles as color}
                        <button 
                            class="color-btn" 
                            class:selected={colorFavorito === color.id}
                            style="background: {color.hex}"
                            on:click={() => colorFavorito = color.id}
                        >
                            {color.nombre}
                        </button>
                    {/each}
                </div>
            </div>
            
            <button class="iniciar-btn" on:click={iniciarCuento} disabled={!nombreNino || !animalFavorito || !colorFavorito}>
                🎢 Comenzar Aventura
            </button>
        </div>
    {:else}
        <!-- Contenido del cuento -->
        <div class="header">
            <a href="{base}/" class="back-btn">← Volver</a>
            <div class="controls-row">
                <button on:click={toggleLang} class="btn">{lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</button>
                <button on:click={() => changeFontSize(-2)} class="btn">A-</button>
                <button on:click={() => changeFontSize(2)} class="btn">A+</button>
                <button on:click={downloadPDF} class="btn">📥 PDF</button>
            </div>
        </div>
        
        <div class="book">
            <div class="page" class:flipping={isFlipping}>
                <h1 style="font-size: {fontSize + 8}px">{story?.title?.[lang] || ''}</h1>
                <p class="content" style="font-size: {fontSize}px; line-height: {fontSize * 1.6}px">{currentContent}</p>
                <div class="page-number">{currentPage + 1} / {totalPages}</div>
            </div>
        </div>
        
        <div class="controls">
            <button on:click={prevPage} disabled={currentPage === 0} class="nav-btn">◀ Anterior</button>
            <div class="dots">
                {#each pages as _, i}<span class="dot" class:active={i === currentPage}></span>{/each}
            </div>
            <button on:click={nextPage} disabled={currentPage === totalPages - 1} class="nav-btn">Siguiente ▶</button>
        </div>
    {/if}
</div>

<style>
    .story-container { min-height: 100vh; padding: 20px; color: white; }
    .personalizacion { max-width: 500px; margin: 50px auto; background: white; border-radius: 20px; padding: 40px; color: #333; text-align: center; }
    .personalizacion h1 { color: #8E2DE2; margin-bottom: 10px; }
    .personalizacion p { color: #666; margin-bottom: 30px; }
    .form-group { margin-bottom: 25px; text-align: left; }
    .form-group label { display: block; font-weight: bold; margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; }
    .form-group input:focus { border-color: #8E2DE2; outline: none; }
    .colores { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .color-btn { width: 70px; height: 70px; border-radius: 50%; border: 4px solid transparent; cursor: pointer; color: white; font-weight: bold; }
    .color-btn.selected { border-color: #333; transform: scale(1.1); }
    .iniciar-btn { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: white; border: none; padding: 15px 40px; border-radius: 30px; font-size: 18px; cursor: pointer; font-weight: bold; }
    .iniciar-btn:disabled { opacity: 0.5; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 10px; }
    .back-btn, .btn { background: rgba(255,255,255,0.2); border: none; padding: 10px 16px; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; }
    .controls-row { display: flex; gap: 8px; }
    .book { background: white; color: #333; border-radius: 10px; padding: 40px; min-height: 450px; max-width: 700px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
    .content { margin: 30px 0; text-align: justify; }
    .page-number { text-align: center; color: #666; margin-top: 20px; }
    .controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; }
    .nav-btn { background: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
    .nav-btn:disabled { opacity: 0.5; }
    .dots { display: flex; gap: 8px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5); }
    .dot.active { background: white; }
    @media print { .header, .controls, .personalizacion { display: none; } }
</style>
