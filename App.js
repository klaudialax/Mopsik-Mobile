import React, { Component } from 'react';

import { DrawerNavigator, StackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { List, ListItem, Icon } from 'react-native-elements'

import DrawerContent from 'mopsik_mobile/src/components/tools/DrawerContent';

import HomeView from 'mopsik_mobile/src/components/views/HomeView';
import MapStack from 'mopsik_mobile/src/components/stacks/MapStack';
import FavouritesStack from 'mopsik_mobile/src/components/stacks/FavouritesStack';
import SearchStack from 'mopsik_mobile/src/components/stacks/SearchStack';
import SettingsView from 'mopsik_mobile/src/components/views/SettingsView';

MOPS = require('mopsik_mobile/src/config/mops');
FAVOURITES = require('mopsik_mobile/src/config/favourites');

let _ = require('lodash');


export default App = DrawerNavigator({
  Home: { screen: HomeView,
    navigationOptions : {
      drawerLabel: 'Home',
      drawerIcon: <Icon name='home' />,
      title: 'Home'
    }
   },
  MapMopsStack: { screen: MapStack,
    navigationOptions: {
        drawerLabel: 'Mapa',
        drawerIcon: <Icon name='map' />,
    } },
  FavouritesStack: { screen: FavouritesStack,
    navigationOptions: {
        drawerLabel: 'Ulubione MOPy',
        drawerIcon: <Icon name='favorite' />,
    } },
  SearchStack: { screen: SearchStack,
    navigationOptions: {
        drawerLabel: 'Wyszukaj MOPa',
        drawerIcon: <Icon name='search' />,
    } },
  Settings: { screen: SettingsView,
    navigationOptions: {
        drawerLabel: 'Ustawienia',
        drawerIcon: <Icon name='build' />,
    } },
},{
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: DrawerContent
}
);
