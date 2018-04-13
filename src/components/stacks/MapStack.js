import React from 'react';
import {CustomCallout} from 'react-native';

import {StackNavigator} from 'react-navigation';

import MopDetailsView from 'mopsik_mobile/src/components/views/MopDetailsView';
import MapView from 'mopsik_mobile/src/components/views/MapView';


MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');


export default MapStack = StackNavigator({
  MapMops: {
    screen: MapView,
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
