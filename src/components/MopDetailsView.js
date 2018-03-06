import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  StyleSheet
} from 'react-native';

import {Button, Text, Icon, Badge} from 'react-native-elements'

import Header from 'mopsik_mobile/src/components/Header';
import UsageTable from 'mopsik_mobile/src/components/UsageTable';
import styles from 'mopsik_mobile/src/config/styles'


MOPS = require('mopsik_mobile/src/config/mops');
FUNCTIONS = require('mopsik_mobile/src/config/functions');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');


export default class MopDetailsView extends Component {

  /* checks if mop is in favourites */
  isInFavourites = (id) => {
    return MOPS.favouriteMOPs.find((el) => {
        return el === id
      }) !== undefined;
  };

  /* depending of boolean parameter inFavs, function returns buttons
    'Add to favourites' or 'Delete from favourites' */
  generateButton = (inFavs) => {
    if (inFavs) {
      return <Button
        title='Usuń z ulubionych'
        onPress={() => {
          FUNCTIONS.deleteFavourite(this.state.mop.id);
          inFavs = this.isInFavourites(this.state.mop.id);
          this.setState({button: this.generateButton(inFavs)});
        }}
        icon={{name: 'favorite', color: THEMES.basic.White}}
        backgroundColor={THEMES.basic.Red}
        color={THEMES.basic.White}
      />
    }
    else {
      return <Button
        title='Dodaj to ulubionych'
        onPress={() => this.addToFavourites(this.state.mop.id)}
        icon={{name: 'favorite-border', color: THEMES.basic.red}}
        backgroundColor={THEMES.basic.White}
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

//TODO - optimise
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
    let {settings} = MOPS;
    let {main_vehicle} = settings;
    return (
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title={this.state.mop.title} stack/>
        <ScrollView>
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
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Pikietaż: </Text>
                {mop.chainage}
              </Text>
              <Text></Text>
              <Text></Text>
              {this.state.button}
            </View>
            <View style={{
            width: 120
          }}>
            {FACILITIES.getFacilitiesIconsLong(mop.facilities)}
            </View>
          </View>
          <Text></Text>
          <Text h4 style={{textAlign: 'center'}}>Zajętość miejsc parkingowych</Text>
          <Text></Text>
          <UsageTable mop={mop}/>
        </View>
        <Text></Text>
      </ScrollView>
      </View>
    );
  }
}
