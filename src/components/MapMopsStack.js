import React, {Component} from 'react';
import {
  CustomCallout
} from 'react-native';

import {StackNavigator} from 'react-navigation';

import MopDetailsView from 'mopsik_mobile/src/components/MopDetailsView';
import MapMopsView from 'mopsik_mobile/src/components/MapMopsView';


MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');


export default MapMopsStack = StackNavigator({
  MapMops: {
    screen: MapMopsView,
    navigationOptions: ({navigation}) => ({
      title: 'Mapa',
    })
  },
  MopDetails: {
    screen: MopDetailsView,
    navigationOptions: ({navigation}) => ({
      title: 'Szczegoly',
    })
  },
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
