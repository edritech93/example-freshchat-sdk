import React, {useEffect} from 'react';
import {LogBox, StyleSheet, Text, View, Button} from 'react-native';
import {
  Freshchat,
  FreshchatConfig,
  FreshchatUser,
} from 'react-native-freshchat-sdk';

// NOTE: new doc react-native-freshchat (https://crmsupport.freshworks.com/en/support/solutions/articles/50000004342-freshchat-react-native-sdk-integration-steps)

const dataCredential = {
  APP_ID: 'your_app_id_here',
  APP_KEY: 'your_app_key_here',
  DOMAIN: 'your_domain_here',
};

const dataUser = {
  id: '4d3bc771-7e33-4f25-a4d6-90fd744f1415',
  firstName: 'Adi',
  lastName: 'Perkasa',
  email: 'adi.p@gmail.com',
  phoneCode: '+62',
  phone: '8123456778',
};

LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    _initFreshChat();
    _userFreshChat();
    _restoreFreshChat();
  }, []);

  async function _initFreshChat() {
    const freshchatConfig = new FreshchatConfig(
      dataCredential.APP_ID,
      dataCredential.APP_KEY,
    );
    freshchatConfig.domain = dataCredential.DOMAIN;
    freshchatConfig.teamMemberInfoVisible = true;
    freshchatConfig.cameraCaptureEnabled = true;
    freshchatConfig.gallerySelectionEnabled = true;
    freshchatConfig.responseExpectationEnabled = true;
    freshchatConfig.showNotificationBanner = true; //iOS only
    freshchatConfig.notificationSoundEnabled = true; //iOS only
    Freshchat.init(freshchatConfig);
  }

  function _userFreshChat() {
    var freshchatUser = new FreshchatUser();
    freshchatUser.firstName = dataUser.firstName;
    freshchatUser.lastName = dataUser.lastName;
    freshchatUser.email = dataUser.email;
    freshchatUser.phoneCountryCode = dataUser.phoneCode;
    freshchatUser.phone = dataUser.phone;
    Freshchat.setUser(freshchatUser, (error: any) => {
      console.log(error);
    });
  }

  function _restoreFreshChat() {
    // TODO: call API for get existing data freshchat from server
    const userFc = {
      externalId: dataUser.id,
      restoreId: '22a2c817-abf3-4458-a726-556ca7f6ceeb', //NOTE: restoreId should get from server
    };
    // NOTE: userFc is dummy data, actually data is from server
    if (userFc) {
      Freshchat.identifyUser(
        userFc.externalId,
        userFc.restoreId,
        (error: any) => console.log(error),
      );
    } else {
      Freshchat.identifyUser(dataUser.id, null, (error: any) =>
        console.log(error),
      );
    }
    Freshchat.getUser(_handleGetUser);
    Freshchat.addEventListener(Freshchat.EVENT_USER_RESTORE_ID_GENERATED, () =>
      Freshchat.getUser(_handleGetUser),
    );
  }

  const _handleGetUser = (user: any) => {
    console.log('externalId: ' + user.externalId);
    console.log('restoreId: ' + user.restoreId);
    if (user.externalId && user.restoreId) {
      Freshchat.identifyUser(user.externalId, user.restoreId, (error: any) => {
        console.log(error);
      });
      // TODO: call API for post user data freshchat to server
      // TODO: save restoreId to server
    }
  };

  return (
    <View style={styles.container}>
      <Text>{'Example of\nreact-native-freshchat'}</Text>
      <Button
        title={'Show Chat'}
        onPress={() => Freshchat.showConversations()}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cyan',
  },
});
