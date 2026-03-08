<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { onMount } from 'svelte';
    
    let stories = [...newStories];
    let storySeleccionada: number | null = null;
    let guardado = false;
    let guardando = false;
    let password = '';
    let autenticado = false;
    let githubToken = '';
    let tokenGuardado = false;
    const PASSWORD_ADMIN = 'RinconAdmin2026!';
    const REPO_OWNER = 'rodcas1982';
    const REPO_NAME = 'hotmart-cuentos-svelte';
    
    function login() {
        if (password === PASSWORD_ADMIN) {
            autenticado = true;
        } else {
            alert('Contraseña incorrecta');
        }
    }
    
    async function guardarEnGitHub() {
        guardando = true;
        try {
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                headers: {
                    'Authorization': `token ${localStorage.getItem('github_token')}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) throw new Error('Error al conectar con GitHub');
            
            const fileData = await response.json();
            const sha = fileData.sha;
            
            let nuevoContenido = '// Cuentos actualizados desde admin\n';
            for (const story of stories) {
                nuevoContenido += `\nexport const ${story.id.replace(/-/g, '_')} = ${JSON.stringify(story, null, 4)};\n`;
            }
            nuevoContenido += '\n\nexport const newStories = [\n';
            nuevoContenido += stories.map((s, i) => `    ${s.id.replace(/-/g, '_')}${i < stories.length - 1 ? ',' : ''}`).join('\n');
            nuevoContenido += '\n];\n';
            
            const commitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${localStorage.getItem('github_token')}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Actualización de cuentos desde admin panel`,
                    content: btoa(unescape(encodeURIComponent(nuevoContenido))),
                    sha: sha
                })
            });
            
            if (commitResponse.ok) {
                guardado = true;
                setTimeout(() => guardado = false, 3000);
            } else {
                const error = await commitResponse.json();
                alert('Error: ' + (error.message || 'Verifica el token'));
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
        guardando = false;
    }
    
    function agregarPagina() {
        if (storySeleccionada !== null) {
            stories[storySeleccionada].pages.push({ es: '', en: '' });
            stories = [...stories];
        }
    }
    
    function eliminarPagina(pageIndex: number) {
        if (storySeleccionada !== null && stories[storySeleccionada].pages.length > 1) {
            stories[storySeleccionada].pages.splice(pageIndex, 1);
            stories = [...stories];
        }
    }
    
    onMount(() => {
        const token = localStorage.getItem('github_token');
        if (token) { githubToken = token; tokenGuardado = true; }
    });
</script>

<div class="admin-container">
    {#if !autenticado}
        <div class="login-box">
            <h1>🔐 Admin Rincon Editorial</h1>
            <input type="password" bind:value={password} placeholder="Contraseña" on:keydown={(e) => e.key === 'Enter' && login()} />
            <button on:click={login}>Entrar</button>
        </div>
    {:else}
        <div class="admin-layout">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h2>📚 Cuentos</h2>
                    <span class="count">{stories.length}</span>
                </div>
                <div class="story-list">
                    {#each stories as story, i}
                        <button 
                            class="story-item" 
                            class:selected={storySeleccionada === i}
                            on:click={() => storySeleccionada = i}
                        >
                            <span class="story-num">{story.id}</span>
                            <span class="story-title">{story.title.es}</span>
                        </button>
                    {/each}
                </div>
            </aside>
            
            <!-- Editor -->
            <main class="editor-main">
                {#if storySeleccionada !== null}
                    {@const story = stories[storySeleccionada]}
                    <header class="editor-header">
                        <div class="header-info">
                            <span class="story-id">{story.id}</span>
                            <input bind:value={story.title.es} placeholder="Título ES" class="title-input" />
                            <input bind:value={story.title.en} placeholder="Título EN" class="title-input" />
                        </div>
                        <div class="header-meta">
                            <input bind:value={story.theme} placeholder="Tema" class="meta-input" />
                            <input bind:value={story.ageRange} placeholder="Edad" class="meta-input" style="width: 80px" />
                            <input bind:value={story.image} placeholder="Imagen" class="meta-input" style="width: 150px" />
                        </div>
                    </header>
                    
                    <div class="pages-container">
                        <div class="pages-header">
                            <h3>📄 Páginas</h3>
                            <button class="btn-add" on:click={agregarPagina}>➕ Nueva Página</button>
                        </div>
                        
                        {#each story.pages as page, pi}
                            <div class="page-card">
                                <div class="page-header">
                                    <span class="page-num">Página {pi + 1}</span>
                                    {#if story.pages.length > 1}
                                        <button class="btn-del" on:click={() => eliminarPagina(pi)}>🗑️ Eliminar</button>
                                    {/if}
                                </div>
                                
                                <div class="page-content">
                                    <div class="lang-column es">
                                        <div class="lang-header">🇪🇸 Español</div>
                                        <textarea bind:value={page.es} placeholder="Escribe el cuento en español... {NOMBRE_NIÑO}, {ANIMAL_FAVORITO}, {COLOR}"></textarea>
                                        <input bind:value={page.image} placeholder="🖼️ Imagen contenido (URL)" class="img-input" />
                                        <input bind:value={page.bgImage} placeholder="🎨 Imagen fondo (URL)" class="img-input" />
                                    </div>
                                    <div class="lang-column en">
                                        <div class="lang-header">🇺🇸 English</div>
                                        <textarea bind:value={page.en} placeholder="Write the story in English... {NOMBRE_NIÑO}, {ANIMAL_FAVORITO}, {COLOR}"></textarea>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                    
                    <div class="save-bar">
                        {#if guardado}
                            <span class="saved-msg">✅ Guardado</span>
                        {/if}
                        <button class="btn-guardar" on:click={guardarEnGitHub} disabled={guardando}>
                            {guardando ? '⏳ Guardando...' : '💾 GUARDAR EN GITHUB'}
                        </button>
                    </div>
                {:else}
                    <div class="empty-state">
                        <h2>👈 Selecciona un cuento para editar</h2>
                        <p>Elige uno de la lista de la izquierda</p>
                    </div>
                {/if}
            </main>
        </div>
    {/if}
</div>

<style>
    .admin-container { min-height: 100vh; background: #f0f2f5; }
    .login-box { max-width: 400px; margin: 100px auto; background: white; padding: 40px; border-radius: 20px; text-align: center; }
    .login-box h1 { color: #8E2DE2; margin-bottom: 20px; }
    .login-box input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 15px; }
    .login-box button { background: #8E2DE2; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 16px; cursor: pointer; }
    
    .admin-layout { display: flex; height: 100vh; }
    
    /* Sidebar */
    .sidebar { width: 280px; background: white; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; }
    .sidebar-header { padding: 20px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    .sidebar-header h2 { margin: 0; font-size: 18px; color: #333; }
    .count { background: #8E2DE2; color: white; padding: 2px 10px; border-radius: 12px; font-size: 14px; }
    .story-list { flex: 1; overflow-y: auto; padding: 10px; }
    .story-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 15px; border: none; background: transparent; border-radius: 10px; cursor: pointer; text-align: left; margin-bottom: 5px; transition: all 0.2s; }
    .story-item:hover { background: #f5f5f5; }
    .story-item.selected { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: white; }
    .story-num { background: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .story-item.selected .story-num { background: rgba(255,255,255,0.2); }
    .story-title { flex: 1; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    
    /* Editor Main */
    .editor-main { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; }
    
    .editor-header { background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .header-info { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }
    .story-id { background: #8E2DE2; color: white; padding: 5px 12px; border-radius: 8px; font-weight: bold; font-size: 14px; }
    .title-input { flex: 1; min-width: 200px; padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; font-weight: 500; }
    .title-input:focus { border-color: #8E2DE2; outline: none; }
    .header-meta { display: flex; gap: 10px; flex-wrap: wrap; }
    .meta-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
    
    /* Pages */
    .pages-container { flex: 1; }
    .pages-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .pages-header h3 { margin: 0; color: #333; }
    .btn-add { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; }
    
    .page-card { background: white; border-radius: 15px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .page-header { background: #f8f9fa; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
    .page-num { font-weight: bold; color: #8E2DE2; }
    .btn-del { background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; }
    
    .page-content { display: flex; gap: 20px; padding: 20px; }
    .lang-column { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .lang-header { font-weight: bold; font-size: 14px; padding-bottom: 8px; border-bottom: 2px solid; }
    .lang-column.es .lang-header { border-color: #4CAF50; color: #4CAF50; }
    .lang-column.en .lang-header { border-color: #2196F3; color: #2196F3; }
    .lang-column textarea { flex: 1; min-height: 150px; padding: 12px; border: 1px solid #ddd; border-radius: 10px; font-size: 14px; font-family: inherit; resize: vertical; line-height: 1.6; }
    .img-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; }
    
    .save-bar { position: sticky; bottom: 20px; background: white; padding: 15px 25px; border-radius: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: auto; }
    .saved-msg { color: #4CAF50; font-weight: bold; }
    .btn-guardar { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 15px; font-weight: bold; cursor: pointer; }
    .btn-guardar:disabled { opacity: 0.6; }
    
    .empty-state { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #999; }
    .empty-state h2 { margin: 0 0 10px 0; }
    
    @media (max-width: 768px) {
        .admin-layout { flex-direction: column; }
        .sidebar { width: 100%; height: auto; max-height: 200px; }
        .page-content { flex-direction: column; }
    }
</style>
