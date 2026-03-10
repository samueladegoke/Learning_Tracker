import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../../src/components/ProgressBar';

/**
 * ProgressBar Component Tests
 * Tests the progress bar component with various configurations
 */
describe('ProgressBar', () => {
    describe('Rendering', () => {
        it('renders with default props', () => {
            const { container } = render(<ProgressBar progress={50} />);

            // Should render a progress bar
            const progressBar = container.querySelector('.bg-gradient-to-r');
            expect(progressBar).toBeInTheDocument();
        });

        it('displays progress percentage when showLabel is true', () => {
            render(<ProgressBar progress={75} showLabel={true} />);

            expect(screen.getByText('75%')).toBeInTheDocument();
        });

        it('hides label when showLabel is false', () => {
            render(<ProgressBar progress={50} showLabel={false} />);

            // Should not show the percentage label
            expect(screen.queryByText('50%')).not.toBeInTheDocument();
        });

        it('displays "Progress" label when showLabel is true', () => {
            render(<ProgressBar progress={30} showLabel={true} />);

            expect(screen.getByText('Progress')).toBeInTheDocument();
        });
    });

    describe('Progress Values', () => {
        it('handles 0% progress', () => {
            const { container } = render(<ProgressBar progress={0} />);

            const progressBar = container.querySelector('.bg-gradient-to-r');
            expect(progressBar).toHaveStyle({ width: '0%' });
        });

        it('handles 100% progress', () => {
            const { container } = render(<ProgressBar progress={100} />);

            const progressBar = container.querySelector('.bg-gradient-to-r');
            expect(progressBar).toHaveStyle({ width: '100%' });
        });

        it('handles decimal progress values', () => {
            render(<ProgressBar progress={33.7} showLabel={true} />);

            // Should round the displayed value
            expect(screen.getByText('34%')).toBeInTheDocument();
        });

        it('caps progress at 100%', () => {
            const { container } = render(<ProgressBar progress={150} />);

            const progressBar = container.querySelector('.bg-gradient-to-r');
            expect(progressBar).toHaveStyle({ width: '100%' });
        });
    });

    describe('Size Variants', () => {
        it('applies small size class', () => {
            const { container } = render(<ProgressBar progress={50} size="sm" />);

            const track = container.querySelector('.h-1\\.5');
            expect(track).toBeInTheDocument();
        });

        it('applies medium size class (default)', () => {
            const { container } = render(<ProgressBar progress={50} size="md" />);

            const track = container.querySelector('.h-2\\.5');
            expect(track).toBeInTheDocument();
        });

        it('applies large size class', () => {
            const { container } = render(<ProgressBar progress={50} size="lg" />);

            const track = container.querySelector('.h-4');
            expect(track).toBeInTheDocument();
        });
    });

    describe('Custom Classes', () => {
        it('applies custom className', () => {
            const { container } = render(
                <ProgressBar progress={50} className="custom-class" />
            );

            const wrapper = container.querySelector('.custom-class');
            expect(wrapper).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has visible progress indicator', () => {
            const { container } = render(<ProgressBar progress={60} />);

            // Progress bar should be visible
            const bar = container.querySelector('.bg-gradient-to-r');
            expect(bar).toBeVisible();
        });
    });
});
