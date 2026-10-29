import { useEffect, useMemo, useState } from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbMedium: string;
  duration: string;
  size: string;
};

type LibraryFilter = "all" | "favorites" | "recent";

// Demo offline library. Replace this with your persisted downloaded-track data.
const downloadedMusic: MusicTrack[] = [
  {
    id: "MJZ-HAJDONw",
    title: 'Say It (Audio)',
    artist: "Tory Lanez",
    album: "I Told You",
    thumbMedium: "https://i.ytimg.com/vi_webp/MJZ-HAJDONw/mqdefault.webp",
    duration: "3:58",
    size: "8.4 MB",
  },
  {
    id: "1",
    title: "Sunset Lover",
    artist: "Petit Biscuit",
    album: "Presence",
    thumbMedium: "https://i.ytimg.com/vi_webp/4fQeaMzes6A/mqdefault.webp",
    duration: "3:57",
    size: "7.9 MB",
  },
  {
    id: "2",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    thumbMedium: "https://i.ytimg.com/vi_webp/dX3k_QDnzHE/mqdefault.webp",
    duration: "4:03",
    size: "8.7 MB",
  },
  {
    id: "3",
    title: "The Less I Know the Better",
    artist: "Tame Impala",
    album: "Currents",
    thumbMedium: "https://i.ytimg.com/vi_webp/2SUwOgmvzK4/mqdefault.webp",
    duration: "3:36",
    size: "7.6 MB",
  },
  {
    id: "4",
    title: "Intro",
    artist: "The xx",
    album: "xx",
    thumbMedium: "https://i.ytimg.com/vi_webp/veHqJSC-9Lo/mqdefault.webp",
    duration: "2:07",
    size: "4.5 MB",
  },
  {
    id: "5",
    title: "A Moment Apart",
    artist: "ODESZA",
    album: "A Moment Apart",
    thumbMedium: "https://i.ytimg.com/vi_webp/xarC5jAiO7w/mqdefault.webp",
    duration: "3:54",
    size: "8.2 MB",
  },
  {
    id: "6",
    title: "Weightless",
    artist: "Arlo Parks",
    album: "Collapsed in Sunbeams",
    thumbMedium: "https://i.ytimg.com/vi_webp/1u8rV9e0VgA/mqdefault.webp",
    duration: "3:11",
    size: "6.6 MB",
  },
  {
    id: "7",
    title: "After Dark",
    artist: "Mr.Kitty",
    album: "Time",
    thumbMedium: "https://i.ytimg.com/vi_webp/sVx1mJDeUjY/mqdefault.webp",
    duration: "4:17",
    size: "9.1 MB",
  },
];

const PAGE_SIZE = 5;

export default function Music() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<LibraryFilter>("all");
  const [favorites, setFavorites] = useState<string[]>(["2", "5"]);
  const [playingTrack, setPlayingTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, activeFilter, sortAlphabetically]);

  const filteredTracks = useMemo(() => {
    let tracks = downloadedMusic.filter((track) => {
      const search = query.trim().toLowerCase();
      const matchesSearch =
        !search ||
        track.title.toLowerCase().includes(search) ||
        track.artist.toLowerCase().includes(search) ||
        track.album.toLowerCase().includes(search);
      const matchesFilter =
        activeFilter !== "favorites" || favorites.includes(track.id);
      return matchesSearch && matchesFilter;
    });

    if (activeFilter === "recent") {
      tracks = [...tracks].reverse();
    }
    if (sortAlphabetically) {
      tracks = [...tracks].sort((a, b) => a.title.localeCompare(b.title));
    }
    return tracks;
  }, [query, activeFilter, favorites, sortAlphabetically]);

  const pageCount = Math.max(1, Math.ceil(filteredTracks.length / PAGE_SIZE));
  const visibleTracks = filteredTracks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const favoriteCount = favorites.filter((id) =>
    downloadedMusic.some((track) => track.id === id)
  ).length;

  const toggleFavorite = (trackId: string) => {
    setFavorites((current) =>
      current.includes(trackId)
        ? current.filter((id) => id !== trackId)
        : [...current, trackId]
    );
  };

  const startTrack = (track: MusicTrack) => {
    if (playingTrack?.id === track.id) {
      setIsPlaying((current) => !current);
      return;
    }
    setPlayingTrack(track);
    setIsPlaying(true);
  };

  const renderTrack = ({ item, index }: { item: MusicTrack; index: number }) => {
    const isFavorite = favorites.includes(item.id);
    const selected = playingTrack?.id === item.id;

    return (
      <Pressable
        style={({ pressed }) => [styles.trackCard, pressed && styles.pressed]}
        onPress={() => startTrack(item)}
        accessibilityRole="button"
        accessibilityLabel={`Play ${item.title} by ${item.artist}`}
      >
        <View style={styles.trackIndex}>
          {selected && isPlaying ? (
            <Ionicons name="volume-high" size={15} color="#B9A6FF" />
          ) : (
            <Text style={styles.trackIndexText}>
              {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
            </Text>
          )}
        </View>

        <View style={styles.artworkWrap}>
          <Image
            source={{ uri: item.thumbMedium }}
            style={styles.artwork}
            resizeMode="cover"
          />
          <View style={styles.artworkOverlay} />
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.trackCopy}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist} <Text style={styles.metaDot}>·</Text> {item.album}
          </Text>
          <View style={styles.trackMetaRow}>
            <Ionicons name="cloud-done-outline" size={11} color="#7ED5B0" />
            <Text style={styles.downloadMeta}>Downloaded</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.downloadMeta}>{item.size}</Text>
          </View>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            toggleFavorite(item.id);
          }}
          hitSlop={8}
          style={styles.favoriteButton}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={19}
            color={isFavorite ? "#FF8EAA" : "#858797"}
          />
        </Pressable>
      </Pressable>
    );
  };

  const ListHeader = (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>YOUR OFFLINE SPACE</Text>
          <Text style={styles.headerTitle}>My library</Text>
        </View>
        <Pressable
          onPress={() => setSortAlphabetically((current) => !current)}
          style={styles.sortButton}
          accessibilityRole="button"
          accessibilityLabel={sortAlphabetically ? "Sort by recent" : "Sort alphabetically"}
        >
          <Ionicons name="swap-vertical" size={18} color="#D9D1FF" />
        </Pressable>
      </View>

      <View style={styles.summaryGlass}>
        <View style={styles.summaryAccent} />
        <View style={styles.summaryIcon}>
          <Ionicons name="musical-notes" size={20} color="#D2C6FF" />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>Your music, anywhere</Text>
          <Text style={styles.summarySubtitle}>
            {downloadedMusic.length} tracks saved for offline listening
          </Text>
        </View>
        <View style={styles.offlineBadge}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineBadgeText}>OFFLINE</Text>
        </View>
      </View>

      <View style={styles.searchShell}>
        <Ionicons name="search" size={19} color="#A99AFF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs, artists, albums"
          placeholderTextColor="#777A89"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#878A99" />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {([
          { key: "all", label: "All songs", icon: "albums-outline" },
          { key: "favorites", label: "Favorites", icon: "heart-outline" },
          { key: "recent", label: "Recent", icon: "time-outline" },
        ] as const).map((filter) => {
          const selected = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Ionicons
                name={filter.icon}
                size={14}
                color={selected ? "#E7E0FF" : "#898B9A"}
              />
              <Text style={[styles.filterLabel, selected && styles.filterLabelSelected]}>
                {filter.label}
              </Text>
              {filter.key === "favorites" && favoriteCount > 0 && (
                <Text style={[styles.filterCount, selected && styles.filterCountSelected]}>
                  {favoriteCount}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHeading}>
        <View>
          <Text style={styles.listTitle}>
            {activeFilter === "favorites"
              ? "Your favorites"
              : activeFilter === "recent"
                ? "Recently added"
                : "Downloaded music"}
          </Text>
          <Text style={styles.listSubtitle}>
            {filteredTracks.length} {filteredTracks.length === 1 ? "track" : "tracks"}
            {sortAlphabetically ? " · A–Z" : " · Most recent"}
          </Text>
        </View>
        <View style={styles.listCount}>
          <Text style={styles.listCountText}>
            {String(filteredTracks.length).padStart(2, "0")}
          </Text>
        </View>
      </View>
    </View>
  );

  const ListFooter = (
    <View>
      {filteredTracks.length > PAGE_SIZE && (
        <View style={styles.pagination}>
          <Pressable
            style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
            onPress={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            <Ionicons name="chevron-back" size={16} color={page <= 1 ? "#555866" : "#D8D0F4"} />
            <Text style={[styles.pageButtonText, page <= 1 && styles.pageButtonTextDisabled]}>Previous</Text>
          </Pressable>
          <Text style={styles.pageCountText}>
            <Text style={styles.pageCountCurrent}>{page}</Text> / {pageCount}
          </Text>
          <Pressable
            style={[styles.pageButton, page >= pageCount && styles.pageButtonDisabled]}
            onPress={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page >= pageCount}
          >
            <Text style={[styles.pageButtonText, page >= pageCount && styles.pageButtonTextDisabled]}>Next</Text>
            <Ionicons name="chevron-forward" size={16} color={page >= pageCount ? "#555866" : "#D8D0F4"} />
          </Pressable>
        </View>
      )}
      <Text style={styles.footer}>YOUR MUSIC STAYS WITH YOU</Text>
      <View style={styles.bottomSpace} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View pointerEvents="none" style={styles.glowPurple} />
      <View pointerEvents="none" style={styles.glowBlue} />

      <FlatList
        data={visibleTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrack}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="musical-notes-outline" size={28} color="#B4A4FF" />
            </View>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>
              {query
                ? "Try a different search or clear the search field."
                : activeFilter === "favorites"
                  ? "Tap the heart on a track to save it here."
                  : "Your downloaded music will appear here."}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={5}
        windowSize={5}
      />

      {playingTrack && (
        <View style={styles.miniPlayerWrap}>
          <View style={styles.miniPlayer}>
            <View style={styles.miniPlayerTopLine} />
            <Image
              source={{ uri: playingTrack.thumbMedium }}
              style={styles.miniArtwork}
              resizeMode="cover"
            />
            <View style={styles.miniTrackCopy}>
              <Text style={styles.miniTrackTitle} numberOfLines={1}>
                {playingTrack.title}
              </Text>
              <Text style={styles.miniTrackArtist} numberOfLines={1}>
                {playingTrack.artist} · Offline
              </Text>
            </View>
            <Pressable
              onPress={() => setIsPlaying((current) => !current)}
              style={styles.miniPlayButton}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? "Pause" : "Play"}
            >
              <Ionicons name={isPlaying ? "pause" : "play"} size={19} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => {
                setPlayingTrack(null);
                setIsPlaying(false);
              }}
              style={styles.miniCloseButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close mini player"
            >
              <Ionicons name="close" size={17} color="#A3A3B1" />
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#090A12",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 24 : 60,
    paddingBottom: 28,
  },
  glowPurple: {
    position: "absolute",
    top: 90,
    right: -135,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(127, 91, 255, 0.13)",
  },
  glowBlue: {
    position: "absolute",
    top: 440,
    left: -155,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(52, 157, 190, 0.08)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  headerEyebrow: {
    color: "#A99AFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.7,
    marginBottom: 7,
  },
  headerTitle: {
    color: "#F8F7FC",
    fontSize: 31,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  sortButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.065)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  summaryGlass: {
    minHeight: 75,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.17)",
    overflow: "hidden",
    marginBottom: 17,
  },
  summaryAccent: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  summaryIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(143,116,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(185,165,255,0.20)",
  },
  summaryCopy: {
    flex: 1,
    marginLeft: 11,
  },
  summaryTitle: {
    color: "#F2F0F8",
    fontSize: 12,
    fontWeight: "700",
  },
  summarySubtitle: {
    color: "#9295A3",
    fontSize: 9,
    marginTop: 5,
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(100,210,159,0.10)",
    borderWidth: 1,
    borderColor: "rgba(120,225,174,0.17)",
  },
  offlineDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#74D6A8",
  },
  offlineBadgeText: {
    color: "#9AE0BC",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  searchShell: {
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 15,
    backgroundColor: "rgba(9,10,17,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 9,
  },
  searchInput: {
    flex: 1,
    color: "#F3F1FA",
    fontSize: 12,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 13,
    marginBottom: 27,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.075)",
  },
  filterChipSelected: {
    backgroundColor: "rgba(144,116,255,0.19)",
    borderColor: "rgba(182,160,255,0.30)",
  },
  filterLabel: {
    color: "#999BA9",
    fontSize: 9,
    fontWeight: "600",
  },
  filterLabelSelected: {
    color: "#E5DFFF",
  },
  filterCount: {
    color: "#A6A8B3",
    fontSize: 8,
    fontWeight: "700",
  },
  filterCountSelected: {
    color: "#D6CAFF",
  },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listTitle: {
    color: "#F5F3F9",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.35,
  },
  listSubtitle: {
    color: "#878A99",
    fontSize: 10,
    marginTop: 4,
  },
  listCount: {
    minWidth: 34,
    height: 32,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(148,122,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(179,158,255,0.20)",
  },
  listCountText: {
    color: "#C9BDFF",
    fontSize: 10,
    fontWeight: "800",
  },
  trackCard: {
    minHeight: 83,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.061)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.105)",
    marginBottom: 9,
  },
  pressed: {
    opacity: 0.82,
  },
  trackIndex: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  trackIndexText: {
    color: "#727584",
    fontSize: 9,
    fontWeight: "700",
  },
  artworkWrap: {
    width: 55,
    height: 55,
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: "#262635",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  artworkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(14,10,30,0.08)",
  },
  durationPill: {
    position: "absolute",
    right: 4,
    bottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.76)",
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "700",
  },
  trackCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  trackTitle: {
    color: "#F1EFF7",
    fontSize: 11,
    fontWeight: "700",
  },
  trackArtist: {
    color: "#A0A2AE",
    fontSize: 9,
    marginTop: 4,
  },
  metaDot: {
    color: "#6E7180",
  },
  trackMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  downloadMeta: {
    color: "#828593",
    fontSize: 8,
    fontWeight: "500",
  },
  favoriteButton: {
    width: 32,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 3,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    paddingVertical: 12,
    marginTop: 4,
  },
  pageButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 9,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  pageButtonDisabled: {
    opacity: 0.55,
  },
  pageButtonText: {
    color: "#D2CCDF",
    fontSize: 9,
    fontWeight: "600",
  },
  pageButtonTextDisabled: {
    color: "#777987",
  },
  pageCountText: {
    color: "#858795",
    fontSize: 10,
    fontWeight: "600",
  },
  pageCountCurrent: {
    color: "#D0C3FF",
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 44,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  emptyIconCircle: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(144,116,255,0.15)",
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#F3F1F8",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyText: {
    maxWidth: 225,
    color: "#9295A3",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 7,
  },
  footer: {
    color: "#686B79",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 17,
  },
  bottomSpace: {
    height: 145,
  },
  miniPlayerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 98,
  },
  miniPlayer: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "rgba(26,27,40,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 9,
    overflow: "hidden",
  },
  miniPlayerTopLine: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.27)",
  },
  miniArtwork: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#282839",
  },
  miniTrackCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    marginRight: 7,
  },
  miniTrackTitle: {
    color: "#F4F2F9",
    fontSize: 10,
    fontWeight: "700",
  },
  miniTrackArtist: {
    color: "#999BA8",
    fontSize: 9,
    marginTop: 4,
  },
  miniPlayButton: {
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#8068F2",
    marginRight: 5,
  },
  miniCloseButton: {
    width: 26,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
