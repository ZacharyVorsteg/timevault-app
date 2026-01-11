// PWA utilities

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New version available
                  console.log('New version available');
                  // You could show a notification here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
}

export function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  if (!('Notification' in window)) {
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(
      (permission) => permission === 'granted'
    );
  }

  return Promise.resolve(false);
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined') return;

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function canInstall(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if already installed
  if (isStandalone()) return false;

  // Check for beforeinstallprompt support
  return 'BeforeInstallPromptEvent' in window;
}
