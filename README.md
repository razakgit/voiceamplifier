# 🎤 Voice Amplifier

A mobile voice amplification app designed for people with soft voices or sore throats who need to communicate clearly. Uses a push-to-talk system to record and play back amplified audio.

## 🌟 Features

- **Push-to-Talk Recording** - Hold button to record, release to play amplified
- **Adjustable Amplification** - 1x to 5x volume boost
- **Volume Presets** - Quick Low/Medium/High settings
- **Real-time Feedback** - Visual indicators for recording and playback
- **Mobile Optimized** - Responsive design for smartphones
- **Offline Capable** - Works without internet once loaded

## 📱 Live Demo

**Web App:** [https://razakgit.github.io/voiceamplifier/voice-amplifier.html](https://razakgit.github.io/voiceamplifier/voice-amplifier.html)

## 🚀 Quick Start

### Option 1: Use Web App (Easiest)

1. Open `voice-amplifier.html` in a mobile browser
2. Grant microphone permission
3. Hold the button to record
4. Release to play back amplified

### Option 2: Create APK (Standalone App)

#### Using Online APK Builder (Recommended)
1. Go to [AppsGeyser.com](https://appsgeyser.com)
2. Click "Create App" → "Website"
3. Enter: `https://razakgit.github.io/voiceamplifier/voice-amplifier.html`
4. Download the generated APK
5. Install on your Android phone

#### Using Cordova (Requires Android SDK)
```bash
cd cordova-app
cordova platform add android
cordova build android
```

### Option 3: Expo/React Native

```bash
npm install
npx expo start
```

## 📂 Project Structure

```
voiceamplifier/
├── voice-amplifier.html    # Standalone web app (RECOMMENDED)
├── App.js                   # Expo/React Native version
├── cordova-app/            # Cordova project for APK building
│   ├── config.xml          # Configured with microphone permissions
│   └── www/
│       └── index.html      # Voice amplifier web app
├── package.json            # Expo dependencies
└── README.md              # This file
```

## 🎯 How It Works

Since mobile operating systems don't allow real-time microphone-to-speaker amplification (to prevent feedback loops), this app uses a **push-to-talk** system:

1. **Press & Hold** - Starts recording your voice
2. **Speak** - Talk while holding the button
3. **Release** - Stops recording and immediately plays back amplified audio

## 🔧 Technical Details

- **Frontend:** HTML5, JavaScript, CSS3
- **Audio API:** Web Audio API / MediaRecorder API
- **Mobile Framework:** Expo (React Native) / Apache Cordova
- **Permissions:** Microphone access required

## ⚙️ Configuration

### Microphone Permissions

The app requires microphone permission. For the web version:
- **HTTPS required** for microphone access in browsers
- **localhost** also works for testing

### Cordova Config

Microphone permissions are pre-configured in `cordova-app/config.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

## 🛠️ Development

### Prerequisites
- Node.js v18+
- npm or yarn
- (Optional) Android Studio for APK building

### Install Dependencies

**For Expo version:**
```bash
npm install
```

**For Cordova version:**
```bash
cd cordova-app
npm install -g cordova
cordova platform add android
```

### Run Development Server

**Expo:**
```bash
npx expo start
```

**Web version:**
```bash
python -m http.server 8080
# Then open http://localhost:8080/voice-amplifier.html
```

## 📝 Use Cases

- **Sore Throat** - Amplify soft voice during illness
- **Quiet Speakers** - Help naturally soft-spoken people be heard
- **Noisy Environments** - Boost voice in loud settings
- **Accessibility** - Assist people with vocal challenges

## ⚠️ Important Notes

- **Audio Feedback:** Keep microphone away from speaker when playing back
- **Volume Safety:** Start with low amplification and increase gradually
- **Best Results:** Use headphones with microphone for optimal experience
- **Browser Compatibility:** Works best in Chrome/Safari on mobile

## 🌐 Deployment

### GitHub Pages (Free Hosting)

The web app is automatically deployed to GitHub Pages:
```
https://razakgit.github.io/voiceamplifier/voice-amplifier.html
```

### Create Standalone APK

Use the deployed GitHub Pages URL with any online APK builder:
- [AppsGeyser](https://appsgeyser.com)
- [WebIntoApp](https://webintoapp.com)
- [Appy Pie](https://appypie.com)

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👤 Author

**Abdul Razak**
- GitHub: [@razakgit](https://github.com/razakgit)

## 🙏 Acknowledgments

Built to help people with sore throats and soft voices communicate clearly during conversations.

---

**Note:** This app uses a push-to-talk system because real-time microphone-to-speaker amplification is not possible on mobile devices due to OS restrictions and feedback prevention mechanisms.
