import React, {Component} from 'react'
import {Text, View} from 'react-native';

import {ListItem} from 'react-native-elements'

export default class MopListItem extends Component {

  /* list element used in LastViewedMops, Favourites and Search */
  render() {
    let {main_vehicle} = SETTINGS.settings;
    let {mop} = this.props;

    return (
      <ListItem
        leftAvatar={
          <View style={{width: 40, alignItems: 'center'}}>
            <Text
              style={{fontSize: 17, color: THEMES.basic.DarkGrey, textAlign: 'center'}}>
              {mop.road_number}
            </Text>
          </View>
        }
        chevron
        topDivider
        bottomDivider
        title={mop.title.replace(/ +/g, ' ')}
        titleProps={{numberOfLines: 1}}
        subtitle={'Kierunek: ' + mop.direction}
        badge={{
          value: mop.usage[main_vehicle] + "%",
          textStyle: {color: mop.color[main_vehicle].text, fontSize: 15},
          containerStyle: {backgroundColor: mop.color[main_vehicle].background, width: 65}
        }}
        onPress={() => {
          this.props.navigation.navigate('MopDetails', {mop: mop, showOnMap: true})
        }}
      />
    )
  }
}
