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
    let mostrarPreview = false;
    let pagePreview = 0;
    let langPreview: 'es' | 'en' = 'es';
    const PASSWORD_ADMIN = 'RinconAdmin2026!';
    const REPO_OWNER = 'rodcas1982';
    const REPO_NAME = 'hotmart-cuentos-svelte';
    
    let mostrarModalToken = false;
    
    function abrirModalToken() {
        mostrarModalToken = true;
    }
    
    function cerrarModalToken() {
        mostrarModalToken = false;
    }
    
    function login() {
        if (password === PASSWORD_ADMIN) {
            autenticado = true;
            const tokenGuardado = localStorage.getItem('github_token');
            if (tokenGuardado) {
                tokenConfigurado = true;
            } else {
                alert('📌 Necesitás configurar tu GitHub Token para guardar cambios');
            }
        } else {
            alert('Contraseña incorrecta');
        }
    }
    
    function guardarToken() {
        if (tokenInput.length > 10) {
            localStorage.setItem('github_token', tokenInput);
            tokenConfigurado = true;
            tokenInput = '';
            alert('✅ Token guardado');
        } else {
            alert('Token muy corto');
        }
    }

    function logout() {
        autenticado = false;
        tokenConfigurado = false;
    }
    
    function selectStory(index: number) {
        storySeleccionada = index;
        guardado = false;
    }
    
    function abrirPreview() { mostrarPreview = true; pagePreview = 0; langPreview = 'es'; }
    
    async function uploadFondoGlobal(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        const token = localStorage.getItem('github_token');
        if (!token) { alert('Configurá el token primero'); return; }
        subiendo = true;
        const fileName = `fondo_global_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/static/images/${fileName}`, {
                method: 'PUT',
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `Subir fondo global`, content: base64 })
            });
            if (response.ok) { stories[storySeleccionada].fondoGlobal = `/images/${fileName}`; stories = [...stories]; alert('✅ Fondo global aplicado'); }
            subiendo = false;
        };
        reader.readAsDataURL(file);
    }
    
    async function uploadImagen(event: Event, tipo: 'imagen' | 'fondo', pageIndex: number) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        const token = localStorage.getItem('github_token');
        if (!token) { alert('Configurá el token primero'); return; }
        subiendo = true;
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/static/images/${fileName}`, {
                method: 'PUT',
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `Subir imagen: ${fileName}`, content: base64 })
            });
            if (response.ok) {
                const urlImagen = `/images/${fileName}`;
                if (tipo === 'imagen') {
                    if (!stories[storySeleccionada].pages[pageIndex].images) stories[storySeleccionada].pages[pageIndex].images = [];
                    stories[storySeleccionada].pages[pageIndex].images.push({ url: urlImagen, posicion: 'centro' });
                } else {
                    stories[storySeleccionada].pages[pageIndex].bgImage = urlImagen;
                }
                stories = [...stories];
                alert('✅ Imagen subida: ' + urlImagen);
            } else {
                alert('Error al subir imagen');
            }
            subiendo = false;
        };
        reader.readAsDataURL(file);
    }
    
    async function guardarEnGitHub(force: boolean = false) {
        guardando = true;
        const token = localStorage.getItem('github_token');
        if (!token) { alert('Configurá el token primero'); guardando = false; return; }
        try {
            // Siempre obtener SHA primero
            let sha = '';
            try {
                const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
                });
                if (response.ok) { const fileData = await response.json(); sha = fileData.sha; }
            } catch (e) { /* archivo nuevo, sin SHA */ }
            
            let nuevoContenido = '// Cuentos actualizados desde admin\n';
            for (const story of stories) { nuevoContenido += `\nexport const ${story.id.replace(/-/g, '_')} = ${JSON.stringify(story, null, 4)};\n`; }
            nuevoContenido += '\nexport const newStories = [\n';
            nuevoContenido += stories.map((s, i) => `    ${s.id.replace(/-/g, '_')}${i < stories.length - 1 ? ',' : ''}`).join('\n');
            nuevoContenido += '\n];\n';
            const body: any = { message: 'Actualización de cuentos desde admin', content: btoa(unescape(encodeURIComponent(nuevoContenido))) };
            if (sha) body.sha = sha;
            
            const commitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/lib/data/nuevos/index.ts`, {
                method: 'PUT',
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
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
                <div class="sidebar-header">
                    <h2>📚 Cuentos</h2>
                    <span class="count">{stories.length}</span>
                </div>
                <div class="token-section">
                    <div class="token-status" class:ok={tokenConfigurado}>
                        {tokenConfigurado ? '✅ Token OK' : '❌ Sin Token'}
                    </div>
                    <button class="token-btn" on:click={abrirModalToken}>
                        {tokenConfigurado ? '🔄 Cambiar Token' : '➕ Agregar Token'}
                    </button>
                </div>
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
                        <div class="pages-header">
                            <h3>📄 Páginas</h3>
                            <div class="header-actions">
                                <label class="upload-fondo-global">🌍 Fondo Global<input type="file" accept="image/*" on:change={uploadFondoGlobal} hidden /></label>
                                <button class="btn-add" on:click={agregarPagina}>➕ Nueva</button>
                            </div>
                        </div>
                        {#if story.fondoGlobal}<div class="fondo-global-msg">🌍 Fondo global activo <button class="btn-quitar" on:click={() => {story.fondoGlobal = ''; stories = [...stories]}}>✕</button></div>{/if}
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
                        {#if subiendo}<span class="subiendo-msg">⏳ Subiendo...</span>{/if}
                        <button class="btn-preview" on:click={abrirPreview}>👁️ Preview</button>
                        <button class="btn-guardar" on:click={() => guardarEnGitHub(false)} disabled={guardando || subiendo}>{guardando ? '⏳' : '💾'} GUARDAR</button>
                        <button class="btn-force" on:click={() => guardarEnGitHub(true)} disabled={guardando}>⚡ FORZAR</button>
                    </div>
                {:else}
                    <div class="empty-state"><h2>👈 Selecciona un cuento</h2></div>
                {/if}
            </main>
        </div>
    {/if}
    
    <!-- Preview Modal - Versión completa -->
    {#if mostrarPreview && storySeleccionada >= 0}
        {@const story = stories[storySeleccionada]}
        {@const pageData = story.pages[pagePreview]}
        <div class="preview-modal" on:click={() => mostrarPreview = false}>
            <div class="preview-content preview-full" on:click|stopPropagation>
                <div class="preview-header">
                    <h2>👁️ Preview: {story.title[langPreview]}</h2>
                    <button class="preview-close" on:click={() => mostrarPreview = false}>✕</button>
                </div>
                <div class="preview-controls">
                    <button on:click={() => pagePreview = Math.max(0, pagePreview - 1)} disabled={pagePreview === 0}>◀</button>
                    <span>Pág {pagePreview + 1}/{story.pages.length}</span>
                    <button on:click={() => pagePreview = Math.min(story.pages.length - 1, pagePreview + 1)} disabled={pagePreview === story.pages.length - 1}>▶</button>
                    <button class="lang-btn" on:click={() => langPreview = langPreview === 'es' ? 'en' : 'es'}>{langPreview === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</button>
                </div>
                
                <!-- Preview completo estilo página real -->
                <div class="preview-story-container" style="background: linear-gradient(135deg, #FF6B6B, #FFE66D)">
                    <div class="preview-book" style={pageData.bgImage || story.fondoGlobal ? `background-image: linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('${pageData.bgImage || story.fondoGlobal}'); background-size: cover; background-position: center;` : ''}>
                        <!-- Imágenes del contenido -->
                        {#if pageData.images}
                            {#each pageData.images as img}
                                {#if img.url}
                                    <img src={img.url} alt="" class="preview-content-img" style="float: {img.posicion}" />
                                {/if}
                            {/each}
                        {/if}
                        
                        <h1 class="preview-title">{story.title[langPreview]}</h1>
                        <div class="preview-text">
                            {@html pageData[langPreview]
                                .replace(/{NOMBRE_NIÑO}/g, '<span class="var-highlight">{NOMBRE_NIÑO}</span>')
                                .replace(/{ANIMAL_FAVORITO}/g, '<span class="var-highlight">{ANIMAL_FAVORITO}</span>')
                                .replace(/{COLOR}/g, '<span class="var-highlight">{COLOR}</span>')}
                        </div>
                        <div class="preview-page-num">{pagePreview + 1} / {story.pages.length}</div>
                    </div>
                    
                    <div class="preview-nav">
                        <button on:click={() => pagePreview = Math.max(0, pagePreview - 1)} disabled={pagePreview === 0}>◀ Anterior</button>
                        <div class="preview-dots">
                            {#each story.pages as _, i}
                                <span class="preview-dot" class:active={i === pagePreview}></span>
                            {/each}
                        </div>
                        <button on:click={() => pagePreview = Math.min(story.pages.length - 1, pagePreview + 1)} disabled={pagePreview === story.pages.length - 1}>Siguiente ▶</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
    
    <!-- Token Modal -->
    {#if mostrarModalToken}
    <div class="token-modal" on:click={cerrarModalToken}>
        <div class="token-modal-content" on:click|stopPropagation>
            <h3>🔐 Configurar GitHub Token</h3>
            <p>Pegá tu token para poder guardar cambios</p>
            <input type="password" bind:value={tokenInput} placeholder="ghp_..." class="token-input-modal" />
            <div class="token-modal-btns">
                <button class="token-save" on:click={() => { guardarToken(); mostrarModalToken = false; }}>💾 Guardar</button>
                <button class="token-cancel" on:click={cerrarModalToken}>Cancelar</button>
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
    .admin-container{min-height:100vh;background:#f0f2f5}.login-box{max-width:400px;margin:100px auto;background:white;padding:40px;border-radius:20px;text-align:center}.login-box h1{color:#8E2DE2;margin-bottom:20px}.login-box input{width:100%;padding:15px;border:2px solid #ddd;border-radius:10px;font-size:16px;margin-bottom:15px}.login-box button{background:#8E2DE2;color:white;border:none;padding:15px 40px;border-radius:10px;font-size:16px;cursor:pointer}
    .admin-layout{display:flex;height:100vh}.sidebar{width:280px;background:white;border-right:1px solid #e0e0e0;display:flex;flex-direction:column}.sidebar-header{padding:20px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}.sidebar-header h2{margin:0;font-size:18px;color:#333}.count{background:#8E2DE2;color:white;padding:2px 10px;border-radius:12px;font-size:14px}.token-setup{padding:15px;background:#fff3cd;border-bottom:1px solid #ffc107}.token-setup p{margin:0 0 10px 0;font-size:14px}.token-setup input{width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px}.token-setup button{background:#ffc107;border:none;padding:8px 16px;border-radius:6px;cursor:pointer}
    .story-list{flex:1;overflow-y:auto;padding:10px}.story-item{width:100%;display:flex;align-items:center;gap:10px;padding:12px 15px;border:none;background:transparent;border-radius:10px;cursor:pointer;text-align:left;margin-bottom:5px}.story-item:hover{background:#f5f5f5}.story-item.selected{background:linear-gradient(135deg,#8E2DE2,#4A00E0);color:white}.story-num{background:rgba(0,0,0,0.1);padding:4px 8px;border-radius:6px;font-size:12px;font-weight:bold}.story-item.selected .story-num{background:rgba(255,255,255,0.2)}.story-title{flex:1;font-size:14px}
    .editor-main{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column}.editor-header{background:white;padding:20px;border-radius:15px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}.header-info{display:flex;align-items:center;gap:15px;margin-bottom:15px;flex-wrap:wrap}.story-id{background:#8E2DE2;color:white;padding:5px 12px;border-radius:8px;font-weight:bold}.title-input{flex:1;min-width:200px;padding:10px 15px;border:2px solid #e0e0e0;border-radius:10px;font-size:16px}.title-input:focus{border-color:#8E2DE2;outline:none}.header-meta{display:flex;gap:10px;flex-wrap:wrap}.meta-input{padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:14px}
    .pages-container{flex:1}.pages-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.pages-header h3{margin:0;color:#333}.header-actions{display:flex;gap:10px;align-items:center}.upload-fondo-global{background:#9C27B0;color:white;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-size:13px}.btn-add{background:#4CAF50;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer}.fondo-global-msg{background:#e8f5e9;padding:10px 15px;border-radius:8px;margin-bottom:15px;font-size:13px;display:flex;align-items:center;gap:10px}.btn-quitar{background:#f44336;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer}
    .page-card{background:white;border-radius:15px;margin-bottom:20px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05)}.page-header{background:#f8f9fa;padding:12px 20px;display:flex;justify-content:space-between;align-items:center}.page-num{font-weight:bold;color:#8E2DE2}.btn-del{background:#f44336;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px}
    .page-content{display:flex;gap:20px;padding:20px}.lang-column{flex:1;display:flex;flex-direction:column;gap:10px}.lang-header{font-weight:bold;font-size:14px;padding-bottom:8px;border-bottom:2px solid}.lang-column.es .lang-header{border-color:#4CAF50;color:#4CAF50}.lang-column.en .lang-header{border-color:#2196F3;color:#2196F3}.lang-column textarea{flex:1;min-height:150px;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;resize:vertical}
    .img-upload-row{display:flex;align-items:center;gap:10px}.upload-btn{background:#2196F3;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:13px}.upload-btn.fondo{background:#9C27B0}.img-url{font-size:12px;color:#666;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .save-bar{position:sticky;bottom:20px;background:white;padding:15px 25px;border-radius:50px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:flex;justify-content:center;align-items:center;gap:15px;margin-top:auto}.saved-msg{color:#4CAF50;font-weight:bold}.subiendo-msg{color:#FF9800;font-weight:bold}.btn-preview{background:#FF9800;color:white;border:none;padding:10px 18px;border-radius:25px;font-size:14px;font-weight:bold;cursor:pointer}.btn-guardar{background:linear-gradient(135deg,#8E2DE2,#4A00E0);color:white;border:none;padding:10px 18px;border-radius:25px;font-size:14px;font-weight:bold;cursor:pointer}.btn-force{background:linear-gradient(135deg,#f44336,#d32f2f);color:white;border:none;padding:10px 18px;border-radius:25px;font-size:14px;font-weight:bold;cursor:pointer}.btn-guardar:disabled,.btn-force:disabled{opacity:0.6}.empty-state{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#999}
    @media(max-width:768px){.admin-layout{flex-direction:column}.sidebar{width:100%;height:auto;max-height:200px}.page-content{flex-direction:column}}
    
    /* Preview Modal Avanzado */
    .preview-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
    .preview-content.preview-full{max-width:750px;width:100%;max-height:95vh;overflow:hidden;display:flex;flex-direction:column;background:transparent;border-radius:0}
    .preview-header{display:flex;justify-content:space-between;align-items:center;padding:15px 20px;background:linear-gradient(135deg,#8E2DE2,#4A00E0);color:white}
    .preview-header h2{margin:0;font-size:18px}
    .preview-close{background:none;border:none;color:white;font-size:24px;cursor:pointer}
    .preview-controls{display:flex;justify-content:center;align-items:center;gap:15px;padding:12px;background:rgba(255,255,255,0.95);border-bottom:1px solid #ddd}
    .preview-controls button{background:#8E2DE2;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer}.preview-controls button:disabled{opacity:0.5}.lang-btn{background:#2196F3 !important}
    .preview-story-container{min-height:500px;padding:20px;display:flex;flex-direction:column;align-items:center}
    .preview-book{background:white;color:#333;border-radius:10px;padding:30px;min-height:380px;max-width:650px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,0.3);position:relative}
    .preview-content-img{max-width:180px;margin:10px;border-radius:8px}
    .preview-content-img[style*="float: izquierda"]{float:left;margin-right:15px}
    .preview-content-img[style*="float: derecha"]{float:right;margin-left:15px}
    .preview-content-img[style*="float: centro"]{display:block;margin:10px auto;float:none}
    .preview-title{font-family:'Dancing Script',cursive;font-size:24px;background:linear-gradient(135deg,#8E2DE2,#4A00E0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:center;margin-bottom:20px}
    .preview-text{font-size:16px;line-height:1.8;text-align:justify;clear:both}
    .preview-text .var-highlight{background:#FFF3CD;padding:2px 6px;border-radius:4px;border:1px solid #FFC107;color:#856404;font-weight:bold}
    .preview-page-num{text-align:center;color:#666;margin-top:20px;font-size:14px}
    .preview-nav{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:15px;background:rgba(255,255,255,0.95);padding:15px 25px;border-radius:50px}
    .preview-nav button{background:#8E2DE2;color:white;border:none;padding:10px 20px;border-radius:25px;cursor:pointer;font-size:14px}
    .preview-nav button:disabled{opacity:0.5}
    .preview-dots{display:flex;gap:8px}
    .preview-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.5)}
    .preview-dot.active{background:white}
    
    /* Token Modal */
    .token-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;align-items:center;justify-content:center}
    .token-modal.show{display:flex}
    .token-modal-content{background:white;padding:30px;border-radius:20px;max-width:400px;width:90%;text-align:center}
    .token-modal-content h3{color:#8E2DE2;margin:0 0 10px 0}
    .token-modal-content p{color:#666;margin:0 0 20px 0;font-size:14px}
    .token-input-modal{width:100%;padding:12px;border:2px solid #ddd;border-radius:10px;font-size:14px;margin-bottom:15px;box-sizing:border-box}
    .token-modal-btns{display:flex;gap:10px;justify-content:center}
    .token-save{background:#4CAF50;color:white;border:none;padding:12px 25px;border-radius:10px;cursor:pointer;font-size:14px}
    .token-cancel{background:#ddd;color:#333;border:none;padding:12px 25px;border-radius:10px;cursor:pointer;font-size:14px}
    .token-section{padding:10px;border-bottom:1px solid #e0e0e0}
    .token-status{padding:10px;font-size:13px;border-radius:8px;text-align:center;margin-bottom:5px}
    .token-status.ok{background:#d4edda;color:#155724}
    .token-status:not(.ok){background:#f8d7da;color:#721c24}
    .token-btn{width:100%;background:#8E2DE2;color:white;border:none;padding:10px;border-radius:8px;cursor:pointer;font-size:13px}
</style>
