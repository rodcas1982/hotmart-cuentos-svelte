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
    
    const gradients: Record<string, string> = {
        '01-valiente': 'linear-gradient(135deg, #FF6B6B, #FFE66D)',
        '02-luna': 'linear-gradient(135deg, #667eea, #764ba2)',
        '03-max': 'linear-gradient(135deg, #11998e, #38ef7d)',
        '04-sofia': 'linear-gradient(135deg, #56ab2f, #a8e063)',
        '05-tito': 'linear-gradient(135deg, #F7971E, #FFD200)',
        '06-dragon': 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
        '07-lunaviaje': 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
        '08-selva': 'linear-gradient(135deg, #134E5E, #71B280)',
        '09-castillo': 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
        '10-contando': 'linear-gradient(135deg, #FC466B, #3F5EFB)',
        '11-abc': 'linear-gradient(135deg, #F093FB, #F5576C)',
        '12-colores': 'linear-gradient(135deg, #FF416C, #FF4B2B)'
    };

    onMount(() => {
        const id = $page.params.id;
        const found = stories.find(s => s.id === id);
        if (found) story = found;
    });
    
    $: pages = story?.pages || [];
    $: totalPages = pages.length;
    $: gradient = gradients[story?.id] || gradients['01-valiente'];
    
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
            <p class="content" style="font-size: {fontSize}px; line-height: {fontSize * 1.6}px">{pages[currentPage]?.[lang] || ''}</p>
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
</div>

<style>
    .story-container { min-height: 100vh; padding: 20px; color: white; }
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
    @media print { .header, .controls { display: none; } }
</style>
