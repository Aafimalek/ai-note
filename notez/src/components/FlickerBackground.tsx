"use client";

import { useEffect } from 'react';

export default function FlickerBackground() {
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.id = 'flicker-bg';

        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let isDark = false;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            isDark = document.documentElement.classList.contains('dark');
        };

        // Observer to detect theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    isDark = document.documentElement.classList.contains('dark');
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        resize();
        window.addEventListener('resize', resize);

        // Dot configuration
        const spacing = 40;
        interface Dot {
            x: number;
            y: number;
            opacity: number;
            targetOpacity: number;
            state: 'idle' | 'glowing' | 'fading';
            speed: number;
            maxGlow: number;
        }

        const dots: Dot[] = [];

        const initDots = () => {
            dots.length = 0;
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    // Add some jitter to position for organic feel
                    const offsetX = (Math.random() - 0.5) * 10;
                    const offsetY = (Math.random() - 0.5) * 10;

                    dots.push({
                        x: x + offsetX,
                        y: y + offsetY,
                        opacity: 0.1,
                        targetOpacity: 0.1,
                        state: 'idle',
                        speed: 0.02 + Math.random() * 0.03,
                        maxGlow: 0.5 + Math.random() * 0.5 // Random peak brightness
                    });
                }
            }
        };

        initDots();
        // Re-init dots on resize to fill screen
        window.addEventListener('resize', initDots);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Base colors
            const baseColor = isDark ? '255, 255, 255' : '0, 0, 0';
            // Glow color (Purple/Blue for that AI feel)
            const glowColor = isDark ? '120, 180, 255' : '100, 50, 255';

            dots.forEach(dot => {
                // State machine for glowing
                if (dot.state === 'idle') {
                    // Small chance to start glowing
                    if (Math.random() < 0.001) {
                        dot.state = 'glowing';
                        dot.targetOpacity = dot.maxGlow;
                    } else {
                        // Slight flicker in idle state
                        dot.targetOpacity = 0.05 + Math.random() * 0.05;
                    }
                } else if (dot.state === 'glowing') {
                    if (dot.opacity >= dot.targetOpacity - 0.05) {
                        dot.state = 'fading';
                        dot.targetOpacity = 0.1;
                    }
                } else if (dot.state === 'fading') {
                    if (dot.opacity <= dot.targetOpacity + 0.05) {
                        dot.state = 'idle';
                    }
                }

                // Smooth transition
                dot.opacity += (dot.targetOpacity - dot.opacity) * dot.speed;

                // Draw
                ctx.beginPath();

                if (dot.state !== 'idle' && dot.opacity > 0.3) {
                    // Draw glow when active
                    const glowSize = 2 + (dot.opacity * 4); // Glow expands with opacity
                    const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glowSize);
                    gradient.addColorStop(0, `rgba(${glowColor}, ${dot.opacity})`);
                    gradient.addColorStop(1, `rgba(${glowColor}, 0)`);

                    ctx.fillStyle = gradient;
                    ctx.arc(dot.x, dot.y, glowSize, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw bright center
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(${baseColor}, ${dot.opacity})`;
                    ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Draw normal idle dot
                    ctx.fillStyle = `rgba(${baseColor}, ${dot.opacity})`;
                    ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', initDots);
            observer.disconnect();
            const existingCanvas = document.getElementById('flicker-bg');
            if (existingCanvas) {
                existingCanvas.remove();
            }
        };
    }, []);

    return null;
}
