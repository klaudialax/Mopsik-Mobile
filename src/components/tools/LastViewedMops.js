import React, {Component} from 'react'
import {AsyncStorage, FlatList, View} from 'react-native';

import {Text} from 'react-native-elements'

import SubHeader from 'mopsik_mobile/src/components/tools/SubHeader';
import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';

let _ = require('lodash');

export default class LastViewedMops extends Component {

  getLast = () => {
    last = [];
    MOPS.lastViewedMops.map((l, i) => {
      last.push(_.find(MOPS.mops, {id: l}));
    });
    return last;
  };

  constructor() {
    super();
    this.state = {
      reload: false
    }
  }

  clearLastViewedMops = async () => {
    MOPS.lastViewedMops = [];
    AsyncStorage.setItem('mopsik_lastViewedMops', JSON.stringify([])).then(() => {
      this.setState({reload: !this.state.reload});
    }).done();
  };

  render() {
    let top = (
      <SubHeader text={'Ostatnio wyświetlane MOP-y'} rightComponent={{
        icon: 'clear',
        color: 'white',
        onPress: this.clearLastViewedMops,
        underlayColor: THEMES.basic.LightColor
      }}/>
    );
    let contents = (
      <View style={{backgroundColor: THEMES.basic.White}}>
        <Text style={{fontSize: 18, textAlign: 'center', margin: 10}}>Brak danych</Text>
      </View>
    );
    if (MOPS.lastViewedMops.length > 0) {
      contents = (
        <FlatList
          data={this.getLast()}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (<MopListItem mop={item} key={index} navigation={this.props.navigation}/>)}
          style={{backgroundColor: THEMES.basic.White}}
        />
      );
    }

    return (
      <View>
        {top}
        {contents}
      </View>
    )
  }
}
