import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>Find movies and TV shows</Text>
        </View>

        {/* Search Input Placeholder */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or genre..."
            placeholderTextColor="#9CA3AF"
            editable={false}
          />
        </View>

        {/* Placeholder Content */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔍</Text>
          </View>
          <Text style={styles.cardTitle}>Search Functionality</Text>
          <Text style={styles.cardText}>
            Search through our movie database
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ Search by title</Text>
            <Text style={styles.featureItem}>✓ Filter by genre</Text>
            <Text style={styles.featureItem}>✓ Filter by year</Text>
            <Text style={styles.featureItem}>✓ Filter by rating</Text>
            <Text style={styles.featureItem}>✓ Add to watchlist from search</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>📝 Coming Soon</Text>
          <Text style={styles.infoText}>
            Search will integrate with TMDb API for real-time movie data
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
    marginBottom: 20,
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
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: '#EC4899',
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
