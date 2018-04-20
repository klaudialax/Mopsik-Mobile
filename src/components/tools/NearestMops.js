import React, {Component} from 'react'
import {ActivityIndicator, Dimensions, View} from 'react-native';

import {Badge, Button, Card, Divider, Icon, List, Text} from 'react-native-elements'

import UsageCircle from 'mopsik_mobile/src/components/tools/UsageCircle';
import SubHeader from 'mopsik_mobile/src/components/tools/SubHeader';

let _ = require('lodash');

export default class NearestMops extends Component {
  constructor(props) {
    super();
    this.state = {
      nearestMops: props.nearestMops,
      width: Dimensions.get('window').width,
      distanceWidth: 0
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      nearestMops: newProps.nearestMops
    })
  }

  changeWidth = () => {
    this.setState({width: Dimensions.get('window').width})
  };

  changeDistanceWidth = (event) => {
    this.setState({distanceWidth: event.nativeEvent.layout.width})
  };


  getCard = (mop, distance, i) => {
    return (
      <Card key={i}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Text numberOfLines={1} style={{
            fontSize: 20,
            fontWeight: 'bold',
            width: (this.state.width - this.state.distanceWidth - 70)
          }}>{mop.title.replace(/  +/g, ' ')}</Text>
          <Badge containerStyle={{backgroundColor: THEMES.basic.LightColor}} onLayout={this.changeDistanceWidth}>
            <Text style={{color: 'black', fontSize: 18}}>{distance} km</Text>
          </Badge>
        </View>
        <Divider style={{backgroundColor: THEMES.basic.LightGrey, marginTop: 10, marginBottom: 10}}/>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{
            width: (this.state.width - 70 - 155)
          }}>
            <View>
              <Text style={{marginBottom: 10, fontSize: 18}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Kierunek: </Text>
                {mop.direction}
              </Text>
              <Text style={{marginBottom: 10, fontSize: 18}}>
                <Text style={{marginTop: 5, marginBottom: 5, fontWeight: 'bold'}}>Droga: </Text>
                {mop.road_number}
              </Text>
            </View>
            <Button
              icon={
                <Icon
                  name='info-outline'
                  size={15}
                  color='white'
                />
              }
              buttonStyle={{backgroundColor: THEMES.basic.DarkColor, width: 140, marginBottom: 5}}
              title='Szczegóły'
              onPress={() => {
                this.props.navigation.navigate('MopDetails', {mop: mop, showOnMap: true})
              }}/>
          </View>
          <View style={{
            alignItems: 'center',
            width: 155,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}>
            <UsageCircle mop={mop} vehicle={SETTINGS.settings.main_vehicle}/>
            <View style={{height: 40, marginTop: 5}}>
              {FACILITIES.getFacilitiesIconsShort(mop.facilities_short)}
            </View>
          </View>
        </View>
      </Card>
    )
  };

  render() {
    let top = (
      <SubHeader text={'Najbliższe MOPy'} rightComponent={false}/>
    );
    if (!this.state.nearestMops) {
      return (
        <View>
          {top}
          <ActivityIndicator
            animating={true}
            style={{
              alignItems: 'center',
            }}
            size="large"
          />
        </View>
      )
    }

    let {nearestMops} = this.state;
    console.log(this.state.nearestMop)

    return (
      <View onLayout={this.changeWidth} style={{marginBottom: 10}}>
        {top}
        {nearestMops.map((n, i) => (
          this.getCard(n.nearest, n.distance, i)
        ))}
      </View>
    )
  }
}
