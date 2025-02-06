import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haztech.petba',
  appName: 'Petba',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      iconColor: '#488AFF',
    },
  },
};

export default config;
