import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your lists and preferences</Text>
        </View>

        {/* Watchlist Card */}
        <View style={[styles.listCard, styles.watchlistCard]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>🔖 Watchlist</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>
          <Text style={styles.listSubtitle}>Movies you want to watch</Text>
        </View>

        {/* Seen Movies Card */}
        <View style={[styles.listCard, styles.seenCard]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>✓ Movies I've Seen</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>
          <Text style={styles.listSubtitle}>Ready to rank when you want</Text>
        </View>

        {/* Master Ranked List Card */}
        <View style={[styles.listCard, styles.rankedCard]}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>🏆 Master Ranked List</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>
          <Text style={styles.listSubtitle}>Your top-rated movies</Text>
        </View>

        {/* Custom Lists Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Custom Lists</Text>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.customListName}>Holiday Favorites</Text>
          <Text style={styles.customListCount}>0 movies</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.customListName}>Comedies</Text>
          <Text style={styles.customListCount}>0 movies</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.customListName}>Date Night</Text>
          <Text style={styles.customListCount}>0 movies</Text>
        </View>

        {/* Streaming Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Streaming Services</Text>
          <Text style={styles.cardText}>
            Configure your subscriptions in settings
          </Text>
          <View style={styles.servicesList}>
            <Text style={styles.serviceItem}>Netflix</Text>
            <Text style={styles.serviceItem}>HBO Max</Text>
            <Text style={styles.serviceItem}>+ 8 more</Text>
          </View>
        </View>

        {/* Attribution */}
        <View style={styles.attribution}>
          <Text style={styles.attributionText}>Powered by TMDb</Text>
          <Text style={styles.attributionText}>Data from OMDb API</Text>
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
    paddingBottom: 40,
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
  listCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  watchlistCard: {
    backgroundColor: '#3B82F6',
  },
  seenCard: {
    backgroundColor: '#10B981',
  },
  rankedCard: {
    backgroundColor: '#F59E0B',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  customListCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceItem: {
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  attribution: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  attributionText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});
