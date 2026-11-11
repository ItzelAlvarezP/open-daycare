import { Icon } from "../_components/icon";
import { PostCard } from "../_components/post-card";
import { MOCK_POSTS, MOCK_SESSION } from "@/lib/mock-posts";

function CameraIcon() {
  return (
    <Icon size={19}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </Icon>
  );
}

export default function FeedPage() {
  return (
    <main className="min-w-0 flex-1 md:h-dvh md:overflow-y-auto">
      <div className="mx-auto w-full max-w-[760px] px-4 pt-[34px] pb-20 md:px-10">
        <header className="mb-6">
          <p className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-clay-dark">
            GUARDERÍA · SALA SOLES
          </p>
          <h1 className="font-display text-[30px] font-semibold text-ink">
            {MOCK_SESSION.greeting}
          </h1>
          <p className="mt-[5px] text-[14.5px] text-muted-dark">
            {MOCK_SESSION.meta}
          </p>
        </header>

        {/* composer estático */}
        <a
          href="#"
          className="mb-6 flex items-center gap-[14px] rounded-composer border border-line bg-card px-[18px] py-[14px] shadow-composer"
        >
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-avatar-to font-display text-[16px] font-semibold text-white">
            C
          </span>
          <span className="flex-1 text-[15px] text-muted">
            Compartí un momento…
          </span>
          <span className="flex size-[38px] flex-none items-center justify-center rounded-item bg-clay-soft text-clay">
            <CameraIcon />
          </span>
        </a>

        {/* divisor */}
        <div className="mb-[14px] flex items-center gap-[14px]">
          <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-label">
            PUBLICADO HOY
          </span>
          <span className="h-px flex-1 bg-rule" />
        </div>

        {/* posts */}
        <div className="flex flex-col gap-4">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
