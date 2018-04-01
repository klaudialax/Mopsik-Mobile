let settings = {
  set: false,
  main_vehicle: 'car',
  main_vehicle_id: -1,
  vehicles_selected: {
    car: false,
    truck: false,
    bus: false
  }
};

let constants = {
  api_mops: 'http://reach.mimuw.edu.pl:8008/mops',
  api_taken: 'http://reach.mimuw.edu.pl:8008/taken',
  parking_icon_small: require('mopsik_mobile/src/images/parking_clear_small.png'),
  parking_icon: require('mopsik_mobile/src/images/parking_clear.png'),
  logo: require('mopsik_mobile/src/images/logo_clear_all.png')
}

module.exports = {
  settings: settings,
  constants: constants
};
