import React, { useState } from 'react';
import Main from "./src/components/Main";
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from 'react-native-ui-kitten';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import Login from "./src/components/Login";

const renderRoutes = (loggedIn, setLoggedIn) => {
  if(loggedIn) {
    return (
      <Main/>
    )
  }
  // else {
  //   return (
  //     <Login onPress={() => setLoggedIn(true)}/>
  //   );
  // }
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  console.ignoredYellowBox = true;
  return (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <ActionSheetProvider>
        {renderRoutes(loggedIn, setLoggedIn)}
      </ActionSheetProvider>
    </ApplicationProvider>
  )
};

export default App;
