import React, { useEffect } from "react";
import "react-native-reanimated";
import {
  PermissionsAndroid,
  SafeAreaView,

  useColorScheme,
  View
} from "react-native";

import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeCtx } from "./src/context/themeCtx.ts";
import { colors } from "./src/config/theme.ts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DatabaseConnectionProvider } from "./src/hooks/db.createConnection";
import InventoryScreen from "./src/screens/InventoryScreen.tsx";
import TabBar from "./src/components/nav/TabBar.tsx";
import ProductsScreen from "./src/screens/ProductsScreen.tsx";
import BarcodeScannerScreenBack from "./src/screens/BarcodeScannerScreenBack.tsx";
import SettingsScreen from "./src/screens/SettingsScreen.tsx";

// import 'react-native-gesture-handler'

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName={"barcode"}
                   tabBar={props => <TabBar {...props} />}>
      {/*<Tab.Screen name="barcode" component={BarcodeScannerScreen} />*/}
      <Tab.Screen name="inventory" component={InventoryScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'Нужен доступ к хранилищу',
        buttonNegative: 'Отмена',
        buttonPositive: 'Разрешить',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission granted');
    } else {
      console.log('Storage permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

function App(): React.JSX.Element {

  const theme = { mode: useColorScheme() ?? "light" };
  let activeColors = colors[theme.mode];

  const Stack = createNativeStackNavigator();

  const customLightThemeNav = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors["light"].primary
    }
  };

// Custom dark theme with overridden and added colors
  const customDarkThemeNav = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors["dark"].primary
    }
  };

  useEffect(() => {
    requestStoragePermission()
  }, []);

  return (
    <ThemeCtx.Provider value={theme}>
      <DatabaseConnectionProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: activeColors.primary }}>
              <NavigationContainer
                theme={theme.mode === "dark" ? customDarkThemeNav : customLightThemeNav}>
                <Stack.Navigator initialRouteName={"HomeTabs"} screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="HomeTabs" component={AppTabs} />
                  <Stack.Screen name="BarcodeScannerBack" component={BarcodeScannerScreenBack} options={{
                    title: "", headerShown: true
                  }} />
                  <Stack.Screen name="Products" component={ProductsScreen} options={{
                    title: "", headerShown: true
                  }} />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </GestureHandlerRootView>
        </SafeAreaView>

      </DatabaseConnectionProvider>
    </ThemeCtx.Provider>

  );
}

export default App;

