import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleProceed = () => {
    if (otp.join('').length === 6) {
      // Validate OTP here
      setError('The OTP you entered is incorrect, please check again or resend it now.');
    } else {
      setError('Please enter the 6 digit verification code.');
    }
  };

  const handleResend = () => {
    // Implement resend logic here
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Please Enter the 6 digit verification code.</Text>
      </View>
      <View style={styles.bottomcontainer}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(ref) => inputRefs.current[index] = ref}
          />
        ))}
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend Now</Text></Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#4285F4',
    // padding: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bottomcontainer:{
 padding:25
  },
  otpInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    textAlign: 'center',
    fontSize: 24,
    // color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  resendText: {
    
    marginBottom: 20,
  },
  resendLink: {
    textDecorationLine: 'underline',
    color: '#4285F4',
  },
  proceedButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    marginBottom: 30,
    backgroundColor: '#4a90e2',
    height: 200,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    padding: 20,
  },
});

export default OTPScreen;