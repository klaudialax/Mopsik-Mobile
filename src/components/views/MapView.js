import React, {Component} from 'react';
import {Dimensions, Image, View} from 'react-native';

import ReactNativeMaps_MapView from 'react-native-maps';
import {Badge, Icon, Text} from 'react-native-elements'

import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles'

MOPS = require('mopsik_mobile/src/config/mops');
FACILITIES = require('mopsik_mobile/src/config/facilities');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');

export default class MapView extends Component {

  /* when creating component */
  constructor(props) {
    super(props);
    let focused = (this.props.navigation.state.params) ? this.props.navigation.state.params.focused : undefined;
    this.state = {
      region: (focused) ? {...MOPS.savedLocation, ...focused.coords} : MOPS.savedLocation,
      error: null,
      followPosition: (!focused),
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      initialized: false,
      focused: focused
    };
    MOPS.refresh();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        r = {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        if (this.state.followPosition) {
          this.state = {
            ...this.state,
            region: r,
            error: null,
          };
        }
        MOPS.savedLocation = r;
      },
      (error) => this.state = {...this.state, error: error.message},
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  }

  componentDidMount() {
    /* location change listener */
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        /* new region object */
        r = {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        };
        /* update region at most every 2 seconds */
        /* updating state rerenders view with new location */
        const t = new Date().getTime();
        if ((t - MOPS.lastLocationUpdate) >= 2000) {
          if (this.state.followPosition) {
            this.setState({
              region: r
            });
          }
          MOPS.savedLocation = r;
          MOPS.lastLocationUpdate = t;
        }
      },
      (error) => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 20000, distanceFilter: 10},
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  /* returns only mops that are on the visible part of the map */
  selectMops = () => {
    let mops = [];
    MOPS.mops.map((mop, i) => {
      if (Math.abs(mop.coords.latitude - this.state.region.latitude) < this.state.region.latitudeDelta
        && Math.abs(mop.coords.longitude - this.state.region.longitude) < this.state.region.longitudeDelta) {
        mops.push(mop);
      }

    });
    return mops;
  };

  /* dragging a map disables followingPosition */
  onRegionChange(region) {
    this.setState({region: region, followPosition: false, initialized: false});
  }

  /* callouts when pressed on marker */
  getCallout = (marker, main_vehicle) => {
    return (
      <ReactNativeMaps_MapView.Callout onPress={() => {
        this.props.navigation.navigate('MopDetails', {mop: marker, showOnMap: false})
      }}>
        <View
          style={{
            backgroundColor: THEMES.basic.White,
            height: 150,
            width: 150,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}
        >
          <Text numberOfLines={2} style={{fontSize: 20, fontWeight: 'bold'}}>{marker.title}</Text>
          <Text numberOfLines={1}>Kierunek: {marker.direction}</Text>
          {FACILITIES.getFacilitiesIconsShort(marker.facilities_short)}
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Zapełnienie: </Text>
            <Badge
              value={marker.usage[main_vehicle] + '%'}
              textStyle={{color: marker.color[main_vehicle].text}}
              containerStyle={{backgroundColor: marker.color[main_vehicle].background}}
            />
          </View>
        </View>
      </ReactNativeMaps_MapView.Callout>
    )
  };

  reload = () => {
    this.setState({reload: true, initialized: false});
  };

  changeMeasures = () => {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    })
  };

  onMapReady = () => {
    if (this.state.focused && this.marker && this.marker.showCallout) {
      setTimeout(() => this.marker.showCallout(), 0);
    }
    this.setState({initialized: true});
  };

  setMarkerRef = (ref) => {
    this.marker = ref
  };

  empty = () => {

  };

  render() {
    let {main_vehicle} = SETTINGS.settings;
    let mops = this.selectMops();

    return (
      <View style={styles.main} onLayout={this.changeMeasures}>
        <Header
          navigation={this.props.navigation}
          title={(this.state.focused) ? ('Pokaż na mapie: ' + this.state.focused.title) : 'Mapa'}
          reload={this.reload}
          stack={this.state.focused}
        />
        <View style={{zIndex: 10}}>
          <Icon
            onPress={() => {
              if (!this.state.followPosition) {
                this.setState({
                  followPosition: true,
                  region: {
                    ...this.state.region,
                    longitude: MOPS.savedLocation.longitude,
                    latitude: MOPS.savedLocation.latitude
                  }
                })
              }
              else {
                this.setState({
                  followPosition: false
                })
              }
            }}
            name='my-location'
            raised
            reverse={this.state.followPosition}
            color={THEMES.basic.LightColor}
            size={30}
          />
        </View>
        <View style={styles.container_map}>
          <ReactNativeMaps_MapView
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange.bind(this)}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onMapReady={this.onMapReady}
            moveOnMarkerPress={false}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flex: 1,
              width: this.state.width,
              height: this.state.height - 120
            }}
          >
            {mops.map((marker, i) => (
              <ReactNativeMaps_MapView.Marker
                coordinate={marker.coords}
                title={marker.title}
                description={marker.direction}
                tracksViewChanges={!this.state.initialized}
                ref={(this.state.focused && marker.id === this.state.focused.id) ? this.setMarkerRef : this.empty}
                key={i}>
                <Image
                  source={SETTINGS.constants.parking_icon_small}
                  style={{width: 25, height: 25, tintColor: marker.color[main_vehicle].background}}
                />
                {this.getCallout(marker, main_vehicle)}
              </ReactNativeMaps_MapView.Marker>
            ))}
          </ReactNativeMaps_MapView>
          <Text>Latitude: {this.state.region.latitude}</Text>
          <Text>Longitude: {this.state.region.longitude}</Text>
        </View>
      </View>
    );
  }
}
