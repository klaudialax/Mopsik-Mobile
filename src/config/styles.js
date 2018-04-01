import {
  StyleSheet,
  Dimensions
} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    backgroundColor: THEMES.basic.LightGrey,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  mainWhite: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: THEMES.basic.White
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8
  },
  container_map: {
    flex: 1,
    backgroundColor: '#f5fcff',
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
