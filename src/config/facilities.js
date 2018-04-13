import React from 'react';
import {Alert, View} from 'react-native';

import {Avatar} from 'react-native-elements'


let _ = require('lodash');

/* dict of all facilities available with coresponding icon names and polish names */
export const facilities = {
  car_wash: {
    icon: 'local-car-wash',
    name: 'Myjnia samochodowa'
  },
  dangerous_cargo_places: {
    icon: 'warning',
    name: 'Miejsce dla pojazdów z ładunkiem niebezpiecznym'
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

/* keys (codes) of facilities to be displayed in mop details view */
export const facilitiesCodes = [
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

/* keys (codes) of facilities to be displayed in callouts on the map */
export const facilitiesCodesShort = [
  'petrol_station',
  'restaurant',
  'sleeping_places',
  'toilets'
];

/* keys (codes) of facilities to be displayed in search view */
export const filterFacilitiesCodes = [
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

/* facility icon for callouts */
let getFacilityIconShort = (code, i) => {
  let fac = facilities[code];
  return (
    <Avatar
      icon={{name: fac.icon, color: THEMES.basic.White}}
      raised
      overlayContainerStyle={{backgroundColor: THEMES.basic.DarkColor}}
      width={35}
      height={35}
      rounded={THEMES.roundedIcons}
      key={i}
    />
  )
};

/* facility icons for callouts combined */
export const getFacilitiesIconsShort = (codes) => {
  return (
    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
      {codes.map((code, i) => (
        getFacilityIconShort(code, i)
      ))}
    </View>
  )
};

/* facility icon for details */
let getFacilityIconLong = (code, i, active, onPress) => {
  let fac = facilities[code];
  return (
    <Avatar
      onPress={onPress}
      icon={{name: fac.icon, color: THEMES.basic.White}}
      raised
      overlayContainerStyle={{backgroundColor: active ? THEMES.basic.DarkColor : THEMES.basic.LightGrey}}
      width={50}
      height={50}
      rounded={THEMES.roundedIcons}
      key={i}
      containerStyle={{margin: 3}}
    />
  )
};

/*
 * returns highlighted (blue) or not (grey) icon
 * on press uses alert to display name of facility --> maybe we can think of something nicer
 * OK button currently not visible
 */
const chooseFacilityIconLong = (codes, code, i) => {
  if (_.includes(codes, code)) {
    return getFacilityIconLong(code, i, true, () => {
      Alert.alert(facilities[code].name, 'dostępne', [/*{text: 'OK'}*/], {cancelable: true})
    })
  }
  else {
    return getFacilityIconLong(code, i, false, () => {
      Alert.alert(facilities[code].name, 'brak', [/*{text: 'OK'}*/], {cancelable: true})
    })
  }
};

/* facility icons for details combined */
export const getFacilitiesIconsLong = (codes) => {
  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }}>
      {facilitiesCodes.map((code, i) => (
        chooseFacilityIconLong(codes, code, i)
      ))}
    </View>
  )
};
