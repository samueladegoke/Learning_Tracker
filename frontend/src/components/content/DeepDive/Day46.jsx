import CodeBlock from '../../CodeBlock'
import { Lightbulb, Music } from 'lucide-react'

export default function DeepDiveDay46() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Music className="w-6 h-6 text-primary-400" /> Musical Time Machine
                    </h2>
                    <p>
                        In Day 46, you build a <strong>Musical Time Machine</strong>—a project that scrapes
                        the Billboard Hot 100 chart for any date and automatically creates a Spotify playlist
                        with those songs. This combines web scraping (Beautiful Soup) with API integration (Spotify).
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Prerequisites:</strong> You need a Spotify account and must register an app at{' '}
                        <code>developer.spotify.com</code> to get your Client ID and Secret.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Scraping Billboard Hot 100
                    </h2>
                    <p>
                        The Billboard Hot 100 is available at a URL that accepts dates. Use Beautiful Soup
                        to extract song titles from the chart:
                    </p>
                    <CodeBlock code={`import requests
from bs4 import BeautifulSoup

# Get the date from user
date = input("Enter a date (YYYY-MM-DD): ")  # e.g., "2000-08-12"

# Fetch the Billboard chart for that date
url = f"https://www.billboard.com/charts/hot-100/{date}/"
response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

# Extract song titles (inspect the page for current selectors)
song_names = soup.select("li ul li h3")

songs = [song.getText().strip() for song in song_names]
print(f"Found {len(songs)} songs from {date}")`} language="python" />
                    <p className="text-surface-400 text-sm">
                        <strong>Note:</strong> Billboard's HTML structure changes. Always inspect the page
                        to find the current CSS selectors for song titles.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Spotify OAuth Setup
                    </h2>
                    <p>
                        Spotify uses OAuth 2.0 for authentication. You need to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-surface-300">
                        <li>Register your app at <code>developer.spotify.com</code></li>
                        <li>Get your <code>Client ID</code> and <code>Client Secret</code></li>
                        <li>Set a <code>Redirect URI</code> (e.g., http://localhost:8888/callback)</li>
                    </ul>
                    <CodeBlock code={`import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

# Load credentials from environment variables (NEVER hardcode!)
CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8888/callback"

# Create Spotify client with OAuth
sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=REDIRECT_URI,
        scope="playlist-modify-public",  # Permission to create playlists
        show_dialog=True,
        cache_path="token.txt"
    )
)

# Get current user info
user_id = sp.current_user()["id"]
print(f"Logged in as: {user_id}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Searching for Tracks
                    </h2>
                    <p>
                        Use Spotify's search API to find tracks. The search returns a nested dictionary
                        with track information:
                    </p>
                    <CodeBlock code={`# Search for a single song
def find_track_uri(song_name, year):
    """Search Spotify for a track and return its URI."""
    # Include year to improve accuracy for older songs
    query = f"track:{song_name} year:{year}"
    
    result = sp.search(q=query, type="track", limit=1)
    
    try:
        # Navigate the nested response
        track = result["tracks"]["items"][0]
        return track["uri"]  # e.g., "spotify:track:abc123"
    except IndexError:
        print(f"Could not find: {song_name}")
        return None

# Search for all Billboard songs
song_uris = []
year = date.split("-")[0]  # Extract year from date

for song in songs:
    uri = find_track_uri(song, year)
    if uri:
        song_uris.append(uri)

print(f"Found {len(song_uris)} out of {len(songs)} songs on Spotify")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Creating the Playlist
                    </h2>
                    <p>
                        Now create a new playlist and add all the found tracks:
                    </p>
                    <CodeBlock code={`# Create a new playlist
playlist_name = f"{date} Billboard Hot 100"

playlist = sp.user_playlist_create(
    user=user_id,
    name=playlist_name,
    public=True,
    description=f"Top 100 songs from {date}"
)

playlist_id = playlist["id"]
print(f"Created playlist: {playlist_name}")

# Add tracks to the playlist (max 100 per request)
if song_uris:
    sp.playlist_add_items(
        playlist_id=playlist_id,
        items=song_uris
    )
    print(f"Added {len(song_uris)} tracks to playlist!")
else:
    print("No tracks to add.")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Example
                    </h2>
                    <p>
                        Here's the full Musical Time Machine script:
                    </p>
                    <CodeBlock code={`import requests
from bs4 import BeautifulSoup
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

# Spotify credentials from environment
sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=os.environ.get("SPOTIFY_CLIENT_ID"),
        client_secret=os.environ.get("SPOTIFY_CLIENT_SECRET"),
        redirect_uri="http://localhost:8888/callback",
        scope="playlist-modify-public"
    )
)
user_id = sp.current_user()["id"]

# Get date and scrape Billboard
date = input("Which year do you want to travel to? (YYYY-MM-DD): ")
url = f"https://www.billboard.com/charts/hot-100/{date}/"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# Extract songs
song_elements = soup.select("li ul li h3")
songs = [song.getText().strip() for song in song_elements]

# Search Spotify
year = date.split("-")[0]
song_uris = []
for song in songs:
    result = sp.search(q=f"track:{song} year:{year}", type="track", limit=1)
    try:
        song_uris.append(result["tracks"]["items"][0]["uri"])
    except IndexError:
        pass

# Create and populate playlist
playlist = sp.user_playlist_create(user_id, f"{date} Billboard 100", True)
sp.playlist_add_items(playlist["id"], song_uris)

print(f"Created playlist with {len(song_uris)} songs!")`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Add the Year</h4>
                            <p className="text-sm text-surface-400">
                                When searching, include <code>year:YYYY</code> in your query to find the original version, not covers.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Handle Missing Songs</h4>
                            <p className="text-sm text-surface-400">
                                Wrap searches in try/except—some songs won't be on Spotify or have different titles.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Token Caching</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>cache_path</code> in SpotifyOAuth to save tokens and avoid re-authorizing each run.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">100 Track Limit</h4>
                            <p className="text-sm text-surface-400">
                                Spotify limits 100 tracks per add request. Use batching for larger playlists.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
