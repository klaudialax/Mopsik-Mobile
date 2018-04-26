import React, {Component} from 'react';
import {FlatList, ScrollView, View} from 'react-native';

import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';
import Header from 'mopsik_mobile/src/components/tools/Header';

import {Avatar, Divider, SearchBar} from 'react-native-elements'

MOPS = require('mopsik_mobile/src/config/mops');
let _ = require('lodash');

const ITEMS_PER_PAGE = 40;

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

  /* initializes facilities dict with all false values */
  getInitialChecks = () => {
    let facs = {};
    FACILITIES.filterFacilitiesCodes.map((f, i) => {
      facs[f] = false;
    });
    return facs;
  };

  /* checks if mops param contains text txt */
  checkParam = (txt, mop, param) =>{
    return mop[param].toLowerCase().match(txt)
  }

  /* searches for text txt in four parameters of the mop */
  checkParams = (txt, mop) => {
    return (
         this.checkParam(txt, mop, 'title')
      || this.checkParam(txt, mop, 'road_number')
      || this.checkParam(txt, mop, 'town')
      || this.checkParam(txt, mop, 'direction')
    )
  }

  /* returns mops that contain text txt if any of the four parameters */
  findMops = (txt) => {
    return MOPS.mops.filter((mop) => {
      return this.checkParams(txt, mop)
    })
  };

  /* checks if mop offers all of the facilities chosen in filters */
  matchFacilities = (mop, facs) => {
    for (f in facs) {
      if (facs[f] && !mop.facilities_dict[f]) {
        return false;
      }
    }
    return true;
  };

  /* returns true if no facilities are chosen in filters */
  allFacsOff = (facs) => {
    console.log(facs);
    for (f in facs) {
      if (facs[f]) {
        return false;
      }
    }
    return true;
  }

  /* returns mops that match search phrase and filters */
  filterMops = (mops, facs) => {
    if(this.allFacsOff(facs)){
      console.log('true')
      return mops;
    }
    return mops.filter((mop) => {
      return this.matchFacilities(mop, facs);
    })
  };

  /* update displayed mops according to searchPhrase */
  changeSearchPhrase = (t) => {
    this.setState({searchPhrase: t});
    let txt = (t && t !== "") ? t.toLowerCase() : "";
    let found = this.findMops(txt);
    let found_filtered = this.filterMops(found, this.state.facilities);

    this.setState({
      found_filtered: found_filtered,
      found: found,
      found_trimmed: found_filtered.slice(0, ITEMS_PER_PAGE),
      page: 1
    });
  };

  reload = () => {
    this.setState({reload: true});
  };

  /* load more mops on reaching end of ScrollView */
  loadMore = () => {
    const {page, found_trimmed} = this.state;
    const start = page * ITEMS_PER_PAGE;
    const end = (page + 1) * ITEMS_PER_PAGE - 1;

    const newData = this.state.found_filtered.slice(start, end);
    this.setState({
      found_trimmed: [...found_trimmed, ...newData],
      page: page + 1
    });
  };

  /* handle checking icon in filters */
  checkFacility = (fac) => {
    const f = this.state.facilities;
    f[fac] = !f[fac];
    const found_filtered = this.filterMops(this.state.found, f);
    this.setState({
      found_filtered: found_filtered,
      found_trimmed: found_filtered.slice(0, ITEMS_PER_PAGE),
      page: 1,
      facilities: f
    });
  };

  getFacilityIcon = (f, i, facs) => {
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
  }


  render() {
    const facs = FACILITIES.facilities;
    const facCodes = FACILITIES.filterFacilitiesCodes;
    const fHalfLength = Math.ceil(facCodes.length / 2);
    return (
      <View>
        <Header navigation={this.props.navigation} title='Wyszukaj MOPa' reload={this.reload}/>
        <SearchBar
          round
          lightTheme
          onChangeText={this.changeSearchPhrase}
          onClearText={this.changeSearchPhrase}
          inputStyle={{color: THEMES.basic.DarkGrey}}
          icon={{type: 'material', name: 'search'}}
          placeholder='Wyszukaj...'
          clearIcon={{color: THEMES.basic.DarkGrey, name: 'close'}}
        />
        <ScrollView>
        <View style={{padding: 5, paddingLeft: 15, paddingRight: 15, backgroundColor: THEMES.basic.White}}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
          }}>
            {facCodes.slice(0, fHalfLength).map((f, i) => this.getFacilityIcon(f, i, facs))}
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
          }}>
            {facCodes.slice(fHalfLength, facCodes.length).map((f, i) => this.getFacilityIcon(f, i, facs))}
          </View>
          </View>
          <Divider style={{backgroundColor: THEMES.basic.DarkGrey, height: 0.8}}/>
          <View>
            <FlatList
              data={this.state.found_trimmed}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (<MopListItem mop={item} key={index} navigation={this.props.navigation}/>)}
              onEndReached={this.loadMore}
              style={{backgroundColor: THEMES.basic.White, marginBottom: 130}}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
