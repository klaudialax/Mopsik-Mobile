import React from 'react';

import {StackNavigator} from 'react-navigation';

import MopDetailsView from 'mopsik_mobile/src/components/views/MopDetailsView';
import SearchView from 'mopsik_mobile/src/components/views/SearchView';
import MapView from 'mopsik_mobile/src/components/views/MapView';


MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');


export default SearchStack = StackNavigator({
  Search: {screen: SearchView},
  MopDetails: {screen: MopDetailsView},
  MapMops: {screen: MapView},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
