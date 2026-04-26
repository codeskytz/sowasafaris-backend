import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col overflow-hidden bg-[#0b2b24] text-[#fff7df]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,186,32,0.22),transparent_28rem),linear-gradient(135deg,rgba(6,26,22,0.94),rgba(15,61,49,0.9))]" />
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-[#ffba20]/30" />
            <div className="absolute bottom-[-10rem] left-[-6rem] h-96 w-96 rounded-full bg-[#ffba20]/10 blur-3xl" />

            <div className="relative grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden flex-col justify-between p-10 lg:flex">
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo.png"
                            alt="Sowa Safari & Adventures"
                            className="size-20 rounded-full border border-[#ffba20]/40 bg-[#fff7df] object-contain p-1 shadow-2xl shadow-black/30"
                        />
                        <div>
                            <p className="text-xs font-bold tracking-[0.4em] text-[#ffba20] uppercase">
                                Sowa Safaris
                            </p>
                            <p className="mt-1 text-sm text-[#fff7df]/70">
                                Mountain Expedition Portal
                            </p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <p className="text-sm font-semibold tracking-[0.45em] text-[#ffba20] uppercase">
                            Admin Command Center
                        </p>
                        <h1 className="mt-6 text-5xl leading-tight font-black tracking-tight">
                            Manage every route, booking, and story from base
                            camp.
                        </h1>
                        <p className="mt-6 max-w-lg text-lg leading-8 text-[#fff7df]/72">
                            Keep safari inventory, pricing, galleries,
                            testimonials, and booking follow-up aligned with the
                            public Sowa Safaris experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                        {['Bookings', 'Safaris', 'Gallery'].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-[#ffba20]/20 bg-white/8 p-4 backdrop-blur"
                            >
                                <p className="font-semibold text-[#ffba20]">
                                    {item}
                                </p>
                                <p className="mt-1 text-xs text-[#fff7df]/65">
                                    Live admin control
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <main className="flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md rounded-[2rem] border border-[#ffba20]/25 bg-[#fffaf0] p-6 text-[#11251f] shadow-2xl shadow-black/30 md:p-8">
                        <div className="mb-8 flex flex-col items-center gap-4 text-center">
                            <img
                                src="/logo.png"
                                alt="Sowa Safari & Adventures"
                                className="size-24 rounded-full border border-[#d8c8a8] bg-white object-contain p-1 shadow-lg"
                            />
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-[0.35em] text-[#9a6b05] uppercase">
                                    Staff Access
                                </p>
                                <h1 className="text-2xl font-black">
                                    {title}
                                </h1>
                                <p className="text-sm text-[#6e6049]">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
