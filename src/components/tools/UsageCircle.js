import React, {Component} from 'react'
import {Text, View} from 'react-native';

import {CircularProgress} from 'mopsik_mobile/src/components/tools/CircularProgress';

export default class UsageCircle extends Component {

  render() {
    let {mop} = this.props;
    let {vehicle} = this.props;
    let usage = mop.usage[vehicle];
    let available = mop.available[vehicle];
    return (
      <View style={{alignItems: 'center'}}>
        <CircularProgress
          percentage={usage}
          blankColor="green"
          donutColor="red"
          fillColor="white"
          progressWidth={28}
          size={70}
        >
          <View>
            <Text style={{fontSize: 17}}>{(available !== 0) ? (usage + '%') : '--'}</Text>
          </View>
        </CircularProgress>
      </View>
    )
  }
}
