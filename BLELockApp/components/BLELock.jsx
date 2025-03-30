import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

// buffer package provides the Buffer class for environments where it is not avaible natively, assigning this, it will be accesible in this application
global.Buffer = global.Buffer || Buffer;

// Initialize the BLE manager globally
const bleManager = new BleManager();

const BLELock = () => {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        // Request Bluetooth permissions on Android
        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ])
                .then((result) => {
                    console.log('Permissions granted:', result);
                })
                .catch((error) => {
                    console.error('Permissions error:', error);
                });
        }

        // Initialize Bluetooth manager
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

        // Stop scanning after 5 seconds
        setTimeout(() => {
            bleManager.stopDeviceScan();
            console.log('Scan stopped');
        }, 5000);

        return () => {
            bleManager.stopDeviceScan();
            bleManager.destroy();
        };
    }, []);

    // Connect to a device
    const connectToDevice = async (device) => {
        try {
            const connected = await bleManager.connectToDevice(device.id);
            console.log("Connected to", connected.name);
            setConnectedDevice(connected);

            // Discover services and characteristics
            await connected.discoverAllServicesAndCharacteristics();
            console.log("Services discovered");

            // Subscribe to characteristic for NFC data
            const characteristicUUID = "your_characteristic_uuid"; // Replace with actual UUID
            connected.monitorCharacteristicForService(
                "your_service_uuid",
                characteristicUUID,
                (error, characteristic) => {
                    if (error) {
                        console.log("Error reading data:", error);
                        return;
                    }
                    console.log("Received NFC Data:", characteristic?.value);
                }
            );
        } catch (error) {
            console.log("Connection failed:", error);
        }
    };


    // Lock or Unlock the Bluetooth NFC Lock
    const toggleLock = async () => {
        if (!connectedDevice) {
            Alert.alert('Error', 'No device connected');
            return;
        }

        try {
            const serviceUUID = '0000180f-0000-1000-8000-00805f9b34fb';
            const characteristicUUID = '00002a39-0000-1000-8000-00805f9b34fb';

            // Use the correct command based on lock state
            const command = isLocked ? 'U' : 'L'; // 'U' for Unlock, 'L' for Lock
            const commandBuffer = new TextEncoder().encode(command); // Encoding the command

            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                Buffer.from(commandBuffer).toString('base64')
            );

            setIsLocked(!isLocked);
            Alert.alert('Success', `Device ${isLocked ? 'unlocked' : 'locked'}`);
        } catch (error) {
            console.error('Toggle failed:', error);
            Alert.alert('Error', 'Failed to send lock/unlock command');
        }
    };


    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>BLE NFC Lock</Text>
            {connectedDevice ? (
                <View>
                    <Text style={{ color: 'green' }}>Connected to: {connectedDevice.name}</Text>
                    <Button
                        title={isLocked ? 'Unlock' : 'Lock'}
                        color={isLocked ? 'red' : 'green'}
                        onPress={() => toggleLock(isLocked ? 'UNLOCK' : 'LOCK')}
                    />
                    <Button
                        title="Disconnect"
                        color="orange"
                        onPress={() => {
                            bleManager.cancelDeviceConnection(connectedDevice.id);
                            setConnectedDevice(null);
                        }}
                        style={{ marginTop: 10 }}
                    />
                </View>
            ) : (
                <>
                    <Text style={{ color: 'red' }}>No device connected</Text>
                    <Button title="Scan for Devices" onPress={() => bleManager.startDeviceScan(null, null, (error, device) => {
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
                    })} />
                </>
            )}
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, marginVertical: 5, backgroundColor: '#eee' }}>
                        <Text>{item.name}</Text>
                        <Button title="Connect" onPress={() => connectToDevice(item)} />
                    </View>
                )}
            />
        </View>
    );
};

export default BLELock;
