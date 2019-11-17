import React, { useState, useEffect, useCallback, useRef } from "react";
import { Platform, Dimensions, Text, View, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from 'react-native-maps';
import firebase from 'firebase'
import '@firebase/firestore';
import mapStyle from "../../map_style";
import Icon from "./TreasureIcon";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {Modal, Layout, Button, Input, Select} from "react-native-ui-kitten";
import Confetti from 'react-native-confetti';


const firebaseConfig = {
  apiKey: "AIzaSyCPwcwbMOAUrVoZbivmHAfRHU5LRJWYO6Q",
  authDomain: "benzinlik-1abfc.firebaseapp.com",
  databaseURL: "https://benzinlik-1abfc.firebaseio.com",
  projectId: "benzinlik-1abfc",
  storageBucket: "benzinlik-1abfc.appspot.com",
  messagingSenderId: "848589488980",
  appId: "1:848589488980:web:ed32936d5f8814371f7ec1"
};

/*
var firebaseConfig = {
  apiKey: "AIzaSyDq2QLOsdVwg5Orx4r_pjM_5kpsG39zdOs",
  authDomain: "akbank-c9e44.firebaseapp.com",
  databaseURL: "https://akbank-c9e44.firebaseio.com",
  projectId: "akbank-c9e44",
  storageBucket: "akbank-c9e44.appspot.com",
  messagingSenderId: "747156654613",
  appId: "1:747156654613:web:8390b0a79f6a83fc335c1c"
};
 */

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const renderModalElement = () => {
  return (
    <Layout
      level='3'
      style={{
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>This is modal</Text>
      <Button onPress={console.log}>Hide Modal</Button>
    </Layout>
  );
};

const progressStyle = {width: 50, height: 10, backgroundColor: 'grey', borderRadius: 15};
const ProgressBar = ({value}) => <View style={progressStyle}>
  <View style={{...progressStyle, width: value + '%', backgroundColor: '#abce83'}}/>
</View>;

const Main = () => {
  const [stations, setStations] = useState([]);
  const ref = useRef(null);
  const [confetti, setConfetti] = useState(false)
  const [isOpen, setOpen] = useState(false);
  const [goal, setGoal] = useState('');
  // const [amount, setAmount] = useState(100);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isCurrentRegion, setCurrentRegion] = useState(false);
  const [location, setLocation] = useState({
    latitude: 40.8701034,
    longitude: 29.389548,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [region, setRegion] = useState({
    latitude: 40.8701034,
    longitude: 29.389548,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  useEffect(() => {
    // console.log(ref, ref.current, ref.current.startConfetti)
  }, []);
  useEffect(() => {
    // db.collection("stations").get().then((querySnapshot) => {
    //   let _stations = [];
    //   querySnapshot.forEach(d => {
    //     _stations.push(d.data());
    //   });
    //   setStations(_stations);
    // });
    const _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location.coords);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      if(isCurrentRegion === false) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.error('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      _getLocationAsync();
    }
  }, []);
  const handlePress = useCallback((location) => {
    if (isOpen === false) {
      const coordinate = location.nativeEvent.coordinate;
      setSelectedLocation(coordinate);
    }
    setOpen(!isOpen);
  }, [isOpen]);
  const handleRegionChange = useCallback((region) => {
    setRegion(region);
  }, []);
  const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
  const handleSaveGoal = useCallback(() => {
    setGoals([...goals, {name: goal.text, loc: selectedLocation, value: Math.floor(Math.random() * 100)}])
    setSelectedLocation(null);
    setOpen(false);
    setGoal('');
    setConfetti(true);
    ref.current.startConfetti();
  }, [goal]);
  return (
    <View style={mapViewStyle}>
    <MapView
      style={mapViewStyle}
      customMapStyle={mapStyle}
      region={region}
      onPress={handlePress}
      onRegionChangeComplete={handleRegionChange}
    >
      <Marker
        key={"current"}
        coordinate={location}
      />
      {selectedLocation != null && <Marker
        key={'selected'}
        coordinate={selectedLocation}
        title={'yeni'}
      >
        <Icon/>
      </Marker>}
      {goals.map(({name, loc, value}) => (
        <>
        <Marker
          key={name}
          coordinate={loc}
          title={name}
        >
          <Icon/>
          <ProgressBar value={value}/>
        </Marker>
        </>
      ))}
    </MapView>
      {isOpen && <TouchableOpacity style={{
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
        top: 0, left:0 }} onPress={handlePress}>
        <View
          behavior="padding"
          enabled style={{
            width: windowWidth,
            marginTop: windowHeight / 4,
            padding: 10,
          backgroundColor: "white",
        }}>
          <View style={{ padding: 20, marginBottom: 10}}>
            <Select data={[{text: 'Bisiklet'}, {text: 'Kulaklık'}, {text: 'Kurs'}, {text: 'Gitar'}, {text: 'Keman'}, ]} onSelect={v => setGoal(v)} selectedOption={goal} style={{marginBottom: 10}}/>
            <Input placeholder='Başlangıç' keyboardType={"numeric"} style={{marginBottom: 10}}/>
            <Button textStyle={{ fontSize: 18}} size={'large'} onPress={handleSaveGoal}>📦 Sakla</Button>
          </View>
        </View>
        </TouchableOpacity>}

      <Confetti ref={ref} confettiCount={100} duration={700} timeout={3}/>
    </View>
  );
};

const mapViewStyle = {flex: 1};

export default Main;
