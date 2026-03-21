import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallbackClassName?: string;
  sectionName?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.sectionName ? `: ${this.props.sectionName}` : ''}]`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.fallbackClassName ?? 'flex items-center justify-center py-20'}>
          <div className="text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <p className="text-sm mb-2">
              {this.props.sectionName
                ? `Failed to load ${this.props.sectionName}`
                : 'Something went wrong'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-xs px-3 py-1 rounded"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
