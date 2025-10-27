
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Emergency SOS',
    description: 'Quick access to emergency services and instant alerts to your trusted contacts',
    icon: 'exclamationmark.triangle.fill',
    color: colors.danger,
    features: [
      'One-tap SOS button with haptic feedback',
      'Automatic location sharing with emergency contacts',
      'Direct calling to emergency services',
      'Silent alert mode for discreet help'
    ]
  },
  {
    id: 2,
    title: 'Safety Contacts',
    description: 'Manage your emergency contacts and access quick-dial numbers',
    icon: 'phone.fill',
    color: colors.secondary,
    features: [
      'Store trusted emergency contacts',
      'Quick-dial police, hospitals, fire department',
      'Add personal emergency contacts',
      'One-tap calling with location sharing'
    ]
  },
  {
    id: 3,
    title: 'Nearby Hostels',
    description: 'Find verified women-friendly hostels and accommodations near you',
    icon: 'building.2.fill',
    color: colors.accent,
    features: [
      'Map view of verified hostels',
      'Safety ratings and reviews',
      'Contact info and availability',
      'Filter by distance and amenities'
    ]
  },
  {
    id: 4,
    title: 'Community Forum',
    description: 'Connect with other women, share experiences, and file complaints',
    icon: 'bubble.left.and.bubble.right.fill',
    color: colors.primary,
    features: [
      'Discuss safety concerns and experiences',
      'File complaints to authorities',
      'Anonymous posting options',
      'Moderated community discussions'
    ]
  },
  {
    id: 5,
    title: 'Safety Tips & Resources',
    description: 'Access curated safety tips, self-defense guides, and educational content',
    icon: 'lightbulb.fill',
    color: colors.warning,
    features: [
      'Daily safety tips and reminders',
      'Self-defense techniques and guides',
      'Digital security best practices',
      'Travel safety recommendations'
    ]
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      console.log('Onboarding completed');
      router.replace('/(tabs)');
    }
  };

  const handlePrevious = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    console.log('Onboarding skipped');
    router.replace('/(tabs)');
  };

  const step = onboardingSteps[currentStep];

  return (
    <View style={commonStyles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <IconSymbol name="shield.fill" size={40} color={colors.primary} />
          <Text style={styles.appName}>SafeGuard</Text>
        </View>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index <= currentStep ? step.color : colors.border,
                width: index === currentStep ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${step.color}20` }]}>
            <IconSymbol name={step.icon} size={80} color={step.color} />
          </View>

          {/* Title and Description */}
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Key Features:</Text>
            {step.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={step.color} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Learn More Button */}
          <Pressable
            style={[styles.learnMoreButton, { borderColor: step.color }]}
            onPress={() => setShowFeatureModal(true)}
          >
            <Text style={[styles.learnMoreText, { color: step.color }]}>
              Learn More About This Feature
            </Text>
            <IconSymbol name="chevron.right" size={16} color={step.color} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <Pressable
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <IconSymbol 
            name="chevron.left" 
            size={20} 
            color={currentStep === 0 ? colors.grey : colors.text} 
          />
          <Text style={[
            styles.navButtonText,
            currentStep === 0 && styles.navButtonTextDisabled
          ]}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          style={[buttonStyles.primaryButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <IconSymbol name="chevron.right" size={20} color="white" />
        </Pressable>
      </View>

      {/* Feature Detail Modal */}
      <Modal
        visible={showFeatureModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{step.title}</Text>
            <Pressable onPress={() => setShowFeatureModal(false)}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: `${step.color}20` }]}>
              <IconSymbol name={step.icon} size={60} color={step.color} />
            </View>
            
            <Text style={styles.modalDescription}>{step.description}</Text>
            
            <View style={styles.modalFeaturesContainer}>
              <Text style={styles.modalFeaturesTitle}>Detailed Features:</Text>
              {step.features.map((feature, index) => (
                <View key={index} style={styles.modalFeatureItem}>
                  <View style={[styles.featureBullet, { backgroundColor: step.color }]} />
                  <Text style={styles.modalFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          
          <Pressable
            style={[buttonStyles.primaryButton, { margin: 20 }]}
            onPress={() => setShowFeatureModal(false)}
          >
            <Text style={styles.nextButtonText}>Got It!</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  skipText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  navButtonTextDisabled: {
    color: colors.grey,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 30,
  },
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  modalFeaturesContainer: {
    marginBottom: 30,
  },
  modalFeaturesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  modalFeatureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
