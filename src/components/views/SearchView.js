import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList
} from 'react-native';

import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';
import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles';

import {SearchBar, Divider, Avatar} from 'react-native-elements'

MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');

const ITEMS_PER_PAGE = 25;

export default class SearchView extends Component {
  constructor() {
    super();
    this.state = {
      searchPhrase: "",
      found: MOPS.mops,
      found_filtered: MOPS.mops,
      reload: false,
      found_trimmed: MOPS.mops.slice(0, ITEMS_PER_PAGE),
      page: 1,
      facilities: this.getInitialChecks()
    }
  }

  getInitialChecks = () => {
    var facs = {};
    FACILITIES.filterFacilitiesCodes.map((f, i) => {
      facs[f] = false;
    });
    return facs;
  }

  findMops = (txt, param) => {
    return MOPS.mops.filter((mop) => {return mop[param].toLowerCase().match(txt)})
  }

  matchFacilities = (mop, facs) => {
    for (f in facs){
      if(facs[f] && !mop.facilities_dict[f]){
        return false;
      }
    };
    return true;
  }

  filterMops = (mops, facs) => {
    return mops.filter((mop) => {return this.matchFacilities(mop, facs)})
  }

  changeSearchPhrase = (t) => {
    var found = [];
    this.setState({searchPhrase: t});
    var txt = (t && t !== "") ? t.toLowerCase() : "";
    var found_name = this.findMops(txt, 'title');
    var found_road = this.findMops(txt, 'road_number');
    var found_town = this.findMops(txt, 'town');
    var found_direction = this.findMops(txt, 'direction');
    var found = _.union(found_direction, found_name, found_road, found_town);
    var found_filtered = this.filterMops(found, this.state.facilities);

    this.setState({
      found_filtered: found_filtered,
      found: found,
      found_trimmed: found_filtered.slice(0, ITEMS_PER_PAGE),
      page: 1
    });
  }

  reload = () => {
    this.setState({reload: true});
  }

  loadMore = () => {
    const { page, found_trimmed } = this.state;
    const start = page * ITEMS_PER_PAGE;
    const end = (page + 1) * ITEMS_PER_PAGE - 1;

    const newData = this.state.found_filtered.slice(start, end);
    this.setState({
      found_trimmed: [...found_trimmed, ...newData],
      page: page + 1
    });
}

  checkFacility = (fac) => {
    var f = this.state.facilities;
    f[fac] = !f[fac];
    var found_filtered = this.filterMops(this.state.found, f);
    this.setState({
      found_filtered: found_filtered,
      found_trimmed: found_filtered.slice(0, ITEMS_PER_PAGE),
      page: 1,
      facilities: f
    });
  }


  render() {
    var facs = FACILITIES.facilities;
    var fac_codes = FACILITIES.filterFacilitiesCodes;
    return (
      <View>
        <Header navigation={this.props.navigation} title='Wyszukaj MOPa' reload={this.reload}/>
        <SearchBar
          round
          lightTheme
          onChangeText={this.changeSearchPhrase}
          onClearText={this.changeSearchPhrase}
          inputStyle={{color: THEMES.basic.DarkGrey}}
          icon={{ type: 'material', name: 'search' }}
          placeholder='Wyszukaj...'
          clearIcon={{ color: THEMES.basic.DarkGrey, name: 'close' }}
        />
        <ScrollView>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          backgroundColor: THEMES.basic.White
        }}>
        {fac_codes.map((f, i) => {
          return (
          <Avatar
            onPress={() => this.checkFacility(f)}
            icon={{name: facs[f].icon, color: THEMES.basic.White}}
            raised
            overlayContainerStyle={{backgroundColor: this.state.facilities[f] ? THEMES.basic.DarkColor : THEMES.basic.LightGrey}}
            width={50}
            height={50}
            rounded={THEMES.roundedIcons}
            key={i}
            containerStyle={{margin: 3}}
          />
        )
        })}
        </View>
        <Divider style={{ backgroundColor: THEMES.basic.DarkGrey, height: 0.8 }} />
        <View>
        <FlatList
          data={this.state.found_trimmed}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (<MopListItem mop={item} key={index} navigation={this.props.navigation}/>)}
          onEndReached={this.loadMore}
          style={{backgroundColor: THEMES.basic.White}}
        />
      </View>
        </ScrollView>
      </View>
    );
  }
}
