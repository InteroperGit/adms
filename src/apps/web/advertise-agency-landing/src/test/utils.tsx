import { type ReactElement, useState } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeContext } from '@/contexts/ThemeContext';

export * from '@testing-library/react';

interface WrapperProps {
  children: React.ReactNode;
  initialDark?: boolean;
}

function AllProviders({ children, initialDark = false }: WrapperProps) {
  const [isDark, setIsDark] = useState(initialDark);
  const toggle = () => setIsDark((prev) => !prev);

  return (
    <MemoryRouter>
      <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>
    </MemoryRouter>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialDark?: boolean }
) {
  const { initialDark, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => <AllProviders initialDark={initialDark}>{children}</AllProviders>,
    ...renderOptions,
  });
}

export { customRender as render };
