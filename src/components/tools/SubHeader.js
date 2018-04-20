import React, {Component} from 'react'
import {Platform} from 'react-native';

import {Header, List} from 'react-native-elements'

let _ = require('lodash');

export default class SubHeader extends Component {

  render() {
    let outer = {
      backgroundColor: THEMES.basic.LightColor,
      height: 35
    };
    let center = {text: this.props.text, style: {
      color: 'white',
      fontSize: 16,
    }};
    let inner = {
      ...Platform.select({
        ios: {
          top: -10,
        },
      })
    };
    if (!this.props.rightComponent) {
      return (
        <Header
          centerComponent={center}
          outerContainerStyles={outer}
          innerContainerStyles={inner}
        />
      )
    }
    return (
      <Header
        centerComponent={center}
        rightComponent={this.props.rightComponent}
        outerContainerStyles={outer}
        innerContainerStyles={inner}
      />
    )
  }
}
