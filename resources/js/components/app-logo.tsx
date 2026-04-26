export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-full border border-sidebar-primary/40 bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/20">
                <img
                    src="/logo.png"
                    alt="Sowa Safari & Adventures"
                    className="size-9 rounded-full object-contain"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-black tracking-wide">
                    Sowa Safaris
                </span>
                <span className="truncate text-xs text-sidebar-foreground/65">
                    Admin Portal
                </span>
            </div>
        </>
    );
}
