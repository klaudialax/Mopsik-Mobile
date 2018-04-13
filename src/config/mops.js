let _ = require('lodash');

import {AsyncStorage} from 'react-native';

import {facilitiesCodes, facilitiesCodesShort} from 'mopsik_mobile/src/config/facilities';

FAVOURITES = require('mopsik_mobile/src/config/favourites');

/*
 * simple color scale for usage of parking spots
 * <0, 35> => green
 * (35, 50> => yellow
 * ...
 */
let simple_scale = {
  35: {
    background: 'green',
    text: 'white'
  },
  50: {
    background: 'yellow',
    text: 'black'
  },
  75: {
    background: 'orange',
    text: 'black'
  },
  100: {
    background: 'red',
    text: 'white'
  }
};

/* assigns background and text color to the value according to the passed scale */
let get_color = (value, scale) => {
  for (let key in scale) {
    if (value <= key)
      return scale[key];
  }
  return {
    background: 'black',
    text: 'white'
  };
};

/* 'global' variables */
let mops = [];
let favouriteMOPs = [];
let favouriteMOPsmapped = [];
let savedLocation = { //Warsaw center
  latitude: 52.226,
  longitude: 21,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};
let lastLocationUpdate = new Date().getTime();

/* calculates new usage and color for updated number of taken parking spots */
let updateMop = (marker) => {
  usage_car = (marker.available.car > 0) ? Math.floor(marker.taken.car * 100 / marker.available.car) : 100;
  usage_truck = (marker.available.truck > 0) ? Math.floor(marker.taken.truck * 100 / marker.available.truck) : 100;
  usage_bus = (marker.available.bus > 0) ? Math.floor(marker.taken.bus * 100 / marker.available.bus) : 100;
  return {
    usage: {
      car: usage_car,
      truck: usage_truck,
      bus: usage_bus
    },
    color: {
      car: get_color(usage_car, simple_scale),
      truck: get_color(usage_truck, simple_scale),
      bus: get_color(usage_bus, simple_scale)
    }
  }
};

/* adds lists of facilities available to MOP dict */
let processMop = (mop) => {
  let fac = [];
  let fac_short = [];
  let fac_dict = mop.facilities;
  for (let code of facilitiesCodes) {
    if (mop.facilities[code]) {
      fac.push(code);
    }
  }
  for (let code of facilitiesCodesShort) {
    if (mop.facilities[code]) {
      fac_short.push(code);
    }
  }
  return {
    ...mop,
    facilities: fac,
    facilities_short: fac_short,
    facilities_dict: fac_dict
  };
}

/*
 * downloads all parameters for all mops
  * makes API call
  * parses response
  * saves to variables
 * called in HomeView
 */
downloadMops = (turnOffSplash) => {
  fetch(SETTINGS.constants.api_mops).then(response => (response) ? response.json() : {}).then((mops_dict) => {
    markers = [];
    for (let key in mops_dict) {
      marker = processMop(mops_dict[key]);
      u = updateMop(marker);
      marker.usage = u.usage;
      marker.color = u.color;
      MOPS.mops.push(marker);
    }
    if (favouriteMOPs.length === 0) {
      FAVOURITES.downloadFavourites();
    }
    AsyncStorage.getItem('mopsik_lastViewedMops').then((response) => {
      if (response) {
        MOPS.lastViewedMops = JSON.parse(response);
      }
      else {
        MOPS.lastViewedMops = [];
      }
      turnOffSplash();
    }).done();
  }).done();
};


/*
 * downloads number of taken spaces for all mops
  * makes API calculates
  * parses response
  * saves to variables
 * called when refresh is pressed and on rendering views
 */
let downloadUsages = () => {
  fetch(SETTINGS.constants.api_taken).then(response => (response) ? response.json() : {}).then((taken_dict) => {
    mops.map((marker) => {
      marker.taken = taken_dict[marker.id].taken;
      u = updateMop(marker);
      marker.usage = u.usage;
      marker.color = u.color;
    });
  }).done();
};

/* function called when refresh button is pressed */
let refresh = () => {
  downloadUsages();
};

let lastViewedMops = [];


module.exports = {
  mops: mops,
  downloadMops: downloadMops,
  refresh: refresh,
  favouriteMOPs: favouriteMOPs,
  favouriteMOPsmapped: favouriteMOPsmapped,
  savedLocation: savedLocation,
  lastLocationUpdate: lastLocationUpdate,
  lastViewedMops: lastViewedMops
};
