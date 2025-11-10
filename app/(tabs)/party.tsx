import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PartyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Watch Party</Text>
          <Text style={styles.subtitle}>Find movies together</Text>
        </View>

        {/* Create Party Card */}
        <TouchableOpacity style={styles.primaryCard} activeOpacity={0.8}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🎉</Text>
          </View>
          <Text style={styles.primaryCardTitle}>Create Party</Text>
          <Text style={styles.primaryCardText}>
            Start a new watch party with friends
          </Text>
        </TouchableOpacity>

        {/* Join Party Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Join Party</Text>
          <Text style={styles.cardText}>Enter a party code to join</Text>
          <View style={styles.codeInput}>
            <Text style={styles.codePlaceholder}>MN-####</Text>
          </View>
          <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
            <Text style={styles.joinButtonText}>Join Party</Text>
          </TouchableOpacity>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Watch Party Features</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✓ Create unique party code</Text>
            <Text style={styles.featureItem}>✓ Share with QR code</Text>
            <Text style={styles.featureItem}>✓ Real-time voting (Yes/No/Seen)</Text>
            <Text style={styles.featureItem}>✓ Smart recommendations</Text>
            <Text style={styles.featureItem}>✓ Match celebration screen</Text>
            <Text style={styles.featureItem}>✓ Filter by shared services</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={[styles.card, styles.infoCard]}>
          <Text style={styles.infoTitle}>🎬 Perfect for Movie Night</Text>
          <Text style={styles.infoText}>
            Let everyone vote and find a movie you'll all love!
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
  primaryCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 24,
    padding: 32,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
  },
  primaryCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  primaryCardText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
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
  codeInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  codePlaceholder: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureList: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
