import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { LoadingIndicator } from '../components/loading-indicator';

interface PrivateRouteProps extends RouteProps {
  /**
   * Optional array of required roles for this route
   * Empty array means no specific role required
   */
  roles?: string[];
  /**
   * Custom fallback component when unauthorized
   */
  unauthorizedComponent?: React.ComponentType;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles = [],
  unauthorizedComponent: UnauthorizedComponent,
  ...rest
}) => {
  const { 
    user, 
    loading: isAuthCheckLoading, 
    isAuthenticated 
  } = useAuth();

  // Show loading state while checking auth status
  if (isAuthCheckLoading) {
    return <LoadingIndicator fullScreen />;
  }

  // Check if user has required roles if specified
  const hasRequiredRole = roles.length === 0 || 
    (user?.roles && roles.some(role => user.roles.includes(role)));

  return (
    <Route
      {...rest}
      render={(props) => {
        // Handle unauthenticated users
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { 
                  from: props.location,
                  reason: 'authentication_required'
                }
              }}
            />
          );
        }

        // Handle unauthorized roles
        if (!hasRequiredRole) {
          return UnauthorizedComponent ? (
            <UnauthorizedComponent />
          ) : (
            <Redirect to="/unauthorized" />
          );
        }

        // Render protected component
        return Component ? <Component {...props} /> : null;
      }}
    />
  );
};