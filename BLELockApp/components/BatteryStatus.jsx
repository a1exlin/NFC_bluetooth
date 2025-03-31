import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BatteryStatus = ({ batteryLevel }) => {
    return (
        <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>Battery Level: {batteryLevel}55%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    batteryContainer: {
        backgroundColor: '#2e2e2e',
        padding: 8,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    batteryText: {
        color: '#32CD32',
        fontSize: 20,
        marginBottom: 5,
    },
});

export default BatteryStatus;
