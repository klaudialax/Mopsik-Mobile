/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';

import { DrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { SideMenu, List, ListItem } from 'react-native-elements'
import { Header } from 'react-native-elements'

MOPS = require('mopsik_mobile/src/config/mops');
THEMES = require('mopsik_mobile/src/config/themes');

export default class MyHeader extends Component {
  bkg = THEMES.basic.backgroundDarkColor;
  txt = THEMES.basic.textLight;
  openMenu = () => this.props.navigation.navigate('DrawerToggle');
  goBack = () => {DeviceEventEmitter.emit('refresh favourites',  {}); this.props.navigation.goBack();};

  leftButton = () => {
    if (this.props.stack){
      return { icon: 'chevron-left', color: this.txt, onPress: this.goBack, underlayColor: this.bkg };
    }
    else{
      return { icon: 'menu', color: this.txt, onPress: this.openMenu, underlayColor: this.bkg };
    }
  }

  render() {
    if(this.props.firstSettings){
      return (
        <Header
          centerComponent={{ text: 'Konfiguracja aplikacji', style: { color: this.txt } }}
          outerContainerStyles={{ backgroundColor: this.bkg }}
        />
      )
    }
    return (
      <Header
        leftComponent={this.leftButton()}
        centerComponent={{ text: this.props.title, style: { color: this.txt } }}
        rightComponent={{ icon: 'refresh', color: this.txt, onPress: () => MOPS.refresh(), underlayColor: this.bkg }}
        outerContainerStyles={{ backgroundColor: this.bkg }}
      />
    );
  }
}
