# Movie Taste Learning App - MVP Design Specification

## (a) System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────┤
│  React/Next.js SPA                                                   │
│  ├─ Onboarding Flow (Pairwise Training)                             │
│  ├─ Personal Dashboard (Recommendations, Lists)                     │
│  ├─ Party Host/Join Interface                                       │
│  └─ Real-time Party Voting UI (WebSocket)                           │
└────────────────────┬────────────────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────┴────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  Express.js Server                                                   │
│  ├─ REST API (Auth, CRUD, Voting)                                   │
│  ├─ WebSocket Server (Socket.io)                                    │
│  └─ Session Management (JWT)                                        │
└────────────────────┬────────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────────────┐
│                        SERVICE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  TasteModelService                                                   │
│  │ ├─ Elo/Bradley-Terry scoring engine                              │
│  │ ├─ Feature-based prior computation                               │
│  │ ├─ Uncertainty/diversity active learning                         │
│  │ └─ Context-aware ranking (genre, mood, etc.)                     │
│                                                                       │
│  PartyService                                                        │
│  │ ├─ Party lifecycle management                                    │
│  │ ├─ Group utility computation (Borda + veto)                      │
│  │ ├─ Candidate set builder (filters + streaming)                   │
│  │ └─ Consensus detection                                           │
│                                                                       │
│  ContentService                                                      │
│  │ ├─ TMDb API client                                               │
│  │ ├─ Metadata enrichment & caching                                 │
│  │ ├─ Provider availability lookup                                  │
│  │ └─ Feature vector extraction                                     │
│                                                                       │
│  TraktService (future)                                               │
│    └─ OAuth flow + history import                                   │
└────────────────────┬────────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL                                                          │
│  ├─ User & Auth tables                                              │
│  ├─ Movie metadata cache                                            │
│  ├─ PairwiseVote history                                            │
│  ├─ UserFlags (seen/liked/not-interested)                           │
│  ├─ Party & voting state                                            │
│  └─ Computed scores/rankings (materialized)                         │
│                                                                       │
│  Redis (optional, for party state & caching)                        │
└─────────────────────────────────────────────────────────────────────┘

                     │
┌────────────────────┴────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────────┤
│  TMDb API v3 (metadata, posters, watch providers)                   │
│  Trakt API (future OAuth import)                                    │
│  JustWatch (future license for availability)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## (b) Algorithm Specifications

### 1. Elo Rating System with Feature Prior

**Initialization:**
```
base_prior = 1500
feature_adjustment = weighted_sum([
  genre_affinity * 100,        // user's avg performance in this genre
  decade_affinity * 50,         // recency bias or nostalgia
  runtime_fit * 30,             // preference for length
  language_match * 40,          // native language boost
  keyword_overlap * 20          // thematic elements
])

initial_score = base_prior + feature_adjustment
uncertainty = 350  // high initially, decreases with votes
```

**Update Rule (after A vs B):**
```
K = 32 * (uncertainty_a + uncertainty_b) / 700  // adaptive K-factor
expected_a = 1 / (1 + 10^((score_b - score_a) / 400))

if outcome == "A_win":
  score_a += K * (1 - expected_a)
  score_b += K * (0 - (1 - expected_a))
elif outcome == "B_win":
  score_a += K * (0 - expected_a)
  score_b += K * (1 - expected_a)
elif outcome == "abstain":
  // Log only, no score update
  // Treat as high uncertainty signal

uncertainty_a *= 0.98  // decay with each comparison
uncertainty_b *= 0.98
```

**Context Tags:**
- Store tags like `["comedy", "date_night", "solo"]` with each vote
- Compute context-specific scores: `score_context = base_score + context_delta`
- Delta computed from votes within that context only

---

### 2. Active Pairing (Uncertainty Sampling)

**Goal:** Select next pair to maximize information gain.

```python
# Pseudocode
def select_next_pair(user_id, context_tags=None, pool_size=100):
    # 1. Get candidate pool
    candidates = get_unseen_movies(user_id, limit=pool_size)

    # 2. Filter by context if provided
    if context_tags:
        candidates = filter_by_tags(candidates, context_tags)

    # 3. Score each potential pair
    pairs = []
    for i, movie_a in enumerate(candidates):
        for movie_b in candidates[i+1:]:
            # Information gain = uncertainty * outcome_ambiguity
            uncertainty = (movie_a.uncertainty + movie_b.uncertainty) / 2
            score_diff = abs(movie_a.score - movie_b.score)
            ambiguity = 1 / (1 + score_diff / 200)  // higher when scores close

            # Diversity bonus: avoid genre-identical pairs
            diversity = 1 - jaccard_similarity(movie_a.genres, movie_b.genres)

            # Prioritize recent/popular to keep user engaged
            recency_factor = (movie_a.popularity + movie_b.popularity) / 2000

            score = (uncertainty * 0.4 + ambiguity * 0.4 + diversity * 0.15 + recency_factor * 0.05)
            pairs.append((movie_a, movie_b, score))

    # 4. Return top pair
    return max(pairs, key=lambda x: x[2])[:2]
```

**Abstain Handling:**
- If user abstains, increase similarity penalty for that genre/feature combo
- Surface more diverse pairs next time

---

### 3. Group Utility (Borda Count with Veto)

**Scenario:** Party with N members selecting from M candidates.

```python
def compute_group_utility(party_id, candidates):
    members = get_party_members(party_id)

    # 1. Get each member's personal ranking
    member_rankings = {}
    for member in members:
        # Rank candidates by Elo score (context-aware if filters applied)
        ranked = sorted(candidates, key=lambda m: get_user_score(member.id, m.id), reverse=True)
        member_rankings[member.id] = ranked

    # 2. Apply veto (seen/not-interested)
    vetoed = set()
    for member in members:
        flags = get_user_flags(member.id, [c.id for c in candidates])
        vetoed.update([f.movie_id for f in flags if f.seen or f.not_interested])

    candidates = [c for c in candidates if c.id not in vetoed]

    # 3. Borda count
    borda_scores = {c.id: 0 for c in candidates}
    for member_id, ranking in member_rankings.items():
        for rank, movie in enumerate(ranking):
            if movie.id not in vetoed:
                points = len(candidates) - rank  # top = most points
                borda_scores[movie.id] += points

    # 4. Return sorted by group utility
    return sorted(candidates, key=lambda c: borda_scores[c.id], reverse=True)
```

**Alternative (Mean Elo):**
```python
def compute_group_utility_mean(party_id, candidates):
    members = get_party_members(party_id)

    # Veto step same as above
    vetoed = apply_vetos(members, candidates)
    candidates = [c for c in candidates if c.id not in vetoed]

    # Mean Elo across members
    for candidate in candidates:
        scores = [get_user_score(m.id, candidate.id) for m in members]
        candidate.group_score = mean(scores)

    return sorted(candidates, key=lambda c: c.group_score, reverse=True)
```

---

### 4. Watch Party Consensus Rules

**Real-time voting:** Yes / No / Seen / Save

**Consensus on first majority:**
```python
def check_consensus(party_id, movie_id, threshold=0.7):
    votes = get_party_votes(party_id, movie_id)
    members = get_party_members(party_id)

    yes_count = count(votes, vote="yes")
    no_count = count(votes, vote="no")
    seen_count = count(votes, vote="seen")

    # Treat "seen" as veto (skip this movie)
    if seen_count > 0:
        return "skip", "Already seen by someone"

    # Require threshold % "yes" and no hard "no"
    yes_ratio = yes_count / len(members)
    if yes_ratio >= threshold and no_count == 0:
        return "match", movie_id

    # If majority "no" or mixed after timeout, skip
    if no_count / len(members) > 0.5:
        return "skip", "Majority passed"

    return "pending", None
```

**Fallback after K rounds (e.g., 10):**
```python
def finalize_party(party_id, max_rounds=10):
    current_round = get_party_round(party_id)

    if current_round >= max_rounds:
        # Show Top-3 for final approval vote
        top_3 = get_top_candidates(party_id, limit=3)
        return "final_vote", top_3

    return "continue", None
```

---

### 5. Candidate Filtering

**Applied before group utility:**
```python
def build_candidate_set(party_id, filters, limit=50):
    party = get_party(party_id)
    members = get_party_members(party_id)

    # 1. Streaming service filter
    if party.services_mode == "intersection":
        available_services = set.intersection(*[set(m.services) for m in members])
    else:  # "any"
        available_services = set.union(*[set(m.services) for m in members])

    # 2. Query movies with providers in available_services
    candidates = query_movies_by_providers(available_services, limit=500)

    # 3. Apply filters
    if filters.get("genres"):
        candidates = [c for c in candidates if any(g in c.genres for g in filters["genres"])]

    if filters.get("runtime_max"):
        candidates = [c for c in candidates if c.runtime <= filters["runtime_max"]]

    if filters.get("decade"):
        start = filters["decade"]
        end = start + 9
        candidates = [c for c in candidates if start <= c.year <= end]

    if filters.get("min_rating"):
        candidates = [c for c in candidates if c.tmdb_rating >= filters["min_rating"]]

    # 4. Limit to top N by group utility
    return compute_group_utility(party_id, candidates)[:limit]
```

---

## (c) API Contract

### REST Endpoints

#### Authentication
```
POST   /api/auth/register
       Body: { name, email, password }
       Response: { user_id, token }

POST   /api/auth/login
       Body: { email, password }
       Response: { user_id, token }
```

#### User Profile
```
GET    /api/users/me
       Response: { id, name, services[], created_at }

PATCH  /api/users/me/services
       Body: { services: ["netflix", "hulu", ...] }
       Response: { updated: true }
```

#### Pairwise Training
```
GET    /api/training/next-pair?context_tags=comedy,solo
       Response: {
         movie_a: { id, title, year, poster, genres, runtime },
         movie_b: { id, title, year, poster, genres, runtime }
       }

POST   /api/training/vote
       Body: {
         movie_a: id,
         movie_b: id,
         outcome: "A_win" | "B_win" | "abstain",
         context_tags: ["comedy"]
       }
       Response: { success: true, votes_count: 15 }
```

#### User Flags
```
POST   /api/flags/mark
       Body: { movie_id, seen: true, not_interested: false, liked: false }
       Response: { success: true }

GET    /api/flags/movie/:movie_id
       Response: { seen, not_interested, liked }
```

#### Recommendations
```
GET    /api/recommendations?context=date_night&genre=comedy&limit=20
       Response: {
         movies: [
           { id, title, year, score, confidence, poster, providers[] }
         ]
       }
```

#### Watch Party - Host
```
POST   /api/parties/create
       Body: {
         services_mode: "intersection" | "any",
         filters: { genres: ["comedy"], runtime_max: 120, min_rating: 7.0 }
       }
       Response: {
         party_id,
         code: "ABC123",
         qr_code_url,
         deep_link: "movieapp://party/ABC123"
       }

GET    /api/parties/:party_id
       Response: {
         id, host_id, code, services_mode, filters,
         members: [{ user_id, name, services[] }],
         status: "waiting" | "voting" | "matched",
         current_movie: { ... } | null,
         match: { ... } | null
       }

DELETE /api/parties/:party_id
       Response: { success: true }
```

#### Watch Party - Join
```
POST   /api/parties/join
       Body: { code: "ABC123" }
       Response: { party_id, host_name, members_count }
```

#### Watch Party - Candidates
```
GET    /api/parties/:party_id/candidates
       Response: {
         movies: [
           { id, title, poster, genres, runtime, group_score, providers[] }
         ],
         round: 3,
         max_rounds: 10
       }
```

---

### WebSocket Events (Socket.io)

**Client → Server**
```javascript
// Join party room
socket.emit("party:join", { party_id, user_id, token })

// Submit vote
socket.emit("party:vote", { party_id, movie_id, vote: "yes" | "no" | "seen" | "save" })

// Request next movie
socket.emit("party:next")
```

**Server → Client**
```javascript
// Member joined
socket.on("party:member_joined", { user_id, name, member_count })

// New movie presented
socket.on("party:new_movie", {
  movie: { id, title, poster, genres, runtime, synopsis },
  round: 5,
  max_rounds: 10
})

// Vote received
socket.on("party:vote_update", {
  movie_id,
  votes: { yes: 3, no: 1, seen: 0, save: 2 },
  voters: ["user1", "user2"],
  pending: ["user3"]
})

// Match found
socket.on("party:match", {
  movie: { ... },
  final_votes: { yes: 4, no: 0 }
})

// No consensus, final vote
socket.on("party:final_vote", {
  top_3: [{ ... }, { ... }, { ... }]
})

// Party ended
socket.on("party:ended", { reason: "match_found" | "host_closed" })
```

---

## (d) Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  services TEXT[] DEFAULT '{}',  -- ["netflix", "hulu", ...]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Movies (cached from TMDb)
CREATE TABLE movies (
  id_tmdb INTEGER PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  year INTEGER,
  genres TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  runtime INTEGER,  -- minutes
  language VARCHAR(10),
  tmdb_rating DECIMAL(3,1),
  popularity DECIMAL(10,2),
  poster_path VARCHAR(255),
  synopsis TEXT,
  embedding_vector VECTOR(768),  -- pgvector for future semantic search
  providers JSONB DEFAULT '{}',  -- { "US": ["netflix", "hulu"], ... }
  metadata_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_movies_year ON movies(year);
CREATE INDEX idx_movies_genres ON movies USING GIN(genres);
CREATE INDEX idx_movies_providers ON movies USING GIN(providers);

-- Pairwise Votes
CREATE TABLE pairwise_votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_a INTEGER NOT NULL REFERENCES movies(id_tmdb),
  movie_b INTEGER NOT NULL REFERENCES movies(id_tmdb),
  outcome VARCHAR(20) NOT NULL,  -- 'A_win', 'B_win', 'abstain'
  context_tags TEXT[] DEFAULT '{}',
  ts TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pairwise_user ON pairwise_votes(user_id, ts DESC);
CREATE INDEX idx_pairwise_context ON pairwise_votes USING GIN(context_tags);

-- User-Movie Flags
CREATE TABLE user_flags (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL REFERENCES movies(id_tmdb),
  seen BOOLEAN DEFAULT FALSE,
  not_interested BOOLEAN DEFAULT FALSE,
  liked BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, movie_id)
);

CREATE INDEX idx_flags_user_seen ON user_flags(user_id, seen) WHERE seen = TRUE;

-- User-Movie Scores (materialized for fast ranking)
CREATE TABLE user_movie_scores (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL REFERENCES movies(id_tmdb),
  context VARCHAR(50) DEFAULT 'general',  -- 'general', 'comedy', 'date_night', etc.
  score DECIMAL(10,2) DEFAULT 1500,
  uncertainty DECIMAL(10,2) DEFAULT 350,
  vote_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, movie_id, context)
);

CREATE INDEX idx_scores_user_context ON user_movie_scores(user_id, context, score DESC);
CREATE INDEX idx_scores_uncertainty ON user_movie_scores(user_id, uncertainty DESC);

-- Parties
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) UNIQUE NOT NULL,  -- e.g., "ABC123"
  services_mode VARCHAR(20) DEFAULT 'intersection',  -- 'intersection' or 'any'
  filters JSONB DEFAULT '{}',  -- { genres, runtime_max, decade, min_rating }
  status VARCHAR(20) DEFAULT 'waiting',  -- 'waiting', 'voting', 'matched', 'ended'
  match_movie_id INTEGER REFERENCES movies(id_tmdb),
  current_round INTEGER DEFAULT 0,
  max_rounds INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_parties_code ON parties(code);
CREATE INDEX idx_parties_host ON parties(host_id);
CREATE INDEX idx_parties_status ON parties(status) WHERE status IN ('waiting', 'voting');

-- Party Members
CREATE TABLE party_members (
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  services TEXT[] DEFAULT '{}',  -- snapshot of services at join time
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (party_id, user_id)
);

CREATE INDEX idx_party_members_party ON party_members(party_id);

-- Party Votes
CREATE TABLE party_votes (
  id BIGSERIAL PRIMARY KEY,
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL REFERENCES movies(id_tmdb),
  vote VARCHAR(10) NOT NULL,  -- 'yes', 'no', 'seen', 'save'
  round INTEGER NOT NULL,
  ts TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (party_id, user_id, movie_id, round)
);

CREATE INDEX idx_party_votes_party_movie ON party_votes(party_id, movie_id, round);

-- Trakt Integration (future)
CREATE TABLE trakt_tokens (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## (e) Minimal UI Flow

### 1. Onboarding (New User)

```
┌─────────────────────────────────────────┐
│  Welcome to TasteMatch!                 │
│                                          │
│  Let's learn your movie taste           │
│  through quick comparisons.             │
│                                          │
│  [Get Started]                          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Select your streaming services:        │
│                                          │
│  ☑ Netflix    ☑ Hulu    ☐ Prime        │
│  ☑ Disney+    ☐ HBO Max  ☐ Apple TV+   │
│                                          │
│  [Continue]                             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Which do you prefer?       [5/20]      │
│                                          │
│  ┌───────────┐      ┌───────────┐      │
│  │           │      │           │      │
│  │  Movie A  │      │  Movie B  │      │
│  │  Poster   │      │  Poster   │      │
│  │           │      │           │      │
│  └───────────┘      └───────────┘      │
│   The Shawshank      Inception         │
│   Redemption                            │
│   1994 | Drama       2010 | Sci-Fi      │
│                                          │
│  [Choose Left]  [Hard to Compare]       │
│                 [Choose Right]          │
│                                          │
│  💡 Tip: Go with your gut feeling!      │
└─────────────────────────────────────────┘
              ↓ (after 20+ comparisons)
┌─────────────────────────────────────────┐
│  Great! We've learned your taste.       │
│                                          │
│  Your top genres:                       │
│  🎭 Drama  🎬 Thriller  🤣 Comedy       │
│                                          │
│  [See Recommendations]                  │
│  [Start a Watch Party]                  │
└─────────────────────────────────────────┘
```

---

### 2. Personal Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  TasteMatch  👤 Profile  🎉 Start Party                     │
├─────────────────────────────────────────────────────────────┤
│  For You Today                                              │
│                                                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │
│  │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │  → [See All]          │
│  └────┘ └────┘ └────┘ └────┘ └────┘                       │
│  95%    92%    89%    87%    85%                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Quick Filters                                              │
│  [🤣 Comedy Only] [😱 Horror Only] [🕰️ Classics]          │
│  [🎭 Drama] [💑 Date Night] [+ Create Custom]             │
├─────────────────────────────────────────────────────────────┤
│  Keep Training                                              │
│  Compare 10 more movies → improve your matches by 15%      │
│  [Start Comparing]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Watch Party - Host Flow

```
┌─────────────────────────────────────────┐
│  Start a Watch Party                    │
│                                          │
│  Streaming Services:                    │
│  ⦿ Only movies we ALL have              │
│  ○ Movies ANY of us has                 │
│                                          │
│  Filters (optional):                    │
│  Genre: [Any ▼]                         │
│  Max Runtime: [120 min ─────○]         │
│  Min Rating: [7.0 ─○────]               │
│                                          │
│  [Create Party]                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Party Code: ABC123                     │
│  ┌─────────────────────────────────┐   │
│  │      [QR Code Here]              │   │
│  └─────────────────────────────────┘   │
│                                          │
│  Share: movieapp://party/ABC123         │
│  [Copy Link]                            │
│                                          │
│  Waiting for members... (2/4)           │
│  • Alice (you)                          │
│  • Bob                                  │
│                                          │
│  [Start Voting]                         │
└─────────────────────────────────────────┘
```

---

### 4. Watch Party - Join Flow

```
┌─────────────────────────────────────────┐
│  Join a Watch Party                     │
│                                          │
│  Enter Party Code:                      │
│  ┌─────────────────────────────────┐   │
│  │ [______]                        │   │
│  └─────────────────────────────────┘   │
│                                          │
│  Or scan QR code with your camera       │
│                                          │
│  [Join]                                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Alice's Party                          │
│                                          │
│  Members: Alice, Bob, You               │
│                                          │
│  Waiting for host to start...           │
└─────────────────────────────────────────┘
```

---

### 5. Watch Party - Voting Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Alice's Party  •  Round 3/10                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│               ┌──────────────────────┐                      │
│               │                      │                      │
│               │   Movie Poster       │                      │
│               │   (Large)            │                      │
│               │                      │                      │
│               └──────────────────────┘                      │
│                                                              │
│               The Grand Budapest Hotel                      │
│               2014 • Comedy, Drama • 100 min               │
│               ⭐ 8.1/10                                     │
│                                                              │
│     A writer encounters the owner of an aging high-class   │
│     hotel, who tells him of his early years serving as a   │
│     lobby boy in the hotel's glorious years...             │
│                                                              │
│     Available on: Netflix, Hulu                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Your Vote:                                                 │
│                                                              │
│  [👍 Yes, Let's Watch]  [👎 Not This One]                 │
│  [👁️ Already Seen]     [💾 Save for Later]                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Votes: 2/3 responded                                       │
│  ✅ Alice: Yes    ✅ Bob: Yes    ⏳ Charlie: pending       │
└─────────────────────────────────────────────────────────────┘
              ↓ (on consensus)
┌─────────────────────────────────────────────────────────────┐
│  🎉 Match Found!                                            │
│                                                              │
│               ┌──────────────────────┐                      │
│               │   Winning Movie      │                      │
│               │   Poster             │                      │
│               └──────────────────────┘                      │
│                                                              │
│     Everyone voted YES! 🎊                                  │
│                                                              │
│     Available on Netflix (all members have it)             │
│                                                              │
│     [Start Watching]  [Find Another]                       │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Fallback - Final Vote (No Consensus)

```
┌─────────────────────────────────────────────────────────────┐
│  Almost there! Pick your favorite:                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│  │   Movie 1      │  │   Movie 2      │  │   Movie 3      ││
│  │   Poster       │  │   Poster       │  │   Poster       ││
│  └────────────────┘  └────────────────┘  └────────────────┘│
│   The Shawshank       Inception          Interstellar      │
│   Redemption                                                │
│   Group Score: 87     Group Score: 85    Group Score: 83   │
│                                                              │
│   [Vote]             [Vote]             [Vote]             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Final round! Highest votes wins.                          │
└─────────────────────────────────────────────────────────────┘
```

---

## (f) Attribution & Legal Requirements

### TMDb Attribution (REQUIRED)

**Usage Terms:**
- Free tier: 50 requests/second (sufficient for MVP)
- Requires visible attribution on all pages showing TMDb data

**Attribution Requirements:**
```html
<!-- Footer or movie detail pages -->
<div class="tmdb-attribution">
  <img src="tmdb-logo.svg" alt="TMDb" />
  <p>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
  <a href="https://www.themoviedb.org">Visit TMDb</a>
</div>
```

**Image Attribution:**
- Poster URLs from TMDb remain hosted on their CDN
- Must include `alt` text: "Poster from TMDb"
- Do NOT scrape or rehost images

**Data Caching:**
- Cache movie metadata for up to 14 days
- Update watch provider data weekly (it changes frequently)
- Respect TMDb's `cache-control` headers

---

### Watch Provider Data

**TMDb Providers (v1 MVP):**
- Free with API key
- Coverage: 80+ countries, major services
- Updated by community (may have gaps)
- Attribution required (see above)

**JustWatch License (Future):**
- Commercial API: ~$500-2000/month depending on requests
- Higher accuracy, faster updates, deeper catalog
- Legal agreements required
- Plan migration path:
  1. Abstract provider lookup into `ContentService`
  2. Implement adapter pattern for TMDb vs JustWatch
  3. Feature flag to A/B test accuracy improvement
  4. Switch once revenue justifies cost

---

### Trakt OAuth Integration (Spec for Future)

**OAuth 2.0 Flow:**
```
1. User clicks "Import from Trakt"
2. Redirect to: https://trakt.tv/oauth/authorize
   ?client_id=YOUR_CLIENT_ID
   &redirect_uri=https://yourapp.com/trakt/callback
   &response_type=code
3. User authorizes
4. Trakt redirects to callback with `code`
5. Exchange code for access_token:
   POST https://api.trakt.tv/oauth/token
   { code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }
6. Store access_token + refresh_token in `trakt_tokens` table
7. Fetch watch history:
   GET https://api.trakt.tv/sync/history
   Headers: { Authorization: "Bearer {access_token}" }
8. Match Trakt IDs → TMDb IDs via:
   GET https://api.trakt.tv/search/tmdb/{tmdb_id}?type=movie
9. Mark all returned movies as "seen" in `user_flags`
```

**Token Refresh:**
- Access tokens expire in 90 days
- Implement background job to refresh before expiry
- Use `refresh_token` to get new `access_token`

---

### Privacy & GDPR Compliance

**User Data:**
- Email + password (hashed with bcrypt)
- Streaming service preferences
- Movie taste model (Elo scores)
- Watch history (flags: seen/liked/not-interested)

**User Rights:**
- Export data: JSON dump of votes, scores, flags
- Delete account: CASCADE delete via foreign keys
- Anonymize: Replace name/email with "Deleted User {UUID}"

**Data Retention:**
- Active users: indefinite
- Inactive (no login in 2 years): anonymize or delete
- Party data: delete 7 days after `ended_at`

---

### License Notes

**Open-Source Components:**
- React, Express, PostgreSQL: MIT License (commercial use OK)
- Socket.io: MIT License
- pgvector extension: PostgreSQL License

**API Terms:**
- TMDb: Non-commercial friendly, attribution required
- Trakt: Free tier for hobby projects; contact for commercial
- JustWatch: Commercial only, license required

**Recommendation:**
- Launch as free beta with TMDb attribution
- Add premium tier ($3-5/month) for JustWatch accuracy + no ads
- Use revenue to cover API costs + hosting

---

## Next Steps (Implementation Phases)

### Phase 1: Core Taste Model (Week 1-2)
- DB schema + migrations
- TMDb client + movie cache
- Elo/BT engine with feature priors
- REST API for pairwise training
- Basic React UI for onboarding (10+ comparisons)

### Phase 2: Recommendations (Week 3)
- Active pairing algorithm
- Context-aware scoring
- User flags (seen/liked)
- Recommendation endpoint
- Personal dashboard UI

### Phase 3: Watch Party MVP (Week 4-5)
- Party CRUD + WebSocket server
- Group utility (Borda/mean Elo)
- Candidate builder with filters
- Real-time voting UI
- Consensus detection

### Phase 4: Polish & Launch (Week 6)
- Streaming service picker
- Party code/QR generation
- Mobile-responsive UI
- TMDb attribution footer
- Deploy to production

### Phase 5: Future Features
- Trakt OAuth import
- JustWatch license integration
- Advanced filters (mood, actor, director)
- Social features (follow friends, shared lists)
- ML embeddings for semantic search

---

**End of Specification**
