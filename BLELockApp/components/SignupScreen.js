// screens/SignupScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from './InputField';

const SignupScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <InputField placeholder="Username" />
            <InputField placeholder="Email" />
            <InputField placeholder="Password" secureTextEntry />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F2FD'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#1976D2',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    linkText: {
        marginTop: 10,
        color: '#1565C0'
    }
});

export default SignupScreen;
