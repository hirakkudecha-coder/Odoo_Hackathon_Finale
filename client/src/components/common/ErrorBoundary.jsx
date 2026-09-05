import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a render exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center p-6 text-[#141A17] font-sans">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 border border-[#E8E1D5] shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FDECE7] text-[#C95426] flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-[#141A17]">
                Something unexpected occurred
              </h1>
              <p className="text-sm text-[#5B6963] mt-2">
                The application encountered an issue while rendering this view.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E1D5] text-left text-xs font-mono text-[#C95426] overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-[#1C3A2F] text-white font-semibold text-xs hover:bg-[#274438] transition-all cursor-pointer shadow-xs"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-[#4A5952] font-semibold text-xs hover:bg-[#FAF8F5] transition-all cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
