import React from 'react';

import {StyleSheet, Text, View, Image, FlatList} from 'react-native';


import orders from './assets/data/orders.json';
const order = orders[0];

import OrderItem from './src/components/OrderItem';
import OrderScreen from './src/screens/OrderScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <OrderScreen />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
