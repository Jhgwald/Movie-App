import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Movie Match — Feed</Text>
        <Text style={styles.sub}>Native app (iOS/Android) via Expo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  sub: { fontSize: 14, opacity: 0.7 },
});
