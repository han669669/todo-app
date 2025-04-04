import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import { PrivateRoute } from './components/private-route';
import { LandingPage } from './pages/landing';
import Login from './pages/auth/login';
import SignUp from './pages/auth/signup';
import Dashboard from './pages/dashboard';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
      <Analytics />
    </AuthProvider>
  );
}