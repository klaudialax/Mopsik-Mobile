import React, {Component} from 'react';
import {
  DeviceEventEmitter
} from 'react-native';

import {SideMenu} from 'react-native-elements'
import {Header} from 'react-native-elements'

MOPS = require('mopsik_mobile/src/config/mops');
THEMES = require('mopsik_mobile/src/config/themes');

export default class MyHeader extends Component {
  bkg = THEMES.basic.DarkColor;
  txt = THEMES.basic.textLight;



  openMenu = () => this.props.navigation.navigate('DrawerToggle');
  goBack = () => {
    DeviceEventEmitter.emit('refresh', {});
    this.props.navigation.goBack();
  };

  leftButton = () => {
    if (this.props.stack) {
      /* we are in stack navigation, so on the left side of the header arrow is displayed instead of menu */
      return {icon: 'chevron-left', color: this.txt, onPress: this.goBack, underlayColor: this.bkg};
    }
    else {
      return {icon: 'menu', color: this.txt, onPress: this.openMenu, underlayColor: this.bkg};
    }
  };

  render() {
    if (this.props.firstSettings) {
      /* while configuring the app header displays only title, no buttons */
      return (
        <Header
          placement="left"
          centerComponent={{text: 'Konfiguracja aplikacji', style: {color: this.txt, fontSize: 16}}}
          outerContainerStyles={{backgroundColor: this.bkg}}
        />
      )
    }
    return (
      <Header
        placement="left"
        leftComponent={this.leftButton()}
        centerComponent={{text: this.props.title, style: {color: this.txt, fontSize: 16}}}
        rightComponent={{
          icon: 'refresh',
          color: this.txt,
          onPress: () => {MOPS.refresh(); this.props.reload()},
          underlayColor: this.bkg
        }}
        outerContainerStyles={{backgroundColor: this.bkg}}
      />
    );
  }
}
