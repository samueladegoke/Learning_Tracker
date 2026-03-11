import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressRing from '../../src/components/ProgressRing';

/**
 * ProgressRing Component Tests
 * Tests the circular progress indicator component
 */
describe('ProgressRing', () => {
    describe('Rendering', () => {
        it('renders an SVG element', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('renders children inside the ring', () => {
            render(
                <ProgressRing progress={75}>
                    <span>Test Content</span>
                </ProgressRing>
            );

            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('renders two circle elements (background and progress)', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const circles = container.querySelectorAll('circle');
            expect(circles).toHaveLength(2);
        });

        it('renders a gradient definition', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const gradient = container.querySelector('#progressGradient');
            expect(gradient).toBeInTheDocument();
        });
    });

    describe('Progress Values', () => {
        it('handles 0% progress', () => {
            const { container } = render(<ProgressRing progress={0} />);

            const progressCircle = container.querySelectorAll('circle')[1];
            // At 0%, strokeDashoffset equals strokeDasharray
            expect(progressCircle).toHaveAttribute('stroke-dasharray');
        });

        it('handles 100% progress', () => {
            const { container } = render(<ProgressRing progress={100} />);

            const progressCircle = container.querySelectorAll('circle')[1];
            expect(progressCircle).toBeInTheDocument();
        });

        it('handles 50% progress', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const progressCircle = container.querySelectorAll('circle')[1];
            expect(progressCircle).toBeInTheDocument();
        });
    });

    describe('Size Configuration', () => {
        it('uses default size of 120', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('width', '120');
            expect(svg).toHaveAttribute('height', '120');
        });

        it('accepts custom size', () => {
            const { container } = render(<ProgressRing progress={50} size={200} />);

            const svg = container.querySelector('svg');
            expect(svg).toHaveAttribute('width', '200');
            expect(svg).toHaveAttribute('height', '200');
        });
    });

    describe('Stroke Width', () => {
        it('uses default stroke width of 8', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const circles = container.querySelectorAll('circle');
            circles.forEach(circle => {
                expect(circle).toHaveAttribute('stroke-width', '8');
            });
        });

        it('accepts custom stroke width', () => {
            const { container } = render(
                <ProgressRing progress={50} strokeWidth={12} />
            );

            const circles = container.querySelectorAll('circle');
            circles.forEach(circle => {
                expect(circle).toHaveAttribute('stroke-width', '12');
            });
        });
    });

    describe('Children Rendering', () => {
        it('renders numeric progress inside ring', () => {
            render(
                <ProgressRing progress={65}>
                    <span>65%</span>
                </ProgressRing>
            );

            expect(screen.getByText('65%')).toBeInTheDocument();
        });

        it('renders multiple children', () => {
            render(
                <ProgressRing progress={50}>
                    <span>First</span>
                    <span>Second</span>
                </ProgressRing>
            );

            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Second')).toBeInTheDocument();
        });
    });

    describe('CSS Classes', () => {
        it('has transition classes for animation', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const progressCircle = container.querySelectorAll('circle')[1];
            expect(progressCircle).toHaveClass('transition-all');
            expect(progressCircle).toHaveClass('duration-700');
        });

        it('svg has rotation class', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const svg = container.querySelector('svg');
            expect(svg).toHaveClass('-rotate-90');
        });
    });

    describe('Accessibility', () => {
        it('is visible to users', () => {
            const { container } = render(<ProgressRing progress={50} />);

            const ring = container.firstChild;
            expect(ring).toBeVisible();
        });
    });
});
