import React from 'react';
import {StackNavigator} from 'react-navigation';

import MopDetailsView from 'mopsik_mobile/src/components/views/MopDetailsView';
import FavouritesView from 'mopsik_mobile/src/components/views/FavouritesView';
import MapView from 'mopsik_mobile/src/components/views/MapView';


MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');


export default FavouritesStack = StackNavigator({
  Favourite: {screen: FavouritesView},
  MopDetails: {screen: MopDetailsView},
  MapMops: {screen: MapView},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
