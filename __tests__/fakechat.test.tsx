import { render, screen } from '@testing-library/react';
import FakeChat from '../components/FakeChat';
import { vi } from 'vitest';

vi.useFakeTimers();

describe('FakeChat', () => {
  it('renders first message', () => {
    render(<FakeChat messages={['hello', 'world']} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
