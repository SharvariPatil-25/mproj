export interface SafetyZone {
  id: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  safety_label: 'Safe' | 'Moderate' | 'Unsafe';
  safety_score: number;
  crime_rate: number;
  lighting_score: number;
  foot_traffic_score: number;
  nearest_police_station: string;
  police_station_distance: number;
  last_incident_date: string | null;
  advice: string;
}

export const safetyZonesData: SafetyZone[] = [
  {
    id: '1',
    city: 'Delhi',
    area: 'Connaught Place',
    latitude: 28.6315,
    longitude: 77.2167,
    safety_label: 'Safe',
    safety_score: 8.5,
    crime_rate: 2.1,
    lighting_score: 9,
    foot_traffic_score: 10,
    nearest_police_station: 'Connaught Place Police Station',
    police_station_distance: 0.5,
    last_incident_date: '2024-01-15',
    advice: 'Well-lit area with heavy foot traffic. Safe during day and night. Police presence is strong.'
  },
  {
    id: '2',
    city: 'Delhi',
    area: 'Hauz Khas Village',
    latitude: 28.5494,
    longitude: 77.1932,
    safety_label: 'Moderate',
    safety_score: 6.5,
    crime_rate: 4.3,
    lighting_score: 6,
    foot_traffic_score: 7,
    nearest_police_station: 'Hauz Khas Police Station',
    police_station_distance: 1.2,
    last_incident_date: null,
    advice: 'Popular nightlife area. Be cautious after 11 PM. Travel in groups and use well-lit paths.'
  },
  {
    id: '3',
    city: 'Delhi',
    area: 'Mehrauli Archaeological Park',
    latitude: 28.5245,
    longitude: 77.1855,
    safety_label: 'Unsafe',
    safety_score: 3.5,
    crime_rate: 8.7,
    lighting_score: 3,
    foot_traffic_score: 2,
    nearest_police_station: 'Mehrauli Police Station',
    police_station_distance: 2.5,
    last_incident_date: '2024-09-20',
    advice: 'Avoid after sunset. Poor lighting and isolated. If visiting, go in groups and inform someone.'
  },
  {
    id: '4',
    city: 'Mumbai',
    area: 'Marine Drive',
    latitude: 18.9432,
    longitude: 72.8236,
    safety_label: 'Safe',
    safety_score: 9.0,
    crime_rate: 1.5,
    lighting_score: 10,
    foot_traffic_score: 9,
    nearest_police_station: 'Marine Drive Police Station',
    police_station_distance: 0.3,
    last_incident_date: '2023-12-05',
    advice: 'Very safe area with constant police patrolling. Popular walking spot any time of day.'
  },
  {
    id: '5',
    city: 'Mumbai',
    area: 'Colaba Causeway',
    latitude: 18.9067,
    longitude: 72.8147,
    safety_label: 'Safe',
    safety_score: 8.0,
    crime_rate: 2.5,
    lighting_score: 8,
    foot_traffic_score: 10,
    nearest_police_station: 'Colaba Police Station',
    police_station_distance: 0.4,
    last_incident_date: '2024-02-10',
    advice: 'Busy shopping area. Generally safe but watch for pickpockets in crowded areas.'
  },
  {
    id: '6',
    city: 'Mumbai',
    area: 'Sanjay Gandhi National Park',
    latitude: 19.2183,
    longitude: 72.9081,
    safety_label: 'Unsafe',
    safety_score: 4.0,
    crime_rate: 7.2,
    lighting_score: 2,
    foot_traffic_score: 3,
    nearest_police_station: 'Borivali Police Station',
    police_station_distance: 3.5,
    last_incident_date: '2024-08-15',
    advice: 'Forest area with wildlife. Avoid isolated trails. Visit only during daylight in groups.'
  },
  {
    id: '7',
    city: 'Bangalore',
    area: 'MG Road',
    latitude: 12.9716,
    longitude: 77.5946,
    safety_label: 'Safe',
    safety_score: 8.5,
    crime_rate: 2.0,
    lighting_score: 9,
    foot_traffic_score: 10,
    nearest_police_station: 'Ashok Nagar Police Station',
    police_station_distance: 0.6,
    last_incident_date: '2024-03-01',
    advice: 'Central business district. Very safe with good lighting and police presence.'
  },
  {
    id: '8',
    city: 'Bangalore',
    area: 'Cubbon Park',
    latitude: 12.9762,
    longitude: 77.5929,
    safety_label: 'Moderate',
    safety_score: 7.0,
    crime_rate: 3.5,
    lighting_score: 6,
    foot_traffic_score: 8,
    nearest_police_station: 'Cubbon Park Police Station',
    police_station_distance: 0.2,
    last_incident_date: '2024-06-20',
    advice: 'Public park. Safe during early morning and evening. Avoid isolated areas after dark.'
  },
  {
    id: '9',
    city: 'Pune',
    area: 'FC Road',
    latitude: 18.5203,
    longitude: 73.8567,
    safety_label: 'Safe',
    safety_score: 8.0,
    crime_rate: 2.3,
    lighting_score: 8,
    foot_traffic_score: 9,
    nearest_police_station: 'Deccan Gymkhana Police Station',
    police_station_distance: 0.8,
    last_incident_date: '2024-04-12',
    advice: 'Student area with shops and cafes. Generally safe with good crowd presence.'
  },
  {
    id: '10',
    city: 'Pune',
    area: 'Katraj',
    latitude: 18.4481,
    longitude: 73.8629,
    safety_label: 'Unsafe',
    safety_score: 4.5,
    crime_rate: 6.8,
    lighting_score: 4,
    foot_traffic_score: 4,
    nearest_police_station: 'Bharati Vidyapeeth Police Station',
    police_station_distance: 2.0,
    last_incident_date: '2024-09-05',
    advice: 'Less developed area. Poor street lighting. Use main roads and avoid late hours.'
  },
  {
    id: '11',
    city: 'Chennai',
    area: 'Marina Beach',
    latitude: 13.0499,
    longitude: 80.2824,
    safety_label: 'Moderate',
    safety_score: 7.0,
    crime_rate: 3.8,
    lighting_score: 7,
    foot_traffic_score: 9,
    nearest_police_station: 'Marina Police Station',
    police_station_distance: 0.5,
    last_incident_date: '2024-07-08',
    advice: 'Popular beach. Safe during day but be cautious after 9 PM. Stay in well-lit areas.'
  },
  {
    id: '12',
    city: 'Hyderabad',
    area: 'Hitech City',
    latitude: 17.4435,
    longitude: 78.3772,
    safety_label: 'Safe',
    safety_score: 8.5,
    crime_rate: 1.8,
    lighting_score: 9,
    foot_traffic_score: 9,
    nearest_police_station: 'Hitech City Police Station',
    police_station_distance: 0.4,
    last_incident_date: '2024-01-28',
    advice: 'IT hub with excellent infrastructure. Very safe with 24/7 security presence.'
  },
  {
    id: '13',
    city: 'Kolkata',
    area: 'Park Street',
    latitude: 22.5535,
    longitude: 88.3527,
    safety_label: 'Safe',
    safety_score: 8.0,
    crime_rate: 2.5,
    lighting_score: 8,
    foot_traffic_score: 10,
    nearest_police_station: 'Park Street Police Station',
    police_station_distance: 0.3,
    last_incident_date: '2024-02-15',
    advice: 'Commercial hub. Safe with heavy police patrolling. Popular for shopping and dining.'
  },
  {
    id: '14',
    city: 'Jaipur',
    area: 'City Palace',
    latitude: 26.9260,
    longitude: 75.8237,
    safety_label: 'Safe',
    safety_score: 7.5,
    crime_rate: 2.8,
    lighting_score: 7,
    foot_traffic_score: 8,
    nearest_police_station: 'M.I. Road Police Station',
    police_station_distance: 0.7,
    last_incident_date: '2024-03-20',
    advice: 'Tourist area with security. Be aware of scams. Keep valuables secure.'
  },
  {
    id: '15',
    city: 'Ahmedabad',
    area: 'Sabarmati Riverfront',
    latitude: 23.0349,
    longitude: 72.5594,
    safety_label: 'Safe',
    safety_score: 8.0,
    crime_rate: 2.2,
    lighting_score: 9,
    foot_traffic_score: 8,
    nearest_police_station: 'Ellis Bridge Police Station',
    police_station_distance: 1.0,
    last_incident_date: '2024-05-01',
    advice: 'Well-maintained public space. Safe for evening walks with good lighting.'
  }
];

export function findNearestSafetyZone(lat: number, lon: number): SafetyZone | null {
  if (safetyZonesData.length === 0) return null;

  let nearest = safetyZonesData[0];
  let minDistance = calculateDistance(lat, lon, nearest.latitude, nearest.longitude);

  for (const zone of safetyZonesData) {
    const distance = calculateDistance(lat, lon, zone.latitude, zone.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = zone;
    }
  }

  return nearest;
}

export function findSafetyZonesByCity(city: string): SafetyZone[] {
  return safetyZonesData.filter(
    zone => zone.city.toLowerCase() === city.toLowerCase()
  );
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
