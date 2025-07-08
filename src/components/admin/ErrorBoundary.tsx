import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente renderizado muestre la UI alternativa
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = (): void => {
    // Recargar la página
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Renderizar UI alternativa
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse text-red-800">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span>حدث خطأ غير متوقع</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-red-700">
                <p className="mb-2">
                  نعتذر، حدث خطأ أثناء تحميل هذا المكون. يرجى المحاولة مرة أخرى أو الاتصال بمسؤول النظام.
                </p>
                
                {this.state.error && (
                  <div className="p-2 bg-white rounded border border-red-200 text-xs font-mono overflow-x-auto">
                    {this.state.error.toString()}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleReload} className="flex-1">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة تحميل الصفحة
                </Button>
                
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/">
                    <Home className="w-4 h-4 ml-2" />
                    العودة للرئيسية
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;