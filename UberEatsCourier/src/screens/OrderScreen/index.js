import {useRef} from 'react';

import {View, Text, FlatList, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

import OrderItem from '../../components/OrderItem';

import orders from '../../../assets/data/orders.json';

const OrderScreen = gestureHandlerRootHOC(() => {
  const bottomSheetRef = useRef(null);

  return (
    <View style={{flex: 1, backgroundColor: 'lightblue'}}>
      <BottomSheet ref={bottomSheetRef} snapPoints={['15%', '95%']}>
        <View style ={{alignItems : "center", height : 80, padding : 5}}>
            <Text style = {styles.title}>You're Online</Text>
            <Text style = {{fontSize : 15, color : "grey"}}>Total available orders : {orders.length}</Text>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={orders}
            renderItem={({item}) => <OrderItem order={item} />}
            style={{width: '100%', height: 100}}
          />
        </View>
      </BottomSheet>
    </View>
  );
});


const styles = StyleSheet.create({
    title : {
        fontSize : 23,
        fontWeight : "500",
        color : "black",
        letterSpacing : 0.5
    }
})

export default OrderScreen;
