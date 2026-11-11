// Datos mock de los niños — en futuros specs se migran a BD reemplazando este archivo.
// Mateo es copia literal del mockup; los otros 7 completan datos coherentes de ejemplo.

export type Badge = { label: string; kind: "alergia" | "invitar" }; // MANÍ/LACTOSA | VINCULAR

export type MockParent = {
  fullName: string;
  meta: string; // "Mamá · activa" | "Papá · invitación enviada"
  status: "activa" | "pendiente";
  avatarBg: string;
  avatarFg: string;
};

export type MockChild = {
  id: string; // slug de URL en inglés, sin tildes
  fullName: string;
  age: string;
  linkedParents: string;
  badge: Badge | null; // null → chevron
  avatarBg: string;
  avatarFg: string;
  room: string;
  birthDate: string;
  intakeDate: string;
  allergyNote: string | null; // null → sin alerta en el perfil
  parents: MockParent[]; // [] → solo "Vincular otro padre"
};

export const MOCK_CHILDREN: MockChild[] = [
  {
    id: "mateo-fernandez",
    fullName: "Mateo Fernández",
    age: "3 años",
    linkedParents: "2 padres vinculados",
    badge: { label: "MANÍ", kind: "alergia" },
    avatarBg: "#A9D9E8",
    avatarFg: "#1F7A93",
    room: "Soles",
    birthDate: "12 mar 2022",
    intakeDate: "feb 2025",
    allergyNote: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      {
        fullName: "Lucía Fernández",
        meta: "Mamá · activa",
        status: "activa",
        avatarBg: "#C9B6E8",
        avatarFg: "#FFFFFF",
      },
      {
        fullName: "Diego Fernández",
        meta: "Papá · invitación enviada",
        status: "pendiente",
        avatarBg: "#A9C7E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "sofia-mendez",
    fullName: "Sofía Méndez",
    age: "2 años",
    linkedParents: "1 padre vinculado",
    badge: null,
    avatarBg: "#F4B8CC",
    avatarFg: "#C44A7A",
    room: "Soles",
    birthDate: "20 jul 2024",
    intakeDate: "ago 2025",
    allergyNote: null,
    parents: [
      {
        fullName: "Rocío Méndez",
        meta: "Mamá · activa",
        status: "activa",
        avatarBg: "#A9C7E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    fullName: "Benjamín Ruiz",
    age: "3 años",
    linkedParents: "2 padres vinculados",
    badge: null,
    avatarBg: "#B9DEC4",
    avatarFg: "#3E8B62",
    room: "Soles",
    birthDate: "8 sep 2023",
    intakeDate: "mar 2025",
    allergyNote: null,
    parents: [
      {
        fullName: "Carolina Ruiz",
        meta: "Mamá · activa",
        status: "activa",
        avatarBg: "#F4B8CC",
        avatarFg: "#FFFFFF",
      },
      {
        fullName: "Martín Ruiz",
        meta: "Papá · activa",
        status: "activa",
        avatarBg: "#C9B6E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "valentina-soto",
    fullName: "Valentina Soto",
    age: "2 años",
    linkedParents: "sin padres vinculados",
    badge: { label: "VINCULAR", kind: "invitar" },
    avatarBg: "#F4DC8E",
    avatarFg: "#9A7B1E",
    room: "Soles",
    birthDate: "3 may 2024",
    intakeDate: "feb 2026",
    allergyNote: null,
    parents: [],
  },
  {
    id: "tomas-diaz",
    fullName: "Tomás Díaz",
    age: "3 años",
    linkedParents: "1 padre vinculado",
    badge: { label: "LACTOSA", kind: "alergia" },
    avatarBg: "#C9B6E8",
    avatarFg: "#7B5FC0",
    room: "Soles",
    birthDate: "27 nov 2022",
    intakeDate: "feb 2025",
    allergyNote: "Intolerancia a la lactosa. Tomamos bebida de almendras en el desayuno.",
    parents: [
      {
        fullName: "Jimena Díaz",
        meta: "Mamá · activa",
        status: "activa",
        avatarBg: "#A9D9E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "emma-castro",
    fullName: "Emma Castro",
    age: "2 años",
    linkedParents: "1 padre vinculado",
    badge: null,
    avatarBg: "#F4B8CC",
    avatarFg: "#C44A7A",
    room: "Soles",
    birthDate: "15 feb 2024",
    intakeDate: "jul 2025",
    allergyNote: null,
    parents: [
      {
        fullName: "Nicolás Castro",
        meta: "Papá · activa",
        status: "activa",
        avatarBg: "#B9DEC4",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "lucas-romero",
    fullName: "Lucas Romero",
    age: "3 años",
    linkedParents: "1 padre vinculado",
    badge: null,
    avatarBg: "#A9D9E8",
    avatarFg: "#1F7A93",
    room: "Soles",
    birthDate: "30 abr 2023",
    intakeDate: "ago 2024",
    allergyNote: null,
    parents: [
      {
        fullName: "Valeria Romero",
        meta: "Mamá · activa",
        status: "activa",
        avatarBg: "#C9B6E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
  {
    id: "olivia-vega",
    fullName: "Olivia Vega",
    age: "2 años",
    linkedParents: "1 padre vinculado",
    badge: null,
    avatarBg: "#B9DEC4",
    avatarFg: "#3E8B62",
    room: "Soles",
    birthDate: "10 oct 2024",
    intakeDate: "feb 2026",
    allergyNote: null,
    parents: [
      {
        fullName: "Gonzalo Vega",
        meta: "Papá · activa",
        status: "activa",
        avatarBg: "#A9C7E8",
        avatarFg: "#FFFFFF",
      },
    ],
  },
];
