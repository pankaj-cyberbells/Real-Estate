import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import PropertyCard from './PropertyCard';
import { typography } from '../../styles';
import property from "../../../assets/property.png"

const recentProperties = [
  { id: '1', name: 'Lorem House', price: '$340/month', location: 'Avenue, West Side', image: property  },
  { id: '2', name: 'Lorem House', price: '$340/month', location: 'Avenue, West Side', image: property },
  { id: '3', name: 'Lorem House', price: '$340/month', location: 'Avenue, West Side', image: property  },
];

const RecentlyViewed = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Recently Viewed</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {recentProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  title: {
    ...typography.sectionTitle,
    marginBottom: 10,
  },
});

export default RecentlyViewed;