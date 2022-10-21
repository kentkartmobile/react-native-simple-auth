import {
  Linking,
  Platform,
  NativeModules
} from 'react-native';


let previousOnLinkChange;

export const dance = (authUrl) => {
  // Use SafariView on iOS
  if (Platform.OS === 'ios') {
    if (previousOnLinkChange) {
      Linking.removeEventListener('url', previousOnLinkChange);
    }
    return NativeModules.iOSWeb.show({
      url: authUrl,
    }).then(() => new Promise((resolve, reject) => {
      const handleUrl = (url) => {
        if (!url || url.indexOf('fail') > -1) {
          reject(url);
        } else {
          resolve(url);
        }
        NativeModules.iOSWeb.dismiss();
      };

      const onLinkChange = ({url}) => {
        Linking.removeEventListener('url', onLinkChange);
        previousOnLinkChange = undefined;
        handleUrl(url);
      };

      Linking.addEventListener('url', onLinkChange);

      previousOnLinkChange = onLinkChange;
    }));
  }
  // Chrome Custom Tabs on Android
  else {
    if (previousOnLinkChange) {
      Linking.removeEventListener('url', previousOnLinkChange);
    }
    return NativeModules.AndroidWeb.openURL(authUrl)
      .then(() => new Promise((resolve, reject) => {
        const handleUrl = (url) => {
          if (!url || url.indexOf('fail') > -1) {
            reject(url);
          } else {
            resolve(url);
          }
        };

        const onLinkChange = ({url}) => {
          Linking.removeEventListener('url', onLinkChange);
          previousOnLinkChange = undefined;
          handleUrl(url);
        };

        Linking.addEventListener('url', onLinkChange);

        previousOnLinkChange = onLinkChange;
      }));
  }
};

export const request = fetch;