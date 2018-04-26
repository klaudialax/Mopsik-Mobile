import React, {Component} from 'react';
import {AsyncStorage, DeviceEventEmitter, ScrollView, View} from 'react-native';

import {Divider, Text} from 'react-native-elements'

import LastViewedMops from 'mopsik_mobile/src/components/tools/LastViewedMops';
import NearestMops from 'mopsik_mobile/src/components/tools/NearestMops';
import SplashScreen from 'mopsik_mobile/src/components/tools/SplashScreen';
import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles'
import {findNearestMop} from 'mopsik_mobile/src/config/findNearestMop'

MOPS = require('mopsik_mobile/src/config/mops');
SETTINGS = require('mopsik_mobile/src/config/settings');

let _ = require('lodash');

export default class HomeView extends Component {

  constructor() {
    super();
    this.state = {
      toggled: false,
      contents: this.getSplashScreen(),
      region: null,
      nearestMops: null
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        r = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        MOPS.savedLocation = {
          ...MOPS.savedLocation,
          ...r
        };
        let nearest = findNearestMop(r.latitude, r.longitude);
        this.state = {
          ...this.state,
          region: r,
          nearestMops: nearest,
        };
      },
      (error) => {
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );

  }

  generateContents = () => {
    this.setState({contents: this.getContents(this.state.nearestMops)})
  };

  getSplashScreen = () => {
    return (<SplashScreen/>)
  };

  updateStateWithNewLocation = (r) => {
    let nearest = findNearestMop(r.latitude, r.longitude);
    this.setState({
      region: r,
      nearestMops: nearest,
      contents: this.getContents(nearest)
    });
  };

  componentDidMount() {
    /* location change listener */
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        /* new region object */
        r = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        /* update region at most every 2 seconds */
        /* updating state rerenders view with new location */
        const t = new Date().getTime();
        if ((t - MOPS.lastLocationUpdate) >= 2000) {
          MOPS.savedLocation = {
            ...MOPS.savedLocation,
            ...r
          };
          MOPS.lastLocationUpdate = t;
          this.updateStateWithNewLocation(r);
        }
      },
      (error) => {
        console.log('error', error)
      },
      {enableHighAccuracy: false, timeout: 20000, distanceFilter: 10},
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  toggleSideMenu() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  getSettings = () => {
    AsyncStorage.getItem('mopsik_settings').then((response) => {
      if (response) { // settings are already saved in AsyncStorage
        SETTINGS.settings = JSON.parse(response);
      }
      else { // no setting saved, opening app configuration
        this.props.navigation.navigate('Settings', {first: true});
      }
    }).done();
  };

  componentWillMount() {
    if (MOPS.mops.length === 0) { // first opening app, downloading mop data
      this.setState({contents: this.getSplashScreen()})
      MOPS.downloadMops(() => {
        this.getSettings();
        this.generateContents()
      });
    }
    else { // only refresh
      this.generateContents();
      MOPS.refresh();
    }
    /* after opening mop detail through NearestMops and then coming back,
       view is rerendered, so this mop appears in LastViewedMops */
    DeviceEventEmitter.addListener('refresh', () => {
      if (this.refs.home) {
        this.generateContents();
      }
    });
  }

  reload = () => {
    this.generateContents();
    this.setState({reload: !this.state.reload});
  };

  getContents = (nearestMops) => {
    return (
      <View style={styles.main}>
        <Header navigation={this.props.navigation} title='Panel główny' reload={this.reload}/>
        <ScrollView style={styles.main}>
          <NearestMops nearestMops={nearestMops} navigation={this.props.navigation}/>
          <LastViewedMops navigation={this.props.navigation}/>
          <Divider style={{backgroundColor: THEMES.basic.LightGrey, height: 0.8}}/>
          <View style={{
            alignItems: 'center',
          }}>
            <Text style={{marginBottom: 15, marginTop: 5}}>Logo wygenerowane przy pomocy Logo Maker</Text>
          </View>
        </ScrollView>
      </View>
    )
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.main} ref='home'>
        {this.state.contents}
      </View>
    );
  }
}
