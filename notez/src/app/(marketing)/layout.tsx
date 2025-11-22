import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";


export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col relative">
            {/* Global Grid Background */}
            <div className="fixed inset-0 z-[-1] w-full h-full bg-background">
                <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)]"></div>
            </div>

            <LandingHeader />
            <main className="flex-1">{children}</main>
            <LandingFooter />
        </div>
    );
}
