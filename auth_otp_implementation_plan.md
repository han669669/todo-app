# Email OTP Implementation Plan

## Overview
Add email OTP authentication while maintaining existing email/password auth as an alternative option.

## Changes Required

### 1. Auth Context (auth-context.tsx)
- Add OTP state:
```typescript
interface OTPData {
  email: string;
  securityPhrase: string;
  otpSent: boolean;
  userId: string;
}

const [otpData, setOtpData] = useState<OTPData>({
  email: '',
  securityPhrase: '',
  otpSent: false,
  userId: ''
});
```

- Add OTP methods:
```typescript
const initiateOTP = async (email: string) => {
  const sessionToken = await account.createEmailToken(
    ID.unique(),
    email,
    true // Enable security phrase
  );
  // Update state and show toast
};

const verifyOTP = async (secret: string) => {
  await account.createSession(otpData.userId, secret);
  // Handle successful auth
};
```

### 2. Login Page (login.tsx)
- Add toggle between password and OTP
- Add OTP-specific UI:
  - Security phrase display
  - OTP input field
  - Resend OTP button

### 3. Signup Page (signup.tsx)
- Similar changes as login page
- Add OTP verification after initial signup

## Implementation Sequence
1. Update auth context
2. Modify login page
3. Update signup page
4. Test both auth flows