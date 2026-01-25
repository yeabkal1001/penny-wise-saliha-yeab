import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")?.[0];
const fallback = host ? `http://${host}:5001/api` : "http://localhost:5001/api";
const envUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL =
	envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")
		? envUrl
		: fallback;
