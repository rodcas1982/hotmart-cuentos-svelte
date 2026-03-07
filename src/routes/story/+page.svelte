<script lang="ts">
    import { stories, type Story } from '$lib/data/stories';
    
    // Get story from URL
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const storyId = urlParams.get('story') || '01-valiente';
    const story: Story = stories.find(s => s.id === storyId) || stories[0];
    
    let currentPage = 0;
    let lang: 'es' | 'en' = 'es';
    let isFlipping = false;
    
    // Calculate total pages (pairs for book view)
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
        window.location.href = '/';
    }
</script>

<div class="app">
    <!-- Hero Image -->
    <header class="hero">
        <img src="/images/{story.image}" alt={story.title[lang]} />
        <div class="hero-overlay">
            <h1>{story.title[lang]}</h1>
        </div>
    </header>
    
    <!-- Controls -->
    <nav class="controls">
        <button class="back-btn" on:click={goBack}>← Volver</button>
        <div class="controls-right">
            <div class="lang-toggle">
                <button class:active={lang === 'es'} on:click={() => setLang('es')}>ES</button>
                <button class:active={lang === 'en'} on:click={() => setLang('en')}>EN</button>
            </div>
        </div>
    </nav>
    
    <!-- Book Carousel -->
    <main class="book-container">
        <div class="book" class:flipping={isFlipping}>
            <!-- Left Page -->
            <div class="page left" class:visible={currentLeftPage < story.pages.length}>
                {#if currentLeftPage < story.pages.length}
                    <div class="page-content">
                        <p>{story.pages[currentLeftPage][lang]}</p>
                    </div>
                {/if}
            </div>
            
            <!-- Right Page -->
            <div class="page right" class:visible={hasRightPage}>
                {#if hasRightPage}
                    <div class="page-content">
                        <p>{story.pages[currentRightPage][lang]}</p>
                    </div>
                {/if}
            </div>
        </div>
        
        <!-- Navigation -->
        <div class="navigation">
            <button class="nav-btn" on:click={prevPage} disabled={currentPage === 0}>◀</button>
            <div class="page-indicator">
                {#each Array(totalPages) as _, i}
                    <button 
                        class="page-dot" 
                        class:active={currentPair === i}
                        on:click={() => goToPage(i)}
                    ></button>
                {/each}
            </div>
            <button class="nav-btn" on:click={nextPage} disabled={currentPage >= story.pages.length - 1}>▶</button>
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #fafafa;
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
        width: 100%;
        height: 250px;
        background: white;
        overflow: hidden;
    }
    
    .hero img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .hero-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    
    .hero h1 {
        color: white;
        font-size: 1.8rem;
        font-weight: 300;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    /* Controls */
    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        background: white;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    .back-btn {
        background: none;
        border: none;
        font-size: 1rem;
        color: #666;
        cursor: pointer;
    }
    
    .lang-toggle {
        display: flex;
        gap: 4px;
        background: #f5f5f5;
        padding: 4px;
        border-radius: 20px;
    }
    
    .lang-toggle button {
        background: none;
        border: none;
        padding: 6px 14px;
        border-radius: 16px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        color: #999;
        transition: all 0.2s;
    }
    
    .lang-toggle button.active {
        background: #222;
        color: white;
    }
    
    /* Book Container */
    .book-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: #f5f5f5;
    }
    
    .book {
        display: flex;
        width: 100%;
        max-width: 800px;
        height: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        overflow: hidden;
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
        padding: 30px;
        opacity: 0.4;
        transition: opacity 0.3s;
    }
    
    .page.visible {
        opacity: 1;
    }
    
    .page.left {
        border-right: 1px solid #eee;
    }
    
    .page-content {
        text-align: center;
    }
    
    .page-content p {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #333;
    }
    
    /* Navigation */
    .navigation {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    
    .nav-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background: white;
        color: #333;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    
    .nav-btn:hover:not(:disabled) {
        background: #222;
        color: white;
    }
    
    .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    .page-indicator {
        display: flex;
        gap: 8px;
    }
    
    .page-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: #ddd;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .page-dot.active {
        background: #222;
        transform: scale(1.2);
    }
    
    /* Mobile */
    @media (max-width: 600px) {
        .hero {
            height: 180px;
        }
        
        .book {
            flex-direction: column;
            height: 300px;
        }
        
        .page {
            border-right: none;
            border-bottom: 1px solid #eee;
        }
        
        .page-content p {
            font-size: 1rem;
        }
    }
</style>
