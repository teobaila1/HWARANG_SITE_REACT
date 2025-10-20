import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Ups, ceva n-a mers.</h1>
          <p>Încearcă să reîncarci pagina sau să revii acasă.</p>
          <a className="btn" href="/">Acasă</a>
        </div>
      );
    }
    return this.props.children;
  }
}
