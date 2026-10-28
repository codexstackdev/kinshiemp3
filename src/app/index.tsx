import { useState } from "react";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ApiTrack } from "@/hooks/types";
import Card from "./components/card";
import { searchMusic } from "@/hooks/actions";

export default function Index() {
  const [query, setQuery] = useState("");
  const [apiResults, setResults] = useState<ApiTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert("Search for music", "Paste a link or enter a track name.");
      return;
    }
    setLoading(true);
    try {
      const data = await searchMusic(query);
      if (data.items.length > 0) {
        setResults(data.items); 
      } else {
        Alert.alert("No tracks found", "We couldn't find any music matching your search. Please check the spelling or try different keywords");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View pointerEvents="none" style={styles.glowViolet} />
      <View pointerEvents="none" style={styles.glowTeal} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}>
              <Ionicons name="musical-notes" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandName}>
                kinshie<Text style={styles.brandAccent}>mp3</Text>
              </Text>
              <Text style={styles.brandCaption}>MUSIC, READY WHEN YOU ARE</Text>
            </View>
          </View>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>ONLINE</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.kickerRow}>
            <View style={styles.kickerLine} />
            <Text style={styles.kicker}>YOUR SOUNDTRACK STARTS HERE</Text>
          </View>
          <Text style={styles.heroTitle}>
            Find it.{"\n"}
            <Text style={styles.heroTitleAccent}>Feel it.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Search a track, press play, and keep your favorites close.
          </Text>
        </View>

        <View style={styles.searchGlass}>
          <View style={styles.glassHighlight} />
          <Text style={styles.fieldLabel}>SEARCH TRACKS</Text>
          <View style={styles.searchInputShell}>
            <Ionicons
              name="search"
              size={19}
              color="#B7A8FF"
              style={styles.searchGlyph}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Song, artist, or music link"
              placeholderTextColor="#777D8C"
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              style={styles.searchInput}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={10}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#9C9EAA"
                  style={styles.clearGlyph}
                />
              </Pressable>
            )}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSearch}
            disabled={loading}
            accessibilityRole="button"
          >
            <Text style={styles.searchButtonText}>
              {loading ? `Processing search query` : "Find music"}
            </Text>
            {loading ? (
              <ActivityIndicator
                size={18}
                color="#FFFFFF"
                style={styles.searchArrow}
              />
            ) : (
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
                style={styles.searchArrow}
              />
            )}
          </Pressable>
          <View style={styles.searchFootnoteRow}>
            <Text style={styles.searchFootnote}>MP3</Text>
            <View style={styles.footnoteDivider} />
            <Text style={styles.searchFootnote}>
              Highest quality, automatically
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Your discoveries</Text>
            <Text style={styles.sectionSubtitle}>
              {apiResults.length} {apiResults.length === 1 ? "track" : "tracks"}{" "}
              to explore
            </Text>
          </View>
          <View style={styles.resultCount}>
            <Text style={styles.resultCountText}>
              {String(apiResults.length).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {apiResults.map((track) => {
          return <Card key={track.id} track={track} />;
        })}

        <View style={styles.permissionNote}>
          <View style={styles.noteIconCircle}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#C2B6FF"
            />
          </View>
          <Text style={styles.noteText}>
            Download only audio you own or have permission to save.
          </Text>
        </View>

        <Text style={styles.footer}>MADE FOR THE MOMENTS BETWEEN</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#080910",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 22 : 60,
    paddingBottom: 40,
  },
  glowViolet: {
    position: "absolute",
    top: 105,
    right: -132,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(133, 101, 255, 0.14)",
  },
  glowTeal: {
    position: "absolute",
    top: 490,
    left: -170,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "rgba(47, 177, 189, 0.075)",
  },
  header: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 48,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8068F2",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.42)",
    shadowColor: "#8068F2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  brandName: {
    color: "#F8F7FC",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.45,
  },
  brandAccent: {
    color: "#B9A9FF",
  },
  brandCaption: {
    color: "#7E8191",
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 1.45,
    marginTop: 4,
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6FE0AE",
  },
  onlineText: {
    color: "#B8BAC5",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  hero: {
    marginBottom: 30,
  },
  kickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 16,
  },
  kickerLine: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#B39FFF",
  },
  kicker: {
    color: "#B7A7FF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  heroTitle: {
    color: "#FCFBFF",
    fontSize: 49,
    lineHeight: 51,
    fontWeight: "800",
    letterSpacing: -2.4,
  },
  heroTitleAccent: {
    color: "#A995FF",
  },
  heroSubtitle: {
    maxWidth: 290,
    color: "#A1A2AF",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 13,
  },
  searchGlass: {
    position: "relative",
    padding: 17,
    borderRadius: 24,
    backgroundColor: "rgba(26,27,41,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.17)",
    marginBottom: 34,
    overflow: "hidden",
    shadowColor: "#5E4AB5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 5,
  },
  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  fieldLabel: {
    color: "#B7B7C5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.65,
    marginBottom: 11,
  },
  searchInputShell: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: "rgba(7,8,15,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  searchGlyph: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#F8F6FF",
    fontSize: 13,
    paddingVertical: 0,
  },
  clearGlyph: {
    paddingLeft: 8,
  },
  searchButton: {
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 12,
    backgroundColor: "#8068F2",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    shadowColor: "#8068F2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.25,
  },
  searchArrow: {
    marginLeft: 10,
  },
  searchFootnoteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 13,
    gap: 9,
  },
  searchFootnote: {
    color: "#A0A0AD",
    fontSize: 9,
    fontWeight: "600",
  },
  footnoteDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#B19EFF",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#F7F5FC",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.45,
  },
  sectionSubtitle: {
    color: "#9294A2",
    fontSize: 11,
    marginTop: 5,
  },
  resultCount: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(145,119,255,0.17)",
    borderWidth: 1,
    borderColor: "rgba(187,168,255,0.30)",
  },
  resultCountText: {
    color: "#D0C5FF",
    fontSize: 11,
    fontWeight: "800",
  },
  permissionNote: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.052)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
    marginTop: 7,
  },
  noteIconCircle: {
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(168,149,255,0.18)",
    marginRight: 10,
  },
  noteIcon: {},
  noteText: {
    flex: 1,
    color: "#A1A2AE",
    fontSize: 10,
    lineHeight: 16,
  },
  footer: {
    color: "#696C7A",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.8,
    textAlign: "center",
    marginTop: 26,
  },
});
