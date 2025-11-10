import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <Text style={styles.subtitle}>Discover movies to watch</Text>
        </View>

        {/* Placeholder Content */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎬</Text>
          </View>
          <Text style={styles.cardTitle}>Movie Cards Coming Soon</Text>
          <Text style={styles.cardText}>
            Browse movies one at a time with swipe actions
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ Filter by Movies/TV Shows</Text>
            <Text style={styles.featureItem}>✓ Show only your streaming services</Text>
            <Text style={styles.featureItem}>✓ Multiple ratings (IMDb, RT, TMDb)</Text>
            <Text style={styles.featureItem}>✓ Quick actions: Pass, Seen, Watchlist</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>🚀 Ready for Development</Text>
          <Text style={styles.infoText}>
            This is a placeholder screen. Features will be implemented based on DESIGN_SPEC.md
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureList: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#8B5CF6',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
});
