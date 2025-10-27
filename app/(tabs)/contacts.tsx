
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const defaultEmergencyNumbers = [
  { name: 'Police', phone: '100', icon: 'shield.fill', color: colors.danger },
  { name: 'Fire Department', phone: '101', icon: 'flame.fill', color: colors.warning },
  { name: 'Hospital Emergency', phone: '102', icon: 'cross.fill', color: colors.accent },
  { name: 'Women Helpline', phone: '1091', icon: 'person.2.fill', color: colors.primary },
];

export default function ContactsScreen() {
  const [personalContacts, setPersonalContacts] = useState<EmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  useEffect(() => {
    loadPersonalContacts();
  }, []);

  const loadPersonalContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('emergencyContacts');
      if (contacts) {
        setPersonalContacts(JSON.parse(contacts));
      }
    } catch (error) {
      console.log('Error loading contacts:', error);
    }
  };

  const savePersonalContacts = async (contacts: EmergencyContact[]) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));
      setPersonalContacts(contacts);
    } catch (error) {
      console.log('Error saving contacts:', error);
    }
  };

  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      'Call Emergency Contact',
      `Do you want to call ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Linking.openURL(`tel:${phone}`);
          },
        },
      ]
    );
  };

  const addPersonalContact = () => {
    if (!newContact.name || !newContact.phone) {
      Alert.alert('Error', 'Please fill in name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship || 'Contact',
    };

    const updatedContacts = [...personalContacts, contact];
    savePersonalContacts(updatedContacts);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddForm(false);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removePersonalContact = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = personalContacts.filter(contact => contact.id !== id);
            savePersonalContacts(updatedContacts);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={commonStyles.wrapper} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Emergency Contacts</Text>
          <Text style={commonStyles.textSecondary}>Quick access to help when you need it</Text>
        </View>

        {/* Emergency Services */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Emergency Services</Text>
          {defaultEmergencyNumbers.map((service, index) => (
            <Pressable
              key={index}
              style={[commonStyles.emergencyCard, { borderLeftColor: service.color }]}
              onPress={() => handleCall(service.phone, service.name)}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <IconSymbol name ={service.icon} size={24} color={service.color} />
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{service.name}</Text>
                    <Text style={styles.contactPhone}>{service.phone}</Text>
                  </View>
                </View>
                <IconSymbol name="phone.fill" size={20} color={service.color} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Personal Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Personal Contacts</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <IconSymbol 
                name={showAddForm ? "xmark" : "plus"} 
                size={20} 
                color={colors.primary} 
              />
            </Pressable>
          </View>

          {/* Add Contact Form */}
          {showAddForm && (
            <View style={commonStyles.card}>
              <Text style={styles.formTitle}>Add Emergency Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                placeholderTextColor={colors.grey}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor={colors.grey}
              />
              <TextInput
                style={styles.input}
                placeholder="Relationship (optional)"
                value={newContact.relationship}
                onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
                placeholderTextColor={colors.grey}
              />
              <Pressable style={styles.saveButton} onPress={addPersonalContact}>
                <Text style={styles.saveButtonText}>Add Contact</Text>
              </Pressable>
            </View>
          )}

          {/* Personal Contacts List */}
          {personalContacts.length === 0 && !showAddForm ? (
            <View style={commonStyles.card}>
              <Text style={styles.emptyText}>No personal emergency contacts added yet.</Text>
              <Text style={commonStyles.textSecondary}>
                Add trusted contacts who can help you in emergencies.
              </Text>
            </View>
          ) : (
            personalContacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={[commonStyles.card, styles.personalContactCard]}
                onPress={() => handleCall(contact.phone, contact.name)}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <View style={styles.contactRow}>
                  <View style={styles.contactInfo}>
                    <IconSymbol name="person.fill" size={24} color={colors.primary} />
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                      <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                    </View>
                  </View>
                  <View style={styles.contactActions}>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleCall(contact.phone, contact.name)}
                    >
                      <IconSymbol name="phone.fill" size={18} color={colors.accent} />
                    </Pressable>
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => removePersonalContact(contact.id)}
                    >
                      <IconSymbol name="trash.fill" size={18} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Safety Tips */}
        <View style={commonStyles.safetyCard}>
          <View style={styles.tipsHeader}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.accent} />
            <Text style={styles.tipsTitle}>Contact Safety Tips</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            • Keep your emergency contacts updated{'\n'}
            • Share your location with trusted contacts{'\n'}
            • Test emergency numbers periodically{'\n'}
            • Add contacts from different locations
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  contactRelationship: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  personalContactCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
});
