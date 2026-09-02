import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 shadow-lg p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center sm:text-left">
          Мы используем файлы cookie. Продолжая, вы соглашаетесь с{' '}
          <a href="/privacy-policy" className="link link-primary">Политикой конфиденциальности</a> и{' '}
          <a href="/terms-of-use" className="link link-primary">Согласием на обработку</a>.
        </p>
        <div className="flex gap-2">
          <button onClick={decline} className="btn btn-ghost btn-sm">Отклонить</button>
          <button onClick={accept} className="btn btn-primary btn-sm">Принять</button>
        </div>
      </div>
    </div>
  );
}