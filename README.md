# TaliKhata - Mobile Ledger App

A free, open-source mobile application for managing personal and business transactions. Keep track of who owes you and who you owe with ease.

## 🚀 Quick Start

### Prerequisites
- Android Device (or Emulator)
- **Linux**: Ubuntu/Debian recommended
- **Build Tools**: Python 3.10+, JDK 11+, Android SDK (via Buildozer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tafimofficial/tali_khata.git
   cd tali_khata
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python3 -m venv backend/venv
   source backend/venv/bin/activate

   # Install dependencies
   pip install -r backend/requirements.txt
   ```

3. **Mobile Build**
   ```bash
   cd mobile
   
   # Install Buildozer (Linux only)
   sudo apt-get update && sudo apt-get install -y git python3-pip autoconf libtool automake pkg-config python3-setuptools
   pip3 install buildozer
   
   # Initialize buildozer
   buildozer init
   
   # Build APK (debug release)
   buildozer android debug
   ```

4. **Install on Device**
   The APK will be generated at `mobile/bin/TaliKhata-0.0.1-debug.apk`.
   Connect your Android device and install the APK manually, or use `adb install`.

## 📂 Project Structure

```
tali_khata/
├── backend/            # Python/Flask API (Mocked for now)
├── frontend/           # React Native Web App
└── mobile/             # Kivy App (Android build)
```

## 📱 How It Works

TaliKhata allows you to:
- 👥 **Manage Contacts**: Add and view users.
- 💰 **Record Transactions**: Log money given or received.
- ⚖️ **Settle Debts**: Clear balances when payments are made.
- 📂 **View History**: See all transactions with timestamps.

## 🔧 Development

### Running the Backend (Mock)
The backend provides mock data for development.
```bash
cd backend
source venv/bin/activate
python3 main.py
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License.
