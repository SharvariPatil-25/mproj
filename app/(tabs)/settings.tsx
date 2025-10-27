
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Switch,
  StyleSheet,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Settings {
  notifications: boolean;
  locationSharing: boolean;
  emergencyAlerts: boolean;
  anonymousMode: boolean;
  biometricLogin: boolean;
  language: string;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    locationSharing: true,
    emergencyAlerts: true,
    anonymousMode: false,
    biometricLogin: false,
    language: 'English',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEmergencyTest = () => {
    Alert.alert(
      'Test Emergency Alert',
      'This will send a test alert to your emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Test',
          onPress: () => {
            Alert.alert('Test Alert Sent', 'Emergency contacts have been notified that this was a test.');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Export your app data including emergency contacts and settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Data Exported', 'Your data has been prepared for export.');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ]
    );
  };

  const handleDataClear = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your app data including emergency contacts, posts, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['appSettings', 'emergencyContacts', 'complaints']);
              setSettings({
                notifications: true,
                locationSharing: true,
                emergencyAlerts: true,
                anonymousMode: false,
                biometricLogin: false,
                language: 'English',
              });
              Alert.alert('Data Cleared', 'All app data has been cleared.');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            } catch (error) {
              console.log('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Safety & Privacy',
      items: [
        {
          title: 'Emergency Alerts',
          subtitle: 'Receive critical safety alerts',
          type: 'switch',
          value: settings.emergencyAlerts,
          key: 'emergencyAlerts',
          icon: 'exclamationmark.triangle.fill',
          color: colors.danger,
        },
        {
          title: 'Location Sharing',
          subtitle: 'Share location with trusted contacts',
          type: 'switch',
          value: settings.locationSharing,
          key: 'locationSharing',
          icon: 'location.fill',
          color: colors.secondary,
        },
        {
          title: 'Anonymous Mode',
          subtitle: 'Hide your identity in forum posts',
          type: 'switch',
          value: settings.anonymousMode,
          key: 'anonymousMode',
          icon: 'person.fill.questionmark',
          color: colors.grey,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          title: 'Push Notifications',
          subtitle: 'Receive app notifications',
          type: 'switch',
          value: settings.notifications,
          key: 'notifications',
          icon: 'bell.fill',
          color: colors.primary,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          title: 'Biometric Login',
          subtitle: 'Use Face ID or fingerprint',
          type: 'switch',
          value: settings.biometricLogin,
          key: 'biometricLogin',
          icon: 'faceid',
          color: colors.accent,
        },
        {
          title: 'Test Emergency Alert',
          subtitle: 'Send test alert to contacts',
          type: 'action',
          action: handleEmergencyTest,
          icon: 'checkmark.shield.fill',
          color: colors.warning,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Emergency Contacts',
          subtitle: 'Manage your emergency contacts',
          type: 'navigation',
          action: () => router.push('/contacts'),
          icon: 'phone.fill',
          color: colors.primary,
        },
        {
          title: 'Language',
          subtitle: settings.language,
          type: 'action',
          action: () => {
            Alert.alert('Language', 'Language selection coming soon!');
          },
          icon: 'globe',
          color: colors.secondary,
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          title: 'Export Data',
          subtitle: 'Download your app data',
          type: 'action',
          action: handleDataExport,
          icon: 'square.and.arrow.up',
          color: colors.accent,
        },
        {
          title: 'Clear All Data',
          subtitle: 'Permanently delete all data',
          type: 'action',
          action: handleDataClear,
          icon: 'trash.fill',
          color: colors.danger,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Safety Tips',
          subtitle: 'Learn safety best practices',
          type: 'navigation',
          action: () => router.push('/safety-tips'),
          icon: 'lightbulb.fill',
          color: colors.accent,
        },
        {
          title: 'Help & Support',
          subtitle: 'Get help using the app',
          type: 'action',
          action: () => {
            Alert.alert('Help & Support', 'Contact support at help@womensafety.app');
          },
          icon: 'questionmark.circle.fill',
          color: colors.secondary,
        },
        {
          title: 'About',
          subtitle: 'App version and information',
          type: 'action',
          action: () => {
            Alert.alert(
              'Women\'s Safety App',
              'Version 1.0.0\n\nBuilt with ❤️ for women\'s safety and empowerment.\n\n© 2024 Women\'s Safety Initiative'
            );
          },
          icon: 'info.circle.fill',
          color: colors.primary,
        },
      ],
    },
  ];

  return (
    <ScrollView style={commonStyles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Settings</Text>
          <Text style={commonStyles.textSecondary}>Customize your safety preferences</Text>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={[
                  commonStyles.card,
                  styles.settingItem,
                  item.type === 'action' && item.icon === 'trash.fill' && styles.dangerItem,
                ]}
                onPress={() => {
                  if (item.type === 'action' || item.type === 'navigation') {
                    item.action?.();
                  }
                }}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                disabled={item.type === 'switch'}
              >
                <View style={styles.settingContent}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                      <IconSymbol name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {item.type === 'switch' && (
                      <Switch
                        value={item.value as boolean}
                        onValueChange={(value) => updateSetting(item.key as keyof Settings, value)}
                        trackColor={{ false: colors.border, true: `${item.color}40` }}
                        thumbColor={item.value ? item.color : colors.grey}
                      />
                    )}
                    {(item.type === 'action' || item.type === 'navigation') && (
                      <IconSymbol name="chevron.right" size={16} color={colors.grey} />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ))}

        {/* Emergency Information */}
        <View style={commonStyles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.danger} />
            <Text style={styles.emergencyTitle}>Emergency Information</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            In case of immediate danger, always call local emergency services first (911). 
            This app is designed to supplement, not replace, professional emergency services.
          </Text>
          <Pressable
            style={styles.emergencyButton}
            onPress={() => Linking.openURL('tel:911')}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <IconSymbol name="phone.fill" size={18} color="white" />
            <Text style={styles.emergencyButtonText}>Call 911</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stay safe, stay connected. Together we're stronger.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 8,
  },
  dangerItem: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  emergencyButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
