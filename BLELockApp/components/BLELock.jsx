
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-manager';

const BLELock = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const bleManagerRef = useRef(new BleManager());

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]).then((result) => {
        console.log('Permissions granted:', result);
      });
    }

    bleManagerRef.current.start({ showAlert: false }).then(() => {
      console.log('Bluetooth initialized');
    });

    return () => {
      bleManagerRef.current.stopScan();
    };
  }, []);

  const startScan = () => {
    setDevices([]);
    bleManagerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error during scan:', error);
        return;
      }
      if (device && device.name) {
        console.log('Found device:', device.name);
        setDevices((prevDevices) => [...prevDevices, device]);
      }
    });

    setTimeout(() => {
      bleManagerRef.current.stopDeviceScan();
      console.log('Scan stopped');
    }, 5000); // Stops scanning after 5 seconds
  };

  const connectToDevice = (device) => {
    bleManagerRef.current.connectToDevice(device.id)
      .then((device) => {
        console.log('Connected to', device.name);
        setConnectedDevice(device);
      })
      .catch((error) => {
        console.log('Connection failed:', error);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>BLE Lock</Text>
      {connectedDevice ? (
        <Text style={{ color: 'green' }}>Connected to: {connectedDevice.name}</Text>
      ) : (
        <Text style={{ color: 'red' }}>No device connected</Text>
      )}
      <Button title="Scan for Devices" onPress={startScan} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.name}</Text>
            <Button title="Connect" onPress={() => connectToDevice(item)} />
          </View>
        )}
      />
    </View>
  );
};

export default BLELock;
