import { useCallback, useEffect, useRef, useState } from "react";

type NetworkStatus = "checking" | "good" | "slow" | "offline";

interface UseNetworkQualityOptions {
  pingUrl?: string;
  downloadUrl?: string;
  interval?: number;
  pingThresholdMs?: number;
  bandwidthThresholdMbps?: number;
  failCountThreshold?: number;
  onError?: (v: any) => void;
}

export function useNetworkQuality({
  pingUrl = "https://www.google.com/favicon.ico",
  downloadUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
  interval = 10000,
  pingThresholdMs = 300,
  bandwidthThresholdMbps = 2,
  failCountThreshold = 2,
  onError,
}: UseNetworkQualityOptions = {}): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>("checking");
  const failCountRef = useRef<number>(0);

  const currentControllersRef = useRef<AbortController[]>([]);

  const check = useCallback(async () => {
    currentControllersRef.current.forEach((controller) => controller.abort());
    currentControllersRef.current = [];

    const pingController = new AbortController();
    const downloadController = new AbortController();
    currentControllersRef.current.push(pingController, downloadController);

    try {
      const [ping, speed] = await Promise.all([
        measurePing(pingUrl, pingController.signal),
        measureDownloadSpeed(downloadUrl, downloadController.signal),
      ]);
      const isSlow = ping > pingThresholdMs || speed < bandwidthThresholdMbps;

      if (isSlow) {
        failCountRef.current += 1;
      } else {
        failCountRef.current = 0;
      }

      if (failCountRef.current >= failCountThreshold) {
        setStatus("slow");
      } else {
        setStatus("good");
      }
    } catch (err) {
      onError?.(err);
      setStatus("offline");
    }
  }, [
    pingUrl,
    downloadUrl,
    pingThresholdMs,
    bandwidthThresholdMbps,
    failCountThreshold,
  ]);

  useEffect(() => {
    check();

    const intervalId = setInterval(check, interval);

    const handleOnline = () => check();
    const handleOffline = () => check();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [check, interval]);

  return status;
}

const measurePing = async (
  url: string,
  signal: AbortSignal
): Promise<number> => {
  const start = performance.now();
  const response = await fetch(url, { cache: "no-store", signal });
  console.log("[useNetworkQuality] Ping:", await response.text());
  if (!response.ok) throw new Error("Ping failed");
  return performance.now() - start;
};

const measureDownloadSpeed = async (
  url: string,
  signal: AbortSignal
): Promise<number> => {
  const start = performance.now();
  const response = await fetch(url, { cache: "no-store", signal });
  const blob = await response.blob();
  const duration = (performance.now() - start) / 1000;
  const bits = blob.size * 8;
  return bits / duration / 1_000_000; // Mbps
};
