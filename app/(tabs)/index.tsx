import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { Movie } from '../../types/movie';
import { Ionicons } from '@expo/vector-icons';

export default function FeedScreen() {
  const {
    contentType,
    setContentType,
    showOnlyMyServices,
    setShowOnlyMyServices,
    currentMovieIndex,
    setCurrentMovieIndex,
    getFilteredMovies,
    addToWatchlist,
    addToSeenMovies,
  } = useApp();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const filteredMovies = getFilteredMovies();
  const currentMovie = filteredMovies[currentMovieIndex];

  const handleSwipe = (action: 'pass' | 'seen' | 'watchlist') => {
    if (!currentMovie) return;

    if (action === 'watchlist') {
      addToWatchlist(currentMovie);
    } else if (action === 'seen') {
      addToSeenMovies(currentMovie);
    }

    // Move to next movie
    setCurrentMovieIndex((currentMovieIndex + 1) % filteredMovies.length);
  };

  const openDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetailsModal(true);
  };

  const getRatingColor = (type: string) => {
    const colors = {
      imdb: '#F59E0B',
      rt: '#EF4444',
      rtAudience: '#F87171',
      tmdb: '#3B82F6'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getRatingLabel = (type: string) => {
    const labels = {
      imdb: 'IMDb',
      rt: 'RT Critics',
      rtAudience: 'RT Audience',
      tmdb: 'TMDb'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!currentMovie) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No more movies!</Text>
          <Text style={styles.emptyText}>Adjust your filters or check back later</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, contentType === 'movies' && styles.filterButtonActive]}
            onPress={() => setContentType('movies')}
          >
            <Text style={[styles.filterButtonText, contentType === 'movies' && styles.filterButtonTextActive]}>
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, contentType === 'tv' && styles.filterButtonActive]}
            onPress={() => setContentType('tv')}
          >
            <Text style={[styles.filterButtonText, contentType === 'tv' && styles.filterButtonTextActive]}>
              TV Shows
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Switch
            value={showOnlyMyServices}
            onValueChange={setShowOnlyMyServices}
            trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            thumbColor={'#FFFFFF'}
          />
          <Text style={styles.switchLabel}>Show only my services</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Movie Card */}
        <View style={styles.movieCard}>
          {/* Poster */}
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: currentMovie.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.posterOverlay}>
              <Text style={styles.movieTitle}>{currentMovie.title}</Text>
              <View style={styles.ratingsContainer}>
                {Object.entries(currentMovie.ratings).map(([type, rating]) => (
                  <View
                    key={type}
                    style={[styles.ratingBadge, { backgroundColor: getRatingColor(type) }]}
                  >
                    <Text style={styles.ratingText}>
                      {getRatingLabel(type)}: {rating}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>{currentMovie.year}</Text>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.metaText}>{currentMovie.runtime}</Text>
            </View>

            <View style={styles.genresContainer}>
              {currentMovie.genres.map(genre => (
                <View key={genre} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {currentMovie.description}
            </Text>

            <View style={styles.streamingSection}>
              <Text style={styles.streamingTitle}>Available on:</Text>
              <View style={styles.streamingList}>
                {currentMovie.streaming.map((s, idx) => (
                  <View key={idx} style={styles.streamingBadge}>
                    <Text style={styles.streamingText}>
                      {s.service}{s.price && ` - ${s.price}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.passButton]}
                onPress={() => handleSwipe('pass')}
              >
                <Text style={styles.actionButtonText}>Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.seenButton]}
                onPress={() => handleSwipe('seen')}
              >
                <Text style={styles.actionButtonText}>Seen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.watchlistButton]}
                onPress={() => handleSwipe('watchlist')}
              >
                <Text style={styles.actionButtonText}>List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.detailsButton]}
                onPress={() => openDetails(currentMovie)}
              >
                <Text style={styles.actionButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMovie?.title}</Text>
              <TouchableOpacity
                onPress={() => setShowDetailsModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {selectedMovie && (
                <>
                  <Image
                    source={{ uri: selectedMovie.poster }}
                    style={styles.modalPoster}
                    resizeMode="cover"
                  />

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Ratings</Text>
                    <View style={styles.ratingsGrid}>
                      {Object.entries(selectedMovie.ratings).map(([type, rating]) => (
                        <View
                          key={type}
                          style={[styles.ratingCard, { backgroundColor: getRatingColor(type) }]}
                        >
                          <Text style={styles.ratingCardLabel}>{getRatingLabel(type)}</Text>
                          <Text style={styles.ratingCardValue}>{rating}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.modalDescription}>{selectedMovie.description}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Details</Text>
                    <Text style={styles.detailText}>Year: {selectedMovie.year}</Text>
                    <Text style={styles.detailText}>Runtime: {selectedMovie.runtime}</Text>
                    <Text style={styles.detailText}>Genres: {selectedMovie.genres.join(', ')}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Streaming Services</Text>
                    {selectedMovie.streaming.map((s, idx) => (
                      <View key={idx} style={styles.streamingRow}>
                        <Text style={styles.streamingService}>{s.service}</Text>
                        <View style={s.type === 'subscription' ? styles.includedBadge : styles.priceBadge}>
                          <Text style={s.type === 'subscription' ? styles.includedText : styles.priceText}>
                            {s.type === 'subscription' ? 'Included' : s.price}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalActionButton}
                      onPress={() => {
                        addToWatchlist(selectedMovie);
                        setShowDetailsModal(false);
                      }}
                    >
                      <Text style={styles.modalActionText}>Add to Watchlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.modalActionButtonSecondary]}
                      onPress={() => {
                        addToSeenMovies(selectedMovie);
                        setShowDetailsModal(false);
                      }}
                    >
                      <Text style={styles.modalActionText}>Mark as Seen</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
  },
  scrollContent: {
    padding: 16,
  },
  movieCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  posterContainer: {
    position: 'relative',
    height: 400,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  metaSeparator: {
    marginHorizontal: 8,
    color: '#6B7280',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  genreTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  streamingSection: {
    marginBottom: 20,
  },
  streamingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  streamingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  streamingBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streamingText: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#EF4444',
  },
  seenButton: {
    backgroundColor: '#10B981',
  },
  watchlistButton: {
    backgroundColor: '#3B82F6',
  },
  detailsButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalPoster: {
    width: '100%',
    height: 250,
  },
  modalSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  ratingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingCardLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  ratingCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  streamingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  streamingService: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  includedBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  includedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  priceBadge: {
    backgroundColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C2410C',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionButtonSecondary: {
    backgroundColor: '#10B981',
  },
  modalActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
