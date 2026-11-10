// Datos mock del feed — en futuros specs se migran a BD reemplazando este archivo.

export type PostType = "logro" | "actividad" | "anuncio";

export type MockPost = {
  id: string;
  type: PostType;
  author: string; // "Mateo" | "Anuncio general"
  initial: string | null; // null → avatar con icono (megáfono, solo anuncios)
  time: string; // "14:20"
  audience: string; // "familia de Mateo" | "toda la sala"
  body: string;
  photoCaption?: string; // solo actividad con foto
  likes: number;
  comments: number;
};

export const MOCK_SESSION = {
  fullName: "Caro Giménez",
  greeting: "Buenas, Caro",
  role: "Maestra",
  room: "Soles",
  meta: "12 niños · martes 17 jun", // estático, decisión del spec
};

export const MOCK_POSTS: MockPost[] = [
  {
    id: "logro-orinal",
    type: "logro",
    author: "Mateo",
    initial: "M",
    time: "14:20",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "actividad-temperas",
    type: "actividad",
    author: "Mateo",
    initial: "M",
    time: "09:40",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoCaption: "Foto · pintando con témperas",
    likes: 5,
    comments: 2,
  },
  {
    id: "anuncio-parque",
    type: "anuncio",
    author: "Anuncio general",
    initial: null,
    time: "07:50",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
