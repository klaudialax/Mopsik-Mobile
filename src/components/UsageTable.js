import React, {Component} from 'react';
import {
  View,
  AsyncStorage,
  ScrollView,
  StyleSheet
} from 'react-native';


import {Text, Icon, Badge} from 'react-native-elements';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

import {VEHICLES, vehiclesCodes} from 'mopsik_mobile/src/config/vehicles';

MOPS = require('mopsik_mobile/src/config/mops');

export default class UsageTable extends Component {

  /*
   * creates row and appends it to tableRow_
   * for each type of vehicle that is to be displayed in MopDetails
     creates a cell with content determined by function fun
   */
  createRow = (tableRow_, fun) => {
    const tableRow = tableRow_;
    for (v of vehiclesCodes){
      if (MOPS.settings.vehicles_selected[v]) {
        tableRow.push(fun(v));
      }
    }
    return tableRow;
  }

  /* Name of vehicle and icon */
  createHeader = (vehicle) => {
    return (
      <View>
          <Icon name={vehicle.icon} color={THEMES.basic.LightColor}/>
          <Text style={{textAlign: 'center'}}>{vehicle.name}</Text>
      </View>
    )
  }

  createHeaderRow = () => {
    return this.createRow(['Typ pojazdu'], (v) => this.createHeader(VEHICLES[v]));
  }

  createUsage = (vehicle) => {
    let {mop} = this.props;
    return (
      <Badge
        value={mop.usage[vehicle] + '%'}
        textStyle={{ color: mop.color[vehicle].text, fontSize: 20 }}
        containerStyle={{ backgroundColor: mop.color[vehicle].background}}
      />
    )
  }

  createUsageRow = () => {
    return this.createRow([], (v) => this.createUsage(v));
  }

  createFree = (vehicle) => {
    let {mop} = this.props;
    return (
      <Text style={{textAlign: 'center', fontSize: 20}}>{mop.available[vehicle] - mop.taken[vehicle]}</Text>
    )
  }

  createFreeRow = () => {
    return this.createRow([], (v) => this.createFree(v));
  }

  createTaken = (vehicle) => {
    let {mop} = this.props;
    return (
      <Text style={{textAlign: 'center', fontSize: 20}}>{mop.taken[vehicle]}</Text>
    )
  }

  createTakenRow = () => {
    return this.createRow([], (v) => this.createTaken(v));
  }


  createOverall = (vehicle) => {
    let {mop} = this.props;
    return (
      <Text style={{textAlign: 'center', fontSize: 20}}>{mop.available[vehicle]}</Text>
    )
  }

  createOverallRow = () => {
    return this.createRow([], (v) => this.createOverall(v));
  }

  createTableData = () => {
    return [this.createUsageRow(), this.createFreeRow(), this.createTakenRow(), this.createOverallRow()]
  }

  render() {
    const tableHead = this.createHeaderRow();
    const tableTitle = ['Zapełnienie', 'Wolne miejsca', 'Zajęte miejsca', 'Całkowita liczba miejsc'];
    const tableData = this.createTableData();
    if (tableHead.length == 1){
      return(
        <Text style={{textAlign: 'center'}}>Nie wybrano żadnego typu pojazdu do wyświetlania. Możesz to zrobić w ustawieniach.</Text>
      )
    }
    return (
      <View>
        <Table borderStyle={{borderWidth: 0.5, borderColor: THEMES.basic.LightGrey}}>
          <Row data={tableHead} flexArr={new Array(tableHead.length).fill(1)} style={styles_.head} textStyle={styles_.text}/>
          <TableWrapper style={{flexDirection: 'row'}}>
            <Col data={tableTitle} style={styles_.title} heightArr={[40,40,40,40]} textStyle={styles_.text}/>
            <Rows data={tableData} flexArr={new Array(tableHead.length - 1).fill(1)} style={styles_.row} heightArr={[40,40,40,40]}/>
          </TableWrapper>
        </Table>
      </View>
    )
  }
}

const styles_ = StyleSheet.create({
  head: { height: 50, backgroundColor: '#f1f8ff' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 40 },
  text: { textAlign: 'center', fontSize: 15 }
})
