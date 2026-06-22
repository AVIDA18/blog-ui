import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(() => {
    if (!token) return 'no-token';
    return 'verifying';
  });

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const verify = async () => {
      try {
        await api(`/Auth/verify-email?token=${encodeURIComponent(token)}`);
        if (!cancelled) setStatus('success');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <h1>Verifying Email</h1>
            <div className="spinner" />
          </>
        )}

        {status === 'no-token' && (
          <>
            <h1>Invalid Link</h1>
            <p className="page-subtitle">No verification token found.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </>
        )}

        {status === 'success' && (
          <>
            <h1>Email Verified! ✅</h1>
            <p className="page-subtitle">Your email has been confirmed. You can now log in.</p>
            <Link to="/login" className="btn btn-primary">Log In</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1>Verification Failed</h1>
            <p className="page-subtitle">The link may be invalid or expired.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
