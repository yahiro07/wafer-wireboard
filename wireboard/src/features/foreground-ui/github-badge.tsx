import { Icons } from "@/components/icons";

export const GithubBadge = () => {
  return (
    <div className="absolute top-0 right-0">
      <a
        href="https://github.com/yahiro07/mini-groove"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="GitHub repository"
        className="block h-20 w-20 bg-[#f5a623] text-black transition-colors hover:bg-[#ffb12a] [clip-path:polygon(100%_0,0_0,100%_100%)]"
      >
        <Icons.Github
          size={30}
          className="absolute right-3 top-3 drop-shadow-sm"
        />
      </a>
    </div>
  );
};
