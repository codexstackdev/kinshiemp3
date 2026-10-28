import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ApiTrack } from "@/hooks/types";

type cardProps = {
  track: ApiTrack;
};

const Card = ({ track }: cardProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playerWidth, setPlayerWidth] = useState(0);
  const [isDownloaded, setDownloaded] = useState(false);
  const togglePlayer = (trackId: string) => {
    setPlayingId((current) => (current === trackId ? null : trackId));
  };

  const handleDownload = async () => {
    setDownloaded(true);
  };
  const isPlaying = playingId === track.id;
  return (
    <View key={track.id} style={styles.trackGlass}>
      <View style={styles.cardTopEdge} />
      <View style={styles.trackMainRow}>
        <View style={styles.coverWrap}>
          <Image
            source={{ uri: track.thumbMedium }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.coverShade} />
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>{track.duration}</Text>
          </View>
        </View>

        <View style={styles.trackDetails}>
          <View style={styles.audioLabel}>
            <View style={styles.audioLabelDot} />
            <Text style={styles.audioLabelText}>AUDIO</Text>
          </View>
          <Text style={styles.trackTitle} numberOfLines={2}>
            {track.title}
          </Text>
          <Text style={styles.trackViews}>
            <Ionicons name="eye-outline" size={12} color="#A895FF" />{" "}
            {track.viewCount} views
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.trackActions}>
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            isPlaying && styles.playButtonActive,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => togglePlayer(track.id)}
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying
              ? `Close player for ${track.title}`
              : `Play ${track.title}`
          }
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={14}
            color="#FFFFFF"
            style={styles.playGlyph}
          />
          <Text style={styles.playText}>
            {isPlaying ? "Close player" : "Play preview"}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.downloadButton,
            isDownloaded && styles.downloadButtonDone,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleDownload()}
          accessibilityRole="button"
          accessibilityLabel={`Download ${track.title} in highest available quality`}
        >
          <Ionicons
            name={isDownloaded ? "checkmark" : "download-outline"}
            size={17}
            color={isDownloaded ? "#8DE0B5" : "#D2C9FF"}
            style={styles.downloadGlyph}
          />
          <Text style={styles.downloadText}>
            {isDownloaded ? "Requested" : "Download"}
          </Text>
        </Pressable>
      </View>

      {isPlaying && (
        <View style={styles.playerPanel}>
          <View style={styles.playerTitleRow}>
            <Ionicons name="musical-notes" size={15} color="#B19FFF" />
            <Text style={styles.playerEyebrow}>NOW PLAYING</Text>
            <View style={styles.playerLivePill}>
              <Text style={styles.playerLiveText}>PREVIEW</Text>
            </View>
          </View>
          <View
            style={styles.videoFrame}
            onLayout={(event) => {
              const measuredWidth = Math.max(
                0,
                Math.floor(event.nativeEvent.layout.width),
              );
              setPlayerWidth((currentWidth) =>
                currentWidth === measuredWidth ? currentWidth : measuredWidth,
              );
            }}
          >
            {playerWidth > 0 && (
              <YoutubePlayer
                volume={100}
                width={playerWidth}
                forceAndroidAutoplay={true}
                height={Math.round((playerWidth * 9) / 16)}
                controls={false}
                preventFullScreen={true}
                videoId={track.id}
                play={isPlaying}
                webViewProps={{
                  allowsFullscreenVideo: false,
                  androidLayerType: "hardware",
                }}
                initialPlayerParams={{
                  controls: false,
                  rel: false,
                }}
                style={[
                  styles.webView,
                  {
                    width: playerWidth,
                    height: Math.round((playerWidth * 9) / 16),
                  },
                ]}
              />
            )}
          </View>
          <Text style={styles.playerCaption}>
            Playback opens in the embedded YouTube player.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  trackGlass: {
    padding: 13,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.072)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 14,
    overflow: "hidden",
  },
  buttonPressed: {
    opacity: 0.82,
  },
  cardTopEdge: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  trackMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverWrap: {
    width: 112,
    height: 91,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#252737",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15,10,35,0.08)",
  },
  durationPill: {
    position: "absolute",
    right: 6,
    bottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(4,5,9,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  trackDetails: {
    flex: 1,
    minHeight: 87,
    justifyContent: "center",
    marginLeft: 13,
  },
  audioLabel: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: "rgba(140,112,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(173,154,255,0.17)",
    marginBottom: 7,
  },
  audioLabelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#B7A8FF",
  },
  audioLabelText: {
    color: "#C8BDFF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  trackTitle: {
    color: "#F5F3FA",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  trackViews: {
    color: "#9699A7",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 7,
  },
  viewsGlyph: {
    color: "#A895FF",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.09)",
    marginTop: 13,
    marginBottom: 12,
  },
  trackActions: {
    flexDirection: "row",
    gap: 9,
  },
  playButton: {
    flex: 1,
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 13,
    backgroundColor: "#8C70FF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  playButtonActive: {
    backgroundColor: "#684ED1",
  },
  playGlyph: {
    marginLeft: 1,
  },
  playText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  downloadButton: {
    flex: 1,
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.065)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  downloadButtonDone: {
    backgroundColor: "rgba(88,197,148,0.13)",
    borderColor: "rgba(110,224,171,0.30)",
  },
  downloadGlyph: {},
  downloadText: {
    color: "#E9E6F1",
    fontSize: 11,
    fontWeight: "700",
  },
  playerPanel: {
    paddingTop: 14,
    marginTop: 13,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.11)",
  },
  playerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  playingIndicator: {
    height: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  playingBarShort: {
    width: 3,
    height: 6,
    borderRadius: 2,
    backgroundColor: "#B19FFF",
  },
  playingBarTall: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: "#B19FFF",
  },
  playingBarMedium: {
    width: 3,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#B19FFF",
  },
  playerEyebrow: {
    color: "#C3B7F9",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.25,
  },
  playerLivePill: {
    marginLeft: "auto",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  playerLiveText: {
    color: "#A4A6B2",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  videoFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    alignSelf: "stretch",
    overflow: "hidden",
    borderRadius: 15,
    backgroundColor: "#05060A",
    borderWidth: 0,
  },
  webView: {
    backgroundColor: "#05060A",
  },
  playerCaption: {
    color: "#7F8290",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 8,
  },
});
