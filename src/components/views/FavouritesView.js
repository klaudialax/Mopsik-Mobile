import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Image,
  DeviceEventEmitter
} from 'react-native';

import {List, ListItem} from 'react-native-elements'
import Swipeout from 'react-native-swipeout';

import Header from 'mopsik_mobile/src/components/tools/Header';

MOPS = require('mopsik_mobile/src/config/mops');
FUNCTIONS = require('mopsik_mobile/src/config/functions');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');


export default class FavouritesView extends Component {


  constructor() {
    super();
    this.state = {
      favouriteMOPsmapped: [],
    };
  }

  componentDidMount = () => {
    this.setState({favouriteMOPsmapped: MOPS.favouriteMOPsmapped});
  };

  componentWillMount() {
    /* this listener makes sure that after deleting mop from favourites in details view,
      mop disapears from favourites view */
    DeviceEventEmitter.addListener('refresh favourites', () => {
      if (this.refs.favs) {
        this.setState({favouriteMOPsmapped: MOPS.favouriteMOPsmapped});
      }
    });
    /* download usages from API */
    MOPS.refresh();
  }

  deleteFav = (id) => {
    FUNCTIONS.deleteFavourite(id);
    this.setState({favouriteMOPsmapped: MOPS.favouriteMOPsmapped});
  };

 /* buttons apearing when swiping left elements on favourites list */
  swipeBtns = (id) => {
    return [{
      text: 'Usuń',
      backgroundColor: THEMES.basic.Red,
      underlayColor: THEMES.basic.underlayWhite,
      onPress: () => {
        this.deleteFav(id)
      }
    }];
  };

  onNavigatorEvent = event => {
    switch (event.id) {
      case 'willAppear':
        this.setState({favouriteMOPsmapped: MOPS.favouriteMOPsmapped});
        break;
    }
  };

  render() {
    let {main_vehicle} = SETTINGS.settings;
    return (

      <View ref='favs'>
        <Header navigation={this.props.navigation} title='Ulubione MOPy'/>
        <List containerStyle={{marginBottom: 20}}>
          {this.state.favouriteMOPsmapped.map((fav, i) => (
            <Swipeout right={this.swipeBtns(fav.id)}
                      autoClose
                      backgroundColor='transparent'
                      key={i}>
              <ListItem
                roundAvatar
                avatar={
                  <Image
                    source={require('mopsik_mobile/src/images/parking_clear.png')}
                    style={{width: 35, height: 35}}
                    tintColor={fav.color[main_vehicle].background}
                  />
                }
                key={i}
                title={fav.title}
                subtitle={'Droga: ' + fav.road_number + '; Kierunek: ' + fav.direction}
                badge={{
                  value: fav.usage[main_vehicle] + "%",
                  textStyle: {color: fav.color[main_vehicle].text},
                  containerStyle: {marginTop: 10, backgroundColor: fav.color[main_vehicle].background}
                }}
                onPress={() => {
                  this.props.navigation.navigate('MopDetails', {mop: fav})
                }}
              />
            </Swipeout>
          ))}
        </List>
      </View>
    );
  }
}