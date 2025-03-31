import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View, Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import BatteryStatus from './components/BatteryStatus';

import BLELock from './components/BLELock';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // Ensures full screen usage
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
    
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          NFC Bluetooth Lock
        </Text>
        <BatteryStatus batteryLevel={BatteryStatus}/>
        <BatteryStatus batteryLevel={BatteryStatus}/>
        <BatteryStatus batteryLevel={BatteryStatus}/>
        <BLELock />
    
      </View>
    </SafeAreaView>
  );
}

export default App;
