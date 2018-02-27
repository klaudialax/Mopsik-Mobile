import React, {Component} from 'react';
import {View, Alert} from 'react-native';

import {Avatar} from 'react-native-elements'


let _ = require('lodash');

export const facilities = {
  car_wash: {
    icon: 'local-car-wash',
    name: 'Myjnia samochodowa'
  },
  dangerous_cargo_places: {
    icon: 'warning',
    name: 'Myjnia'
  },
  garage: {
    icon: 'build',
    name: 'Warsztat'
  },
  lighting: {
    icon: 'lightbulb-outline',
    name: 'Oświetlenie'
  },
  monitoring: {
    icon: 'videocam',
    name: 'Monitoring'
  },
  petrol_station: {
    icon: 'local-gas-station',
    name: 'Stacja benzynowa'
  },
  restaurant: {
    icon: 'restaurant',
    name: 'Gastronomia'
  },
  security: {
    icon: 'security',
    name: 'Ochrona'
  },
  sleeping_places: {
    icon: 'hotel',
    name: 'Miejsca noclegowe'
  },
  toilets: {
    icon: 'wc',
    name: 'Toalety'
  }
};

export const facilities_codes = [
  'car_wash',
  'dangerous_cargo_places',
  'garage',
  'lighting',
  'monitoring',
  'petrol_station',
  'restaurant',
  'security',
  'sleeping_places',
  'toilets'
];

export const facilities_codes_short = [
  'petrol_station',
  'restaurant',
  'sleeping_places',
  'toilets'
];

let getFacilityIconShort = (code, i) => {
  let fac = facilities[code];
  return (
  <Avatar
    onPress={() => {}}
    icon={{name: fac.icon, color: THEMES.basic.backgroundWhite}}
    raised
    overlayContainerStyle={{backgroundColor: THEMES.basic.backgroundDarkColor}}
    width={35}
    height={35}
    rounded
    key={i}
  />
  )
}

export const getFacilitiesIconsShort = (codes) => {
  return (
    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
    {codes.map((code, i) => (
      getFacilityIconShort(code, i, true, () => {})
    ))}
    </View>
  )
}

let getFacilityIconLong = (code, i, active, onPress) => {
  let fac = facilities[code];
  return (
  <Avatar
    onPress={onPress}
    icon={{name: fac.icon, color: THEMES.basic.backgroundWhite}}
    raised
    overlayContainerStyle={{backgroundColor: active ? THEMES.basic.backgroundDarkColor : THEMES.basic.backgroundLightGrey}}
    width={50}
    height={50}
    rounded
    key={i}
    containerStyle={{margin: 3}}
  />
  )
}

const chooseFacilityIconLong = (codes, code, i) =>{
  if (_.includes(codes, code)){
    return getFacilityIconLong(code, i, true, () => {
      Alert.alert(facilities[code].name, 'dostępne', [/*{text: 'OK'}*/], { cancelable: true })
    })
  }
  else{
    return getFacilityIconLong(code, i, false, () => {
      Alert.alert(facilities[code].name, 'brak', [/*{text: 'OK'}*/], { cancelable: true })
    })
  }
}

export const getFacilitiesIconsLong = (codes) => {
  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }}>
    {facilities_codes.map((code, i) => (
      chooseFacilityIconLong(codes, code, i)
    ))}
    </View>
  )
}
