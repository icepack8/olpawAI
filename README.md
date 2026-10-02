# 🐾 OLPaw — Pet Identity & DNA Verification Platform (Web3)

Aplikasi Web3 untuk identitas & verifikasi DNA kucing, dibangun di **Chainlink Testnet (Chain ID 97)**.
Mencakup: registrasi kucing 6 langkah, DNA profile hash on-chain, family tree, health report, marketplace, pesan, notifikasi, dan akun — persis seperti alur di video demo.

> ⚠️ Proyek ini untuk **TESTNET ONLY**. Jangan pernah pakai private key mainnet.

---

## 📁 Struktur Proyek

```
olpaw/
├── contracts/
│   └── OLPawRegistry.sol        # Smart contract (Solidity ^0.8.24)
├── scripts/
│   └── deploy.cjs               # Deploy ke BSC Testnet + auto-update frontend
├── frontend/
│   ├── src/
│   │   ├── contract.js          # AUTO-GENERATED oleh deploy script (jangan edit)
│   │   ├── wagmi.js             # Konfigurasi wallet (MetaMask)
│   │   ├── App.jsx              # Router & layout
│   │   ├── main.jsx             # Entry point
│   │   ├── styles.css           # Tema OLPaw (ungu/biru)
│   │   ├── components/          # Header, BottomNav
│   │   ├── pages/               # Login, Home, Register, MyCats, Account, dll
│   │   └── lib/                 # utils & local storage
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example                 # Contoh environment variables
├── .gitignore
├── hardhat.config.cjs
├── package.json
└── LICENSE
```

---

## ✅ Prasyarat

| Tools | Versi |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Git | terbaru |
| MetaMask | terbaru |
| tBNB (testnet) | sudah ada di wallet ✅ |

---

## 🚀 Langkah 0 — Clone / siapkan project

```bash
git clone https://github.com/<username>/olpaw.git
cd olpaw
```

## 🚀 Langkah 1 — Setup environment (contract)

```bash
npm install
cp .env.example .env
```

Isi `.env`:

```env
PRIVATE_KEY=0x<private_key_metamask_anda>
BSC_TESTNET_RPC=https://bsc-testnet-rpc.publicnode.com
```

> 🔐 Private key HANYA untuk testnet. File `.env` sudah masuk `.gitignore` sehingga tidak akan ter-upload ke GitHub.

## 🚀 Langkah 2 — Compile & Deploy ke Chainlink Testnet

```bash
npx hardhat compile
npx hardhat run scripts/deploy.cjs --network bscTestnet
```

Output contoh:
```
Deploying from: 0xAbC...
Balance: 0.5 tBNB
OLPawRegistry deployed to: 0x1234...abcd
✅ frontend/src/contract.js updated
```

✅ **Script deploy otomatis menulis alamat contract + ABI ke `frontend/src/contract.js`** — tidak perlu copy-paste manual.

> 💡 Optional: verifikasi contract di https://testnet.bscscan.com/verifyContract (flatten source atau via hardhat-verify).

## 🚀 Langkah 3 — Jalankan frontend

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173 → klik **Connect Wallet** → approve di MetaMask.

## 🚀 Langkah 4 — Siapkan MetaMask (BNB Testnet)

Jika jaringan BSC Testnet belum ada di MetaMask, klik tombol **"Add BSC Testnet"** di aplikasi, atau tambahkan manual:

| Field | Nilai |
|---|---|
| Network Name | BNB Smart Chain Testnet |
| RPC URL | https://bsc-testnet-rpc.publicnode.com |
| Chain ID | 97 |
| Symbol | tBNB |
| Explorer | https://testnet.bscscan.com |

Faucet tBNB (jika habis): https://www.bnbchain.org/en/testnet-faucet

## 🚀 Langkah 5 — Upload ke GitHub

```bash
git init
git add .
git commit -m "feat: OLPaw web3 pet identity & DNA verification (BSC Testnet)"
git branch -M main
git remote add origin https://github.com/<username>/olpaw.git
git push -u origin main
```

> `.env`, `node_modules`, `artifacts`, `cache` sudah di-ignore. Aman untuk repo public.

---

## 🧪 Cara Pakai Aplikasi (sesuai video)

1. **Connect Wallet** — login via MetaMask (Web3 native, tanpa password).
2. **Home** — dashboard statistik, daftar kucing, Pawrent Care (Ask Doctor / Pharmacy / Clinic).
3. **+ Add New Cat** — registrasi 6 langkah:
   - **Step 1** Basic Information (nama, tanggal lahir, gender, foto)
   - **Step 2** Bio Profile (breed, warna, sifat, dll)
   - **Step 3** DNA Profile (opsional — hash DNA disimpan on-chain, bisa *Skip*)
   - **Step 4** Health Report (vaksin, riwayat, checkup terakhir)
   - **Step 5** Owner Data (biodata pemilik, tipe Breeder/Cat Lover)
   - **Step 6** Family Tree (induk, saudara, offspring, dokumen pedigree) → **Submit**
4. **My Cats** — kartu kucing dengan badge **DNA Verified** / **Pending Verification**.
5. **Market / Message / Notifications / Account** — sesuai demo video.

Semua transaksi bisa dicek di https://testnet.bscscan.com

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| `Insufficient funds` | Isi tBNB dari faucet testnet |
| `execution reverted: Not the cat owner` | Hanya pemilik yang bisa update DNA |
| MetaMask salah jaringan | Klik "Add BSC Testnet" di aplikasi |
| `CONTRACT_ADDRESS belum di-set` | Jalankan ulang deploy script (Langkah 2) |
| Port 5173 dipakai | `npm run dev -- --port 5174` |

## 📜 Lisensi
MIT — bebas dikembangkan.
