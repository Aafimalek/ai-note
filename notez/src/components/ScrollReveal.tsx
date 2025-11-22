"use client";

import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-fade-in-up');
                            entry.target.classList.remove('opacity-0', 'translate-y-8');
                        }, delay);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [delay]);

    return (
        <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700">
            {children}
        </div>
    );
}
