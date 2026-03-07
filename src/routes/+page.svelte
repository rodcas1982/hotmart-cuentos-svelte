<script lang="ts">
    import { stories } from '$lib/data/stories';
    import { base } from '$app/paths';
    
    // Agrupar por series (3 cuentos cada una = 4 series)
    const series = [
        { name: 'Serie 1: Valores en Acción', stories: stories.slice(0, 3), color: '#FF6B6B' },
        { name: 'Serie 2: Cuentos para Dormir', stories: stories.slice(3, 6), color: '#4ECDC4' },
        { name: 'Serie 3: Aprende y Descubre', stories: stories.slice(6, 9), color: '#45B7D1' },
        { name: 'Serie 4: Colección Extra', stories: stories.slice(9, 12), color: '#96CEB4' }
    ];
    
    // Comentarios de psicólogos y padres
    const testimonials = [
        { 
            text: "Estos cuentos ayudan a los niños a desarrollar valores desde temprana edad. La personalización hace que se identifiquen con los personajes.",
            autor: "Dra. María García",
            cargo: "Psicóloga Infantil"
        },
        {
            text: "Mi hija de 5 años no quiere dormir sin escuchar un cuento. Ha aprendido a compartir y ser honesta gracias a estas historias.",
            autor: "Carlos Mendoza",
            cargo: "Padre de familia"
        }
    ];
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="home">
    <!-- Header moderno con colores mejorados -->
    <header>
        <div class="header-bg">
            <div class="shapes">
                <div class="shape s1"></div>
                <div class="shape s2"></div>
                <div class="shape s3"></div>
                <div class="shape s4"></div>
            </div>
        </div>
        <div class="header-content">
            <div class="logo">📚</div>
            <h1>Biblioteca de Cuentos</h1>
            <p>12 historias bilingües mágicas para crecer con valores</p>
            <div class="badges">
                <span class="badge">Español</span>
                <span class="badge">English</span>
            </div>
        </div>
    </header>
    
    <!-- Testimonios de psicólogos y padres -->
    <section class="testimonials">
        {#each testimonials as t}
            <div class="testimonial">
                <p class="quote">"{t.text}"</p>
                <p class="autor"><strong>{t.autor}</strong> - {t.cargo}</p>
            </div>
        {/each}
    </section>
    
    <!-- Series分组 -->
    <main class="container">
        {#each series as serie}
            <div class="serie-section">
                <h2 class="serie-title" style="--serie-color: {serie.color}">{serie.name}</h2>
                <div class="stories-grid">
                    {#each serie.stories as story, i}
                        {@const globalIndex = stories.indexOf(story)}
                        <a href="{base}/story?id={story.id}" class="story-card" style="--card-color: {serie.color}">
                            <div class="card-img-wrap">
                                <img src="{base}/images/{story.image}" alt={story.title.es} />
                            </div>
                            <div class="card-body">
                                <h2>{story.title.es}</h2>
                                <p class="en">{story.title.en}</p>
                                <span class="pages">{story.pages.length} páginas</span>
                            </div>
                            <div class="card-decoration"></div>
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </main>
    
    <footer>
        <p>Hecho con amor para familias que quieren criar hijos con valores</p>
        <p class="sub">Gerardo Rodríguez C</p>
    </footer>
</div>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    :global(body) {
        font-family: 'Baloo 2', 'Fredoka', -apple-system, BlinkMacSystemFont, sans-serif;
        background: #f8f9fe;
        min-height: 100vh;
    }
    
    .home {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    /* Header - colores mejorados */
    header {
        position: relative;
        padding: 50px 20px 60px;
        background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%);
        overflow: hidden;
    }
    
    .header-bg {
        position: absolute;
        inset: 0;
    }
    
    .shapes {
        position: absolute;
        inset: 0;
        overflow: hidden;
    }
    
    .shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
        background: white;
    }
    
    .s1 { width: 200px; height: 200px; top: -50px; right: -50px; }
    .s2 { width: 150px; height: 150px; bottom: -30px; left: 10%; }
    .s3 { width: 80px; height: 80px; top: 20%; left: 20%; }
    .s4 { width: 120px; height: 120px; bottom: -40px; right: 20%; }
    
    .header-content {
        position: relative;
        z-index: 1;
        text-align: center;
    }
    
    .logo {
        font-size: 4rem;
        margin-bottom: 15px;
        animation: bounce 2s ease infinite;
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    header h1 {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        margin-bottom: 8px;
    }
    
    header p {
        font-size: 1.2rem;
        color: rgba(255,255,255,0.95);
        margin-bottom: 20px;
    }
    
    .badges {
        display: flex;
        justify-content: center;
        gap: 12px;
    }
    
    .badge {
        background: rgba(255,255,255,0.25);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        color: white;
        font-weight: 600;
    }
    
    /* Testimonios */
    .testimonials {
        background: white;
        padding: 30px 20px;
        margin: -30px 20px 0;
        position: relative;
        z-index: 2;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .testimonial {
        text-align: center;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    
    .testimonial:last-child {
        border-bottom: none;
    }
    
    .quote {
        font-size: 1.05rem;
        color: #555;
        font-style: italic;
        margin-bottom: 10px;
        line-height: 1.5;
    }
    
    .autor {
        font-size: 0.9rem;
        color: #888;
    }
    
    .autor strong {
        color: #FF6B6B;
    }
    
    /* Container */
    .container {
        flex: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    
    /* Serie */
    .serie-section {
        margin-bottom: 50px;
    }
    
    .serie-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--serie-color);
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 3px solid var(--serie-color);
    }
    
    .stories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 25px;
    }
    
    /* Card - imagen más grande */
    .story-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        text-decoration: none;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
    }
    
    .story-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .card-img-wrap {
        height: 220px; /* Más grande que antes (180px) */
        background: linear-gradient(135deg, var(--card-color) 0%, color-mix(in srgb, var(--card-color) 70%, white) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    
    .card-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
    }
    
    .card-body {
        padding: 20px;
    }
    
    .card-body h2 {
        font-size: 1.15rem;
        font-weight: 800;
        color: #333; /* NO blanco - legible */
        margin-bottom: 4px;
    }
    
    .card-body .en {
        font-size: 0.95rem;
        color: #666;
        font-style: italic;
        margin-bottom: 12px;
    }
    
    .pages {
        display: inline-block;
        background: var(--card-color);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .card-decoration {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
    }
    
    /* Footer */
    footer {
        padding: 30px;
        text-align: center;
        color: #666;
        font-size: 1rem;
        background: white;
    }
    
    footer .sub {
        color: #999;
        font-size: 0.85rem;
        margin-top: 5px;
    }
    
    /* Mobile */
    @media (max-width: 600px) {
        header {
            padding: 40px 20px 50px;
        }
        
        header h1 {
            font-size: 1.8rem;
        }
        
        .testimonials {
            margin: -20px 15px 0;
            padding: 20px 15px;
        }
        
        .stories-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .card-img-wrap {
            height: 150px;
        }
        
        .card-body {
            padding: 12px;
        }
        
        .card-body h2 {
            font-size: 1rem;
        }
    }
</style>
