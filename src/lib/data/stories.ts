// Story data - bilingual children's stories
export interface Page {
    es: string;
    en: string;
}

export interface Story {
    id: string;
    title: { es: string; en: string };
    image: string;
    pages: Page[];
}

export const stories: Story[] = [
    {
        id: "01-valiente",
        title: { es: "El Pequeño Valiente", en: "The Brave Little One" },
        image: "01-valiente.jpg",
        pages: [
            { es: "Había una vez un pequeño león llamado Tomás que vivía en la sabana africana. Era un león muy especial con una melena dorada brillante.", en: "Once upon a time, there was a little lion named Tomás who lived in the African savanna. He was a very special lion with a golden shining mane." },
            { es: "Tenía un amigo peluche favorito: un león de peluche que le regaló su abuelita. Lo llevaba a todas partes.", en: "He had a favorite plush friend: a lion plush that his grandmother gave him. He took it everywhere." },
            { es: "Pero había algo que le daba mucho miedo: las tormentas con truenos. ¡Cuando sonaba el trueno, se escondía debajo de su cama!", en: "But there was something that scared him a lot: storms with thunder! When thunder sounded, he hid under his bed!" },
            { es: "\"¡El trueno es un monstruo!\", gritaba temblando.", en: "\"Thunder is a monster!\" he would say, trembling." },
            { es: "Un día, Tomás estaba jugando en el jardín. De pronto, el cielo se puso muy oscuro.", en: "One day, Tomás was playing in the garden. Suddenly, the sky became very dark." },
            { es: "Escuchó un sonido triste: \"¡Pío, pío!\". ¡Era un pollito mojándose!", en: "He heard a sad sound: \"Peep, peep!\". It was a chick getting wet!" },
            { es: "Tomás recordó: \"Ser valiente es hacer lo correcto aunque tengas miedo\". Corrió a ayudar.", en: "Tomás remembered: \"Being brave is doing what's right even when you're scared.\" He ran to help." },
            { es: "La lluvia paró. \"¡Gracias, valiente león!\" ¡Todos aplaudieron a Tomás!", en: "The rain stopped. \"Thank you, brave lion!\" Everyone applauded Tomás!" },
            { es: "Moraleja: ¡Eres más valiente de lo que crees!", en: "Moral: You are braver than you think!" },
            { es: "Gracias por leer. ¿Con quién lo leerás mañana?", en: "Thank you for reading. Who will you read it with tomorrow?" }
        ]
    },
    {
        id: "02-luna",
        title: { es: "Luna la Honesta", en: "Luna the Honest" },
        image: "02-luna.jpg",
        pages: [
            { es: "Luna era una bola de queso plateado que brillaba en el cielo nocturno.", en: "Luna was a silver cheese ball that glowed in the night sky." },
            { es: "Todos la miraban y decían: \"¡Qué luna tan bella!\"", en: "Everyone looked at her and said: \"How beautiful the moon is!\"" },
            { es: "Pero Luna no brillaba sola. Ella reflejaba la luz del sol.", en: "But Luna didn't shine alone. She reflected the sun's light." },
            { es: "Una estrella le preguntó: \"¿Por qué no dices que no brillas tú misma?\"", en: "A star asked her: \"Why don't you say you don't shine yourself?\"" },
            { es: "Luna sonrió: \"Prefiero ser honesta. Yo反射o la luz, no la creo.\"", en: "Luna smiled: \"I'd rather be honest. I reflect light, I don't create it.\"" },
            { es: "Todos conmemdaron su honestidad. \"¡Qué luna tan noble!\"", en: "Everyone praised her honesty. \"What a noble moon!\"" },
            { es: "Moraleja: La honestidad brilla más que cualquier luz.", en: "Moral: Honesty shines brighter than any light." },
            { es: "Gracias por leer sobre Luna.", en: "Thank you for reading about Luna." }
        ]
    },
    {
        id: "03-max",
        title: { es: "Max y la Amistad", en: "Max and Friendship" },
        image: "03-max.jpg",
        pages: [
            { es: "Max era un perro golden retriever muy feliz que vivía en una casa con jardín.", en: "Max was a very happy golden retriever who lived in a house with a garden." },
            { es: "Un día llegó un niño llamado Lucas a vivir a la casa de al lado.", en: "One day, a boy named Lucas moved into the house next door." },
            { es: "Max vio a Lucas por la cerca y movió su cola. ¡Era un nuevo amigo!", en: "Max saw Lucas through the fence and wagged his tail. A new friend!" },
            { es: "Se hicieron amigos instantánea. Jugaban juntos todos los días.", en: "They became friends instantly. They played together every day." },
            { es: "Max enseñó a Lucas a lanzar la pelota. Lucas enseñó a Max a buscar aplausos.", en: "Max taught Lucas to throw the ball. Lucas taught Max to fetch applause." },
            { es: "Un día, Lucas tuvo que mudarse lejos. Max se sintió triste.", en: "One day, Lucas had to move far away. Max felt sad." },
            { es: "Pero Max entendió: los amigos están en el corazón, no en la distancia.", en: "But Max understood: friends are in the heart, not in the distance." },
            { es: "Moraleja: La verdadera amistad nunca termina.", en: "Moral: True friendship never ends." }
        ]
    },
    {
        id: "04-sofia",
        title: { es: "Sofía y la Naturaleza", en: "Sofia and Nature" },
        image: "04-sofia.jpg",
        pages: [
            { es: "Sofía vivía en una casita cerca del bosque. Amaba las flores y los animalitos.", en: "Sofia lived in a little house near the forest. She loved flowers and animals." },
            { es: "Un día vio a un bird triste sin plumas. \"¿Qué te pasó?\"", en: "One day she saw a sad bird without feathers. \"What happened to you?\"" },
            { es: "\"Los humanos tiraron basura en mi nido\", respondió el pájaro.", en: "\"Humans threw garbage in my nest,\" replied the bird." },
            { es: "Sofía decidió ayudar. Recogió la basura y plantó flores nuevas.", en: "Sofia decided to help. She picked up the garbage and planted new flowers." },
            { es: "El pájaro Recoveró sus plumas y cantó feliz.", en: "The bird regrew its feathers and sang happily." },
            { es: "Moraleja: Cuidar la naturaleza es cuidar nuestro hogar.", en: "Moral: Caring for nature is caring for our home." }
        ]
    },
    {
        id: "05-tito",
        title: { es: "Tito Aprende a Compartir", en: "Tito Learns to Share" },
        image: "05-tito.jpg",
        pages: [
            { es: "Tito era un osito de peluche que siempre quería sus juguetes solo para él.", en: "Tito was a teddy bear who always wanted his toys for himself alone." },
            { es: "Un día vino un amigo a jugar. \"¿Puedo jugar contigo?\"", en: "One day a friend came to play. \"Can I play with you?\"" },
            { es: "Tito dijo: \"No, estos son míos\". Y guardó todos sus juguetes.", en: "Tito said: \"No, these are mine.\" And hid all his toys." },
            { es: "El amigo se fue triste. Tito se sintió solo.", en: "The friend left sad. Tito felt alone." },
            { es: "Al día siguiente, Tito compartió sus juguetes. ¡Jugaron felices!", en: "The next day, Tito shared his toys. They played happily!" },
            { es: "Moraleja: Compartir multiplica la alegría.", en: "Moral: Sharing multiplies joy." }
        ]
    },
    {
        id: "06-dragon",
        title: { es: "El Dragón Soñador", en: "The Dreamy Dragon" },
        image: "06-dragon.jpg",
        pages: [
            { es: "Drago era un dragón que no podía dormir. ¡Soñaba despierto todo el día!", en: "Drago was a dragon who couldn't sleep. He daydreamed all day!" },
            { es: "Los otros dragones firesaban montañas de fuego. Drago solo miraba las estrellas.", en: "The other dragons breathed fire mountains. Drago just looked at the stars." },
            { es: "\"¿Por qué no duermes?\", preguntó su mamá.", en: "\"Why don't you sleep?\" asked his mother." },
            { es: "\"Porque los sueños son más bellos que la realidad\", respondió Drago.", en: "\"Because dreams are more beautiful than reality,\" replied Drago." },
            { es: "Su mamá sonrió: \"Entonces sueña pero también vive\".", en: "His mother smiled: \"Then dream but also live.\"" },
            { es: "Moraleja: Los sueños son el combustible de la vida.", en: "Moral: Dreams are the fuel of life." }
        ]
    },
    {
        id: "07-lunaviaje",
        title: { es: "Viaje a la Luna", en: "Journey to the Moon" },
        image: "07-luna.jpg",
        pages: [
            { es: "Pepo era un pingüino que soñaba con conocer la luna.", en: "Pepo was a penguin who dreamed of meeting the moon." },
            { es: "Construyó un cohete con cajas de cartón. \"¡Listo para partir!\"", en: "He built a rocket with cardboard boxes. \"Ready to leave!\"" },
            { es: "El cohete voló... ¡y cayó en el jardín de al lado!", en: "The rocket flew... and landed in the next door garden!" },
            { es: "Pero ahí estava la luna! Era una lampara de la vecina.", en: "But there was the moon! It was a neighbor's lamp." },
            { es: "Igual fue una aventura mágica. ¡Los sueños también cumplen de otras formas!", en: "It was still a magical adventure. Dreams also come true in other ways!" },
            { es: "Moraleja: El camino importa más que el destino.", en: "Moral: The journey matters more than the destination." }
        ]
    },
    {
        id: "08-selva",
        title: { es: "Animalitos de la Selva", en: "Jungle Animals" },
        image: "08-selva.jpg",
        pages: [
            { es: "En la selva vivían muchos animales: leones, monos, loros y elefantes.", en: "In the jungle lived many animals: lions, monkeys, parrots, and elephants." },
            { es: "Un día hubo una tormenta grande. Todos buscaron refugio.", en: "One day there was a big storm. Everyone looked for shelter." },
            { es: "El elefante usó sus orejas como paraguas para todos.", en: "The elephant used his ears as an umbrella for everyone." },
            { es: "El mono compartió su árbol con los pájaros.", en: "The monkey shared his tree with the birds." },
            { es: "Juntos superaron la tormenta. ¡La ayuda mutua es la mejor medicina!", en: "Together they overcame the storm. Mutual help is the best medicine!" },
            { es: "Moraleja: En comunidad somos más fuertes.", en: "Moral: In community we are stronger." }
        ]
    },
    {
        id: "09-castillo",
        title: { es: "El Castillo de Estrellas", en: "Castle of Stars" },
        image: "09-castillo.jpg",
        pages: [
            { es: "En un castillo de nubes vivían las estrellas pequeñas.", en: "In a castle of clouds lived the little stars." },
            { es: "Tenían miedo de brillar. \"Somos muy pequeñas\", pensaban.", en: "They were afraid to shine. \"We are too small,\" they thought." },
            { es: "Una estrella grande les dijo: \"Cada luz cuenta en la oscuridad\".", en: "A big star told them: \"Every light counts in the darkness.\"" },
            { es: "Esa noche, las estrella pequeñas brillaron juntas. ¡El cielo quedó hermoso!", en: "That night, the little stars shone together. The sky became beautiful!" },
            { es: "Moraleja: Tu luz importa, por pequeña que sea.", en: "Moral: Your light matters, no matter how small." }
        ]
    },
    {
        id: "10-contando",
        title: { es: "Contando Animalitos", en: "Counting Animals" },
        image: "10-contando.jpg",
        pages: [
            { es: "Lola la vaca quería aprender a contar. \"Uno, dos, tres...\"", en: "Lola the cow wanted to learn to count. \"One, two, three...\"" },
            { es: "Encontró 1 gallina, 2 cerdos, 3 caballos y muchos más.", en: "She found 1 chicken, 2 pigs, 3 horses and many more." },
            { es: "\"¿Para qué sirve contar?\", preguntó el caballo.", en: "\"What's counting for?\" asked the horse." },
            { es: "\"Para no perder nada y saber cuánto tenemos\", respondió Lola.", en: "\"To not lose anything and know how much we have,\" replied Lola." },
            { es: "Ahora todos cuentan sus amigos. ¡Las matemáticas son útiles!", en: "Now everyone counts their friends. Math is useful!" },
            { es: "Moraleja: Saber contar hace la vida más fácil.", en: "Moral: Knowing how to count makes life easier." }
        ]
    },
    {
        id: "11-abc",
        title: { es: "El ABC Mágico", en: "The Magical ABC" },
        image: "11-abc.jpg",
        pages: [
            { es: "Las letras del alfabeto eran mejores amigas. A, B, C, D...", en: "The letters of the alphabet were best friends. A, B, C, D..." },
            { es: "Un día la A se perdió. \"¿Dónde estás?\", gritaron las otras.", en: "One day A got lost. \"Where are you?\" shouted the others." },
            { es: "La A estaba escondida. \"Soy la primera, me da vergüenza\".", en: "A was hiding. \"I'm first, I'm embarrassed.\"" },
            { es: "\"Eres importante pero no más que las demás\", dijeron B, C, D...", en: "\"You are important but no more than the others,\" said B, C, D..." },
            { es: "Juntas forman palabras mágicas. ¡El equipo es todo!", en: "Together they form magical words. Teamwork is everything!" },
            { es: "Moraleja: Cada letra cuenta en las palabras.", en: "Moral: Every letter counts in words." }
        ]
    },
    {
        id: "12-colores",
        title: { es: "Lucas y los Colores", en: "Lucas and Colors" },
        image: "12-colores.jpg",
        pages: [
            { es: "Lucas vivía en un mundo en blanco y negro. No veía colores.", en: "Lucas lived in a black and white world. He couldn't see colors." },
            { es: "Un día encontró unos lentes mágicos. ¡El mundo se llenó de color!", en: "One day he found magical glasses. The world filled with color!" },
            { es: "El cielo era azul, el pasto verde, las flores rojas y amarillas.", en: "The sky was blue, the grass green, the flowers red and yellow." },
            { es: "\"¡Qué hermoso es el mundo!\", exclamó Lucas.", en: "\"How beautiful the world is!\" exclaimed Lucas." },
            { es: "Compartir los lentes con sus amigos. ¡La alegría se multiplica!", en: "Sharing the glasses with his friends. Joy multiplies!" },
            { es: "Moraleja: Los colores de la vida Compartirlos es mejor.", en: "Moral: The colors of life are better shared." }
        ]
    }
];
