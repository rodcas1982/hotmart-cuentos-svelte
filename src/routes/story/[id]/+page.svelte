<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    const stories = newStories;
    let story: any = stories[0];
    let currentPage = 0;
    let lang: 'es' | 'en' = 'es';
    let isFlipping = false;
    let fontSize = 18;
    
    let nombreNino = '';
    let animalFavorito = '';
    let animalPersonalizado = '';
    let mostrarAnimalOtro = false;
    let colorFavorito = '';
    let showPersonalizacion = true;
    let personalizado = false;
    
    const animalesComunes = [
        { id: 'perro', emoji: '🐕', nombre: 'Perro' },
        { id: 'gato', emoji: '🐱', nombre: 'Gato' },
        { id: 'leon', emoji: '🦁', nombre: 'León' },
        { id: 'elefante', emoji: '🐘', nombre: 'Elefante' },
        { id: 'dinosaurio', emoji: '🦕', nombre: 'Dinosaurio' },
        { id: 'unicornio', emoji: '🦄', nombre: 'Unicornio' },
        { id: 'conejo', emoji: '🐰', nombre: 'Conejo' },
        { id: 'panda', emoji: '🐼', nombre: 'Panda' },
    ];
    
    const coloresDisponibles = [
        { id: 'rojo', hex: '#FF6B6B', nombre: 'Rojo' },
        { id: 'naranja', hex: '#FF9A56', nombre: 'Naranja' },
        { id: 'amarillo', hex: '#FFD93D', nombre: 'Amarillo' },
        { id: 'verde', hex: '#6BCB77', nombre: 'Verde' },
        { id: 'celeste', hex: '#4D96FF', nombre: 'Celeste' },
        { id: 'azul', hex: '#667eea', nombre: 'Azul' },
        { id: 'morado', hex: '#8E2DE2', nombre: 'Morado' },
        { id: 'rosa', hex: '#F5576C', nombre: 'Rosa' },
        { id: 'fucsia', hex: '#FF6B9D', nombre: 'Fucsia' },
        { id: 'turquesa', hex: '#00D9C0', nombre: 'Turquesa' },
        { id: 'lavanda', hex: '#B4A7D6', nombre: 'Lavanda' },
    ];
    
    const coloresClaros = ['amarillo', 'celeste', 'lavanda', 'turquesa'];
    
    let gradient = 'linear-gradient(135deg, #FF6B6B, #FFE66D)';
    let textoOscuro = false;
    
    onMount(() => {
        const id = $page.params.id;
        const found = stories.find(s => s.id === id);
        if (found) story = found;
    });
    
    function seleccionarAnimal(id: string) {
        animalFavorito = id;
        mostrarAnimalOtro = false;
    }
    
    function mostrarOtro() {
        mostrarAnimalOtro = true;
        animalFavorito = '';
    }
    
    function iniciarCuento() {
        const animalFinal = mostrarAnimalOtro ? animalPersonalizado : animalFavorito;
        
        if (nombreNino && animalFinal && colorFavorito) {
            const color = coloresDisponibles.find(c => c.id === colorFavorito);
            if (color) {
                gradient = `linear-gradient(135deg, ${color.hex}, ${adjustColor(color.hex, 30)})`;
                textoOscuro = coloresClaros.includes(colorFavorito);
            }
            animalFavorito = animalFinal;
            showPersonalizacion = false;
            personalizado = true;
        }
    }
    
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
            .replace(/{ANIMAL_FAVORITO}/g, animalFavorito)
            .replace(/{COLOR}/g, colorFavorito);
    }
    
    $: pages = story?.pages || [];
    $: totalPages = pages.length;
    $: currentPageData = pages[currentPage] || {};
    $: currentContent = replaceVariables(currentPageData[lang] || '');
    $: currentImage = currentPageData.image || '';
    $: currentBgImage = currentPageData.bgImage || '';
    
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
        <div class="personalizacion">
            <div class="icono">✏️🖍️🎨</div>
            <h1>Personaliza tu cuento</h1>
            <p>Ingresa los datos para hacer el cuento único</p>
            
            <div class="form-group">
                <label>Nombre del niño/niña:</label>
                <input type="text" bind:value={nombreNino} placeholder="Ej: Martín" />
            </div>
            
            <div class="form-group">
                <label>Animal favorito:</label>
                <div class="animales">
                    {#each animalesComunes as animal}
                        <button 
                            class="animal-btn" 
                            class:selected={animalFavorito === animal.id && !mostrarAnimalOtro}
                            on:click={() => seleccionarAnimal(animal.id)}
                            title={animal.nombre}
                        >
                            {animal.emoji}
                        </button>
                    {/each}
                    <button class="animal-btn otro" on:click={mostrarOtro} title="Otro">
                        ➕
                    </button>
                </div>
                {#if mostrarAnimalOtro}
                    <input type="text" bind:value={animalPersonalizado} placeholder="Escribe el animal" class="otro-input" />
                {/if}
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
                            title={color.nombre}
                        >
                        </button>
                    {/each}
                </div>
            </div>
            
            <button class="iniciar-btn" on:click={iniciarCuento} disabled={!nombreNino || !(animalFavorito || animalPersonalizado) || !colorFavorito}>
                🎢 Comenzar Aventura
            </button>
        </div>
    {:else}
        <div class="header" class:oscuro={textoOscuro}>
            <a href="{base}/" class="back-btn" class:oscuro={textoOscuro}>← Volver</a>
            <div class="controls-row">
                <button on:click={toggleLang} class="btn" class:oscuro={textoOscuro}>{lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</button>
                <button on:click={() => changeFontSize(-2)} class="btn" class:oscuro={textoOscuro}>A-</button>
                <button on:click={() => changeFontSize(2)} class="btn" class:oscuro={textoOscuro}>A+</button>
                <button on:click={downloadPDF} class="btn" class:oscuro={textoOscuro}>📥 PDF</button>
            </div>
        </div>
        
        <div class="book" class:has-bg={!!currentBgImage} style={currentBgImage ? `background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('${currentBgImage}'); background-size: cover; background-position: center;` : ''}>
            <div class="page" class:flipping={isFlipping}>
                {#if currentImage}
                    <img src={currentImage} alt="" class="page-image" />
                {/if}
                <h1 class="titulo-decorativo" style="font-size: {fontSize + 8}px">{story?.title?.[lang] || ''}</h1>
                <p class="content" style="font-size: {fontSize}px; line-height: {fontSize * 1.6}px">{currentContent}</p>
                <div class="page-number">{currentPage + 1} / {totalPages}</div>
            </div>
        </div>
        
        <div class="controls" class:oscuro={textoOscuro}>
            <button on:click={prevPage} disabled={currentPage === 0} class="nav-btn">◀ Anterior</button>
            <div class="dots">
                {#each pages as _, i}<span class="dot" class:active={i === currentPage}></span>{/each}
            </div>
            <button on:click={nextPage} disabled={currentPage === totalPages - 1} class="nav-btn">Siguiente ▶</button>
        </div>
    {/if}
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pinyon+Script&display=swap');
    
    .story-container { min-height: 100vh; padding: 20px; color: white; }
    .personalizacion { max-width: 500px; margin: 50px auto; background: white; border-radius: 20px; padding: 40px; color: #333; text-align: center; }
    .icono { font-size: 50px; margin-bottom: 10px; }
    .personalizacion h1 { color: #8E2DE2; margin-bottom: 10px; }
    .personalizacion p { color: #666; margin-bottom: 30px; }
    .form-group { margin-bottom: 25px; text-align: left; }
    .form-group label { display: block; font-weight: bold; margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; }
    .form-group input:focus { border-color: #8E2DE2; outline: none; }
    .animales { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .animal-btn { width: 50px; height: 50px; border-radius: 12px; border: 3px solid #ddd; background: white; cursor: pointer; font-size: 24px; transition: transform 0.2s; }
    .animal-btn:hover { transform: scale(1.1); }
    .animal-btn.selected { border-color: #8E2DE2; background: #f3e5f5; }
    .animal-btn.otro { border-style: dashed; }
    .otro-input { margin-top: 10px !important; }
    .colores { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .color-btn { width: 38px; height: 38px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: transform 0.2s; }
    .color-btn:hover { transform: scale(1.1); }
    .color-btn.selected { border-color: #333; transform: scale(1.15); }
    .iniciar-btn { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: white; border: none; padding: 15px 40px; border-radius: 30px; font-size: 18px; cursor: pointer; font-weight: bold; }
    .iniciar-btn:disabled { opacity: 0.5; }
    
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 10px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 15px; }
    .header.oscuro { background: rgba(255,255,255,0.9); }
    .back-btn, .btn { background: rgba(255,255,255,0.25); border: none; padding: 10px 16px; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; font-weight: bold; }
    .back-btn.oscuro, .btn.oscuro { color: #333; background: rgba(0,0,0,0.1); }
    .controls-row { display: flex; gap: 8px; }
    
    .book { background: white; color: #333; border-radius: 10px; padding: 40px; min-height: 450px; max-width: 700px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
    .book.has-bg { background-size: cover; background-position: center; }
    .page-image { max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto; }
    .titulo-decorativo { font-family: 'Dancing Script', 'Pinyon Script', cursive; font-weight: 700; background: linear-gradient(135deg, #8E2DE2, #4A00E0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; margin-bottom: 20px; }
    .content { margin: 30px 0; text-align: justify; }
    .page-number { text-align: center; color: #666; margin-top: 20px; }
    
    .controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 15px; }
    .controls.oscuro { background: rgba(255,255,255,0.9); }
    .nav-btn { background: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; }
    .nav-btn:disabled { opacity: 0.5; }
    .dots { display: flex; gap: 8px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.5); }
    .dot.active { background: white; }
    .controls.oscuro .dot { background: rgba(0,0,0,0.3); }
    .controls.oscuro .dot.active { background: #8E2DE2; }
    
    @media print { .header, .controls, .personalizacion { display: none; } }
</style>
