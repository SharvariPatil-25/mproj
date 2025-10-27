
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: 'travel' | 'digital' | 'personal' | 'emergency' | 'general';
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

const safetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Share Your Location',
    content: 'Always inform trusted contacts about your whereabouts when traveling alone, especially at night. Use location sharing features on your phone.',
    category: 'travel',
    icon: 'location.fill',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Trust Your Instincts',
    content: 'If something feels wrong, it probably is. Don\'t ignore your gut feelings about people or situations. Remove yourself from uncomfortable situations immediately.',
    category: 'personal',
    icon: 'heart.fill',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Emergency Contacts Ready',
    content: 'Keep emergency numbers easily accessible. Program ICE (In Case of Emergency) contacts in your phone and consider speed dial options.',
    category: 'emergency',
    icon: 'phone.fill',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Stay Alert in Public',
    content: 'Avoid wearing headphones or being distracted by your phone when walking alone. Stay aware of your surroundings and potential exits.',
    category: 'personal',
    icon: 'eye.fill',
    priority: 'high',
  },
  {
    id: '5',
    title: 'Secure Your Digital Life',
    content: 'Use strong, unique passwords for all accounts. Enable two-factor authentication and be cautious about sharing personal information online.',
    category: 'digital',
    icon: 'lock.fill',
    priority: 'medium',
  },
  {
    id: '6',
    title: 'Plan Your Route',
    content: 'Research your destination beforehand. Know the safest routes, public transportation options, and identify safe places like police stations or hospitals.',
    category: 'travel',
    icon: 'map.fill',
    priority: 'medium',
  },
  {
    id: '7',
    title: 'Carry Safety Items',
    content: 'Consider carrying a whistle, personal alarm, or pepper spray (where legal). Keep your phone charged and carry a portable charger.',
    category: 'personal',
    icon: 'shield.fill',
    priority: 'medium',
  },
  {
    id: '8',
    title: 'Hotel Safety',
    content: 'When staying in hotels or hostels, verify staff identity before opening doors. Use door locks and security chains. Don\'t share room details with strangers.',
    category: 'travel',
    icon: 'building.2.fill',
    priority: 'medium',
  },
  {
    id: '9',
    title: 'Social Media Privacy',
    content: 'Avoid posting real-time locations or travel plans on social media. Review privacy settings regularly and be selective about friend requests.',
    category: 'digital',
    icon: 'person.2.fill',
    priority: 'medium',
  },
  {
    id: '10',
    title: 'Learn Basic Self-Defense',
    content: 'Consider taking a self-defense class. Learn basic techniques to break free from grabs and create opportunities to escape.',
    category: 'personal',
    icon: 'figure.martial.arts',
    priority: 'low',
  },
  {
    id: '11',
    title: 'Emergency Meeting Points',
    content: 'Establish meeting points with friends and family in case of emergencies. Have backup communication methods if phones don\'t work.',
    category: 'emergency',
    icon: 'mappin.and.ellipse',
    priority: 'medium',
  },
  {
    id: '12',
    title: 'Document Important Information',
    content: 'Keep copies of important documents (ID, passport, insurance) in separate locations. Store digital copies securely in the cloud.',
    category: 'general',
    icon: 'doc.fill',
    priority: 'low',
  },
];

export default function SafetyTipsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Tips', icon: 'list.bullet', color: colors.primary },
    { key: 'travel', label: 'Travel', icon: 'airplane', color: colors.secondary },
    { key: 'personal', label: 'Personal', icon: 'person.fill', color: colors.accent },
    { key: 'digital', label: 'Digital', icon: 'wifi', color: colors.warning },
    { key: 'emergency', label: 'Emergency', icon: 'exclamationmark.triangle.fill', color: colors.danger },
    { key: 'general', label: 'General', icon: 'info.circle.fill', color: colors.grey },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.accent;
      default:
        return colors.grey;
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.color || colors.primary;
  };

  const filteredTips = selectedCategory === 'all' 
    ? safetyTips 
    : safetyTips.filter(tip => tip.category === selectedCategory);

  const toggleTipExpansion = (tipId: string) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView style={commonStyles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Safety Tips & Resources</Text>
          <Text style={commonStyles.textSecondary}>
            Essential knowledge for staying safe and secure
          </Text>
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <Pressable
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && [
                  styles.categoryButtonActive,
                  { backgroundColor: category.color }
                ],
              ]}
              onPress={() => setSelectedCategory(category.key)}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <IconSymbol 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.key ? 'white' : category.color} 
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Safety Tips List */}
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip) => (
            <Pressable
              key={tip.id}
              style={[
                commonStyles.card,
                styles.tipCard,
                { borderLeftColor: getPriorityColor(tip.priority) },
              ]}
              onPress={() => toggleTipExpansion(tip.id)}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipLeft}>
                  <View 
                    style={[
                      styles.tipIcon, 
                      { backgroundColor: `${getCategoryColor(tip.category)}20` }
                    ]}
                  >
                    <IconSymbol 
                      name={tip.icon} 
                      size={20} 
                      color={getCategoryColor(tip.category)} 
                    />
                  </View>
                  <View style={styles.tipTitleContainer}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <View style={styles.tipMeta}>
                      <View 
                        style={[
                          styles.priorityBadge, 
                          { backgroundColor: getPriorityColor(tip.priority) }
                        ]}
                      >
                        <Text style={styles.priorityText}>{tip.priority}</Text>
                      </View>
                      <Text style={styles.categoryLabel}>{tip.category}</Text>
                    </View>
                  </View>
                </View>
                <IconSymbol 
                  name={expandedTip === tip.id ? "chevron.up" : "chevron.down"} 
                  size={16} 
                  color={colors.grey} 
                />
              </View>
              
              {expandedTip === tip.id && (
                <View style={styles.tipContent}>
                  <Text style={styles.tipText}>{tip.content}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Emergency Resources */}
        <View style={commonStyles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.danger} />
            <Text style={styles.emergencyTitle}>Emergency Resources</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Remember: In immediate danger, always call emergency services first.
          </Text>
          <View style={styles.emergencyNumbers}>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Emergency Services:</Text>
              <Text style={styles.emergencyNumber}>911</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Women's Helpline:</Text>
              <Text style={styles.emergencyNumber}>1091</Text>
            </View>
            <View style={styles.emergencyItem}>
              <Text style={styles.emergencyLabel}>Domestic Violence:</Text>
              <Text style={styles.emergencyNumber}>1-800-799-7233</Text>
            </View>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={commonStyles.safetyCard}>
          <View style={styles.resourcesHeader}>
            <IconSymbol name="book.fill" size={24} color={colors.accent} />
            <Text style={styles.resourcesTitle}>Additional Resources</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            • Self-defense classes in your area{'\n'}
            • Women's safety apps and tools{'\n'}
            • Local support groups and organizations{'\n'}
            • Legal aid and counseling services{'\n'}
            • Safety equipment and personal alarms
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stay informed, stay prepared, stay safe. Knowledge is your best defense.
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
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  categoryTextActive: {
    color: 'white',
  },
  tipsContainer: {
    marginBottom: 30,
  },
  tipCard: {
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitleContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  categoryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  tipContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
  emergencyNumbers: {
    marginTop: 16,
  },
  emergencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emergencyLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
