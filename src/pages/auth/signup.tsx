import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { AuthLayout } from '../../layouts/auth-layout';
import { Button, Input, Card, CardBody, CardFooter } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [useOTP, setUseOTP] = useState(false);
  const { signup, loading, initiateOTP, verifyOTP, otpData } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (useOTP) {
        if (!otpData.otpSent) {
          // Generate random password for OTP signup
          const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
          await signup(email, randomPassword, name);
          await initiateOTP(email);
        } else {
          await verifyOTP(otp);
          history.push('/dashboard');
        }
      } else {
        await signup(email, password, name);
        history.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message :
        useOTP ? 'OTP verification failed' : 'Registration failed');
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-lg shadow-lg">
      <CardBody className="p-8">
        <div className="flex items-center justify-between mb-8">
        <Link to="/" className="text-primary-500 hover:text-primary-600">
          <Icon icon="lucide:arrow-left" className="text-2xl" />
        </Link>
        <h1 className="text-3xl font-extrabold text-center flex-1">
          Create Your Account
        </h1>
        </div>

        {error && (
        <div className="mb-6 p-4 bg-danger-100 text-danger-700 rounded-lg shadow-sm">
          {error}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          className="rounded-lg"
        />
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          className="rounded-lg"
        />

        {!useOTP && (
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            className="rounded-lg"
          />
        )}
        {useOTP && (
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
              className="rounded-lg"
            />
          </>
        )}

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setUseOTP(!useOTP)}
            className="text-primary-500 hover:text-primary-600"
          >
            {useOTP ? 'Use Password Signup' : 'Use OTP Signup'}
          </Button>
        </div>
        <Button
          type="submit"
          color="primary"
          fullWidth
          isLoading={loading}
          className="rounded-lg py-3 text-lg font-semibold"
        >
          Sign Up
        </Button>
        </form>
      </CardBody>
      <CardFooter className="p-6 bg-gray-50 flex justify-center">
        <p className="text-default-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:underline">
          Log In
        </Link>
        </p>
      </CardFooter>
      </Card>
    </AuthLayout>
  );
}