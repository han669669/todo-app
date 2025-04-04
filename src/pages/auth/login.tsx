import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { AuthLayout } from '../../layouts/auth-layout';
import { Button, Input, Card, CardBody, CardFooter } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [useOTP, setUseOTP] = useState(false);
  const { login, loading, initiateOTP, verifyOTP, otpData } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (useOTP) {
        if (!otpData.otpSent) {
          await initiateOTP(email);
        } else {
          await verifyOTP(otp);
          history.push('/dashboard');
        }
      } else {
        await login(email, password);
        history.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message :
        useOTP ? 'OTP verification failed' : 'Invalid email or password');
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
      <CardBody className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-primary-500 hover:text-primary-600 transition duration-200">
          <Icon icon="lucide:arrow-left" className="text-2xl" />
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-800 text-center flex-1">
          Welcome Back
        </h1>
        </div>

        {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          className="rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        />

        {!useOTP ? (
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            className="rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          />
        ) : (
          <>
            {otpData.otpSent && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                Security Phrase: <strong>{otpData.securityPhrase}</strong>
              </div>
            )}
            <Input
              label={otpData.otpSent ? "OTP Code" : "Send OTP"}
              type={otpData.otpSent ? "text" : "button"}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required={otpData.otpSent}
              fullWidth
            />
          </>
        )}

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setUseOTP(!useOTP)}
            className="text-primary-500 hover:text-primary-600"
          >
            {useOTP ? 'Use Password Login' : 'Use OTP Login'}
          </Button>
        </div>
        <Button
          type="submit"
          color="primary"
          fullWidth
          isLoading={loading}
          className="py-3 text-lg font-semibold rounded-lg bg-primary-500 hover:bg-primary-600 transition duration-200"
        >
          Log In
        </Button>
        </form>
      </CardBody>
      <CardFooter className="p-6 bg-gray-50 flex justify-center">
        <p className="text-gray-600">
        New here?{' '}
        <Link to="/signup" className="text-primary-500 hover:underline">
          Create an account
        </Link>
        </p>
      </CardFooter>
      </Card>
    </AuthLayout>
  );
}