import {useRef, useMemo, useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import FontAswome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MapView, {Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import orders from '../../../assets/data/orders.json';
const order = orders[1];

const ORDER_STATUS = {
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
};

const restaurantLocation = {
  latitude: order.Restaurant.lat,
  longitude: order.Restaurant.lng,
};

const deliveryLocation = {
  latitude: order.User.lat,
  longitude: order.User.lng,
};

const OrderDeliveryScreen = gestureHandlerRootHOC(({navigation}) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isDriverClose, setIsDriverClose] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(
    ORDER_STATUS.READY_FOR_PICKUP,
  );
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
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

  const getDriverLocation = async () => {
    let hasLocationPermission = await requestLocationPermission();

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          setDriverLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission(true);
        },
        error => {
          setLocationPermission(false);
          Alert.alert('Error : ', error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      setLocationPermission(false);
      Alert.alert('Error : ', 'We need Location permission to work for you :)');
    }
  };

  useEffect(() => {
    let foregroundLocation;
    if (!locationPermission) {
      getDriverLocation();

      foregroundLocation = Geolocation.watchPosition(
        position => {
          setDriverLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          Alert.alert('Error : ', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 100000,
          distanceFilter: 10,
        },
      );
    }

    //NOTE: i need to clear the location finder
    //need to figure out where to do it yet
    //here its not working :(
    //return Geolocation.clearWatch(foregroundLocation);
  }, [locationPermission]);

  useEffect(() => {
    console.log('999', driverLocation);
  }, [driverLocation]);

  if (!driverLocation) {
    return (
      <>
        <ActivityIndicator size="large" style={{flex: 1}} />
      </>
    );
  }

  const RenderButtonTitle = () => {
    if (deliveryStatus == ORDER_STATUS.READY_FOR_PICKUP) {
      return 'Accept Order';
    }
    if (deliveryStatus == ORDER_STATUS.ACCEPTED) {
      return 'Pick-Up Order';
    }
    if (deliveryStatus == ORDER_STATUS.PICKED_UP) {
      return 'Complete Order';
    }
  };

  const onButtonPressed = () => {
    if (deliveryStatus == ORDER_STATUS.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });
      setDeliveryStatus(ORDER_STATUS.ACCEPTED);
    }

    if (deliveryStatus == ORDER_STATUS.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });
      setDeliveryStatus(ORDER_STATUS.PICKED_UP);
    }

    if (deliveryStatus == ORDER_STATUS.PICKED_UP) {
      console.log('Delivery Completed');
      navigation.navigate('Orders');
    }
  };

  const IsButtonDisable = () => {
    if (deliveryStatus == ORDER_STATUS.READY_FOR_PICKUP) {
      return false;
    }
    if (deliveryStatus == ORDER_STATUS.ACCEPTED && isDriverClose) {
      return false;
    }
    if (deliveryStatus == ORDER_STATUS.PICKED_UP && isDriverClose) {
      return false;
    }
    return true;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'lightblue'}}>
      <MapView
        ref={mapRef}
        style={{
          height: height,
          width: width,
          marginBottom: '15%',
        }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}>
        <MapViewDirections
          origin={driverLocation}
          waypoints={
            deliveryStatus == ORDER_STATUS.PICKED_UP ? [] : [restaurantLocation]
          }
          destination={
            deliveryStatus == ORDER_STATUS.ACCEPTED
              ? restaurantLocation
              : deliveryLocation
          }
          strokeColor="#3fc060"
          strokeWidth={5}
          apikey="AIzaSyAKEubPUgBNmdLVb-Jh4Uj4ciAg-BgqxSQ"
          onReady={results => {
           setIsDriverClose(results.distance <= 0.1);
            setTotalDistance(results.distance);
            setTotalTime(results.duration);
          }}
        />
        <Marker
          title={order.Restaurant.name}
          description={order.Restaurant.address}
          coordinate={restaurantLocation}>
          <View
            style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
            <Entypo size={20} name="shop" color="white" />
          </View>
        </Marker>

        <Marker
          title={order.User.name}
          description={order.User.address}
          coordinate={deliveryLocation}>
          <View style={{backgroundColor: 'teal', padding: 5, borderRadius: 20}}>
            <Entypo size={20} name="user" color="white" />
          </View>
        </Marker>
      </MapView>

      {deliveryStatus.READY_FOR_PICKUP && (
        <Ionicons
          name="arrow-back-circle"
          size={40}
          color="black"
          style={{position: 'absolute', zIndex: 99, top: 15, left: 15}}
          onPress={() => navigation.goBack()}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{backgroundColor: 'grey', width: '25%'}}>
        <View style={styles.mainContainer}>
          <Text style={styles.mainText}> {totalTime.toFixed(0)} min</Text>
          <FontAswome5 name="shopping-bag" size={30} color="#3fc060" />
          <Text style={styles.mainText}>{totalDistance.toFixed(2)} km</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: 'black',
              letterSpacing: 1,
              marginVertical: 10,
            }}>
            {order.Restaurant.name}
          </Text>

          <View style={styles.textView}>
            <Fontisto name="shopping-store" size={20} style={{width: 35}} />
            <Text style={{fontSize: 20, fontWeight: '400', color: 'grey'}}>
              {order.Restaurant.address}
            </Text>
          </View>

          <View style={styles.textView}>
            <FontAswome5 name="map-marker-alt" size={26} style={{width: 35}} />
            <Text style={{fontSize: 20, fontWeight: '400', color: 'grey'}}>
              {order.User.address}
            </Text>
          </View>

          <View style={styles.itemsContainer}>
            <Text style={styles.itemText}>Item1 x1</Text>
            <Text style={styles.itemText}>Item2 x4</Text>
            <Text style={styles.itemText}>Item3 x2</Text>
            <Text style={styles.itemText}>Item4 x3</Text>
          </View>
        </View>

        <Pressable
          style={{
            ...styles.Button,
            backgroundColor: IsButtonDisable() ? 'grey' : '#3fc060',
          }}
          onPress={onButtonPressed}
          disabled={IsButtonDisable()}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '500',
              textAlign: 'center',
              letterSpacing: 1,
            }}>
            {RenderButtonTitle()}
          </Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 25,
    fontWeight: '500',
    color: 'black',
    letterSpacing: 1,
    marginHorizontal: 10,
  },
  detailsContainer: {
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  itemsContainer: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    marginVertical: 10,
    paddingVertical: 10,
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 5,
    color: 'grey',
  },
  Button: {
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 10,
    padding: 17,
    borderRadius: 10,
  },
});

export default OrderDeliveryScreen;
