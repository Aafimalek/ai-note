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

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Create dots grid
        const spacing = 40;
        const dots: Array<{ x: number; y: number; opacity: number; targetOpacity: number; flickerSpeed: number }> = [];

        for (let x = 0; x < canvas.width; x += spacing) {
            for (let y = 0; y < canvas.height; y += spacing) {
                dots.push({
                    x,
                    y,
                    opacity: 0.1,
                    targetOpacity: 0.1,
                    flickerSpeed: 0.02 + Math.random() * 0.05
                });
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get theme
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';

            dots.forEach(dot => {
                // Randomly change target opacity
                if (Math.random() < 0.01) {
                    dot.targetOpacity = Math.random() < 0.3 ? 0.02 : 0.1;
                }

                // Smoothly transition to target opacity
                dot.opacity += (dot.targetOpacity - dot.opacity) * dot.flickerSpeed;

                // Draw dot
                ctx.fillStyle = color + dot.opacity + ')';
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            const existingCanvas = document.getElementById('flicker-bg');
            if (existingCanvas) {
                existingCanvas.remove();
            }
        };
    }, []);

    return null;
}
