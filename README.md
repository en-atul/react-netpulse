# ⚡ react-network-quality

A modern, lightweight React hook that **actively measures your internet connection quality**—combining real-time **ping latency** and **download speed** analysis.

Whether you're building a video conferencing app, a multiplayer game, or just want to warn users of poor connections, `react-network-quality` gives you the network insights `navigator.onLine` can’t.

---

### 🌍 Smarter than Just “Online”

> You know how some tools only tell you if you’re online or offline? That’s cool — but what if the connection is _really slow_ or laggy?
>
> `react-network-quality` gives you that next-level visibility.

Yes, libraries like [`react-detect-offline`](https://www.npmjs.com/package/react-detect-offline) are helpful for basic online checks.  
But this hook is here when you need **actual performance** indicators.

---

### 🧠 Features at a Glance

| Feature                        | `react-network-quality` |
| ------------------------------ | ----------------------- |
| ✅ Ping latency measurement    | Yes                     |
| ✅ Download speed check        | Yes                     |
| ✅ Real-time connection status | Yes                     |
| ✅ React **hook-based API**    | Yes                     |
| ✅ Fully typed (TypeScript)    | Yes                     |
| ✅ Customizable thresholds     | Yes                     |

---

### 📦 Installation

```bash
npm install react-network-quality
```

---

### ⚙️ Usage Example

```tsx
import { useNetworkQuality } from "react-network-quality";

function MyComponent() {
  const status = useNetworkQuality({
    pingUrl: "https://www.google.com/favicon.ico", // tiny & reliable
    downloadUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    interval: 10000, // check every 10s
    pingThresholdMs: 300,
    bandwidthThresholdMbps: 2,
    failCountThreshold: 2,
    onError: (error) => console.error("Network check failed:", error),
  });

  return <div>Network status: {status}</div>;
}
```

---

### 🔁 What Does It Return?

This hook returns one of four possible network states:

| Status     | Meaning                                                           |
| ---------- | ----------------------------------------------------------------- |
| `checking` | Currently measuring ping and download speed                       |
| `good`     | Fast ping and download — you're solid                             |
| `slow`     | Online, but with high latency or low speed — possibly degraded UX |
| `offline`  | Ping/download failed — you're likely disconnected                 |

---

### 🛠️ Configuration Options

Here’s the full breakdown of the options you can pass to `useNetworkQuality()`:

| Prop                     | Type                   | Default                                   | Description                                                             |
| ------------------------ | ---------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| `pingUrl`                | `string`               | `"https://www.google.com/favicon.ico"`    | A small static file used to measure latency. Should return 200 OK.      |
| `downloadUrl`            | `string`               | A large image hosted on Wikimedia Commons | Used to test download speed. Pick something near your users.            |
| `interval`               | `number`               | `10000` (ms)                              | Time between re-checks (in milliseconds).                               |
| `pingThresholdMs`        | `number`               | `300`                                     | Max ping allowed before marking connection as "slow".                   |
| `bandwidthThresholdMbps` | `number`               | `2`                                       | Minimum download speed in Mbps before marking connection as "slow".     |
| `failCountThreshold`     | `number`               | `2`                                       | How many consecutive failures are needed to trigger "slow" status.      |
| `onError`                | `(error: any) => void` | `undefined`                               | Optional callback when a ping or download fails. Use for logging/debug. |

---

### 🧠 Best Practices

- ✅ **Ping URL**: Use a small, reliably fast resource (like Google’s favicon).
- ✅ **Download URL**: Choose a large, cache-busted file from your own CDN or server.
- ✅ **Customize thresholds** to reflect what “good” and “slow” mean for your app’s UX.

---

### 🤝 Contributing

Want to help improve this package? Found a cool use case or bug?
Feel free to open issues or PRs!

---

### 📄 License

MIT — use it freely, contribute kindly.

---

> ⚡ Built for modern React apps that care about real user connectivity.

---
