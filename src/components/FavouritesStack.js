import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';

import MopDetailsView from 'mopsik_mobile/src/components/MopDetailsView';
import FavouriteMopsView from 'mopsik_mobile/src/components/FavouriteMopsView';


MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');


export default FavouritesStack = StackNavigator({
  Favourite: {screen: FavouriteMopsView},
  MopDetails: {screen: MopDetailsView},
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});
