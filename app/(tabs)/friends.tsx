import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.subtitle}>See what friends are watching</Text>
        </View>

        {/* Placeholder Content */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>❤️</Text>
          </View>
          <Text style={styles.cardTitle}>Friends Activity Feed</Text>
          <Text style={styles.cardText}>
            Stay connected with your movie-loving friends
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ See what friends watched</Text>
            <Text style={styles.featureItem}>✓ View their watchlists</Text>
            <Text style={styles.featureItem}>✓ Check their custom lists</Text>
            <Text style={styles.featureItem}>✓ See their streaming services</Text>
            <Text style={styles.featureItem}>✓ Activity timestamps</Text>
          </View>
        </View>

        {/* Sample Activity Cards */}
        <View style={styles.activityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SJ</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              <Text style={styles.friendName}>Sarah Johnson</Text>
              {' '}added{' '}
              <Text style={styles.movieName}>Inception</Text>
              {' '}to watchlist
            </Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MC</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              <Text style={styles.friendName}>Mike Chen</Text>
              {' '}watched{' '}
              <Text style={styles.movieName}>Oppenheimer</Text>
            </Text>
            <Text style={styles.activityTime}>5 hours ago</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>👥 Connect with Friends</Text>
          <Text style={styles.infoText}>
            Invite friends to discover movies together
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
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  friendName: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  movieName: {
    fontWeight: '600',
    color: '#8B5CF6',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#EC4899',
    marginTop: 8,
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
