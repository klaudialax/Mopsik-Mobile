import React, {Component} from 'react'
import {
  View,
  Text
} from 'react-native';

import {CircularProgress} from 'mopsik_mobile/src/components/CircularProgress';

export default class UsageCircle extends Component {

    render() {
        let {mop} = this.props;
        let {vehicle} = this.props;
        let usage = mop.usage[vehicle];
        return (
            <View style={{alignItems:'center'}}>
              <CircularProgress
                percentage={(usage !== undefined) ? usage : 100}
                blankColor="green"
                donutColor="red"
                fillColor="white"
                progressWidth={28}
                size={70}
              >
                <View>
                  <Text style={{fontSize: 17}}>{(usage !== undefined) ? (usage + '%') : '--'}</Text>
                </View>
              </CircularProgress>
            </View>
        )
    }
}
