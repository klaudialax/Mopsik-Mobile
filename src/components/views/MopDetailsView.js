import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';

import {Button, Text, Icon, Badge} from 'react-native-elements'

import Header from 'mopsik_mobile/src/components/tools/Header';
import UsageTable from 'mopsik_mobile/src/components/tools/UsageTable';
import styles from 'mopsik_mobile/src/config/styles'


MOPS = require('mopsik_mobile/src/config/mops');
FAVOURITES = require('mopsik_mobile/src/config/favourites');
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
          FAVOURITES.deleteFavourite(this.state.mop.id);
          inFavs = this.isInFavourites(this.state.mop.id);
          this.setState({button: this.generateButton(inFavs)});
        }}
        icon={<Icon
          name='favorite'
          size={15}
          color={THEMES.basic.LightPink}
        />}
        titleStyle={{
          color: THEMES.basic.LightPink
        }}
        buttonStyle={{
          width: 190,
          backgroundColor: THEMES.basic.Red,
          marginBottom: 5
        }}
      />
    }
    else {
      return <Button
        title='Dodaj to ulubionych'
        onPress={() => this.addToFavourites(this.state.mop.id)}
        icon={<Icon
          name='favorite-border'
          size={15}
          color={THEMES.basic.red}
        />}
        titleStyle={{
          color: THEMES.basic.Red
        }}
        buttonStyle={{
          width: 190,
          backgroundColor: THEMES.basic.LightPink,
          marginBottom: 5
        }}
      />
    }
  };

  addToLastViewedMops = async (mop) => {
    if(!MOPS.lastViewedMops.includes(mop)){
      MOPS.lastViewedMops.unshift(mop);
      MOPS.lastViewedMops = MOPS.lastViewedMops.slice(0, 3);
      await AsyncStorage.setItem('mopsik_lastViewedMops', JSON.stringify(MOPS.lastViewedMops))
    }
  };

  constructor(props) {
    super(props);
    let {mop} = this.props.navigation.state.params;
    this.addToLastViewedMops(mop.id);
    this.state = {
      button: this.generateButton(this.isInFavourites(mop.id)),
      mop: mop,
      width: Dimensions.get('window').width
    };
  }

//TODO - optimise
  addToFavourites = (id) => {
    AsyncStorage.getItem('mopsik_favouriteMOPs').then((response) => {
      let favourites = [];
      if (response) {
        favourites = JSON.parse(response);
      }
      favourites.push(id);
      let favourites_mapped = [];
      favourites.map((fav, i) => {
        favourites_mapped.push(_.find(MOPS.mops, {id: fav}));
      });
      MOPS.favouriteMOPs = favourites;
      MOPS.favouriteMOPsmapped = favourites_mapped;
      AsyncStorage.setItem('mopsik_favouriteMOPs', JSON.stringify(favourites));
      let inFavs = this.isInFavourites(this.state.mop.id);
      this.setState({button: this.generateButton(inFavs)});
    }).done();
  };


  reload = () => {
    this.setState({reload: true});
  }

  changeWidth = () => {
    this.setState({width: Dimensions.get('window').width})
  }

  render() {
    let {mop} = this.state;
    let {settings} = SETTINGS;
    let {main_vehicle} = settings;
    return (
      <View style={styles.mainWhite} onLayout={this.changeWidth}>
        <Header navigation={this.props.navigation} title={this.state.mop.title} stack reload={this.reload}/>
        <ScrollView>
        <View style={{margin: 10}}>
          <Text h3 style={{textAlign: 'center'}}>{mop.title}</Text>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around',}}>
            <View style={{margin: 10, width: (this.state.width - 140)}}>
              <Text h4>Kierunek: {mop.direction}</Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Droga: </Text>
                {mop.road_number}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Operator: </Text>
                {mop.operator.name}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Kontakt: </Text>
                {mop.operator.email}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Pikietaż: </Text>
                {mop.chainage}
              </Text>
              <Text style={{marginTop: 5, marginBottom: 5}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Miejscowość: </Text>
                {mop.town}
              </Text>
              <Text></Text>
              <Text></Text>
              {this.state.button}
            </View>
            <View style={{width: 120}}>
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
