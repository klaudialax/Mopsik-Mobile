import React, {Component} from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';

import {Button, ButtonGroup, Icon, CheckBox, Text, Divider} from 'react-native-elements';

import Header from 'mopsik_mobile/src/components/Header';
import styles from 'mopsik_mobile/src/config/styles';
import {VEHICLES, vehiclesCodes} from 'mopsik_mobile/src/config/vehicles';

MOPS = require('mopsik_mobile/src/config/mops');
FUNCTIONS = require('mopsik_mobile/src/config/functions');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');

export default class SettingsView extends Component {

  constructor() {
    super();
    this.state = {
      selectedIndex: MOPS.settings.main_vehicle_id,
      vehicles_selected: {
        car: MOPS.settings.vehicles_selected.car,
        truck: MOPS.settings.vehicles_selected.truck,
        bus: MOPS.settings.vehicles_selected.bus,
      }
    };
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex: selectedIndex});
    MOPS.settings.main_vehicle = this.buttons[selectedIndex].text_id;
    MOPS.settings.main_vehicle_id = selectedIndex;
    AsyncStorage.setItem('settings', JSON.stringify(MOPS.settings));
  };

  get_button = (text_id) => {
    return (<View><Icon name={VEHICLES[text_id].icon}
                        color={((MOPS.settings.main_vehicle_id !== -1) && (text_id === MOPS.settings.main_vehicle))
                          ? THEMES.basic.LightColor
                          : THEMES.basic.Grey}/>
                          <Text>{VEHICLES[text_id].name}</Text></View>)
  };

  car = () => this.get_button('car');
  truck = () => this.get_button('truck');
  bus = () => this.get_button('bus');

  buttons = [
    {element: this.car, text_id: 'car'},
    {element: this.truck, text_id: 'truck'},
    {element: this.bus, text_id: 'bus'}
  ];

  get_ok_button = () => {
    let dis = (this.state.selectedIndex === -1);
    let icon = dis ? {name: 'block', color: 'red'} : {name: 'done', color: 'green'};
    return (<Button
      onPress={() => {
        this.props.navigation.state.params.first = false;
        this.props.navigation.navigate('Home')
      }}
      title="OK"
      disabled={dis}
      icon={icon}
    />);
  };

  updateMultipleSelection = (vehicle_selected) => {
    let st = {...this.state};
    let v = !st.vehicles_selected[vehicle_selected];
    st.vehicles_selected[vehicle_selected] = v;
    this.setState(st);
    MOPS.settings.vehicles_selected[vehicle_selected] = v;
    AsyncStorage.setItem('settings', JSON.stringify(MOPS.settings));
  };

  getCheckBox = (vehicle, i) => {
    return (
      <CheckBox
        title={VEHICLES[vehicle].name}
        textStyle={{fontSize: 16}}
        checked={this.state.vehicles_selected[vehicle]}
        onPress={() => this.updateMultipleSelection(vehicle)}
        checkedColor='#8aa8e3'
        key={i}
      />
    )
  }

  render() {
    let {params} = this.props.navigation.state;
    let first = (params) ? params.first : false;
    let header = (first)
      ? (<Header navigation={this.props.navigation} firstSettings/>)
      : (<Header navigation={this.props.navigation} title='Ustawienia'/>);
    let ok = (first) ? this.get_ok_button() : undefined;

    const {selectedIndex} = this.state;

    return (

      <View style={styles.main}>
      {header}
      <View>
      <Text style={{fontSize: 16, margin: 5, textAlign: 'center'}}>Wybierz Twój główny typ pojazdu</Text>
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={this.buttons}
        containerStyle={{height: 70}}
        />
      <Text></Text>
      <Divider style={{ backgroundColor: THEMES.basic.LightGrey, height: 2 }} />
      <Text></Text>
      <Text style={{fontSize: 16, margin: 5, textAlign: 'center'}}>Wybierz typy pojazdów, dla których chcesz wyświetlać dane w szczegółowych informacjach o MOPie</Text>
      {vehiclesCodes.map((vehicle, i) => (
        this.getCheckBox(vehicle, i)
      ))}
      </View>
      <Text></Text>
      {ok}
      </View>
    );
  }
}
