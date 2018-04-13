import {StyleSheet} from 'react-native';

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
  container_map: {
    flex: 1,
    backgroundColor: '#f5fcff',
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
