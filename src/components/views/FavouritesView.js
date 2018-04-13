import React, {Component} from 'react';
import {DeviceEventEmitter, FlatList, View} from 'react-native';

import Swipeout from 'react-native-swipeout';

import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';
import Header from 'mopsik_mobile/src/components/tools/Header';

MOPS = require('mopsik_mobile/src/config/mops');
FAVOURITES = require('mopsik_mobile/src/config/favourites');
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
    DeviceEventEmitter.addListener('refresh', () => {
      if (this.refs.favs) {
        this.setState({favouriteMOPsmapped: MOPS.favouriteMOPsmapped});
      }
    });
    /* download usages from API */
    MOPS.refresh();
  }

  deleteFav = (id) => {
    FAVOURITES.deleteFavourite(id);
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

  reload = () => {
    this.setState({reload: true});
  };

  render() {
    let {main_vehicle} = SETTINGS.settings;

    return (

      <View ref='favs'>
        <Header navigation={this.props.navigation} title='Ulubione MOPy' reload={this.reload}/>
        <FlatList
          data={this.state.favouriteMOPsmapped}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <Swipeout right={this.swipeBtns(item.id)}
                      autoClose
                      backgroundColor='transparent'
                      key={index}>
              <MopListItem mop={item} navigation={this.props.navigation}/>
            </Swipeout>)}
          style={{backgroundColor: THEMES.basic.White, marginBottom: 100}}
        />
      </View>
    );
  }
}
