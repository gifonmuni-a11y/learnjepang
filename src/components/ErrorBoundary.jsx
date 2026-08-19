// Error Boundary untuk menangkap runtime error di seluruh aplikasi
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state sehingga render menampilkan fallback UI
    return { hasError: true, error: error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="genkoyoshi-panel glass rounded-2xl p-8 text-center text-washi">
          <h2 className="font-display font-bold text-2xl mb-4">⚠️ Terjadi Error</h2>
          <p className="text-washi-dim mb-4">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-washi-400 text-sumi-900 px-4 py-2 rounded-xl text-sm hover:bg-washi-300 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary