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
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

interface Place {
  id: string;
  type: 'hostel' | 'hospital';
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  amenities: string[];
  safetyRating?: number;
  availability?: 'Available' | 'Full' | 'Limited';
  price?: string;
}

// --- UPDATED: Addresses cleaned up ---
const mockHostels: Place[] = [
    {
    id: 'h1',
    type: 'hostel',
    name: 'Dewan Kuldip Singh Girls Hostel',
    address: 'Behind Hilton Arcade, Evershine City, Vasai East, Maharashtra 401208',
    phone: '+919823616515',
    rating: 4.5,
    distance: '2.5 km',
    amenities: ['24/7 Security', 'Biometric Entry', 'Mess Facility', 'WiFi'],
    safetyRating: 5,
    availability: 'Available',
    price: '₹167/day',
  },
  {
    id: 'h2',
    type: 'hostel',
    name: 'Narayan Chandra Trust Hostel',
    address: 'Manvelpada Rd, near Moregaon Talav, Vasai, Virar, Maharashtra 401209',
    phone: '+918600176423',
    rating: 4.8,
    distance: '3.1 km',
    amenities: ['CCTV', 'Female Warden', 'Filtered Water', 'Laundry Service'],
    safetyRating: 5,
    availability: 'Limited',
    price: '₹217/day',
  },
  {
    id: 'h4',
    type: 'hostel',
    name: 'Asha Sadan Girls Hostel',
    address: 'Golani Naka, Vasai East, Waliv, Maharashtra 401208',
    phone: '+919822123456',
    rating: 4.7,
    distance: '1.8 km',
    amenities: ['24/7 Security', 'Female Staff', 'Recreation Room', 'Garden'],
    safetyRating: 5,
    availability: 'Full',
    price: '₹183/day',
  },
    {
    id: 'h3',
    type: 'hostel',
    name: 'Bluearrow PG Accommodation',
    address: '1st floor, Om plaza, near railway station, Nalasopara West, Maharashtra 401203',
    phone: '+918983011663',
    rating: 3.5,
    distance: '4.2 km',
    amenities: ['Lockers', 'Common Kitchen', 'Close to Station', 'WiFi'],
    safetyRating: 4,
    availability: 'Available',
    price: '₹150/day',
  },
];

const mockHospitals: Place[] = [
  {
    id: 'hp1',
    type: 'hospital',
    name: 'Golden Park Hospital',
    address: 'Golden Park, Vasai West, Maharashtra 401202',
    phone: '+912502333333',
    rating: 4.6,
    distance: '2.1 km',
    amenities: ['Multi-speciality', '24/7 Emergency', 'Pharmacy', 'ICU'],
  },
  {
    id: 'hp2',
    type: 'hospital',
    name: 'IASIS Hospital',
    address: 'Evershine City Rd, Vasai East, Maharashtra 401208',
    phone: '+919765452187',
    rating: 4.3,
    distance: '3.5 km',
    amenities: ['General Hospital', 'Pathology Lab', 'OPD Services'],
  },
  {
    id: 'hp3',
    type: 'hospital',
    name: 'Cardinal Gracias Memorial Hospital',
    address: 'Bangli, Vasai West, Maharashtra 401201',
    phone: '+912502322363',
    rating: 4.7,
    distance: '1.5 km',
    amenities: ['Charitable', 'Surgical Dept.', 'Maternity Ward'],
  },
];


export default function FindPlacesScreen(): React.FC {
  const [places, setPlaces] = useState<Place[]>([...mockHostels, ...mockHospitals]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(places);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hostels' | 'hospitals'>('all');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, categoryFilter, places]);

  const getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  // --- UPDATED: Filtering logic now includes sorting for hostels ---
  const applyFilters = (): void => {
    let filtered = [...places];

    if (searchQuery) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter === 'hostels') {
        filtered = filtered.filter(place => place.type === 'hostel');
        // Define the sort order
        const availabilityOrder = { 'Available': 1, 'Limited': 2, 'Full': 3 };
        // Sort the filtered hostels based on availability
        filtered.sort((a, b) => {
            if (a.availability && b.availability) {
                return availabilityOrder[a.availability] - availabilityOrder[b.availability];
            }
            return 0;
        });
    } else if (categoryFilter === 'hospitals') {
        filtered = filtered.filter(place => place.type === 'hospital');
    }

    setFilteredPlaces(filtered);
  };

  const handleCall = (phone: string, name: string): void => {
    Alert.alert(
      `Call ${name}`,
      `Do you want to call this number?`,
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

  const getDirections = (address: string): void => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Couldn't open maps", "Please install a maps application to get directions.");
        }
      });
  };

  const getAvailabilityColor = (availability?: string): string => {
    switch (availability) {
      case 'Available': return colors.accent;
      case 'Limited': return colors.warning;
      case 'Full': return colors.danger;
      default: return colors.grey;
    }
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconSymbol
        key={i}
        name={i < Math.round(rating) ? "star.fill" : "star"}
        size={14}
        color={i < Math.round(rating) ? colors.warning : colors.grey}
      />
    ));
  };

  const renderSafetyStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconSymbol
        key={i}
        name={i < rating ? "shield.fill" : "shield"}
        size={12}
        color={i < rating ? colors.accent : colors.grey}
      />
    ));
  };

  return (
    <View style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Safe Haven</Text>
        <Text style={commonStyles.textSecondary}>Spaces that care, comfort, and protect</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.grey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.grey}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'hostels', label: 'Hostels' },
            { key: 'hospitals', label: 'Hospitals' },
          ].map((filter) => (
            <Pressable
              key={filter.key}
              style={[
                styles.filterButton,
                categoryFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setCategoryFilter(filter.key as 'all' | 'hostels' | 'hospitals')}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text style={[ styles.filterText, categoryFilter === filter.key && styles.filterTextActive, ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.hostelsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.hostelsContent}
      >
        {filteredPlaces.map((place: Place) => (
          <View key={place.id} style={commonStyles.card}>
            <View style={styles.hostelHeader}>
              <View style={styles.hostelTitleRow}>
                <Text style={styles.hostelName}>{place.name}</Text>
                {place.type === 'hostel' && place.availability && (
                  <View style={[ styles.availabilityBadge, { backgroundColor: getAvailabilityColor(place.availability) } ]}>
                    <Text style={styles.availabilityText}>{place.availability}</Text>
                  </View>
                )}
                {place.type === 'hospital' && (
                  <View style={[ styles.availabilityBadge, { backgroundColor: colors.primary } ]}>
                    <Text style={styles.availabilityText}>Hospital</Text>
                  </View>
                )}
              </View>

              <View style={styles.ratingRow}>
                <View style={styles.rating}>
                  {renderStars(place.rating)}
                  <Text style={styles.ratingText}>{place.rating}</Text>
                </View>
                {place.type === 'hostel' && place.safetyRating && (
                  <View style={styles.safetyRating}>
                    <Text style={styles.safetyLabel}>Safety: </Text>
                    {renderSafetyStars(place.safetyRating)}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.hostelDetails}>
              <View style={styles.detailRow}>
                <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{place.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol name="km.away" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{place.distance} away</Text>
              </View>
              {place.type === 'hostel' && place.price && (
                <View style={styles.detailRow}>
                  <IconSymbol name="indianrupeesign.circle" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{place.price}</Text>
                </View>
              )}
            </View>

            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>{place.type === 'hostel' ? 'Amenities:' : 'Services:'}</Text>
              <View style={styles.amenitiesList}>
                {place.amenities.map((amenity: string, index: number) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={[styles.actionButton, styles.callButton]} onPress={() => handleCall(place.phone, place.name)}>
                <IconSymbol name="phone.fill" size={18} color="white" />
                <Text style={styles.actionButtonText}>Call</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.directionsButton]} onPress={() => getDirections(place.address)}>
                <IconSymbol name="arrow.turn.right.down" size={18} color="white" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {filteredPlaces.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="building.2.fill" size={48} color={colors.grey} />
            <Text style={styles.emptyTitle}>No Places Found</Text>
            <Text style={commonStyles.textSecondary}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    paddingBottom: 4,
  },
  filterButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  hostelsList: {
    flex: 1,
  },
  hostelsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hostelHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  hostelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  availabilityBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  safetyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  safetyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  hostelDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: colors.accent,
  },
  directionsButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
});