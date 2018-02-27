import React, {Component} from 'react';
import {
  View,
  AsyncStorage
} from 'react-native';

import {Button, ButtonGroup, Icon, CheckBox, Text, Divider} from 'react-native-elements';

import Header from 'mopsik_mobile/src/components/Header';
import styles from 'mopsik_mobile/src/config/styles';

MOPS = require('mopsik_mobile/src/config/mops');
FUNCTIONS = require('mopsik_mobile/src/config/functions');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');

export default class SettingsView extends Component {

  constructor() {
    super();
    this.state = {
      selectedIndex: MOPS.settings.main_vehicle_id,
      car_selected: MOPS.settings.car_selected,
      truck_selected: MOPS.settings.truck_selected,
      bus_selected: MOPS.settings.bus_selected,
    };
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex: selectedIndex});
    MOPS.settings.main_vehicle = this.buttons[selectedIndex].text_id;
    MOPS.settings.main_vehicle_id = selectedIndex;
    AsyncStorage.setItem('settings', JSON.stringify(MOPS.settings));
  };

  get_button = (icon_name, text, text_id) => {
    return (<View><Icon name={icon_name}
                        color={((MOPS.settings.main_vehicle_id !== -1) && (text_id === MOPS.settings.main_vehicle)) ? THEMES.basic.backgroundLightColor : THEMES.basic.backgroundGrey}/><Text>{text}</Text></View>)
  };

  car = () => this.get_button('directions-car', 'Samochód', 'car');
  truck = () => this.get_button('local-shipping', 'Ciężarówka', 'truck');
  bus = () => this.get_button('directions-bus', 'Autobus', 'bus');

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
    let v = !st[vehicle_selected];
    st[vehicle_selected] = v;
    this.setState(st);
    MOPS.settings[vehicle_selected] = v;
    AsyncStorage.setItem('settings', JSON.stringify(MOPS.settings));
  };

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
      <Divider style={{ backgroundColor: THEMES.basic.backgroundLightGrey, height: 2 }} />
      <Text></Text>
      <Text style={{fontSize: 16, margin: 5, textAlign: 'center'}}>Wybierz typy pojazdów, dla których chcesz wyświetlać dane w szczegółowych informacjach o MOPie</Text>
      <CheckBox
        title='Samochód'
        textStyle={{fontSize: 16}}
        checked={this.state.car_selected}
        onPress={() => this.updateMultipleSelection('car_selected')}
        checkedColor='#8aa8e3'
      />
      <CheckBox
        title='Ciężarówka'
        textStyle={{fontSize: 16}}
        checked={this.state.truck_selected}
        onPress={() => this.updateMultipleSelection('truck_selected')}
        checkedColor='#8aa8e3'
      />
      <CheckBox
        title='Autobus'
        textStyle={{fontSize: 16}}
        checked={this.state.bus_selected}
        onPress={() => this.updateMultipleSelection('bus_selected')}
        checkedColor='#8aa8e3'
      />
      </View>
      <Text></Text>
      {ok}
      </View>
    );
  }
}
