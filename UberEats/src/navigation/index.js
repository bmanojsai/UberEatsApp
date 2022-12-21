//packages
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

//screens
import HomeScreen from '../screens/HomeScreen/index';
import RestaurentDetails from '../screens/RestaurantDetails';
import DishDetailsScreen from '../screens/DishDetailsScreen';
import BasketScreen from '../screens/BasketScreen';
import OrderScreen from '../screens/OrderScreen';
import OrderDetailsScreen from './../screens/OrderDetailsScreen';
import Profile from './../screens/ProfileScreen/index';
import {useAuthContext} from '../contexts/AuthContext';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator initialRouteName="Restaurants">
      <HomeStack.Screen name="Restaurants" component={HomeScreen} />
      <HomeStack.Screen
        name="Restaurant"
        component={RestaurentDetails}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Dish"
        component={DishDetailsScreen}
        options={{headerShown: true}}
      />
      <HomeStack.Screen
        name="Basket"
        component={BasketScreen}
        options={{headerShown: true}}
      />
    </HomeStack.Navigator>
  );
};

const OrderStack = createNativeStackNavigator();

const OrderStackNavigator = () => {
  return (
    <OrderStack.Navigator initialRouteName="Your Orders">
      <OrderStack.Screen name="Your Orders" component={OrderScreen} />
      <OrderStack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{headerShown: false}}
      />
    </OrderStack.Navigator>
  );
};

const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator barStyle={{backgroundColor: 'white'}}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="home" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <MaterialIcon name="view-list" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwsome name="user" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const {dbUser} = useAuthContext();

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {!dbUser ? (
        <RootStack.Screen name="Profile" component={Profile} />
      ) : (
        <RootStack.Screen name="HomeTabs" component={HomeTabs} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
