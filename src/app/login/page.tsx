'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className={styles.container}>
      {/* Logo Pill */}
      <div className={styles.pill}>
        <div className={styles.pillIcon}>
          T
        </div>
        <span className={styles.pillText}>
          TAGVERSE.<span className={styles.pillTextHighlight}>IO</span>
        </span>
      </div>

      {/* Heading */}
      <h1 className={styles.heading}>
        Tagverse CRM
      </h1>

      {/* Login Card */}
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Input */}
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <User size={18} strokeWidth={2.5} />
            </div>
            <input
              type="email"
              placeholder="admin@tagverse.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Password Input */}
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className={`${styles.input} ${styles.inputPassword}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeBtn}
            >
              {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Forgot Password */}
        <a href="#" className={styles.forgotLink}>
          Forgot Password?
        </a>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <div className={styles.dividerText}>
            OR SECURE SSO
          </div>
        </div>

        {/* SSO Buttons */}
        <div className={styles.ssoGroup}>
          <button className={styles.ssoBtn}>
            <div className={styles.ssoIcon}>
              <span className={styles.googleG}>G</span>
            </div>
            Sign in with Google
          </button>
          
          <button className={styles.ssoBtn}>
            <div className={`${styles.ssoIcon} ${styles.ssoIconSquare}`}>
               <div className={styles.msGrid}>
                 <div style={{ backgroundColor: '#f25022' }}></div>
                 <div style={{ backgroundColor: '#7fba00' }}></div>
                 <div style={{ backgroundColor: '#00a4ef' }}></div>
                 <div style={{ backgroundColor: '#ffb900' }}></div>
               </div>
            </div>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
