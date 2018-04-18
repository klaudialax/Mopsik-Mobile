import React, {Component} from 'react';
import {FlatList, ScrollView, View} from 'react-native';

import MopListItem from 'mopsik_mobile/src/components/tools/MopListItem';
import Header from 'mopsik_mobile/src/components/tools/Header';

import {Avatar, Divider, SearchBar} from 'react-native-elements'

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
    let facs = {};
    FACILITIES.filterFacilitiesCodes.map((f, i) => {
      facs[f] = false;
    });
    return facs;
  };

  checkParam = (txt, mop, param) =>{
    return mop[param].toLowerCase().match(txt)
  }

  checkParams = (txt, mop) => {
    return (
         this.checkParam(txt, mop, 'title')
      || this.checkParam(txt, mop, 'road_number')
      || this.checkParam(txt, mop, 'town')
      || this.checkParam(txt, mop, 'direction')
    )
  }

  findMops = (txt) => {
    return MOPS.mops.filter((mop) => {
      return this.checkParams(txt, mop)
    })
  };

  matchFacilities = (mop, facs) => {
    for (f in facs) {
      if (facs[f] && !mop.facilities_dict[f]) {
        return false;
      }
    }
    return true;
  };

  allFacsOff = (facs) => {
    console.log(facs);
    for (f in facs) {
      if (facs[f]) {
        return false;
      }
    }
    return true;
  }

  filterMops = (mops, facs) => {
    if(this.allFacsOff(facs)){
      console.log('true')
      return mops;
    }
    return mops.filter((mop) => {
      return this.matchFacilities(mop, facs);
    })
  };

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


  render() {
    const facs = FACILITIES.facilities;
    const fac_codes = FACILITIES.filterFacilitiesCodes;
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
