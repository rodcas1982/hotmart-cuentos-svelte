<script lang="ts">
    import { newStories } from '$lib/data/nuevos';
    import { onMount } from 'svelte';
    
    let stories = [...newStories];
    let storyEditando: number | null = null;
    let guardado = false;
    let password = '';
    let autenticado = false;
    const PASSWORD_ADMIN = 'RinconAdmin2026!';
    
    function login() {
        if (password === PASSWORD_ADMIN) {
            autenticado = true;
        } else {
            alert('Contraseña incorrecta');
        }
    }
    
    function editarHistoria(index: number) {
        storyEditando = index;
        guardado = false;
    }
    
    function guardarHistoria() {
        // Guardar en localStorage
        localStorage.setItem('cuentos_editados', JSON.stringify(stories));
        guardado = true;
        storyEditando = null;
    }
    
    function exportarCambios() {
        const data = JSON.stringify(stories, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cuentos_actualizados.json';
        a.click();
    }
    
    function importarCambios(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target?.result as string);
                    stories = imported;
                    localStorage.setItem('cuentos_editados', JSON.stringify(stories));
                    alert('Cuentos importados correctamente');
                } catch (err) {
                    alert('Error al importar: formato inválido');
                }
            };
            reader.readAsText(file);
        }
    }
    
    // Cargar cambios guardados
    onMount(() => {
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
                <div class="acciones">
                    <button class="btn-export" on:click={exportarCambios}>📥 Exportar JSON</button>
                    <label class="btn-import">
                        📤 Importar JSON
                        <input type="file" accept=".json" on:change={importarCambios} />
                    </label>
                </div>
            </header>
            
            {#if guardado}
                <div class="alert success">✅ Cambios guardados en localStorage</div>
            {/if}
            
            <div class="stories-list">
                {#each stories as story, i}
                    <div class="story-item">
                        <div class="story-header">
                            <span class="story-id">{story.id}</span>
                            <h3>{story.title.es}</h3>
                            {#if storyEditando === i}
                                <button class="btn-save" on:click={guardarHistoria}>💾 Guardar</button>
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
                                    <label>Páginas (una por línea, formato: ES | EN):</label>
                                    <textarea rows="8" 
                                        value={story.pages.map(p => `${p.es} | ${p.en}`).join('\n\n')}
                                        on:change={(e) => {
                                            const lines = e.target.value.split('\n\n');
                                            story.pages = lines.map(l => {
                                                const [es, en] = l.split(' | ');
                                                return { es: es || '', en: en || '' };
                                            });
                                        }}
                                    ></textarea>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
            
            <p class="info">💡 Los cambios se guardan en el navegador. Exporta el JSON para guardar permanentemente.</p>
        </div>
    {/if}
</div>

<style>
    .admin-container { min-height: 100vh; background: #f5f5f5; padding: 20px; }
    .login-box { max-width: 400px; margin: 100px auto; background: white; padding: 40px; border-radius: 20px; text-align: center; }
    .login-box h1 { color: #8E2DE2; margin-bottom: 20px; }
    .login-box input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 15px; }
    .login-box button { background: #8E2DE2; color: white; border: none; padding: 15px 40px; border-radius: 10px; font-size: 16px; cursor: pointer; }
    
    .admin-panel header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
    .admin-panel h1 { color: #333; margin: 0; }
    .acciones { display: flex; gap: 10px; }
    .btn-export, .btn-import { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; }
    .btn-import { background: #2196F3; }
    .btn-import input { display: none; }
    
    .alert { padding: 15px; border-radius: 10px; margin-bottom: 20px; }
    .alert.success { background: #d4edda; color: #155724; }
    
    .stories-list { display: flex; flex-direction: column; gap: 15px; }
    .story-item { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .story-header { display: flex; align-items: center; gap: 15px; padding: 15px 20px; background: #f8f8f8; }
    .story-id { background: #8E2DE2; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
    .story-header h3 { flex: 1; margin: 0; }
    .btn-edit, .btn-save { border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; }
    .btn-edit { background: #FF9800; color: white; }
    .btn-save { background: #4CAF50; color: white; }
    
    .editor { padding: 20px; display: flex; flex-wrap: wrap; gap: 15px; }
    .campo { flex: 1 1 200px; }
    .campo.full { flex: 1 1 100%; }
    .campo label { display: block; font-weight: bold; margin-bottom: 5px; color: #333; }
    .campo input, .campo textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; font-family: inherit; }
    .campo textarea { resize: vertical; }
    
    .info { text-align: center; color: #666; margin-top: 20px; font-size: 14px; }
</style>
