import {
  AsyncStorage
} from 'react-native';
var _ = require('lodash');

let settings = {
  set: false,
  main_vehicle: 'car',
  main_vehicle_id: -1,
  car_selected: false,
  truck_selected: false,
  bus_selected: false
}

let simple_legend = {
  35: {
    background:'green',
    text:'white'
  },
  50: {
    background:'yellow',
    text:'black'
  },
  75: {
    background:'orange',
    text:'black'
  },
  100: {
    background:'red',
    text:'white'
  }
}

let get_color = (value, legend) => {
  for (let key in legend) {
    if (value <= key)
      return legend[key];
  }
  return {
    background:'black',
    text:'white'
  };
}

let mops = [];
let favouriteMOPs = [];
let favouriteMOPsmapped = [];

let downloadMops = () => {
  fetch('http://reach.mimuw.edu.pl:8008/mops').then(response => (response) ? response.json() : {}).then((mops_dict) => {
      markers = [];
      for (var key in mops_dict) {
        markers.push(mops_dict[key]);
      }
      console.log('len', markers.length);
      markers.map((marker) => {
        usage_car = (marker.available.car > 0) ? Math.floor(marker.taken.car * 100 / marker.available.car) : 0;
        usage_truck = (marker.available.truck > 0) ? Math.floor(marker.taken.truck * 100 / marker.available.truck) : 0;
        usage_bus = (marker.available.bus > 0) ? Math.floor(marker.taken.bus * 100 / marker.available.bus) : 0;
        mops.push({
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

        })
      });
  }).done();
}

let downloadUsages = () => {
  fetch('http://reach.mimuw.edu.pl:8008/taken').then(response => (response) ? response.json() : {}).then((taken_dict) => {
      mops.map((marker) => {
        marker.taken = taken_dict[marker.id].taken;
        usage_car = (marker.available.car > 0) ? Math.floor(marker.taken.car * 100 / marker.available.car) : 0;
        usage_truck = (marker.available.truck > 0) ? Math.floor(marker.taken.truck * 100 / marker.available.truck) : 0;
        usage_bus = (marker.available.bus > 0) ? Math.floor(marker.taken.bus * 100 / marker.available.bus) : 0;
        marker.usage = {
            car: usage_car,
            truck: usage_truck,
            bus: usage_bus
          }
        marker.color = {
            car: get_color(usage_car, simple_legend),
            truck: get_color(usage_truck, simple_legend),
            bus: get_color(usage_bus, simple_legend)
        }
      });
  }).done();
}

let refresh = () => {
  console.log('refresh');
  downloadUsages();
}


module.exports = {
  mops: mops,
  settings: settings,
  downloadMops: downloadMops,
  refresh: refresh,
  favouriteMOPs: favouriteMOPs,
  favouriteMOPsmapped: favouriteMOPsmapped
};
