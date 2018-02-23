import React, {Component} from 'react';
import {
  Text,
  View,
  AsyncStorage
} from 'react-native';

import {Button} from 'react-native-elements'

import Header from 'mopsik_mobile/src/components/Header';
import styles from 'mopsik_mobile/src/config/styles'

MOPS = require('mopsik_mobile/src/config/mops');
FUNCTIONS = require('mopsik_mobile/src/config/functions');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');

export default class MopDetailsView extends Component {

  isInFavourites = (id) => {
    return MOPS.favouriteMOPs.find((el) => {
        return el === id
      }) !== undefined;
  };

  generateButton = (inFavs) => {
    if (inFavs) {
      return <Button
        title='Usuń z ulubionych'
        onPress={() => {
          FUNCTIONS.deleteFavourite(this.state.mop.id);
          inFavs = this.isInFavourites(this.state.mop.id);
          this.setState({button: this.generateButton(inFavs)})
          ;
        }}
        //large
        icon={{name: 'favorite', color: THEMES.basic.backgroundWhite}}
        backgroundColor={THEMES.basic.backgroundRed}
        color={THEMES.basic.backgroundWhite}
      />
    }
    else {
      return <Button
        title='Dodaj to ulubionych'
        onPress={() => this.addToFavourites(this.state.mop.id)}
        //large
        icon={{name: 'favorite-border', color: THEMES.basic.red}}
        backgroundColor={THEMES.basic.backgroundWhite}
        color={THEMES.basic.red}
      />
    }
  };

  constructor(props) {
    super(props);
    let {mop} = this.props.navigation.state.params;
    this.state = {
      button: this.generateButton(this.isInFavourites(mop.id)),
      mop: mop
    };
  }

  addToFavourites = (id) => {
    AsyncStorage.getItem('favouriteMOPs').then((response) => {
      let favourites = [];
      if (response) {
        favourites = JSON.parse(response);
      }
      favourites.push(id);
      AsyncStorage.setItem('favouriteMOPs', JSON.stringify(favourites));
      let favourites_mapped = [];
      favourites.map((fav, i) => {
        favourites_mapped.push(_.find(MOPS.mops, {id: fav}));
      });
      MOPS.favouriteMOPs = favourites;
      MOPS.favouriteMOPsmapped = favourites_mapped;
      let inFavs = this.isInFavourites(this.state.mop.id);
      this.setState({button: this.generateButton(inFavs)});
    }).done();
  };


  render() {
    return (

      <View style={styles.main}>
        <Header navigation={this.props.navigation} title={this.state.mop.title} stack/>

        <Text>Detale mopa: {this.state.mop.title} </Text>
        <Text>Opis: {this.state.mop.description} </Text>
        {this.state.button}
      </View>
    );
  }
}
