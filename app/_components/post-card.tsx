import { Icon } from "./icon";
import type { MockPost, PostType } from "@/lib/mock-posts";

/* Colores del avatar por niño — llegarán del modelo de datos de niños */
const KID_AVATAR_BG = "#A9D9E8";
const KID_AVATAR_TEXT = "#1F7A93";

const PILL_STYLES: Record<PostType, { label: string; className: string }> = {
  logro: { label: "LOGRO", className: "bg-logro-soft text-logro" },
  actividad: { label: "ACTIVIDAD", className: "bg-actividad-soft text-actividad" },
  anuncio: { label: "ANUNCIO", className: "bg-anuncio-soft text-anuncio" },
};

/* Corazón relleno: único icono con fill */
function HeartIcon() {
  return (
    <svg
      width={19}
      height={19}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <Icon size={20}>
      <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </Icon>
  );
}

function CommentIcon() {
  return (
    <Icon size={18}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </Icon>
  );
}

function ImageIcon() {
  return (
    <Icon size={30} strokeWidth={1.7}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
    </Icon>
  );
}

export function PostCard({ post }: { post: MockPost }) {
  const pill = PILL_STYLES[post.type];
  return (
    <article className="rounded-post border border-line bg-card px-[22px] py-5 shadow-post">
      <header className="mb-[14px] flex items-center gap-3">
        {post.initial ? (
          <span
            className="flex size-11 flex-none items-center justify-center rounded-full font-display text-[17px] font-semibold"
            style={{ background: KID_AVATAR_BG, color: KID_AVATAR_TEXT }}
          >
            {post.initial}
          </span>
        ) : (
          <span className="flex size-11 flex-none items-center justify-center rounded-full bg-anuncio-soft text-anuncio">
            <MegaphoneIcon />
          </span>
        )}
        <div className="flex-1">
          <div className="font-display text-[16.5px] font-semibold text-ink">
            {post.author}
          </div>
          <div className="text-[12.5px] text-muted">
            {post.time} · publicado por vos
          </div>
        </div>
        <div
          className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${pill.className}`}
        >
          <span className="size-2 rounded-full bg-current" />
          <span className="text-[12px] font-extrabold tracking-[0.5px]">
            {pill.label}
          </span>
        </div>
      </header>

      <div className="mb-2.5 text-[12.5px] text-muted">Para: {post.audience}</div>
      <p className="text-[15.5px] leading-[1.55] text-ink-body">{post.body}</p>

      {post.photoCaption && (
        <a
          href="#"
          className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-photo border-[1.5px] border-dashed border-photo-border bg-photo-bg text-photo-text"
        >
          <ImageIcon />
          <span className="text-[13.5px]">{post.photoCaption}</span>
        </a>
      )}

      <footer className="mt-4 flex items-center gap-[18px] border-t border-line-soft pt-[14px]">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-clay">
          <HeartIcon />
          {post.likes}
        </span>
        <a
          href="#"
          className="flex items-center gap-[7px] text-[14px] font-bold text-muted-dark"
        >
          <CommentIcon />
          {post.comments}
        </a>
        <span className="flex-1" />
        <a href="#" className="text-[14px] font-extrabold text-clay-deep">
          Editar
        </a>
      </footer>
    </article>
  );
}
