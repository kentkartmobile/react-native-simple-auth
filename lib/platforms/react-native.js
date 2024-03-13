import {
  Linking,
  Platform,
  NativeModules
} from 'react-native';

let linkingHandler;
let previousOnLinkChange;

export const dance = (authUrl) => {
  // Use SafariView on iOS
  if (Platform.OS === 'ios') {
    if (previousOnLinkChange) {
      linkingHandler.remove();
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
        linkingHandler.remove();
        previousOnLinkChange = undefined;
        handleUrl(url);
      };

      linkingHandler = Linking.addEventListener('url', onLinkChange);

      previousOnLinkChange = onLinkChange;
    }));
  }
  // Chrome Custom Tabs on Android
  else {
    if (previousOnLinkChange) {
      linkingHandler.remove();
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
          linkingHandler.remove();
          previousOnLinkChange = undefined;
          handleUrl(url);
        };

        linkingHandler = Linking.addEventListener('url', onLinkChange);

        previousOnLinkChange = onLinkChange;
      }));
  }
};

export const request = fetch;