import React, {Component} from 'react'
import {
  View,
  Text,
  Image
} from 'react-native';

import {ListItem} from 'react-native-elements'

export default class MopListItem extends Component {

    render() {
        let {main_vehicle} = SETTINGS.settings;
        let {mop} = this.props;

        return (
          <ListItem
              roundAvatar
              avatar={
                <Image
                  source={require('mopsik_mobile/src/images/parking_clear.png')}
                  style={{width: 35, height: 35}}
                  tintColor={mop.color[main_vehicle].background}
                />
              }
              title={mop.title}
              subtitle={'Droga: ' + mop.road_number + '; Kierunek: ' + mop.direction}
              badge={{
                value: mop.usage[main_vehicle] + "%",
                textStyle: {color: mop.color[main_vehicle].text},
                containerStyle: {marginTop: 10, backgroundColor: mop.color[main_vehicle].background}
              }}
              onPress={() => {
                this.props.navigation.navigate('MopDetails', {mop: mop})
              }}
          />
        )
    }
}
