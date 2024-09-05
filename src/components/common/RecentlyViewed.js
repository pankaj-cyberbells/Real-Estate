import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import PropertyCard from './PropertyCard';
import { colors, typography } from '../../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentViewed } from '../../features/viewedPropertySlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecentlyViewed = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { viewedProperties, loading, error } = useSelector((state) => state.viewedProperties);

  const viewedProperty = viewedProperties.map(item => {
    // Extract latitude and longitude from coordinates if available
    const [latitude = null, longitude = null] = item.property.location?.coordinates || [];
  
    return {
      id: item.property.id,
      image: item.property.mainImage || null,
      rating: item.property.rating || 0,
      title: item.property.title,
      location: item.property.location?.address || 'Location not available',
      latitude: latitude, // Extracted latitude
      longitude: longitude, // Extracted longitude
      area: item.property.squareFeet || 0,
      description: item.property.description || "No description about the property",
      features: item.property.features || [],
      baths: item.property.bathrooms || 0,
      bedrooms: item.property.bedrooms || 0,
      price: item.property.price || 0,
      type: item.property.type || 'Not specified',
      images: item.property.images || [],
      reviews: item.property.reviews || [],
      category: item.property.category || "NA",
      furnishedType: item.property.furnishedType || "null",
      isGatedSociety: item.property.gatedSociety || false,
      isPetFriendly: item.property.petFriendly || false,
      preferredTenant: item.property.preferredTenant || 'Any',
      availableDate: item.property.nextAvailableDate || null, // Use null if not provided
      updatedDate: item.property.updatedAt || null, // Use null if not provided
      agentId: item.property.agentId,
      viewedAt: item.viewedAt
    };
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchProperties = async () => {
        const userData = await AsyncStorage.getItem('user');
        const parsedData = JSON.parse(userData);
        const userId = parsedData?._id;
        if (userId) {
          dispatch(fetchRecentViewed(userId));
        } else {
          console.log('User ID is null');
        }
      };

      fetchProperties();
    }, [dispatch])
  );
  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     const userData = await AsyncStorage.getItem('user');
  //     const parsedData = JSON.parse(userData);
  //     const userId = parsedData?._id;
  //     if (userId) {
  //       dispatch(fetchRecentViewed(userId));
        
  //     } else {
  //       console.log('User ID is null');
  //     }
  //   };

  //   fetchProperties();
  // }, [dispatch]);

  const handlePropertyPress = (property) => {
    navigation.navigate('ApartmentScreen', { listing: property });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Viewed</Text>
      {viewedProperty.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {viewedProperty.map((property, index) => (
            <TouchableOpacity key={property.id} onPress={() => handlePropertyPress(property)}>
              <PropertyCard key={property.id} property={property} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noPropertiesContainer}>
           <Icon name="visibility-off" size={48} color={colors.textLight} />
          <Text style={styles.noPropertiesText}>You have not viewed any properties yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  title: {
    ...typography.sectionTitle,
    marginBottom: 10,
    color: "black"
  },
  noPropertiesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  noPropertiesText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RecentlyViewed;
