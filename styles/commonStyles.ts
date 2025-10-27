
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#FF69B4',      // Pink for women's safety theme
  secondary: '#007AFF',    // Blue for trust and reliability
  accent: '#34C759',       // Green for safety/success
  danger: '#FF3B30',       // Red for emergency/SOS
  warning: '#FF9500',      // Orange for warnings
  background: '#F8F8F8',   // Light background
  backgroundAlt: '#FFFFFF', // White background
  text: '#333333',         // Dark text for readability
  textSecondary: '#666666', // Secondary text
  grey: '#8E8E93',         // Grey for inactive elements
  card: '#FFFFFF',         // White card background
  border: '#E5E5EA',       // Light border
  shadow: 'rgba(0, 0, 0, 0.1)', // Shadow color
};

export const buttonStyles = StyleSheet.create({
  sosButton: {
    backgroundColor: colors.danger,
    borderRadius: 50,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  emergencyButton: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 4,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emergencyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 2,
  },
  safetyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 2,
  },
  tabBar: {
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  largeIcon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
});
