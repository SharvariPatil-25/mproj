import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { SafetyZone } from '@/data/safetyZones';

interface EmergencyPanelProps {
  nearestZone: SafetyZone | null;
  onCallEmergency: (number: string) => void;
  onShowMap: () => void;
}

export function EmergencyPanel({ nearestZone, onCallEmergency, onShowMap }: EmergencyPanelProps) {
  const emergencyNumbers = [
    { name: 'Police', number: '100' },
    { name: 'Emergency', number: '112' },
    { name: "Women's Helpline", number: '181' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="exclamationmark.triangle.fill" size={18} color="#ef4444" />
        <Text style={styles.title}>Emergency</Text>
      </View>

      <View style={styles.buttonsGrid}>
        {emergencyNumbers.map((item) => (
          <Pressable
            key={item.number}
            onPress={() => onCallEmergency(item.number)}
            style={({ pressed }) => [
              styles.emergencyButton,
              pressed && styles.emergencyButtonPressed
            ]}
          >
            <IconSymbol name="phone.fill" size={24} color="#dc2626" />
            <Text style={styles.buttonName}>{item.name}</Text>
            <Text style={styles.buttonNumber}>{item.number}</Text>
          </Pressable>
        ))}
      </View>

      {nearestZone && (
        <View style={styles.policeInfo}>
          <View style={styles.policeHeader}>
            <IconSymbol name="mappin.circle.fill" size={18} color="#2563eb" />
            <View style={styles.policeTextContainer}>
              <Text style={styles.policeTitle}>Nearest Police Station</Text>
              <Text style={styles.policeName}>{nearestZone.nearest_police_station}</Text>
              <Text style={styles.policeDistance}>
                {nearestZone.police_station_distance.toFixed(1)} km away
              </Text>
              <Pressable onPress={onShowMap}>
                <Text style={styles.mapLink}>Show on map →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  buttonsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  emergencyButton: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  emergencyButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  buttonName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  buttonNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  policeInfo: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
  },
  policeHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  policeTextContainer: {
    flex: 1,
  },
  policeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  policeName: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  policeDistance: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  mapLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
    marginTop: 8,
  },
});
