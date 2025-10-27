import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { SafetyZone } from '@/data/safetyZones';

interface SafetyInfoProps {
  zone: SafetyZone;
  distance: number;
}

export function SafetyInfoCard({ zone, distance }: SafetyInfoProps) {
  const getSafetyColor = (label: string) => {
    switch (label) {
      case 'Safe':
        return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' };
      case 'Moderate':
        return { bg: '#fefce8', border: '#fde047', text: '#854d0e' };
      case 'Unsafe':
        return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
      default:
        return { bg: '#f9fafb', border: '#e5e7eb', text: '#1f2937' };
    }
  };

  const recentIncident = zone.last_incident_date
    ? new Date(zone.last_incident_date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    : false;

  const colors = getSafetyColor(zone.safety_label);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityArea}>
            {zone.city} - {zone.area}
          </Text>
          <Text style={styles.distanceText}>{distance.toFixed(2)} km away</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <Text style={[styles.badgeText, { color: colors.text }]}>{zone.safety_label}</Text>
        </View>
      </View>

      <View style={styles.scoresGrid}>
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <IconSymbol name="shield.fill" size={14} color="#4b5563" />
            <Text style={styles.scoreLabel}>Safety</Text>
          </View>
          <Text style={styles.scoreValue}>{zone.safety_score}/10</Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <IconSymbol name="eye.fill" size={14} color="#4b5563" />
            <Text style={styles.scoreLabel}>Light</Text>
          </View>
          <Text style={styles.scoreValue}>{zone.lighting_score}/10</Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <IconSymbol name="person.3.fill" size={14} color="#4b5563" />
            <Text style={styles.scoreLabel}>Traffic</Text>
          </View>
          <Text style={styles.scoreValue}>{zone.foot_traffic_score}/10</Text>
        </View>
      </View>

      {recentIncident && zone.last_incident_date && (
        <View style={styles.incidentAlert}>
          <Text style={styles.incidentText}>
            Recent incident: {new Date(zone.last_incident_date).toLocaleDateString()}
          </Text>
        </View>
      )}

      <View style={styles.adviceContainer}>
        <Text style={styles.adviceTitle}>Safety Advice:</Text>
        <Text style={styles.adviceText}>{zone.advice}</Text>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  cityArea: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  distanceText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoresGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  incidentAlert: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  incidentText: {
    fontSize: 14,
    color: '#991b1b',
    fontWeight: '500',
  },
  adviceContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
  },
  adviceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
