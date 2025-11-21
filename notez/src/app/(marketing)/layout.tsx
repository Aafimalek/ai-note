import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import FlickerBackground from "@/components/FlickerBackground";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <FlickerBackground />
            <LandingHeader />
            <main className="flex-1">{children}</main>
            <LandingFooter />
        </div>
    );
}
