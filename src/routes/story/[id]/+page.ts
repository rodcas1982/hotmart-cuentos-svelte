import { newStories } from '$lib/data/nuevos';
import { error } from '@sveltejs/kit';

export function load({ params }) {
    const story = newStories.find(s => s.id === params.id);
    
    if (!story) {
        throw error(404, 'Cuento no encontrado');
    }
    
    return {
        story,
        stories: newStories
    };
}
