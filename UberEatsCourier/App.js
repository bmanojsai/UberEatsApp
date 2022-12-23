import React from 'react';
import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import orders from './assets/data/orders.json';
const order = orders[0];

import OrderItem from './src/components/OrderItem';
import OrderScreen from './src/screens/OrderScreen';
import OrderDeliveryScreen from './src/screens/OrderDelivery';
import RootNavigation from './src/navigation';

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};

export default App;
