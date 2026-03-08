<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { onMount } from 'svelte';
    
    let stories = [...newStories];
    let storyEditando: number | null = null;
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
    
    function guardarToken() {
        if (githubToken.length > 10) {
            localStorage.setItem('github_token', githubToken);
            tokenGuardado = true;
            alert('Token guardado correctamente');
        }
    }
    
    async function guardarEnGitHub() {
        guardando = true;
        
        // Obtener el contenido actual del archivo
        const filePath = 'src/lib/data/nuevos';
        
        try {
            // Obtener SHA del archivo actual
            const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}/index.ts`, {
                headers: {
                    'Authorization': `token ${localStorage.getItem('github_token')}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al conectar con GitHub');
            }
            
            const fileData = await response.json();
            const sha = fileData.sha;
            
            // Generar el nuevo contenido del archivo
            let nuevoContenido = '// Cuentos actualizados desde admin\n';
            for (const story of stories) {
                nuevoContenido += `\nexport const ${story.id.replace('-', '_')} = ${JSON.stringify(story, null, 4)};\n`;
            }
            nuevoContenido += `\n\nexport const newStories = [\n`;
            nuevoContenido += stories.map((s, i) => `    ${s.id.replace('-', '_')}${i < stories.length - 1 ? ',' : ''}`).join('\n');
            nuevoContenido += '\n];\n';
            
            // Commitear los cambios
            const commitResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}/index.ts`, {
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
                alert('✅ Cambios guardados en GitHub! El sitio se actualizará en 1-2 minutos.');
            } else {
                const error = await commitResponse.json();
                alert('Error al guardar: ' + (error.message || 'Verifica el token'));
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
        
        guardando = false;
    }
    
    function editarHistoria(index: number) {
        storyEditando = index;
        guardado = false;
    }
    
    // Cargar cambios guardados
    onMount(() => {
        const token = localStorage.getItem('github_token');
        if (token) {
            githubToken = token;
            tokenGuardado = true;
        }
        
        const guardados = localStorage.getItem('cuentos_editados');
        if (guardados) {
            try {
                stories = JSON.parse(guardados);
            } catch (e) {}
        }
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
        <div class="admin-panel">
            <header>
                <h1>📝 Panel de Administración</h1>
                <div class="token-section">
                    {#if !tokenGuardado}
                        <input type="password" bind:value={githubToken} placeholder="GitHub Token (Personal Access Token)" class="token-input" />
                        <button on:click={guardarToken}>Guardar Token</button>
                    {:else}
                        <span class="token-ok">✅ Token de GitHub configurado</span>
                    {/if}
                </div>
            </header>
            
            {#if guardado}
                <div class="alert success">✅ Cambios guardados en GitHub - El sitio se actualizará en breve</div>
            {/if}
            
            <div class="stories-list">
                {#each stories as story, i}
                    <div class="story-item">
                        <div class="story-header">
                            <span class="story-id">{story.id}</span>
                            <h3>{story.title.es}</h3>
                            {#if storyEditando === i}
                                <button class="btn-save" on:click={guardado = false} disabled>Editando...</button>
                            {:else}
                                <button class="btn-edit" on:click={() => editarHistoria(i)}>✏️ Editar</button>
                            {/if}
                        </div>
                        
                        {#if storyEditando === i}
                            <div class="editor">
                                <div class="campo">
                                    <label>Título ES:</label>
                                    <input bind:value={story.title.es} />
                                </div>
                                <div class="campo">
                                    <label>Título EN:</label>
                                    <input bind:value={story.title.en} />
                                </div>
                                <div class="campo">
                                    <label>Tema:</label>
                                    <input bind:value={story.theme} />
                                </div>
                                <div class="campo">
                                    <label>Rango edad:</label>
                                    <input bind:value={story.ageRange} />
                                </div>
                                <div class="campo full">
                                    <label>Páginas (formato: ES | EN):</label>
                                    <textarea rows="6" 
                                        value={story.pages.map(p => `${p.es} | ${p.en}`).join('\n\n')}
                                        on:change={(e) => {
                                            const lines = e.target.value.split('\n\n');
                                            story.pages = lines.map(l => {
                                                const idx = l.indexOf(' | ');
                                                if (idx === -1) return { es: l, en: '' };
                                                return { es: l.substring(0, idx), en: l.substring(idx + 3) };
                                            });
                                        }}
                                    ></textarea>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
            
            {#if storyEditando !== null}
                <div class="save-bar">
                    <button class="btn-guardar-todo" on:click={guardarEnGitHub} disabled={guardando || !tokenGuardado}>
                        {guardando ? '⏳ Guardando en GitHub...' : '💾 GUARDAR TODOS LOS CAMBIOS'}
                    </button>
                </div>
            {/if}
            
            <p class="info">💡 Los cambios se guardan directamente en GitHub. Necesitás un Personal Access Token con permisos de repo.</p>
        </div>
    {/if}
</div>

<style>
    .admin-container { min-height: 100vh; background: #f5f5f5; padding: 20px; }
    .login-box { max-width: 400px; margin: 100px auto; background: white; padding: 40px; border-radius: 20px; text-align: center; }
    .login-box h1 { color: #8E2DE2; margin-bottom: 20px; }
    .login-box input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 15px; }
    .login-box button { background: #8E2DE2; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 16px; cursor: pointer; }
    
    .admin-panel header { margin-bottom: 20px; }
    .admin-panel h1 { color: #333; margin-bottom: 15px; }
    .token-section { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .token-input { flex: 1; min-width: 250px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
    .token-ok { background: #d4edda; color: #155724; padding: 10px 15px; border-radius: 8px; }
    
    .alert { padding: 15px; border-radius: 10px; margin-bottom: 20px; }
    .alert.success { background: #d4edda; color: #155724; }
    
    .stories-list { display: flex; flex-direction: column; gap: 15px; }
    .story-item { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .story-header { display: flex; align-items: center; gap: 15px; padding: 15px 20px; background: #f8f8f8; }
    .story-id { background: #8E2DE2; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
    .story-header h3 { flex: 1; margin: 0; }
    .btn-edit { border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; background: #FF9800; color: white; }
    .btn-save { border: none; padding: 8px 15px; border-radius: 8px; font-size: 14px; background: #4CAF50; color: white; }
    
    .editor { padding: 20px; display: flex; flex-wrap: wrap; gap: 15px; }
    .campo { flex: 1 1 200px; }
    .campo.full { flex: 1 1 100%; }
    .campo label { display: block; font-weight: bold; margin-bottom: 5px; color: #333; }
    .campo input, .campo textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
    .campo textarea { resize: vertical; }
    
    .save-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: white; padding: 15px 30px; border-radius: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
    .btn-guardar-todo { background: linear-gradient(135deg, #8E2DE2, #4A00E0); color: white; border: none; padding: 15px 30px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; }
    .btn-guardar-todo:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .info { text-align: center; color: #666; margin-top: 80px; font-size: 14px; }
</style>
