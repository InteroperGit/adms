import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './card';

describe('Card components', () => {
  it('renders Card with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders Card with custom className', () => {
    render(<Card className="custom-card">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('custom-card');
  });

  it('renders CardHeader with children and custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Header')).toHaveClass('custom-header');
  });

  it('renders CardTitle with children and custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Title')).toHaveClass('custom-title');
  });

  it('renders CardDescription with children and custom className', () => {
    render(<CardDescription className="custom-description">Description</CardDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toHaveClass('custom-description');
  });

  it('renders CardContent with children and custom className', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Content')).toHaveClass('custom-content');
  });

  it('renders CardFooter with children and custom className', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toHaveClass('custom-footer');
  });

  it('renders a full Card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>Test Content</CardContent>
        <CardFooter>Test Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
  });
});
