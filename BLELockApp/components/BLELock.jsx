import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// Initialize the BLE manager globally
const bleManager = new BleManager();

const BLELock = () => {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        // Request Bluetooth permissions on Android
        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]).then((result) => {
                console.log('Permissions granted:', result);
            }).catch((error) => {
                console.error('Permissions error:', error);
            });
        }

        // No need to explicitly call bleManager.start()
        console.log('BLE Manager initialized');

        return () => {
            bleManager.stopDeviceScan();
            bleManager.destroy();
        };
    }, []);

    // Start scanning for devices
    const startScan = () => {
        setDevices([]);
        console.log('Starting device scan...');
        
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log('Error during scan:', error);
                return;
            }

            if (device && device.name) {
                console.log('Found device:', device.name);
                setDevices((prevDevices) => {
                    const exists = prevDevices.some((d) => d.id === device.id);
                    if (!exists) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            }
        });

        setTimeout(() => {
            bleManager.stopDeviceScan();
            console.log('Scan stopped');
        }, 5000);
    };

    // Connect to a device
    const connectToDevice = async (device) => {
        try {
            const connected = await bleManager.connectToDevice(device.id);
            console.log('Connected to:', connected.name);
            setConnectedDevice(connected);
            Alert.alert('Success', `Connected to ${connected.name}`);
        } catch (error) {
            console.log('Connection failed:', error);
            Alert.alert('Error', 'Connection failed');
        }
    };

    // Toggle Lock/Unlock the Bluetooth NFC Lock
    const toggleLock = async () => {
        if (!connectedDevice) {
            Alert.alert('Error', 'No device connected');
            return;
        }

        try {
            const characteristicUUID = '00002a39-0000-1000-8000-00805f9b34fb'; // Example UUID for writing
            const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb'; // Example Service UUID

            const command = isLocked ? 'UNLOCK' : 'LOCK';
            const commandBuffer = Buffer.from(command).toString('base64');

            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                commandBuffer
            );

            setIsLocked(!isLocked);
            Alert.alert('Success', `Lock ${isLocked ? 'unlocked' : 'locked'}`);
        } catch (error) {
            console.error('Toggle failed:', error);
            Alert.alert('Error', 'Failed to send lock/unlock command');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>BLE NFC Lock</Text>
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
                ListEmptyComponent={<Text>No devices found. Please scan.</Text>}
            />
            {connectedDevice && (
                <View style={{ marginTop: 20 }}>
                    <Button 
                        title={isLocked ? "Unlock" : "Lock"} 
                        onPress={toggleLock} 
                        color={isLocked ? "red" : "green"} 
                    />
                </View>
            )}
        </View>
    );
};

export default BLELock;
