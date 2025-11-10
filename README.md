# Movie Match - Native Mobile App

A mobile movie discovery app built with **Expo** and **React Native** that helps users find movies to watch by swiping through recommendations and organizing them into lists.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo Go app on your iOS/Android device
- Git

### Installation & Running

```bash
# Clone the repository
git clone <your-repo-url>
cd Movie-App

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Testing on Your Device

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android)
2. Run `npx expo start` in your terminal
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
4. The app will load on your device!

## 📱 Features (In Development)

### Current Status: Navigation Framework ✅

The app now has a complete navigation structure with 5 tabs:

- **Feed** - Browse movies one at a time (Coming Soon)
- **Search** - Search for movies and TV shows (Coming Soon)
- **Friends** - See what friends are watching (Coming Soon)
- **Party** - Create watch parties with friends (Coming Soon)
- **Profile** - Manage watchlists and preferences (Coming Soon)

### Planned Features

Based on `DESIGN_SPEC.md`:

#### 1. Feed Tab
- Browse movies with card-based interface
- Filter by Movies/TV Shows
- Show only subscribed streaming services
- Quick actions: Pass, Seen, Watchlist, Details
- Multiple ratings display (IMDb, RT, TMDb)

#### 2. Search Tab
- Search by title or genre
- Filter by year, rating, genre
- Add movies directly to watchlist

#### 3. Friends Tab
- Activity feed of friends' watching
- See friends' watchlists
- View custom lists
- Timestamps for all activities

#### 4. Watch Party Tab
- Create party with unique code (MN-####)
- Join existing parties
- Real-time voting (Yes/No/Seen)
- Smart recommendations
- Match celebration screen

#### 5. Profile Tab
- Watchlist management
- Movies I've Seen tracker
- Master Ranked List
- Custom lists (Holiday Favorites, Comedies, Date Night)
- Streaming service configuration

## 🏗️ Project Structure

```
Movie-App/
├── app/                      # Expo Router app directory
│   ├── (tabs)/              # Tab navigation group
│   │   ├── _layout.tsx      # Tab bar configuration
│   │   ├── index.tsx        # Feed screen (default)
│   │   ├── search.tsx       # Search screen
│   │   ├── friends.tsx      # Friends screen
│   │   ├── party.tsx        # Party screen
│   │   └── profile.tsx      # Profile screen
│   └── _layout.tsx          # Root layout
├── assets/                  # Images and static files
├── legacy-web/             # Previous HTML/web version
├── DESIGN_SPEC.md          # Complete feature specification
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── babel.config.js         # Babel configuration
└── tsconfig.json           # TypeScript configuration
```

## 🛠️ Technology Stack

- **Expo SDK 51** - React Native framework
- **Expo Router** - File-based navigation
- **React Native** - Mobile UI framework
- **TypeScript** - Type safety
- **Ionicons** - Icon library

## 📋 Development Workflow

1. **Pull latest changes:**
   ```bash
   git pull
   ```

2. **Start development server:**
   ```bash
   npx expo start
   ```

3. **Test on device:**
   - Open Expo Go and scan QR code
   - Changes will hot reload automatically

4. **Make changes:**
   - Edit files in `app/` directory
   - Save and see instant updates on your device

## 🎨 Design System

### Colors
- **Primary Purple:** `#8B5CF6`
- **Primary Pink:** `#EC4899`
- **Background:** `#F9FAFB`
- **Text Dark:** `#1F2937`
- **Text Light:** `#6B7280`

### Components
- Cards with rounded corners (`borderRadius: 20`)
- Shadow effects for depth
- Gradient backgrounds for primary actions
- Tab bar with active/inactive states

## 📡 API Integration (Future)

The app will integrate with:
- **TMDb API** - Movie data, posters, streaming availability
- **OMDb API** - IMDb and Rotten Tomatoes ratings

## 🔄 Version Control

This project uses Git. Key branches:
- **main** - Production-ready code
- **claude/movie-match-app-[session-id]** - Active development branch

## 📝 Next Steps

Features will be implemented incrementally based on `DESIGN_SPEC.md`. Follow-up development will focus on:

1. Sample movie data structure
2. Feed screen UI with movie cards
3. Swipe/button actions for movies
4. Watchlist and seen movies state management
5. Search functionality
6. Social features (Friends tab)
7. Watch Party real-time voting
8. API integration

## 🐛 Troubleshooting

### App won't load?
- Make sure you're on the same WiFi network as your computer
- Try restarting the Expo server (`npx expo start -c` to clear cache)
- Restart Expo Go app on your device

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
npx expo start --clear
```

## 📄 License

See `DESIGN_SPEC.md` for full specification details.

---

**Built with Expo** | **Powered by TMDb** | **Data from OMDb API**
