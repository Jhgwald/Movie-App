# Movie Match App

A mobile-friendly movie discovery app that helps users find movies to watch by swiping through recommendations and organizing them into lists.

## Features

### 1. Feed Tab (Primary Interface)
- Browse movies one at a time with detailed information
- Filter by Movies/TV Shows
- Toggle to show only movies from your streaming services
- View movie cards with:
  - High-quality poster images
  - Multiple ratings (IMDb, Rotten Tomatoes, TMDb)
  - Year, runtime, and genres
  - Brief description
  - Available streaming services
- Quick actions: Pass, Seen, Watchlist, Details

### 2. Search Tab
- Search movies by title or genre
- Browse all available movies
- Add movies directly to watchlist
- View detailed information

### 3. Friends Tab
- See what friends are watching
- View friends' watchlist additions
- Track friends' custom lists
- Social activity feed with timestamps

### 4. Watch Party Tab
- Create watch parties with unique codes
- Join existing parties with party codes
- Collaborative movie matching
- Real-time voting (Yes/No/Seen)
- Celebration screen when everyone matches
- See which streaming services have the matched movie

### 5. Profile Tab
- Manage your Watchlist
- Track Movies You've Seen
- Master Ranked List (top-rated movies)
- Create custom lists (Holiday Favorites, Comedies, Date Night, etc.)
- Configure streaming service subscriptions
- View attribution for data sources

## How to Use

### Getting Started

1. **Open the App**: Simply open `index.html` in any modern web browser
2. **No Installation Required**: The app runs entirely in the browser using React CDN

### Browsing Movies (Feed Tab)

1. Start on the Feed tab (home icon)
2. Toggle between Movies and TV Shows
3. Enable "Show only my services" to filter by your subscriptions
4. Review each movie card with all the details
5. Take action:
   - **Pass** (red) - Skip this movie
   - **Seen** (green) - Mark as watched
   - **List** (blue) - Add to watchlist
   - **Details** (purple) - View full information

### Using Watch Party

1. Navigate to the Party tab (users icon)
2. **To Create a Party**:
   - Click "Create Party"
   - Enter a party name
   - Share the generated code (e.g., MN-1234) with friends
   - Wait for friends to join
   - Click "Start Matching"
   - Vote on movies (Yes/No/Seen)
   - Celebrate when you find a match!

3. **To Join a Party**:
   - Enter the party code
   - Click "Join Party"
   - Start voting with your friends

### Managing Your Profile

1. Navigate to the Profile tab (list icon)
2. View your watchlist and seen movies
3. Configure your streaming services:
   - Check the services you subscribe to
   - This filters movies in the feed when enabled
4. Create custom lists for better organization

### Searching for Movies

1. Navigate to the Search tab (search icon)
2. Type a movie title or genre
3. Browse results
4. Add movies to your watchlist or view details

## Technology Stack

- **React 18** - UI framework (via CDN)
- **Tailwind CSS** - Styling and responsive design
- **Babel Standalone** - JSX transformation
- **Vanilla JavaScript** - State management with React Hooks

## Sample Movies Included

The prototype includes 10 popular movies:

1. The Grand Budapest Hotel (2014)
2. Everything Everywhere All at Once (2022)
3. Knives Out (2019)
4. Parasite (2019)
5. Dune (2021)
6. The Shawshank Redemption (1994)
7. Inception (2010)
8. Interstellar (2014)
9. Barbie (2023)
10. Oppenheimer (2023)

## Streaming Services Supported

- Netflix
- Hulu
- Disney+
- Amazon Prime
- HBO Max
- Apple TV+
- Paramount+
- Peacock
- Showtime
- Starz

## Design Features

- **Mobile-First**: Optimized for mobile devices (max-width 448px)
- **Modern UI**: Purple/pink gradient theme with smooth transitions
- **Clean Typography**: Large headings, readable body text
- **Color Coding**:
  - Green: Seen/Positive actions
  - Blue: Watchlist
  - Red: Pass/Negative actions
  - Purple: Details/Primary brand
  - Yellow: IMDb ratings
  - Red: Rotten Tomatoes
  - Blue: TMDb ratings

## Data Attribution

- **TMDb API** - Movie data, posters, and streaming availability
- **OMDb API** - IMDb and Rotten Tomatoes ratings

As per legal requirements:
- "Powered by TMDb" attribution is displayed
- OMDb attribution included in footer

## Future Enhancements

Features planned for future versions:

- Real swipe gesture support (currently button-based)
- Settings modal with advanced preferences
- TV shows functionality
- Advanced search filters (year, rating, genre)
- Create and manage custom lists
- Rank and reorder movies in lists
- Real friends social features with user accounts
- Push notifications for watchlist overlaps
- Deep links to streaming services
- Machine learning recommendations based on viewing history
- Integration with live TMDb and OMDb APIs

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

This is a single-file prototype for demonstration purposes. For production:

1. Set up a proper React project with build tools
2. Integrate real APIs (TMDb, OMDb)
3. Add user authentication
4. Implement backend for watch parties
5. Add real-time features with WebSockets
6. Implement persistent storage

## License

See DESIGN_SPEC.md for full specification details.

---

**Powered by TMDb** | **Data from OMDb API**
