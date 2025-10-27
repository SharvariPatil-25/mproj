
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    console.log('Auth attempt:', { isLogin, email, name });
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isLogin && (!name || !phone)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        // Login logic
        await AsyncStorage.setItem('userLoggedIn', 'true');
        await AsyncStorage.setItem('userEmail', email);
        console.log('Login successful');
        router.replace('/onboarding');
      } else {
        // Registration logic
        const userData = {
          email,
          name,
          phone,
          registrationDate: new Date().toISOString(),
        };
        await AsyncStorage.setItem('userLoggedIn', 'true');
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('Registration successful');
        router.replace('/onboarding');
      }
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    console.log('Biometric login requested');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Biometric Login',
      'Biometric authentication would be implemented here with expo-local-authentication',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={commonStyles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <IconSymbol name="shield.fill" size={60} color={colors.primary} />
          </View>
          <Text style={styles.appTitle}>Sakhi</Text>
          <Text style={styles.appSubtitle}>Women's Safety Companion</Text>
        </View>

        {/* Auth Form */}
        <View style={commonStyles.card}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin 
              ? 'Sign in to access your safety tools' 
              : 'Join our community for enhanced safety'
            }
          </Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <IconSymbol name="person.fill" size={20} color={colors.grey} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <IconSymbol name="envelope.fill" size={20} color={colors.grey} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <IconSymbol name="phone.fill" size={20} color={colors.grey} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.grey} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <IconSymbol name="lock.fill" size={20} color={colors.grey} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          )}

          <Pressable
            style={[buttonStyles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Text>
          </Pressable>

          {isLogin && (
            <Pressable style={styles.biometricButton} onPress={handleBiometricLogin}>
              <IconSymbol name="person.crop.circle.fill" size={24} color={colors.secondary} />
              <Text style={styles.biometricText}>Use Biometric Login</Text>
            </Pressable>
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <Pressable onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Emergency Access */}
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyTitle}>Emergency Access</Text>
          <Text style={styles.emergencyText}>
            In case of emergency, you can access basic safety features without logging in
          </Text>
          <Pressable
            style={styles.emergencyButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.danger} />
            <Text style={styles.emergencyButtonText}>Emergency Mode</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height - 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  biometricText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  switchLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emergencyContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.danger,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  emergencyButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
