import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../screens/search/SearchScreen';
import CollectionScreen from '../../screens/collection/CollectionScreen';
import MyPropertyScreen from '../../screens/myProperty/MyPropertyScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RenterProfile from '../../screens/profile/RenterProfile';
import ApartmentScreen from '../../screens/myProperty/ApartmentScreen';
import AddPropertyStep1 from '../../screens/myProperty/AddPropertyStep1';
import AddPropertyStep2 from '../../screens/myProperty/AddPropertyStep2';
import SearchProperties from '../../screens/search/SearchProperties';
import { logoutUser } from '../../features/authSlice';
import AddressSearchScreen from '../../screens/myProperty/AddressSearchScreen';

const Tab = createBottomTabNavigator();

const SearchStack = createStackNavigator();
const CollectionStack = createStackNavigator();
const MyPropertyStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const CustomHeader = ({navigation, title}) => (
  <>
    <StatusBar backgroundColor="#4a90e2" barStyle="light-content" />
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
       
      </View>
      
    </View>
  </>
);

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="Searchstack"
      component={SearchScreen}
      options={({navigation}) => ({
        header: () => <CustomHeader navigation={navigation} title="Home" />,
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      })}
    />
    <SearchStack.Screen
      name="Searchproperties"
      component={SearchProperties}
      options={{
        headerTitle: 'Search Properties',
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      }}
    />
  </SearchStack.Navigator>
);

const CollectionStackScreen = () => (
  <CollectionStack.Navigator>
    <CollectionStack.Screen
      name="Collectionstack"
      component={CollectionScreen}
      options={({navigation}) => ({
        header: () => (
          <CustomHeader navigation={navigation} title="Collection" />
        ),
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      })}
    />
  </CollectionStack.Navigator>
);

const MyPropertyStackScreen = () => (
  <MyPropertyStack.Navigator>
    <MyPropertyStack.Screen
      name="MyPropertystack"
      component={MyPropertyScreen}
      options={({navigation}) => ({
        header: () => (
          <CustomHeader navigation={navigation} title="My Property" />
        ),
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      })}
    />
    <MyPropertyStack.Screen
      name="ApartmentScreen"
      component={ApartmentScreen}
      options={{
        headerTitle: 'Description',
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      }}
    />
    <MyPropertyStack.Screen
      name="AddPropertyScreen"
      component={AddPropertyStep1}
      options={{
        headerTitle: 'ADD PROPERTY',
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      }}
    />
    <MyPropertyStack.Screen
      name="AddPropertyScreen2"
      component={AddPropertyStep2}
      options={{
        headerTitle: 'ADD PROPERTY',
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      }}
    />
     <MyPropertyStack.Screen
      name="AddressScreen"
      component={AddressSearchScreen}
      options={{
        headerTitle: 'Add Address',
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      }}
    />
  </MyPropertyStack.Navigator>
);

const NotificationStackScreen = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen
      name="Notificationstack"
      component={NotificationScreen}
      options={({navigation}) => ({
        header: () => (
          <CustomHeader navigation={navigation} title="Notification" />
        ),
        headerStyle: {backgroundColor: '#4a90e2'},
        headerTintColor: 'white',
      })}
    />
  </NotificationStack.Navigator>
);

const ProfileStackScreen = () => {
 

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profilestack"
        component={ProfileScreen}
        options={({navigation}) => ({
          header: () => <CustomHeader navigation={navigation} title="Profile" />,
          headerStyle: {backgroundColor: '#4a90e2'},
          headerTintColor: 'white',
        })}
      />
      <ProfileStack.Screen
        name="RenterProfile"
        component={RenterProfile}
        options={{
          headerTitle: 'Renter Profile',
          headerStyle: {backgroundColor: '#4a90e2'},
          headerTintColor: 'white',
        }}
      />
    </ProfileStack.Navigator>
  );
};

const TabNavigator = () => {
  // const dispatch = useDispatch();

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'MyPropertystack';
    if (routeName === 'ApartmentScreen') {
      return false;
    }
    return true;
  };
  const getTabBarVisibility2 = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profilestack';
    if (routeName === 'RenterProfile') {
      return false;
    }
    return true;
  };

  // const logoutHandler = () => {
  //   dispatch(logout());
  // };

  return (
    <Tab.Navigator
      // tabBarOptions={{
      //   activeTintColor: '#4a90e2',
      //   inactiveTintColor: 'gray',
      // }}
      >
      {/* <Tab.Screen
        name="Home"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
  name="Home"
  component={SearchStackScreen}
  options={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
      <Icon name="home" size={size} color={color} />
    ),
    tabBarStyle: ((route) => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? 'Searchstack';
      if (routeName === 'Searchproperties') {
        return { display: 'none' };
      }
      return;
    })(route),
  })}
/>
      {/* <Tab.Screen
        name="Collection"
        component={CollectionStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="bookmark-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="MyProperty"
        component={MyPropertyStackScreen}
        options={({route}) => ({
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="business-outline" size={size} color={color} />
          ),
          tabBarStyle: (route => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? 'MyPropertystack';
            if (
              routeName === 'ApartmentScreen' ||
              routeName === 'AddPropertyScreen' ||
              routeName === 'AddPropertyScreen2'||
              routeName === 'AddressScreen'
            ) {
              return {display: 'none'};
            }
            return;
          })(route),
          tabBarVisible: getTabBarVisibility(route),
        })}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
  name="Profile"
  component={ProfileStackScreen}
  options={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
      <Icon name="person-outline" size={size} color={color} />
    ),
    tabBarStyle: ((route) => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profilestack';
      if (routeName === 'RenterProfile') {
        return { display: 'none' };
      }
      return;
    })(route),
    tabBarVisible: getTabBarVisibility2 (route),
  })}
/>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#4a90e2',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: 'white',
    fontSize: 13,
  },
  notificationButton: {
    marginRight: 10,
    padding: 10,
  },
});

export default TabNavigator;
