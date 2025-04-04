# Email OTP Implementation Details

## Architecture Overview
Implemented dual authentication system supporting:
- Traditional email/password login
- Passwordless email OTP login
- Both methods use Appwrite's authentication services

## Key Components

### 1. Auth Context Modifications
```typescript
// Added OTP state
interface OTPData {
  email: string;
  securityPhrase: string; 
  otpSent: boolean;
  userId: string;
}

// New methods
const initiateOTP = async (email: string) => {
  // Calls Appwrite's createEmailToken()
  // Stores security phrase and user ID
};

const verifyOTP = async (secret: string) => {
  // Calls Appwrite's createSession()
  // Completes authentication
};

// Modified signup flow
const signup = async (email: string, password: string, name: string) => {
  // Generates random password for OTP signup
  // Skips auto-login for OTP flows
};
```

### 2. Login Page Implementation
- Added toggle between password/OTP login
- OTP flow steps:
  1. User enters email
  2. System sends OTP and shows security phrase
  3. User enters OTP code
  4. System verifies and logs in

### 3. Signup Page Implementation
- Special handling for OTP signup:
  - Generates random valid password for Appwrite
  - Immediately initiates OTP flow
  - Skips password input UI for OTP signup

## Security Considerations
- Security phrases prevent phishing
- Random passwords meet Appwrite requirements
- OTP codes expire after short duration
- All errors are properly handled

## User Flows

### Password Login
1. Enter email/password
2. Submit form
3. Authenticate via Appwrite

### OTP Login
1. Enter email
2. Receive OTP via email
3. Verify security phrase
4. Enter OTP code
5. Complete authentication

### OTP Signup
1. Enter name/email
2. System creates account with random password
3. Receive OTP via email
4. Verify security phrase
5. Enter OTP code
6. Complete authentication