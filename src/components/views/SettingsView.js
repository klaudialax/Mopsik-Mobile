import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  Alert
} from 'react-native';

import {Button, ButtonGroup, Icon, CheckBox, Text, Divider} from 'react-native-elements';
import RNRestart from 'react-native-restart';

import Header from 'mopsik_mobile/src/components/tools/Header';
import styles from 'mopsik_mobile/src/config/styles';
import {VEHICLES, vehiclesCodes} from 'mopsik_mobile/src/config/vehicles';


MOPS = require('mopsik_mobile/src/config/mops');
THEMES = require('mopsik_mobile/src/config/themes');
let _ = require('lodash');

export default class SettingsView extends Component {

  constructor() {
    super();
    this.state = {
      selectedIndex: SETTINGS.settings.main_vehicle_id,
      vehicles_selected: {
        car: SETTINGS.settings.vehicles_selected.car,
        truck: SETTINGS.settings.vehicles_selected.truck,
        bus: SETTINGS.settings.vehicles_selected.bus,
      }
    };
    this.updateIndex = this.updateIndex.bind(this)
  }

  /* update settings with new chosen 'main vehicle' */
  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex: selectedIndex});
    SETTINGS.settings.main_vehicle = this.buttons[selectedIndex].text_id;
    SETTINGS.settings.main_vehicle_id = selectedIndex;
    AsyncStorage.setItem('mopsik_settings', JSON.stringify(SETTINGS.settings));
  };

  /* return button for main vehicle ButtonGroup */
  get_button = (text_id) => {
    return (<View><Icon name={VEHICLES[text_id].icon}
                        color={((SETTINGS.settings.main_vehicle_id !== -1) && (text_id === SETTINGS.settings.main_vehicle))
                          ? THEMES.basic.LightColor
                          : THEMES.basic.Grey}/>
                          <Text>{VEHICLES[text_id].name}</Text></View>)
  };

  /* main vehicle ButtonGroup */
  car = () => this.get_button('car');
  truck = () => this.get_button('truck');
  bus = () => this.get_button('bus');

  buttons = [
    {element: this.car, text_id: 'car'},
    {element: this.truck, text_id: 'truck'},
    {element: this.bus, text_id: 'bus'}
  ];

  /* OK button gets activated once main vehicle is chosen */
  get_ok_button = () => {
    let dis = (this.state.selectedIndex === -1);
    let icon =
    dis ?
      <Icon
        name='block'
        size={20}
        color='red'
      />
    :
      <Icon
        name='done'
        size={20}
        color='green'
      />;
    return (<Button
      onPress={() => {
        this.props.navigation.state.params.first = false;
        this.props.navigation.navigate('Home')
      }}
      title="OK"
      disabled={dis}
      icon={icon}
      buttonStyle={{backgroundColor: THEMES.basic.LightColor, width: 140, marginBottom: 20, height: 40}}
    />);
  };

  /* handles changes in multiple selection of vehicles (to be shown in mop details) */
  updateMultipleSelection = (vehicle_selected) => {
    let st = {...this.state};
    let v = !st.vehicles_selected[vehicle_selected];
    st.vehicles_selected[vehicle_selected] = v;
    SETTINGS.settings.vehicles_selected[vehicle_selected] = v;
    AsyncStorage.setItem('mopsik_settings', JSON.stringify(SETTINGS.settings));
    this.setState(st);
  };

  /* returns checkbox with icon */
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

  reload = () => {
    this.setState({reload: true});
  }

  resetApp = () => {
    AsyncStorage.removeItem('mopsik_settings').then(() => {
      AsyncStorage.removeItem('mopsik_favouriteMOPs').then(() => {
        AsyncStorage.removeItem('mopsik_lastViewedMops').then(() => {
          RNRestart.Restart();
        }).done();
      }).done();
    }).done();

  }

  render() {
    let {params} = this.props.navigation.state;
    /* first = False => app already configured */
    let first = (params) ? params.first : false;
    let header = (first)
      ? (<Header navigation={this.props.navigation} firstSettings/>)
      : (<Header navigation={this.props.navigation} title='Ustawienia' reload={this.reload}/>);
    let button = (first)
    ?
      this.get_ok_button()
    :
      (<Button
        onPress={() => {Alert.alert(
          'Czy na pewno chcesz kontynuować?',
          'Zresetowanie ustawień wymaże wszystkie dane zapisane przez aplikację i uruchomi ją ponownie.',
          [
            {text: 'Anuluj', onPress: () => {}, style: 'cancel'},
            {text: 'Zresetuj', onPress: this.resetApp},
          ],
          { cancelable: false }
        )}}
        title="Zresetuj ustawienia"
        buttonStyle={{marginBottom: 20, backgroundColor: THEMES.basic.Red, height: 40}}
        icon={<Icon
          name='delete'
          size={20}
          color={THEMES.basic.White}
        />}
      />);

    const {selectedIndex} = this.state;

    return (

      <View style={styles.main}>
      {header}
      <ScrollView style={{marginTop: 10}}>
      <Text style={{fontSize: 16, margin: 5, textAlign: 'center'}}>
        Wybierz Twój główny typ pojazdu
      </Text>
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={this.buttons}
        containerStyle={{height: 70}}
        selectedButtonStyle={{backgroundColor: THEMES.basic.White}}
        buttonStyle={{backgroundColor: THEMES.basic.DisabledGrey}}
        />
      <Divider style={{ backgroundColor: THEMES.basic.LightGrey, height: 1.5, margin: 10 }} />
      <Text style={{fontSize: 16, margin: 10, textAlign: 'center'}}>
        Wybierz typy pojazdów, dla których chcesz wyświetlać dane w szczegółowych informacjach o MOPie
      </Text>
      {vehiclesCodes.map((vehicle, i) => (
        this.getCheckBox(vehicle, i)
      ))}
      <View style={{margin: 20, height: 50}}>
        {button}
      </View>
      </ScrollView>
      </View>
    );
  }
}
