import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from './database';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { logger } from './utils/logger';
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface HomeStackProps {
  refreshKey: number;
}

function HomeStack({ refreshKey }: HomeStackProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain">
        {(props) => <HomeScreen {...props} key={refreshKey} />}
      </Stack.Screen>
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
    </Stack.Navigator>
  );
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Initialize database
        await initDatabase();
        setDbInitialized(true);
      } catch (e) {
        logger.error('App initialization error:', e);
        // Still set to true to allow app to continue
        setDbInitialized(true);
      } finally {
        // Add a small delay to ensure splash screen is visible
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed its layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleTransactionAdded = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <CurrencyProvider>
      <BudgetProvider>
        <SafeAreaView style={styles.safeArea} edges={['bottom']} onLayout={onLayoutRootView}>
        <NavigationContainer>
          <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 0,
              paddingBottom: 10,
              paddingTop: 10,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarActiveTintColor: '#1A1A1A',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 4,
            },
            tabBarIconStyle: {
              marginTop: 4,
            },
          }}
        >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.tabIcon, { color, fontSize: focused ? 26 : 24 }]}>
                  🏠
                </Text>
              </View>
            ),
            tabBarLabel: 'Home',
          }}
        >
          {() => (
            <View style={{ flex: 1 }}>
              <HomeStack refreshKey={refreshKey} />
            </View>
          )}
        </Tab.Screen>

        <Tab.Screen
          name="Stats"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.tabIcon, { color, fontSize: focused ? 26 : 24 }]}>
                  📊
                </Text>
              </View>
            ),
            tabBarLabel: 'Analytics',
          }}
        >
          {() => <StatsScreen key={refreshKey} />}
        </Tab.Screen>

        <Tab.Screen
          name="Add"
          options={{
            tabBarIcon: () => (
              <View style={styles.addButtonContainer}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setAddModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ),
            tabBarLabel: '',
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setAddModalVisible(true);
            },
          }}
        >
          {() => <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />}
        </Tab.Screen>

        <Tab.Screen
          name="Reports"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.tabIcon, { color, fontSize: focused ? 26 : 24 }]}>
                  📄
                </Text>
              </View>
            ),
            tabBarLabel: 'Reports',
          }}
        >
          {() => <ExpensesScreen />}
        </Tab.Screen>

        <Tab.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.tabIcon, { color, fontSize: focused ? 26 : 24 }]}>
                  👤
                </Text>
              </View>
            ),
            tabBarLabel: 'Profile',
          }}
        >
          {() => <SettingsScreen />}
        </Tab.Screen>
      </Tab.Navigator>

        <AddTransactionScreen
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSuccess={handleTransactionAdded}
        />
        </NavigationContainer>
      </SafeAreaView>
      </BudgetProvider>
    </CurrencyProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 24,
  },
  addButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 40,
  },
});

