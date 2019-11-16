import React, { useState } from "react";
import MapView, { Marker } from 'react-native-maps';

const Main = () => {
  const [stations, setStations] = useState([]);
  // data addition
  // useEffect(() => {
  //   // Add a second document with a generated ID.
  //   data.forEach((d) => {
  //     const _d = {
  //       ...d,
  //       description: "",
  //       location: {
  //         latitude: d.lat,
  //         longitude: d.lng
  //       }
  //     };
  //     db.collection("stations").add(_d)
  //       .then(function(docRef) {
  //         console.log("Document written with ID: ", docRef.id);
  //       })
  //       .catch(function(error) {
  //         console.error("Error adding document: ", error);
  //       });
  //   });
  // }, []);
  // useEffect(() => {
  //   db.collection("stations").get().then((querySnapshot) => {
  //     let _stations = [];
  //     querySnapshot.forEach(d => {
  //       _stations.push(d.data());
  //     });
  //     setStations(_stations);
  //   });
  // }, []);
  return (
    <MapView style={{flex: 1}}>
      {stations.map(station => (
        <Marker
          key={station.name}
          coordinate={station.location}
          title={station.name}
          description={station.description}
        />
      ))}
    </MapView>
  );
}

export default Main;
