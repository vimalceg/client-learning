const mockApp = {
  name: 'Demo Site',
  pages: [
    { id: 'home', url: '/', label: 'Home' },
    { id: 'about', url: '/about', label: 'About' },
    { id: 'features', url: '/features', label: 'Features' }
  ]
};

export function fetchAppInfo() {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockApp), 300);
  });
}
