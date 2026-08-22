import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last line of defence: if anything throws during render, show a readable
 * diagnostic instead of a blank page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#0b0d12",
            color: "#e9e4d8",
            display: "grid",
            placeItems: "center",
            padding: 24,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <div style={{ maxWidth: 560, textAlign: "left" }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#ff5b1f",
                marginBottom: 12,
              }}
            >
              Meridian Carriers — render error
            </p>
            <h1 style={{ fontFamily: "Anton, sans-serif", fontSize: 34, margin: "0 0 12px", textTransform: "uppercase" }}>
              Something broke on deck
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#8e939d" }}>
              {this.state.error.message || String(this.state.error)}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: 20,
                background: "#ff5b1f",
                color: "#0b0d12",
                border: "none",
                borderRadius: 999,
                padding: "12px 24px",
                fontFamily: "inherit",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
