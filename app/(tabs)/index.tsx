import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Vibration,
  Linking,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

const primarySOSNumber = '919324159899';

const registeredEmergencyContacts = [
  { name: 'Mom', number: '919324159899' },    
  { name: 'Sister', number: '918828395565' },    
];

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('Getting location...');
  const [sosPressed, setSosPressed] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const formattedAddress = [
          addr.street,
          addr.city,
          addr.region,
          addr.postalCode,
        ]
          .filter(Boolean)
          .join(', ');
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.log('Error getting location:', error);
      setAddress('Unable to get location');
    }
  };

  const toDMS = (deg: number, isLng: boolean): string => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);

    const direction = isLng ? (deg >= 0 ? 'E' : 'W') : (deg >= 0 ? 'N' : 'S');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const handleSOSPress = async () => {
    setSosPressed(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Vibration.vibrate([0, 500, 200, 500]);

    Alert.alert(
      'Emergency Alert',
      `This will open WhatsApp to send your location to your primary contact and then let you call emergency services (112). Are you sure?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setSosPressed(false) },
        { text: 'Send Alert via WhatsApp', style: 'destructive', onPress: sendEmergencyAlert },
      ]
    );
  };

  const sendEmergencyAlert = async () => {
    if (!location) {
        Alert.alert('Location not ready', 'Cannot send alert without location.');
        setSosPressed(false);
        return;
    }
    
    const latDMS = toDMS(location.coords.latitude, false);
    const lonDMS = toDMS(location.coords.longitude, true);
    // --- CORRECTED: Removed the typo '$2' from the URL ---
    const message = `⚠️ CRITICAL ALERT — I NEED HELP IMMEDIATELY !!!

Please don't ignore this. I'm in trouble and sharing my live location.

📍 Address: ${address}
📌 Coordinates: ${latDMS}, ${lonDMS}
🗺️ Live Location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;

    const url = `whatsapp://send?phone=${primarySOSNumber}&text=${encodeURIComponent(message)}`;

    try {
        await Linking.openURL(url);
        Alert.alert(
            'WhatsApp Opened',
            'Press send in WhatsApp. You can then call emergency services.',
            [{ text: 'OK', onPress: () => {
                setSosPressed(false);
                Linking.openURL(`tel:112`);
            }}]
        );
    } catch (error) {
        Alert.alert('Error', 'Could not open WhatsApp. Please make sure it is installed.');
        setSosPressed(false);
    }
  };

  const sendWhatsAppMessage = async (contactNumber: string, message: string) => {
    const url = `whatsapp://send?phone=${contactNumber}&text=${encodeURIComponent(message)}`;
    try {
        await Linking.openURL(url);
    } catch (error) {
        Alert.alert('Error', 'Could not open WhatsApp. Please make sure it is installed.');
    }
  };
  
  const quickActions = [
    {
      title: 'Call Police',
      icon: 'shield.fill',
      color: colors.danger,
      action: () => Linking.openURL('tel:112'),
    },
    {
      title: 'Share Location',
      icon: 'location.fill',
      color: colors.secondary,
      action: async () => {
        if (!location) {
            Alert.alert('Location not ready', 'Please wait for the location to update.');
            return;
        }

        const latDMS = toDMS(location.coords.latitude, false);
        const lonDMS = toDMS(location.coords.longitude, true);
        const message = `Location Share

I'm sharing my current location with you.

📍 Address: ${address}
📌 Coordinates: ${latDMS}, ${lonDMS}
🗺️ Live Location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;


        if (registeredEmergencyContacts.length === 0) {
            Alert.alert('No Contacts', 'Please register at least one emergency contact in the contacts section.');
            return;
        }

        if (registeredEmergencyContacts.length === 1) {
            sendWhatsAppMessage(registeredEmergencyContacts[0].number, message);
            return;
        }

        const alertButtons = registeredEmergencyContacts.map(contact => ({
            text: contact.name,
            onPress: () => sendWhatsAppMessage(contact.number, message)
        }));

        alertButtons.push({ text: 'Cancel', style: 'cancel' });

        Alert.alert('Share Location via WhatsApp', 'Choose a contact to send your location to:', alertButtons);
      },
    },
    {
      title: 'Emergency Contacts',
      icon: 'phone.fill',
      color: colors.primary,
      action: () => router.push('/contacts'),
    },
    {
      title: 'Nearby Hostels',
      icon: 'building.2.fill',
      color: colors.accent,
      action: () => router.push('/hostels'),
    },
  ];

  return (
    <ScrollView style={commonStyles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Women's Safety</Text>
          <Text style={commonStyles.textSecondary}>Stay safe, stay connected</Text>
        </View>

        <View style={styles.sosContainer}>
          <Pressable
            style={[buttonStyles.sosButton, sosPressed && styles.sosPressed]}
            onPress={handleSOSPress}
            onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <IconSymbol name="exclamationmark.triangle.fill" size={40} color="white" />
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
          <Text style={styles.sosDescription}>
            Press for emergency alert
          </Text>
        </View>

        <View style={commonStyles.card}>
          <View style={styles.locationHeader}>
            <IconSymbol name="location.fill" size={24} color={colors.secondary} />
            <Text style={styles.locationTitle}>Current Location</Text>
          </View>
          <Text style={commonStyles.textSecondary}>{address}</Text>
          <Pressable style={styles.refreshButton} onPress={getCurrentLocation}>
            <IconSymbol name="arrow.clockwise" size={16} color={colors.secondary} />
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={commonStyles.subtitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                style={[styles.quickActionButton, { borderColor: action.color }]}
                onPress={action.action}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <IconSymbol name={action.icon as any} size={32} color={action.color} />
                <Text style={[styles.quickActionText, { color: action.color }]}>
                  {action.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={commonStyles.safetyCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol name="lightbulb.fill" size={24} color={colors.accent} />
            <Text style={styles.tipsTitle}>Safety Tip of the Day</Text>
          </View>
          <Text style={commonStyles.text}>
            Always inform someone you trust about your whereabouts when traveling alone.
          </Text>
          <Pressable
            style={styles.viewMoreButton}
            onPress={() => router.push('/(tabs)/forum')}
          >
            <Text style={styles.viewMoreText}>View More Tips</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.primary} />
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
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sosPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  sosText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  sosDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  refreshText: {
    color: colors.secondary,
    fontSize: 14,
    marginLeft: 4,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionButton: {
    width: (width - 60) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});