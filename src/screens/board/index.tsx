import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Share,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { useAppSelector } from "../../hooks/storeHooks";

const LeaderBoardScreen = () => {
  const { leaders } = useAppSelector((state) => state.wordGameState);

  console.warn(leaders, "hello");

  const [isSharing, setIsSharing] = useState(false);
  const viewShotRef = useRef<any>(null);

  const shareScreen = async () => {
    try {
      if (!viewShotRef.current) return;
      setIsSharing(true);
      await viewShotRef.current.capture().then(async (uri: any) => {
        await Share.share({
          message: "Check out this screen",
          url: uri,
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ViewShot ref={viewShotRef}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Leaderboard</Text>
        </View>

        {leaders
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          ).sort((a,b) => b.score - a.score)
          .map((leader, index) => (
            <View key={leader.name} style={styles.leaderContainer}>
              <Text style={styles.rankText}>{index + 1}.</Text>
              <Text style={styles.nameText}>{leader.name}</Text>
              <Text style={styles.scoreText}>{leader.score} pts</Text>
            </View>
          ))}
      </ScrollView>
      <Button title="Share" onPress={shareScreen} disabled={isSharing} />
    </ViewShot>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#333",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#fff",
  },
  leaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  rankText: {
    fontSize: 20,
    marginRight: 20,
    color: "#333",
  },
  nameText: {
    fontSize: 20,
    flex: 1,
    color: "#333",
  },
  scoreText: {
    fontSize: 20,
    color: "#333",
  },
});
