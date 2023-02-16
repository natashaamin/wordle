import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "..";
import LeaderBoardScreen from "../../board";

type HomeStackParamList = {
  Home: any;
  Game: any;
};

type BoardStackParamList = {
  Board: any;
};

export default function MainScreen() {
  const Tab = createBottomTabNavigator();
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();
  const BoardStack = createNativeStackNavigator<BoardStackParamList>();

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} />
      </HomeStack.Navigator>
    );
  }

  function LeaderBoardStackScreen() {
    return (
      <BoardStack.Navigator>
        <BoardStack.Screen name="Board" component={LeaderBoardScreen} />
      </BoardStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }: any) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }: any) => {
            let iconName: React.ComponentProps<typeof Ionicons>["name"] =
              "game-controller";

            if (route.name === "Game") {
              iconName = focused
                ? "game-controller"
                : "game-controller-outline";
            } else if (route.name === "LeaderBoard") {
              iconName = focused ? "settings" : "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{ title: "Home" }}
        />
        <Tab.Screen
          name="BoardStack"
          component={LeaderBoardStackScreen}
          options={{ title: "LeaderBoard" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
