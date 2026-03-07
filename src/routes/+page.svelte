<script lang="ts">
    import { stories } from '$lib/data/stories';
    import { base } from '$app/paths';
    
    let lang: 'es' | 'en' = 'es';
    let currentTestimonialIndex = 0;
    
    // Agrupar por series (3 cuentos cada una = 4 series)
    const series = [
        { name: 'Serie 1: Valores en Acción', stories: stories.slice(0, 3), color: '#FF6B6B' },
        { name: 'Serie 2: Cuentos para Dormir', stories: stories.slice(3, 6), color: '#4ECDC4' },
        { name: 'Serie 3: Aprende y Descubre', stories: stories.slice(6, 9), color: '#45B7D1' },
        { name: 'Serie 4: Colección Extra', stories: stories.slice(9, 12), color: '#96CEB4' }
    ];
    
    // 10 Comentarios de psicólogos, padres y educadores
    const testimonials = [
        { 
            text_es: "Estos cuentos ayudan a los niños a desarrollar valores desde temprana edad. La personalización hace que se identifiquen con los personajes.",
            text_en: "These stories help children develop values from an early age. Personalization makes them identify with the characters.",
            autor: "Dra. María García",
            cargo: "Psicóloga Infantil"
        },
        {
            text_es: "Mi hija de 5 años no quiere dormir sin escuchar un cuento. Ha aprendido a compartir y ser honesta gracias a estas historias.",
            text_en: "My 5-year-old daughter doesn't want to sleep without hearing a story. She has learned to share and be honest thanks to these stories.",
            autor: "Carlos Mendoza",
            cargo: "Padre de familia"
        },
        {
            text_es: "Como maestro de primaria, recomiendo estos cuentos. Teach values in a way that children understand and apply in their daily lives.",
            text_en: "As an elementary school teacher, I recommend these stories. They teach values in a way that children understand and apply in their daily lives.",
            autor: "Prof. Roberto Sánchez",
            cargo: "Maestro de Primaria"
        },
        {
            text_es: "Mi hijo hiperactivo se calmaba al escuchar estos cuentos. La combinación de valores y narración suave es perfecta.",
            text_en: "My hyperactive child calmed down when listening to these stories. The combination of values and soft narration is perfect.",
            autor: "Ana López",
            cargo: "Madre de tres niños"
        },
        {
            text_es: "Los cuentos no solo enseñan a los niños, sino que también ayudan a los padres a conectar con sus hijos a través de la lectura.",
            text_en: "The stories not only teach children, but also help parents connect with their children through reading.",
            autor: "Dr. Javier Pérez",
            cargo: "Doctor en Neurolingüística"
        },
        {
            text_es: "Mis estudiantes mejoran su vocabulario y comprensión lectora mientras aprenden valores importantes para la vida.",
            text_en: "My students improve their vocabulary and reading comprehension while learning important life values.",
            autor: "Mtra. Carmen Ruiz",
            cargo: "Maestra de Kinder"
        },
        {
            text_es: "La personalize with the child's name makes them feel special and creates a unique bond with history.",
            text_en: "Personalizing with the child's name makes them feel special and creates a unique bond with the story.",
            autor: "Dra. Isabel Torres",
            cargo: "Psicopedagoga"
        },
        {
            text_es: "Estos cuentos son perfectos para la rutina nocturna. Mis hijos relajan y duermen feliz después de escuchar uno.",
            text_en: "These stories are perfect for the bedtime routine. My children relax and sleep happily after listening to one.",
            autor: "Miguel Ángel González",
            cargo: "Padre de dos niños"
        },
        {
            text_es: "Teach children to diversity y respeto por el medio ambiente de manera divertida y understandable.",
            text_en: "Teaching children about diversity and respect for the environment in a fun and understandable way.",
            autor: "Lic. Fernando Díaz",
            cargo: "Educador Ambiental"
        },
        {
            text_es: "Como padre primerizo, estos cuentos me han dado herramientas para hablar de emociones difíciles con mi bebé.",
            text_en: "As a first-time parent, these stories have given me tools to talk about difficult emotions with my baby.",
            autor: "Diego Hernández",
            cargo: "Padre primerizo"
        }
    ];
    
    // Obtener 2 testimonios actuales
    $: currentTestimonials = testimonials.slice(currentTestimonialIndex, currentTestimonialIndex + 2);
    
    function toggleLang() {
        lang = lang === 'es' ? 'en' : 'es';
    }
    
    function nextTestimonials() {
        if (currentTestimonialIndex < testimonials.length - 2) {
            currentTestimonialIndex += 2;
        } else {
            currentTestimonialIndex = 0;
        }
    }
    
    // Auto-rotar testimonios cada 8 segundos
    import { onMount } from 'svelte';
    onMount(() => {
        const interval = setInterval(nextTestimonials, 8000);
        return () => clearInterval(interval);
    });
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
            <h1>{lang === 'es' ? 'Biblioteca de Cuentos' : 'Story Library'}</h1>
            <p>{lang === 'es' ? '12 historias bilingües mágicas para crecer con valores' : '12 magical bilingual stories to grow with values'}</p>
            <div class="badges">
                <button class="badge" class:active={lang === 'es'} on:click={() => lang = 'es'}>
                    {lang === 'es' ? '🇪🇸' : 'ES'} Español
                </button>
                <button class="badge" class:active={lang === 'en'} on:click={() => lang = 'en'}>
                    {lang === 'en' ? '🇬🇧' : 'EN'} English
                </button>
            </div>
        </div>
    </header>
    
    <!-- Testimonios (10 total, rotan de 2 en 2) -->
    <section class="testimonials">
        {#each currentTestimonials as t}
            <div class="testimonial">
                <p class="quote">"{lang === 'es' ? t.text_es : t.text_en}"</p>
                <p class="autor"><strong>{t.autor}</strong> - {t.cargo}</p>
            </div>
        {/each}
        <button class="more-btn" on:click={nextTestimonials}>
            {lang === 'es' ? 'Ver más testimonios →' : 'See more testimonials →'}
        </button>
    </section>
    
    <!-- Series agrupadas -->
    <main class="container">
        {#each series as serie}
            <div class="serie-section">
                <h2 class="serie-title" style="--serie-color: {serie.color}">
                    {lang === 'es' ? serie.name : serie.name.replace('Serie ', 'Series ').replace('Valores en Acción', 'Values in Action').replace('Cuentos para Dormir', 'Bedtime Stories').replace('Aprende y Descubre', 'Learn and Discover').replace('Colección Extra', 'Extra Collection')}
                </h2>
                <div class="stories-grid">
                    {#each serie.stories as story}
                        <a href="{base}/story?id={story.id}" class="story-card" style="--card-color: {serie.color}">
                            <div class="card-img-wrap">
                                <img src="{base}/images/{story.image}" alt={story.title[lang]} />
                            </div>
                            <div class="card-body">
                                <h2>{story.title[lang]}</h2>
                                <p class="pages">{story.pages.length} {lang === 'es' ? 'páginas' : 'pages'}</p>
                            </div>
                            <div class="card-decoration"></div>
                        </a>
                    {/each}
                </div>
            </div>
        {/each}
    </main>
    
    <footer>
        <p>{lang === 'es' ? 'Hecho con amor para familias que quieren criar hijos con valores' : 'Made with love for families who want to raise children with values'}</p>
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
    
    /* Header */
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
        border: none;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .badge:hover {
        background: rgba(255,255,255,0.4);
    }
    
    .badge.active {
        background: white;
        color: #FF6B6B;
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
    
    .testimonial:last-of-type {
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
    
    .more-btn {
        display: block;
        margin: 15px auto 0;
        background: none;
        border: 2px solid #FF6B6B;
        color: #FF6B6B;
        padding: 8px 20px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
    }
    
    .more-btn:hover {
        background: #FF6B6B;
        color: white;
    }
    
    /* Container */
    .container {
        flex: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    
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
    
    /* Card */
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
        height: 220px;
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
        color: #333;
        margin-bottom: 4px;
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
