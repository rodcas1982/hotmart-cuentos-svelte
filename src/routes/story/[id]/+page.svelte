<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import type { Story } from '$lib/data/nuevos';
    import { onMount } from 'svelte';
    
    const stories = newStories;
    let story: Story = stories[0];
    let currentPage = 0;
    let lang: 'es' | 'en' = 'es';
    let isFlipping = false;
    
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
        if (found) {
            story = found;
        }
    });
    
    // Obtener página actual
    $: currentLang = lang;
    $: pages = story?.pages || [];
    $: totalPages = pages.length;
    $: gradient = gradients[story?.id] || gradients['01-valiente'];
    
    function nextPage() {
        if (currentPage < totalPages - 1) {
            isFlipping = true;
            setTimeout(() => {
                currentPage++;
                isFlipping = false;
            }, 150);
        }
    }
    
    function prevPage() {
        if (currentPage > 0) {
            isFlipping = true;
            setTimeout(() => {
                currentPage--;
                isFlipping = false;
            }, 150);
        }
    }
    
    function toggleLang() {
        lang = lang === 'es' ? 'en' : 'es';
    }
    
    // Función para descargar PDF
    async function downloadPDF() {
        const content = pages[currentPage]?.[lang] || '';
        const title = story?.title?.[lang] || 'Cuento';
        
        // Usar la herramienta pdf de OpenClaw para generar PDF
        // Por ahora, usamos window.print() que es más simple
        window.print();
    }
</script>

<div class="story-container" style="background: {gradient}">
    <div class="header">
        <a href="{base}/" class="back-btn">← Volver</a>
        <div class="lang-toggle">
            <button on:click={toggleLang} class="lang-btn">
                {lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
            </button>
            <button on:click={downloadPDF} class="pdf-btn">
                📥 PDF
            </button>
        </div>
    </div>
    
    <div class="book">
        <div class="page" class:flipping={isFlipping}>
            <h1>{story?.title?.[lang] || ''}</h1>
            <p class="content">{pages[currentPage]?.[lang] || ''}</p>
            <div class="page-number">{currentPage + 1} / {totalPages}</div>
        </div>
    </div>
    
    <div class="controls">
        <button on:click={prevPage} disabled={currentPage === 0} class="nav-btn">
            ◀ Anterior
        </button>
        <div class="dots">
            {#each pages as _, i}
                <span class="dot" class:active={i === currentPage}></span>
            {/each}
        </div>
        <button on:click={nextPage} disabled={currentPage === totalPages - 1} class="nav-btn">
            Siguiente ▶
        </button>
    </div>
</div>

<style>
    .story-container {
        min-height: 100vh;
        padding: 20px;
        color: white;
    }
    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
    .back-btn, .lang-btn, .pdf-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 16px;
    }
    .book {
        background: white;
        color: #333;
        border-radius: 10px;
        padding: 40px;
        min-height: 400px;
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .content {
        font-size: 18px;
        line-height: 1.8;
        margin: 30px 0;
    }
    .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 30px;
    }
    .nav-btn {
        background: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
    }
    .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .dots {
        display: flex;
        gap: 8px;
    }
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
    }
    .dot.active {
        background: white;
    }
    @media print {
        .header, .controls {
            display: none;
        }
    }
</style>
