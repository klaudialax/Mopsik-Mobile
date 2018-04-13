import React, {Component} from 'react'

import {Header, List} from 'react-native-elements'

let _ = require('lodash');

export default class SubHeader extends Component {

  render() {
    let outer = {backgroundColor: THEMES.basic.LightColor, height: 35, marginTop: 5};
    let center = {text: this.props.text, style: {color: 'white', fontSize: 16}};
    if (!this.props.rightComponent) {
      return (
        <Header
          centerComponent={center}
          outerContainerStyles={outer}/>
      )
    }
    return (
      <Header
        centerComponent={center}
        rightComponent={this.props.rightComponent}
        outerContainerStyles={outer}/>
    )
  }
}
