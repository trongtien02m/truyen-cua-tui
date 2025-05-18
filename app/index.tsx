// import HomeScreen from '@app/screens/HomeScreen';
import { StyleSheet, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HomeScreen />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
