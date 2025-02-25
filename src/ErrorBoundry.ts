import React from 'react';

export class ErrorBoundary extends React.Component<{
    fallback: React.ReactNode,
    hasError: boolean,
    children: React.ReactNode
}> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    //TODO : Error logging
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}