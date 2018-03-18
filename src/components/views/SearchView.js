import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';

import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';
import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles';

import {SearchBar} from 'react-native-elements'
import {List} from 'react-native-elements'

MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');

export default class SearchView extends Component {
  constructor() {
    super();
    this.state = {
      searchPhrase: "",
      found: MOPS.mops,
      reload: false
    }
  }

  findMops = (txt, param) => {
    return MOPS.mops.filter((mop) => {return mop[param].toLowerCase().match(txt)})
  }

  changeSearchPhrase = (t) => {
    var found = [];
    this.setState({searchPhrase: t});
    var txt = (t && t !== "") ? t.toLowerCase() : "";
    var found_name = this.findMops(txt, 'title');
    var found_road = this.findMops(txt, 'road_number');
    var found_town = this.findMops(txt, 'town');
    var found_direction = this.findMops(txt, 'direction');
    found = _.union(found_direction, found_name, found_road, found_town);
    this.setState({found: found});
  }

  reload = () => {
    this.setState({reload: true});
  }

  render() {
    return (
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title='Wyszukaj' reload={this.reload}/>
        <SearchBar
          round
          lightTheme
          onChangeText={this.changeSearchPhrase}
          onClearText={this.changeSearchPhrase}
          inputStyle={{color: THEMES.basic.DarkGrey}}
          icon={{ type: 'font-awesome', name: 'search' }}
          placeholder='Wyszukaj...'
          clearIcon={{ color: THEMES.basic.DarkGrey, name: 'close' }}
        />
        <ScrollView>
        <List containerStyle={{marginBottom: 100}}>
          {this.state.found.map((f, i) => (
            <MopListItem mop={f} key={i} navigation={this.props.navigation}/>
          ))}
        </List>
        </ScrollView>
      </View>
    );
  }
}
