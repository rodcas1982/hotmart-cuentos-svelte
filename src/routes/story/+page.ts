// Cargar parámetros URL correctamente para la página de story
export const prerender = false;

export function load({ url }) {
    const storyId = url.searchParams.get('story') || '01-valiente';
    return {
        storyId
    };
}