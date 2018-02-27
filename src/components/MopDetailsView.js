import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  ScrollView
} from 'react-native';

import {Button, Text, Icon, Badge} from 'react-native-elements'

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
        icon={{name: 'favorite', color: THEMES.basic.backgroundWhite}}
        backgroundColor={THEMES.basic.backgroundRed}
        color={THEMES.basic.backgroundWhite}
      />
    }
    else {
      return <Button
        title='Dodaj to ulubionych'
        onPress={() => this.addToFavourites(this.state.mop.id)}
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
    let {mop} = this.state;
    let {main_vehicle} = MOPS.settings;
    return (
      <ScrollView>
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title={this.state.mop.title} stack/>
        <View style={{margin: 10}}>
          <Text h3 style={{textAlign: 'center'}}>{mop.title}</Text>
          <View style={{margin: 10, flex: 1, flexDirection: 'row', width: 360}}>
            <View style={{margin: 10,
      width: 240}}>
              <Text h4>Kierunek: {mop.direction}</Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Droga: </Text>
                {mop.road_number}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Operator: </Text>
                {mop.operator_name}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Kontakt: </Text>
                {mop.operator_email}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>{mop.description}</Text>
            </View>
            <View style={{
            width: 120
          }}>
            {FACILITIES.getFacilitiesIconsLong(mop.facilities)}
            </View>
          </View>
          <Text></Text>
          <Text></Text>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text>Zapełnienie:  </Text>
            <Badge
              value={mop.usage[main_vehicle] + '%'}
              textStyle={{ color: mop.color[main_vehicle].text }}
              containerStyle={{ backgroundColor: mop.color[main_vehicle].background}}
            />
          </View>
        </View>

        {this.state.button}
        <Text></Text>
        <Text></Text>
      </View>
      </ScrollView>
    );
  }
}
