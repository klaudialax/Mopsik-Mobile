import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableOpacity,
  Image
} from 'react-native';

import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles'

MOPS = require('mopsik_mobile/src/config/mops');
SETTINGS = require('mopsik_mobile/src/config/settings');

let _ = require('lodash');

export default class HomeView extends Component {

  constructor() {
    super();
    this.state = {
      toggled: false
    }

  }

  toggleSideMenu() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  componentWillMount() {
    AsyncStorage.getItem('settings').then((response) => {
      if (response) { // settings are already saved in AsyncStorage
        SETTINGS.settings = JSON.parse(response);
      }
      else { // no setting saved, opening app configuration
        this.props.navigation.navigate('Settings', {first: true});
      }
    }).done();
    if (MOPS.mops.length === 0) { // first opening app, downloading mop data
      MOPS.downloadMops();
    }
    else { // only refresh
      MOPS.refresh();
    }

  }

  reload = () => {
    this.setState({reload: true});
  }

  render() {

    const {navigate} = this.props.navigation;

    return (
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title='Home' reload={this.reload}/>
        <View style={{
          alignItems: 'center',
        }}>
        <Text></Text>
        <Image source={require('mopsik_mobile/src/images/logo_clear_all.png')}/>
          <Button
            onPress={() => AsyncStorage.clear()}
            title="Reset AsyncStorage - DEBUG ONLY"
          />
        <Text></Text>
        <Text>Logo wygenerowane przy pomocy Logo Maker</Text>
        </View>
      </View>
    );
  }
}
