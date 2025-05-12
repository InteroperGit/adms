import { render, screen, fireEvent } from '@testing-library/react';
import LoadingMoreButton from './LoadingMoreButton';

describe('LoadingMoreButton', () => {
    it('renders default text when not loading', () => {
        render(<LoadingMoreButton isLoading={false} onClick={() => {}} />);
        expect(screen.getByRole('button')).toHaveTextContent('Показать еще');
    });

    it('renders custom children when provided', () => {
        render(
            <LoadingMoreButton isLoading={false} onClick={() => {}}>
                Загрузить больше
            </LoadingMoreButton>
        );
        expect(screen.getByRole('button')).toHaveTextContent('Загрузить больше');
    });

    it('renders loading text and spinner when isLoading is true', () => {
        render(<LoadingMoreButton isLoading={true} onClick={() => {}} />);
        expect(screen.getByRole('button')).toHaveTextContent('Загрузка...');
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('disables button when loading', () => {
        render(<LoadingMoreButton isLoading={true} onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when disabled prop is true', () => {
        render(<LoadingMoreButton isLoading={false} disabled={true} onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<LoadingMoreButton isLoading={false} onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(<LoadingMoreButton isLoading={false} disabled={true} onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('uses custom loading text and spinner size', () => {
        render(
            <LoadingMoreButton
                isLoading={true}
                onClick={() => {}}
                loadingText="Загружаем..."
                spinnerSize={32}
            />
        );
        expect(screen.getByText('Загружаем...')).toBeInTheDocument();
        const spinner = screen.getByRole('button').querySelector('div');
        expect(spinner).toHaveStyle({ width: '32px', height: '32px' });
    });
});