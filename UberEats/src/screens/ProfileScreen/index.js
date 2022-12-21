import {View, Text, TextInput, StyleSheet, Button, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Auth, DataStore} from 'aws-amplify';
import {User} from '../../models';
import {useAuthContext} from '../../contexts/AuthContext';


const Profile = () => {
  const [name, setName] = useState(dbUser ? dbUser.name : '');
  const [address, setAddress] = useState(dbUser ? dbUser.address : '');
  const [lat, setLat] = useState(dbUser ? dbUser.lat : '0');
  const [lng, setLng] = useState(dbUser ? dbUser.lng : '0');

  const {sub, setDbUser, dbUser} = useAuthContext();

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name);
      setAddress(dbUser.address);
      setLat(dbUser.lat);
      setLng(dbUser.lng);
    }
  }, [dbUser]);

  const createUser = async () => {
    try {
      let user = await DataStore.save(
        new User({
          name,
          address,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          sub,
        }),
      );

      setDbUser(user);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const updateUser = async () => {
    try {
      const user = await DataStore.save(
        User.copyOf(dbUser, updated => {
          updated.name = name;
          updated.address = address;
          updated.lat = parseFloat(lat);
          updated.lng = parseFloat(lng);
        }),
      );

      setDbUser(user);
    } catch (err) {
      Alert.alert('Error :', err.message);
    }
  };

  const onSave = async () => {
    if (dbUser) {
      await updateUser();
    } else {
      await createUser();
    }
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />
      <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="Latitude"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={lng}
        onChangeText={setLng}
        placeholder="Longitude"
        style={styles.input}
      />
      <Button onPress={onSave} title="Save" />
      <View style={{height: 20}}></View>
      <Button onPress={() => Auth.signOut()} title="SignOut" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
