<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { base } from '$app/paths';
    import type { Story } from '$lib/data/nuevos';
    
    const stories = newStories;
    
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const storyId = urlParams.get('story') || '01-valiente';
    const story: Story = stories.find(s => s.id === storyId) || stories[0];
    
    let currentPage = 0;
    let lang: 'es' | 'en' = 'es';
    let isFlipping = false;
    
    // Get gradient based on story
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
    
    $: gradient = gradients[story.id] || gradients['01-valiente'];
    
    $: totalPages = Math.ceil(story.pages.length / 2);
    $: currentPair = Math.floor(currentPage / 2);
    $: currentLeftPage = currentPage;
    $: currentRightPage = currentPage + 1;
    $: hasRightPage = currentRightPage < story.pages.length;
    
    function nextPage() {
        if (currentPage < story.pages.length - 1 && !isFlipping) {
            isFlipping = true;
            setTimeout(() => {
                currentPage += 2;
                if (currentPage >= story.pages.length) currentPage = story.pages.length - 1;
                isFlipping = false;
            }, 150);
        }
    }
    
    function prevPage() {
        if (currentPage > 0 && !isFlipping) {
            isFlipping = true;
            setTimeout(() => {
                currentPage = Math.max(0, currentPage - 2);
                isFlipping = false;
            }, 150);
        }
    }
    
    function goToPage(pageIndex: number) {
        currentPage = pageIndex * 2;
    }
    
    function setLang(l: 'es' | 'en') {
        lang = l;
    }
    
    function goBack() {
        window.location.href = $base + '/';
    }
</script>

<div class="app" style="--gradient: {gradient}">
    <!-- Hero con patrón -->
    <header class="hero">
        <div class="hero-pattern"></div>
        <div class="hero-content">
            <img src="{base}/images/{story.image}" alt={story.title[lang]} class="hero-img" />
            <h1>{story.title[lang]}</h1>
        </div>
    </header>
    
    <!-- Controls -->
    <nav class="controls">
        <button class="back-btn" on:click={goBack}>
            <span class="icon">←</span> Volver
        </button>
        <div class="lang-toggle">
            <button class:active={lang === 'es'} on:click={() => setLang('es')}>ES</button>
            <button class:active={lang === 'en'} on:click={() => setLang('en')}>EN</button>
        </div>
    </nav>
    
    <!-- Book -->
    <main class="book-container">
        <div class="book" class:flipping={isFlipping}>
            <div class="page left" class:visible={currentLeftPage < story.pages.length}>
                {#if currentLeftPage < story.pages.length}
                    <div class="page-content">
                        <p>{story.pages[currentLeftPage][lang]}</p>
                    </div>
                {/if}
            </div>
            <div class="page right" class:visible={hasRightPage}>
                {#if hasRightPage}
                    <div class="page-content">
                        <p>{story.pages[currentRightPage][lang]}</p>
                    </div>
                {/if}
            </div>
            <div class="book-spine"></div>
        </div>
        
        <!-- Navigation -->
        <div class="navigation">
            <button class="nav-btn" on:click={prevPage} disabled={currentPage === 0}>
                <span>◀</span>
            </button>
            <div class="page-indicator">
                {#each Array(totalPages) as _, i}
                    <button 
                        class="page-dot" 
                        class:active={currentPair === i}
                        on:click={() => goToPage(i)}
                        aria-label="Página {i + 1}"
                    ></button>
                {/each}
            </div>
            <button class="nav-btn" on:click={nextPage} disabled={currentPage >= story.pages.length - 1}>
                <span>▶</span>
            </button>
        </div>
    </main>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    :global(body) {
        font-family: 'Baloo 2', 'Fredoka', -apple-system, BlinkMacSystemFont, sans-serif;
        background: var(--gradient);
        min-height: 100vh;
    }
    
    .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    /* Hero */
    .hero {
        position: relative;
        height: 220px;
        overflow: hidden;
    }
    
    .hero-pattern {
        position: absolute;
        inset: 0;
        background-image: 
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 40%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 30%);
    }
    
    .hero-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .hero-img {
        width: 140px;
        height: 140px;
        object-fit: contain;
        filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
    }
    
    .hero h1 {
        color: white;
        font-size: 2rem;
        font-weight: 800;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        margin-top: 10px;
    }
    
    /* Controls */
    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: white;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    .back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        color: #555;
        cursor: pointer;
        padding: 8px 16px;
        border-radius: 25px;
        transition: all 0.2s;
    }
    
    .back-btn:hover {
        background: #f5f5f5;
    }
    
    .back-btn .icon {
        font-size: 1.2rem;
    }
    
    .lang-toggle {
        display: flex;
        gap: 4px;
        background: #f0f0f0;
        padding: 4px;
        border-radius: 25px;
    }
    
    .lang-toggle button {
        background: none;
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        color: #888;
        transition: all 0.3s;
    }
    
    .lang-toggle button.active {
        background: var(--gradient);
        color: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    /* Book */
    .book-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 20px;
    }
    
    .book {
        display: flex;
        width: 100%;
        max-width: 900px;
        height: 380px;
        background: #FFFEF5;
        border-radius: 12px;
        box-shadow: 
            0 10px 40px rgba(0,0,0,0.15),
            inset 0 0 60px rgba(0,0,0,0.03);
        overflow: hidden;
        position: relative;
        transition: transform 0.3s ease;
    }
    
    .book.flipping {
        transform: scale(0.98);
    }
    
    .page {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 40px;
        opacity: 0.5;
        transition: all 0.4s;
    }
    
    .page.visible {
        opacity: 1;
    }
    
    .page.left {
        background: linear-gradient(90deg, #FFFEF5, #FFFEF0);
    }
    
    .page.right {
        background: linear-gradient(90deg, #FFFEF0, #FFFEF5);
    }
    
    .book-spine {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(90deg, #ddd, #eee, #ddd);
        transform: translateX(-50%);
    }
    
    .page-content {
        text-align: center;
    }
    
    .page-content p {
        font-size: 1.15rem;
        line-height: 2;
        color: #444;
    }
    
    /* Navigation */
    .navigation {
        display: flex;
        align-items: center;
        gap: 25px;
        margin-top: 25px;
    }
    
    .nav-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        background: white;
        color: #333;
        font-size: 1.3rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .nav-btn:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }
    
    .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    .page-indicator {
        display: flex;
        gap: 10px;
    }
    
    .page-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: rgba(255,255,255,0.4);
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .page-dot:hover {
        background: rgba(255,255,255,0.7);
    }
    
    .page-dot.active {
        background: white;
        transform: scale(1.3);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    /* Mobile */
    @media (max-width: 600px) {
        .hero {
            height: 180px;
        }
        
        .hero-img {
            width: 100px;
            height: 100px;
        }
        
        .hero h1 {
            font-size: 1.5rem;
        }
        
        .book {
            flex-direction: column;
            height: 320px;
        }
        
        .page {
            padding: 20px;
        }
        
        .page-content p {
            font-size: 1rem;
        }
        
        .book-spine {
            left: 0;
            right: 0;
            top: 50%;
            width: auto;
            height: 2px;
            transform: none;
        }
    }
</style>
