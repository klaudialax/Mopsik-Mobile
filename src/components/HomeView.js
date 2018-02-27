import React, {Component} from 'react';
import {
  Text,
  View,
  Button,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';

import LinkInBrowserView from 'mopsik_mobile/src/components/LinkInBrowserView'
import Header from 'mopsik_mobile/src/components/Header';
import styles from 'mopsik_mobile/src/config/styles'

MOPS = require('mopsik_mobile/src/config/mops');

let _ = require('lodash');

export default class HomeView extends Component {

  constructor() {
    super();
    this.state = {
      toggled: false,
      link: false
    }

  }

  toggleSideMenu() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  uploadFavourites = async (favourites) => {
    try {
      await AsyncStorage.setItem('favouriteMOPs',
        JSON.stringify(favourites));
    }
    catch (e) {
    }
  };


  componentWillMount() {
    AsyncStorage.getItem('settings').then((response) => {
      if (response) {
        MOPS.settings = JSON.parse(response);
      }
      else {
        this.props.navigation.navigate('Settings', {first: true});
      }
    }).done();
    if (MOPS.mops.length === 0) {
      MOPS.downloadMops();
    }
    else {
      MOPS.refresh();
    }

  }

  render() {

    hyperlink = (this.state.link) ? <LinkInBrowserView src='https://logomakr.com/018RtM#'/> : <Text></Text>;

    const {navigate} = this.props.navigation;

    return (
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title='Home'/>
        <View style={styles.container}>
          <Text>HOME</Text>
          <Button
            onPress={() => AsyncStorage.clear()}
            title="Reset AsyncStorage - DEBUG"
          />
          <TouchableOpacity onPress={() => this.setState({link: true})}>
            <Text>Logo wygenerowane przy pomocy Logo Maker</Text>
          </TouchableOpacity>
          {hyperlink}
        </View>
      </View>
    );
  }
}
