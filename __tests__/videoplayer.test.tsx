import { render } from '@testing-library/react';
import VideoPlayer from '../components/VideoPlayer';

describe('VideoPlayer', () => {
  it('renders iframe', () => {
    const { container } = render(<VideoPlayer videoId="dQw4w9WgXcQ" />);
    expect(container.querySelector('iframe')).toBeInTheDocument();
  });
});
