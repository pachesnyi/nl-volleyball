# Security Guidelines

## 🔒 Environment Variables & Secrets

### ✅ Safe to Commit
- `.env.example` - Template with placeholder values
- Next.js config files
- Firebase client-side config (API keys are not secrets)

### ❌ NEVER Commit These Files
- `.env.local` - Contains actual credentials
- `.env.production.local` - Production credentials
- Any file with actual API keys, secrets, or passwords

## 🔐 Firebase Security Notes

### Firebase API Keys Are NOT Secrets
Firebase API keys are **identifiers, not secrets**. They can be publicly exposed because:
- They identify your Firebase project
- Security is enforced by Firebase Security Rules
- They're designed to be used in client-side code

### Real Security Layers
1. **Firebase Security Rules** - Your main security layer
2. **Firebase App Check** - Protects against abuse
3. **CORS Configuration** - Limits domains
4. **NEXTAUTH_SECRET** - This IS a secret and must be protected

## 🛡️ Production Security Checklist

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Games - read for authenticated users, write for creators/admins
    match /games/{gameId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || 
         resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### Environment Variables for Production

#### Vercel
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXTAUTH_SECRET
```

#### Netlify
Add in Site Settings > Environment Variables:
- All the `NEXT_PUBLIC_FIREBASE_*` variables
- `NEXTAUTH_SECRET` (keep this secret!)

## 🚨 If Credentials Are Compromised

### NEXTAUTH_SECRET Leaked
1. Generate new secret: `openssl rand -base64 32`
2. Update all environments
3. Users will need to re-login

### Firebase Project Compromised
1. Regenerate Firebase App credentials
2. Update Security Rules
3. Enable App Check
4. Review Firebase Authentication settings

## 📋 Security Best Practices

1. **Regular Security Audits**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Keep Dependencies Updated**
   ```bash
   npm update
   ```

3. **Environment-Specific Configs**
   - Development: `.env.local`
   - Production: Platform environment variables

4. **Monitor Firebase Usage**
   - Check Firebase Console regularly
   - Set up billing alerts
   - Monitor authentication logs

5. **Use Proper Error Handling**
   - Don't expose internal errors to users
   - Log security events
   - Implement rate limiting