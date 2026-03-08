<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    
    let stories: any[] = [...newStories];
    let storySeleccionada: number = -1;
    let guardado = false;
    let guardando = false;
    let subiendo = false;
    let password = '';
    let autenticado = false;
    let tokenInput = '';
    let tokenConfigurado = false;
    const PASSWORD_ADMIN = 'RinconAdmin2026!';
    const REPO_OWNER = 'rodcas1982';
    const REPO_NAME = 'hotmart-cuentos-svelte';
    
    function login() {
        if (password === PASSWORD_ADMIN) {
            autenticado = true;
            if (localStorage.getItem('github_token')) tokenConfigurado = true;
        }
    }
    
    function guardarToken() {
        if (tokenInput.length > 10) {
            localStorage.setItem('github_token', tokenInput);
            tokenConfigurado = true;
            tokenInput = '';
        }
    }
    
    function selectStory(index: number) {
        storySeleccionada = index;
        guardado = false;
    }
    
    async function uploadImagen(event: Event, tipo: 'imagen' | 'fondo', pageIndex: number) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        
        const token = localStorage.getItem('github_token');
        if (!token) { alert('Configurá el token primero'); return; }
        
        subiendo = true;
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        
        try {
            // Convertir a base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                
                // Subir a GitHub
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/static/images/${fileName}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Subir imagen: ${fileName}`,
                        content: base64
                    })
                });
                
                if (response.ok) {
                    const urlImagen = `/images/${fileName}`;
                    if (tipo === 'imagen') stories[storySeleccionada].pages[pageIndex].image = urlImagen;
                    else stories[storySeleccionada].pages[pageIndex].bgImage = urlImagen;
                    stories = [...stories];
                    alert('✅ Imagen subida: ' + urlImagen);
                } else {
                    alert('Error al subir imagen');
                }
                subiendo = false;
            };
            reader.readAsDataURL(file);
        } catch (err) {
            alert('Error: ' + err);
            subiendo = false;
        }
    }
    
    async function guardarEnGitHub() {
        guardando = true;
        const token = localStorage.getItem('github_token');
        if (!token) { alert('Configurá el token primero'); guardando = false; return; }
        try {
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!response.ok) throw new Error('Error al conectar');
            const fileData = await response.json();
            const sha = fileData.sha;
            
            let nuevoContenido = '// Cuentos actualizados desde admin\n';
            for (const story of stories) {
                nuevoContenido += `\nexport const ${story.id.replace(/-/g, '_')} = ${JSON.stringify(story, null, 4)};\n`;
            }
            nuevoContenido += '\nexport const newStories = [\n';
            nuevoContenido += stories.map((s, i) => `    ${s.id.replace(/-/g, '_')}${i < stories.length - 1 ? ',' : ''}`).join('\n');
            nuevoContenido += '\n];\n';
            
            const commitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                method: 'PUT',
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Actualización de cuentos desde admin', content: btoa(unescape(encodeURIComponent(nuevoContenido))), sha })
            });
            
            if (commitResponse.ok) { guardado = true; setTimeout(() => guardado = false, 3000); }
            else { const e = await commitResponse.json(); alert('Error: ' + e.message); }
        } catch (err: any) { alert('Error: ' + err.message); }
        guardando = false;
    }
    
    function agregarPagina() {
        if (storySeleccionada >= 0) stories[storySeleccionada].pages = [...stories[storySeleccionada].pages, { es: '', en: '' }];
    }
    
    function eliminarPagina(pi: number) {
        if (storySeleccionada >= 0 && stories[storySeleccionada].pages.length > 1) {
            const np = [...stories[storySeleccionada].pages];
            np.splice(pi, 1);
            stories[storySeleccionada].pages = np;
        }
    }
</script>

<div class="admin-container">
    {#if !autenticado}
        <div class="login-box">
            <h1>🔐 Admin Rincon Editorial</h1>
            <input type="password" bind:value={password} placeholder="Contraseña" on:keydown={e => e.key === 'Enter' && login()} />
            <button on:click={login}>Entrar</button>
        </div>
    {:else}
        <div class="admin-layout">
            <aside class="sidebar">
                <div class="sidebar-header"><h2>📚 Cuentos</h2><span class="count">{stories.length}</span></div>
                {#if !tokenConfigurado}
                    <div class="token-setup">
                        <p>📌 Pegá tu GitHub Token</p>
                        <input type="password" bind:value={tokenInput} placeholder="Token" />
                        <button on:click={guardarToken}>Guardar</button>
                    </div>
                {/if}
                <div class="story-list">
                    {#each stories as story, i}
                        <button class="story-item" class:selected={storySeleccionada === i} on:click={() => selectStory(i)}>
                            <span class="story-num">{story.id}</span>
                            <span class="story-title">{story.title.es}</span>
                        </button>
                    {/each}
                </div>
            </aside>
            <main class="editor-main">
                {#if storySeleccionada >= 0}
                    {@const story = stories[storySeleccionada]}
                    <header class="editor-header">
                        <div class="header-info">
                            <span class="story-id">{story.id}</span>
                            <input bind:value={story.title.es} placeholder="Título ES" class="title-input" />
                            <input bind:value={story.title.en} placeholder="Título EN" class="title-input" />
                        </div>
                        <div class="header-meta">
                            <input bind:value={story.theme} placeholder="Tema" class="meta-input" />
                            <input bind:value={story.ageRange} placeholder="Edad" class="meta-input" style="width:80px" />
                            <input bind:value={story.image} placeholder="Imagen" class="meta-input" style="width:150px" />
                        </div>
                    </header>
                    <div class="pages-container">
                        <div class="pages-header"><h3>📄 Páginas</h3><button class="btn-add" on:click={agregarPagina}>➕ Nueva</button></div>
                        {#each story.pages as page, pi}
                            <div class="page-card">
                                <div class="page-header">
                                    <span class="page-num">Página {pi + 1}</span>
                                    {#if story.pages.length > 1}<button class="btn-del" on:click={() => eliminarPagina(pi)}>🗑️</button>{/if}
                                </div>
                                <div class="page-content">
                                    <div class="lang-column es">
                                        <div class="lang-header">🇪🇸 Español</div>
                                        <textarea bind:value={page.es} placeholder="Texto en español..."></textarea>
                                        
                                        <div class="img-upload-row">
                                            <label class="upload-btn">
                                                📤 Subir Imagen
                                                <input type="file" accept="image/*" on:change={(e) => uploadImagen(e, 'imagen', pi)} hidden />
                                            </label>
                                            <span class="img-url">{page.image || 'Sin imagen'}</span>
                                        </div>
                                        
                                        <div class="img-upload-row">
                                            <label class="upload-btn fondo">
                                                🎨 Subir Fondo
                                                <input type="file" accept="image/*" on:change={(e) => uploadImagen(e, 'fondo', pi)} hidden />
                                            </label>
                                            <span class="img-url">{page.bgImage || 'Sin fondo'}</span>
                                        </div>
                                    </div>
                                    <div class="lang-column en">
                                        <div class="lang-header">🇺🇸 English</div>
                                        <textarea bind:value={page.en} placeholder="English..."></textarea>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                    <div class="save-bar">
                        {#if guardado}<span class="saved-msg">✅ Guardado</span>{/if}
                        {#if subiendo}<span class="subiendo-msg">⏳ Subiendo imagen...</span>{/if}
                        <button class="btn-guardar" on:click={guardarEnGitHub} disabled={guardando || subiendo}>{guardando ? '⏳' : '💾'} GUARDAR</button>
                    </div>
                {:else}
                    <div class="empty-state"><h2>👈 Selecciona un cuento</h2></div>
                {/if}
            </main>
        </div>
    {/if}
</div>

<style>
    .admin-container{min-height:100vh;background:#f0f2f5}.login-box{max-width:400px;margin:100px auto;background:white;padding:40px;border-radius:20px;text-align:center}.login-box h1{color:#8E2DE2;margin-bottom:20px}.login-box input{width:100%;padding:15px;border:2px solid #ddd;border-radius:10px;font-size:16px;margin-bottom:15px}.login-box button{background:#8E2DE2;color:white;border:none;padding:15px 40px;border-radius:10px;font-size:16px;cursor:pointer}
    .admin-layout{display:flex;height:100vh}.sidebar{width:280px;background:white;border-right:1px solid #e0e0e0;display:flex;flex-direction:column}.sidebar-header{padding:20px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}.sidebar-header h2{margin:0;font-size:18px;color:#333}.count{background:#8E2DE2;color:white;padding:2px 10px;border-radius:12px;font-size:14px}.token-setup{padding:15px;background:#fff3cd;border-bottom:1px solid #ffc107}.token-setup p{margin:0 0 10px 0;font-size:14px}.token-setup input{width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px}.token-setup button{background:#ffc107;border:none;padding:8px 16px;border-radius:6px;cursor:pointer}
    .story-list{flex:1;overflow-y:auto;padding:10px}.story-item{width:100%;display:flex;align-items:center;gap:10px;padding:12px 15px;border:none;background:transparent;border-radius:10px;cursor:pointer;text-align:left;margin-bottom:5px}.story-item:hover{background:#f5f5f5}.story-item.selected{background:linear-gradient(135deg,#8E2DE2,#4A00E0);color:white}.story-num{background:rgba(0,0,0,0.1);padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold}.story-item.selected .story-num{background:rgba(255,255,255,0.2)}.story-title{flex:1;font-size:14px}
    .editor-main{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column}.editor-header{background:white;padding:20px;border-radius:15px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}.header-info{display:flex;align-items:center;gap:15px;margin-bottom:15px;flex-wrap:wrap}.story-id{background:#8E2DE2;color:white;padding:5px 12px;border-radius:8px;font-weight:bold}.title-input{flex:1;min-width:200px;padding:10px 15px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px}.title-input:focus{border-color:#8E2DE2;outline:none}.header-meta{display:flex;gap:10px;flex-wrap:wrap}.meta-input{padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px}
    .pages-container{flex:1}.pages-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.pages-header h3{margin:0;color:#333}.btn-add{background:#4CAF50;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer}
    .page-card{background:white;border-radius:15px;margin-bottom:20px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05)}.page-header{background:#f8f9fa;padding:12px 20px;display:flex;justify-content:space-between;align-items:center}.page-num{font-weight:bold;color:#8E2DE2}.btn-del{background:#f44336;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px}
    .page-content{display:flex;gap:20px;padding:20px}.lang-column{flex:1;display:flex;flex-direction:column;gap:10px}.lang-header{font-weight:bold;font-size:14px;padding-bottom:8px;border-bottom:2px solid}.lang-column.es .lang-header{border-color:#4CAF50;color:#4CAF50}.lang-column.en .lang-header{border-color:#2196F3;color:#2196F3}.lang-column textarea{flex:1;min-height:150px;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;resize:vertical}
    .img-upload-row{display:flex;align-items:center;gap:10px}.upload-btn{background:#2196F3;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:13px}.upload-btn.fondo{background:#9C27B0}.img-url{font-size:12px;color:#666;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .save-bar{position:sticky;bottom:20px;background:white;padding:15px 25px;border-radius:50px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:flex;justify-content:center;align-items:center;gap:15px;margin-top:auto}.saved-msg{color:#4CAF50;font-weight:bold}.subiendo-msg{color:#FF9800;font-weight:bold}.btn-guardar{background:linear-gradient(135deg,#8E2DE2,#4A00E0);color:white;border:none;padding:12px 30px;border-radius:25px;font-size:15px;font-weight:bold;cursor:pointer}.btn-guardar:disabled{opacity:0.6}.empty-state{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#999}
    @media(max-width:768px){.admin-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:200px}.page-content{flex-direction:column}}
</style>
