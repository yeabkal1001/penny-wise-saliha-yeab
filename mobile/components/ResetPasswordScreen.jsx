import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ResetPasswordScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRequestReset = async () => {
    if (!isLoaded) return;
    if (!emailAddress.trim()) {
      setError("Please enter your email.");
      return;
    }

    setIsPending(true);
    setError("");
    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        strategy: "reset_password_email_code",
      });

      if (attempt.status === "needs_first_factor") {
        setIsVerifying(true);
        return;
      }

      if (attempt.status === "needs_identifier") {
        setError("Please check your email and try again.");
        return;
      }

      await signIn.prepareFirstFactor({ strategy: "email_code" });
      setIsVerifying(true);
    } catch (err) {
      try {
        await signIn.create({ identifier: emailAddress.trim() });
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        setIsVerifying(true);
      } catch (fallbackError) {
        setError("Unable to send reset code. Please try again.");
        console.error(fallbackError);
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded) return;
    if (!code.trim()) {
      setError("Enter the verification code.");
      return;
    }
    if (!newPassword.trim()) {
      setError("Enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    setError("");
    try {
      let attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
      });

      if (attempt.status === "needs_new_password") {
        const resetAttempt = await signIn.resetPassword({ password: newPassword });
        if (resetAttempt.status === "complete") {
          await setActive({ session: resetAttempt.createdSessionId });
          router.replace("/");
          return;
        }
      }

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
        return;
      }

      attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (attempt.status === "needs_new_password") {
        const resetAttempt = await signIn.resetPassword({ password: newPassword });
        if (resetAttempt.status === "complete") {
          await setActive({ session: resetAttempt.createdSessionId });
          router.replace("/");
          return;
        }
      }

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
        return;
      }

      setError("Reset failed. Please try again.");
    } catch (err) {
      const message = err?.errors?.[0]?.message || "Reset failed. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}> 
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        ) : null}

        {!isVerifying ? (
          <>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor={COLORS.textDarkMuted}
              onChangeText={(value) => setEmailAddress(value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleRequestReset} disabled={isPending}>
              <Text style={styles.buttonText}>{isPending ? "Sending..." : "Send code"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={[styles.verificationInput, error && styles.errorInput]}
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.textDarkMuted}
              onChangeText={(value) => setCode(value)}
            />
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={newPassword}
              placeholder="New password"
              placeholderTextColor={COLORS.textDarkMuted}
              secureTextEntry={true}
              onChangeText={(value) => setNewPassword(value)}
            />
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={confirmPassword}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.textDarkMuted}
              secureTextEntry={true}
              onChangeText={(value) => setConfirmPassword(value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isPending}>
              <Text style={styles.buttonText}>{isPending ? "Saving..." : "Update password"}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 8 }}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
