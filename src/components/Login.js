import React from "react";
import {Button, Input} from "react-native-ui-kitten";
import {Dimensions, View} from "react-native";

const Login = ({ onPress }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#ee4a4e" }}>
      <View style={{ marginTop: Dimensions.get("window").height / 2 - 80, padding: 30}}>
        <Input placeholder='Kullanıcı adı' value={"saklapp"} onChangeText={console.log}/>
        <Input placeholder='Şifre' value={"test"} secureTextEntry={true}/>
        <Button color={"#ee4a4e"} onPress={onPress}>Login</Button>
      </View>
    </View>
  );
};

export default Login;
