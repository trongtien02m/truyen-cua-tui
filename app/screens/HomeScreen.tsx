import Explore from '@app/screens/Explore';
import MyBooks from '@app/screens/MyBooks';
import Tabs from '@app/screens/Tabs';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('MyBooks');

  const renderContent = () => {
    if (activeTab === 'MyBooks') {
      return <MyBooks />;
    } else if (activeTab === 'Explorer') {
      return <Explore />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>{renderContent()}</View>
      <View style={styles.tabs}>
        <Tabs activeTab={activeTab} changeTab={setActiveTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    padding: 0,
  },
});
