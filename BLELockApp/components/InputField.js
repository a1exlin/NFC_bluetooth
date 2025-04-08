// components/InputField.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const InputField = ({ placeholder, secureTextEntry }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#555"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#E0F7FA',
        borderRadius: 5,
        width: '80%',
        alignSelf: 'center'
    },
    input: {
        fontSize: 16,
        color: '#333'
    }
});

export default InputField;
