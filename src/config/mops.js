let _ = require('lodash');

let settings = {
  set: false,
  main_vehicle: 'car',
  main_vehicle_id: -1,
  car_selected: false,
  truck_selected: false,
  bus_selected: false
};

let simple_legend = {
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

let get_color = (value, legend) => {
  for (let key in legend) {
    if (value <= key)
      return legend[key];
  }
  return {
    background: 'black',
    text: 'white'
  };
};

let mops = [];
let favouriteMOPs = [];
let favouriteMOPsmapped = [];
let savedLocation = {
  latitude: 52.226,
  longitude: 21,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};
let lastLocationUpdate = new Date().getTime();

let updateMop = (marker) => {
  usage_car = (marker.available.car > 0) ? Math.floor(marker.taken.car * 100 / marker.available.car) : 0;
  usage_truck = (marker.available.truck > 0) ? Math.floor(marker.taken.truck * 100 / marker.available.truck) : 0;
  usage_bus = (marker.available.bus > 0) ? Math.floor(marker.taken.bus * 100 / marker.available.bus) : 0;
  return {
    ...marker,
    usage: {
      car: usage_car,
      truck: usage_truck,
      bus: usage_bus
    },
    color: {
      car: get_color(usage_car, simple_legend),
      truck: get_color(usage_truck, simple_legend),
      bus: get_color(usage_bus, simple_legend)
    }
  }
};

let downloadMops = () => {
  fetch('http://reach.mimuw.edu.pl:8008/mops').then(response => (response) ? response.json() : {}).then((mops_dict) => {
    markers = [];
    for (let key in mops_dict) {
      markers.push(mops_dict[key]);
    }
    markers.map((marker) => {
      mops.push(updateMop(marker));
    });
  }).done();
};

let downloadUsages = () => {
  fetch('http://reach.mimuw.edu.pl:8008/taken').then(response => (response) ? response.json() : {}).then((taken_dict) => {
    mops.map((marker) => {
      marker.taken = taken_dict[marker.id].taken;
      marker = updateMop(marker);
    });
  }).done();
};

let refresh = () => {
  downloadUsages();
};


module.exports = {
  mops: mops,
  settings: settings,
  downloadMops: downloadMops,
  refresh: refresh,
  favouriteMOPs: favouriteMOPs,
  favouriteMOPsmapped: favouriteMOPsmapped,
  savedLocation: savedLocation,
  lastLocationUpdate: lastLocationUpdate
};
