// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, FlatList, PermissionsAndroid, Platform, Alert, StyleSheet } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';

// // buffer package provides the Buffer class for environments where it is not available natively
// global.Buffer = global.Buffer || Buffer;

// // Initialize the BLE manager globally
// const bleManager = new BleManager();

// const BLELock = () => {
//    const [devices, setDevices] = useState([]);
//    const [connectedDevice, setConnectedDevice] = useState(null);
//    const [isLocked, setIsLocked] = useState(false);


//    useEffect(() => {
//        // Request Bluetooth permissions on Android
//        if (Platform.OS === 'android') {
//            PermissionsAndroid.requestMultiple([
//                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//            ])
//                .then((result) => {
//                    console.log('Permissions granted:', result);
//                })
//                .catch((error) => {
//                    console.error('Permissions error:', error);
//                });
//        }

//        return () => {
//            bleManager.stopDeviceScan();
//            bleManager.destroy();
//        };
//    }, []);

//    const startScan = () => {
//        setDevices([]);
//        bleManager.startDeviceScan(null, null, (error, device) => {
//            if (error) {
//                console.log('Error during scan:', error);
//                return;
//            }

//            if (device && device.name) {
//                console.log('Found device:', device.name);
//                setDevices((prevDevices) => {
//                    const exists = prevDevices.some((d) => d.id === device.id);
//                    if (!exists) {
//                        return [...prevDevices, device];
//                    }
//                    return prevDevices;
//                });
//            }
//        });


//        setTimeout(() => {
//            bleManager.stopDeviceScan();
//            console.log('Scan stopped');
//        }, 5000);
//    };

//    const connectToDevice = async (device) => {
//        try {
//            console.log("Attempting to connect to", device.name);
//            const connected = await bleManager.connectToDevice(device.id, { autoConnect: true });
//            console.log("Connected to", connected.name);
//            setConnectedDevice(connected);

//            await connected.discoverAllServicesAndCharacteristics();
//            console.log("Services and characteristics discovered");
//        } catch (error) {
//            console.log("Connection failed:", error);
//        }
//    };


//    return (
//        <View style={styles.container}>
//            <Text style={styles.header}>ChargeVault</Text>
//            {connectedDevice ? (
//                <View style={styles.connectedContainer}>
//                    <Text style={styles.connectedText}>Connected to: {connectedDevice.name}</Text>
//                    <TouchableOpacity style={styles.lockButton} onPress={() => setIsLocked(!isLocked)}>
//                        <Text style={styles.buttonText}>{isLocked ? 'Unlock' : 'Lock'}</Text>
//                    </TouchableOpacity>
//                    <TouchableOpacity style={styles.disconnectButton} onPress={() => {
//                        bleManager.cancelDeviceConnection(connectedDevice.id);
//                        setConnectedDevice(null);
//                    }}>
//                        <Text style={styles.buttonText}>Disconnect</Text>
//                    </TouchableOpacity>
//                </View>
//            ) : (
//                <>
//                    <Text style={styles.noDeviceText}>No device connected</Text>
//                    <TouchableOpacity style={styles.scanButton} onPress={startScan}>
//                        <Text style={styles.scanButtonText}>Scan for Devices</Text>
//                    </TouchableOpacity>
//                </>
//            )}
//            <FlatList
//                data={devices}
//                keyExtractor={(item) => item.id}
//                renderItem={({ item }) => (
//                    <TouchableOpacity style={styles.deviceButton} onPress={() => connectToDevice(item)}>
//                        <Text style={styles.deviceText}>{item.name}</Text>
//                        <Text style={styles.connectText}>Connect</Text>
//                    </TouchableOpacity>
//                )}
//            />
//        </View>
//    );
// };


// const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        backgroundColor: 'black',
//        padding: 20,
//        borderRadius: 5,
//    },
//    header: {
//        fontSize: 28,
//        color: '#fff',
//        fontWeight: 'bold',
//        marginBottom: 10,
//        textAlign: 'center',
//    },
//    scanButton: {
//        backgroundColor: '#4682B4',
//        padding: 15,
//        marginVertical: 10,
//        borderRadius: 5,
//        alignItems: 'center',
//    },
//    scanButtonText: {
//        color: '#fff',
//        fontSize: 18,
//        fontWeight: 'bold',
//    },
//    deviceButton: {
//        backgroundColor: '#32CD32',
//        padding: 20,
//        marginVertical: 5,
//        borderRadius: 8,
//        alignItems: 'center',
//        borderWidth: 2,
//        borderColor: '#fff',
//    },
//    deviceText: {
//        color: '#fff',
//        fontSize: 20,
//    },
//    connectText: {
//        color: '#000',
//        textAlign: 'center',
//        fontWeight: 'bold',
//    },
//    connectedText: {
//        color: '#32CD32',
//        fontSize: 20,
//        marginBottom: 10,
//        textAlign: 'center',
//    },
//    lockButton: {
//        backgroundColor: '#228B22',
//        padding: 15,
//        marginVertical: 5,
//        borderRadius: 8,
//        alignItems: 'center',
//    },
//    disconnectButton: {
//        backgroundColor: '#FF6347',
//        padding: 15,
//        marginVertical: 5,
//        borderRadius: 8,
//        alignItems: 'center',
//    },
//    buttonText: {
//        color: '#fff',
//        fontSize: 18,
//    },
//    noDeviceText: {
//        color: '#FF6347',
//        fontSize: 18,
//        marginBottom: 10,
//        textAlign: 'center',
//    },
// });


// export default BLELock;



