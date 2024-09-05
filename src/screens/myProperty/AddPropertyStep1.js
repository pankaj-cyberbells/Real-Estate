import React, { useState ,useEffect, useRef} from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme , Image, FlatList } from 'react-native';
import { lightTheme, darkTheme } from '../../components/common/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomDropdown from '../../components/common/CustomDropdown';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {request, PERMISSIONS} from 'react-native-permissions';
import * as Yup from 'yup';
import CustomInputAddress from '../../components/common/CustomInputAddress';


const validationSchema = Yup.object().shape({
  title: Yup.string().required('Property Title is required'),
  fullAddress: Yup.string().required('Full Address is required'),
  bedrooms: Yup.string().required('Number of Bedrooms is required'),
  bathrooms: Yup.string().required('Number of Bathrooms is required'),
  squareFeet: Yup.number().positive('Square feet must be a positive number').required('Square feet is required'),
  price: Yup.number().positive('Price must be a positive number').required('Price is required'),
  description: Yup.string().required('Description is required'),
  images: Yup.array().min(2, 'At least 2 images are required').required('Images are required'),
  // Add other field validations as needed
});

export default function AddPropertyStep1({ route, navigation }) {
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef(null);
  const [scrollToError, setScrollToError] = useState(false);
  const inputRefs = useRef({});
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const { propertyToEdit } = route.params || {};
  // console.log({propertyToEdit})
  const [fieldPositions, setFieldPositions] = useState({});
  const isEditing = !!propertyToEdit;
  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
      );
      if (result === 'granted') {
        console.log('Camera permission granted');
        openCamera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };
  const [images, setImages] = useState([]);
  const [isImagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [isImagePreviewModalVisible, setImagePreviewModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    fullAddress: '',
    city: '',
    state: '',
    country:'',
    zipCode:'',
    coordinates:[null,null],
    bedrooms: '1',
    bathrooms: '1',
    floorNumber: 'Ground Floor',
    squareFeet: null,
    category: '1BHK',
    furnishedType: 'Fully Furnished',
    price: null,
    brokerage: 'Brokerage estimation',
    preferredTenant: 'All',
    parking: '0',
    nextAvailableDate: new Date(),
    description: '',
    images: [],
    
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
console.log(Object.keys(errors)[0],"erororroro")

useEffect(() => {
  if (route.params?.selectedAddress) {
    setFormData(prevState => ({
      ...prevState,
      ...route.params.selectedAddress,
      coordinates: route.params.selectedAddress.coordinates || [null, null],
    }));
  }
}, [route.params?.selectedAddress]);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: propertyToEdit.title || '',
        fullAddress: propertyToEdit.location?.address || '',
        bedrooms: propertyToEdit.bedrooms?.toString() || '1',
        bathrooms: propertyToEdit.bathrooms?.toString() || '1',
        floorNumber: propertyToEdit.floorNumber || 'Ground Floor',
        squareFeet: propertyToEdit.squareFeet?.toString() || '',
        category: propertyToEdit.category || '2BHK',
        furnishedType: propertyToEdit.furnishedType || 'Fully Furnished',
        price: propertyToEdit.price?.toString() || '',
        brokerage: propertyToEdit.brokerage || 'Brokerage estimation',
        preferredTenant: propertyToEdit.preferredTenant || 'All',
        parking: propertyToEdit.parking?.toString() || '0',
        nextAvailableDate: new Date(propertyToEdit.nextAvailableDate) || new Date(),
        description: propertyToEdit.description || '',
        images: images || [],
      });
    }
  }, [isEditing, propertyToEdit]);


  
  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
    // setTouchedFields(prevState => ({ ...prevState, [name]: true }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: undefined })); // Clear error for this field
  };
  
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (yupError) {
      const newErrors = {};
      yupError.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  
  const updateFieldPosition = (name, layout) => {
    setFieldPositions(prev => ({
      ...prev,
      [name]: layout.y
    }));
  };
  
  
 
const handleNext = async () => {
  const isValid = await validateForm();

  if (isValid) {
    const serializedFormData = {
      ...formData,
      nextAvailableDate: formData.nextAvailableDate.toISOString(), // Convert Date to string
    };
    navigation.navigate('AddPropertyScreen2', {
      formData: serializedFormData,
      isEditing,
      propertyId: propertyToEdit?._id,
    });
  } else {
    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      // Add your validation errors here
    }));

    // Trigger the scroll after updating the errors
    setScrollToError(true);
  }
};
 
 // useEffect to handle scrolling after errors state is updated
useEffect(() => {
  if (scrollToError) {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField && fieldPositions[firstErrorField] !== undefined) {
      scrollViewRef.current?.scrollTo({
        y: fieldPositions[firstErrorField] - 50, // 50px offset
        animated: true,
      });
    }
    // Reset the scroll trigger state
    setScrollToError(false);
  }
}, [scrollToError, errors, fieldPositions]);

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      saveToPhotos: true,
      
      cameraType: 'back',
      quality: 0.7,
      includeExtra: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else if (response.assets) {
        
        const newImages = response.assets.map(asset => {
          if (asset.base64) {
            const mimeType = asset.type || 'image/jpeg';
           
            return `data:${mimeType};base64,${asset.base64}`;
          } else {
            return asset.uri;
          }
        });
        setImages(prevImages => [...prevImages, ...newImages].slice(0, 10));
        handleChange('images', [...images, ...newImages].slice(0, 10));
      }
    });
  };
  // console.log(formData)

  const pickImage = (useCamera) => {
    if (useCamera) {
      requestCameraPermission();
    } else {
    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      selectionLimit: 10,
      includeBase64: true,
    };

    const imagePicker = useCamera ? launchCamera : launchImageLibrary;

    imagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        console.log(response.assets)
        const newImages = response.assets.map(asset => {
          if (asset.base64) {
            const mimeType = asset.type || 'image/jpeg';
           
            return `data:${mimeType};base64,${asset.base64}`;
          } else {
            return asset.uri;
          }
        });
        setImages(prevImages => [...prevImages, ...newImages].slice(0, 10));
        handleChange('images', [...images, ...newImages].slice(0, 10));
      }
    });
  }
    setImagePickerModalVisible(false);
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedImage(item);
      setImagePreviewModalVisible(true);
    }}>
      <Image source={{ uri: item }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  const renderErrorMessage = () => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{firstError}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView 
    ref={scrollViewRef}
    style={[styles.container, { backgroundColor: theme.colors.background }]}
    contentContainerStyle={styles.contentContainer}
  >
      <View style={styles.imagePickerButtons}>
      <TouchableOpacity
        style={[styles.imageUploader, { borderColor: theme.colors.secondary }]}
        onPress={() => setImagePickerModalVisible(true)}
      >
        <Text style={[styles.uploaderText, { color: theme.colors.text }]}>Upload Property Images</Text>
      </TouchableOpacity>
</View>

      {images.length > 0 && (
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.imageList}
        />
      )}

      <CustomInput
        label="Property Title"
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.secondary}
        error={errors.title}
        // ref={(ref) => (inputRefs.current.title = ref)}
        onLayout={(event) => updateFieldPosition('title', event.nativeEvent.layout)}
      />
      <CustomInputAddress
        label="Full Address"
        value={formData.fullAddress}
        onChangeText={(value) => handleChange('fullAddress', value)}
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.secondary}
        error={errors.fullAddress}
        // ref={(ref) => (inputRefs.current.fullAddress = ref)}
        onLayout={(event) => updateFieldPosition('fullAddress', event.nativeEvent.layout)}
      />

      <View style={styles.row}>
        <CustomDropdown
          label="No of Bedrooms"
          value={formData.bedrooms}
          onValueChange={(value) => handleChange('bedrooms', value)}
          items={['1', '2', '3', '4', '5+']}
          containerStyle={[styles.halfWidth, { borderColor: theme.colors.secondary }]}
          textStyle={{ color: theme.colors.text }}
        />
        <CustomDropdown
          label="No of Bathrooms"
          value={formData.bathrooms}
          onValueChange={(value) => handleChange('bathrooms', value)}
          items={['1', '2', '3', '4', '5']}
          containerStyle={[styles.halfWidth, { borderColor: theme.colors.secondary }]}
          textStyle={{ color: theme.colors.text }}
        />
      </View>

      <CustomDropdown
        label="Floor number"
        value={formData.floorNumber}
        onValueChange={(value) => handleChange('floorNumber', value)}
        items={['Ground Floor', '1', '2', '3', '4', '5']}
        containerStyle={{ borderColor: theme.colors.secondary }}
        textStyle={{ color: theme.colors.text }}
      />

      <CustomInput
        label="Square feet"
        value={formData.squareFeet}
        onChangeText={(value) => handleChange('squareFeet', value)}
        keyboardType="numeric"
        placeholder="Enter sq ft"
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.secondary}
        error={errors.squareFeet}
        // ref={(ref) => (inputRefs.current.squareFeet = ref)}
        onLayout={(event) => updateFieldPosition('squareFeet', event.nativeEvent.layout)}
      />

<CustomDropdown
  label="Category"
  value={formData.category}
  onValueChange={(value) => handleChange('category', value)}
  items={[
    '1BHK', 
    '2BHK', 
    '3BHK', 
    '4BHK', 
    '5BHK+', 
    'Single Room', 
    'Double Room', 
    'Shared Room', 
    'Office Space', 
    'Shop', 
    'Warehouse', 
    'Showroom'
  ]}
  // containerStyle={{ borderColor: theme.colors.secondary }}
  textStyle={{ color: theme.colors.text }}
/>

      <CustomDropdown
        label="Furnished Type"
        value={formData.furnishedType}
        onValueChange={(value) => handleChange('furnishedType', value)}
        items={['Fully Furnished', 'Semi-Furnished', 'Unfurnished']}
        containerStyle={{ borderColor: theme.colors.secondary }}
        textStyle={{ color: theme.colors.text }}
      />

      <CustomInput
        label="Price"
        value={formData.price}
        onChangeText={(value) => handleChange('price', value)}
        keyboardType="numeric"
        placeholder="Price estimation"
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.secondary}
        error={errors.price}
        // ref={(ref) => (inputRefs.current.price = ref)}
        onLayout={(event) => updateFieldPosition('price', event.nativeEvent.layout)}
      />

      <View style={styles.row}>
        <CustomDropdown
          label="Brokerage"
          value={formData.brokerage}
          onValueChange={(value) => handleChange('brokerage', value)}
          items={['Brokerage estimation', 'Fixed']}
          containerStyle={[styles.threeQuartersWidth, { borderColor: theme.colors.secondary }]}
          textStyle={{ color: theme.colors.text }}
        />
        <CustomDropdown
          label=""
          value="fix"
          onValueChange={() => {}}
          items={['fix']}
          containerStyle={[styles.quarterWidth, { borderColor: theme.colors.secondary }]}
          textStyle={{ color: theme.colors.text }}
        />
      </View>

      <CustomDropdown
        label="Preferred Tenant"
        value={formData.preferredTenant}
        onValueChange={(value) => handleChange('preferredTenant', value)}
        items={['All', 'Family', 'Bachelor', 'Company']}
        containerStyle={{ borderColor: theme.colors.secondary }}
        textStyle={{ color: theme.colors.text }}
      />

      <CustomDropdown
        label="Parking"
        value={formData.parking}
        onValueChange={(value) => handleChange('parking', value)}
        items={['0', '1', '2', '3', '4', '5+']}
        containerStyle={{ borderColor: theme.colors.secondary }}
        textStyle={{ color: theme.colors.text }}
      />

      <CustomDatePicker
        label="Next Available Date"
        value={formData.nextAvailableDate}
        onChange={(value) => handleChange('nextAvailableDate', value)}
        containerStyle={{ borderColor: theme.colors.secondary }}
        textStyle={{ color: theme.colors.text }}
      />

      <CustomInput
        label="Description"
        value={formData.description}
        onChangeText={(value) => handleChange('description', value)}
        multiline
        numberOfLines={4}
        placeholder="Short Description of the Property"
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.secondary}
        error={errors.description}
        // ref={(ref) => (inputRefs.current.description = ref)}
        onLayout={(event) => updateFieldPosition('description', event.nativeEvent.layout)}
      />
 {renderErrorMessage()}
<TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <Modal isVisible={isImagePickerModalVisible} onBackdropPress={() => setImagePickerModalVisible(false)}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(true)}>
            <Icon name="camera-alt" size={24} color={theme.colors.text} />
            <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => pickImage(false)}>
            <Icon name="photo-library" size={24} color={theme.colors.text} />
            <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isImagePreviewModalVisible} onBackdropPress={() => setImagePreviewModalVisible(false)}>
        <View style={styles.modalContent}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageUploader: {
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploaderText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  threeQuartersWidth: {
    width: '48%',
  },
  quarterWidth: {
    width: '48%',
  },
  button: {
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // imageList: {
  //   marginBottom: 16,
  // },
  // thumbnail: {
  //   width: 80,
  //   height: 80,
  //   marginRight: 8,
  //   borderRadius: 4,
  // },
  // modalContent: {
  //   backgroundColor: 'white',
  //   padding: 22,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 4,
  //   borderColor: 'rgba(0, 0, 0, 0.1)',
  // },
  imageList: {
    marginBottom: 16,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 4,
  },
  modalContent: {
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 18,
    marginLeft: 15,
  },
  fullImage: {
    width: '100%',
    height: 300,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#d32f2f',
  },
});
