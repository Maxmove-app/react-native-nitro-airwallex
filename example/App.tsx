import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Airwallex } from "react-native-nitro-airwallex";

export default function App() {
  const [status, setStatus] = useState("Ready");
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setStatus("Checking native module…");
    try {
      let rejected = false;
      try {
        await Airwallex.presentPaymentSheet(
          { id: "example-intent", clientSecret: "", amount: "1.00", currency: "EUR" },
          { environment: "sandbox", countryCode: "DE", captureMode: "manual" },
        );
      } catch (error) {
        if (!(error instanceof Error) || !/requires id and clientSecret/.test(error.message))
          throw error;
        rejected = true;
      }
      if (!rejected) throw new Error("Invalid input was accepted");
      if (await Airwallex.isWalletAvailable({ environment: "sandbox" })) {
        throw new Error("Unconfigured wallet reported available");
      }
      setStatus("Passed: native validation and wallet readiness");
    } catch {
      setStatus("Failed: check native installation and pinned dependency versions");
    } finally {
      setRunning(false);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Nitro Airwallex</Text>
          <Text>Native validation example · experimental alpha</Text>
          <Text>No credentials or payment requests are used.</Text>
          <Button title="Run native checks" disabled={running} onPress={run} />
          <Text accessibilityLiveRegion="polite" testID="validation-result">
            {status}
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, gap: 20 },
  title: { fontSize: 28, fontWeight: "600" },
});
