import {useRef, useMemo, useEffect} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  PermissionsAndroid,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import MapView, {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import OrderItem from '../../components/OrderItem';

import orders from '../../../assets/data/orders.json';

const OrderScreen = gestureHandlerRootHOC(({navigation}) => {
  const bottomSheetRef = useRef(null);
  const {width, height} = useWindowDimensions();

  const snapPoints = useMemo(() => ['15%', '95%'], []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'lightblue'}}>
      <MapView
        style={{
          height: height,
          width: width,
          marginBottom: '15%',
        }}
        showsUserLocation
        followsUserLocation>
        {orders.map(oo => (
          <Marker
            key={oo.id}
            title={'Hello'}
            description="Hi How are you doing?"
            coordinate={{
              latitude: oo.Restaurant.lat,
              longitude: oo.Restaurant.lng,
            }}>
            <View
              style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
              <Entypo size={20} name="shop" color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{backgroundColor: 'grey', width: '25%'}}>
        <View style={{alignItems: 'center', height: 80, padding: 5}}>
          <Text style={styles.title}>You're Online</Text>
          <Text style={{fontSize: 15, color: 'grey'}}>
            Total available orders : {orders.length}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={orders}
            renderItem={({item}) => (
              <OrderItem order={item} navigation={navigation} />
            )}
            style={{width: '100%', height: 100}}
          />
        </View>
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  title: {
    fontSize: 23,
    fontWeight: '500',
    color: 'black',
    letterSpacing: 0.5,
  },
});

export default OrderScreen;
