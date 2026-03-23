import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   LEGACYHUB AI TRADING — 100% DONNÉES LIVE
   ✅ Prix réels Binance WebSocket — mis à jour chaque seconde
   ✅ TradingView Charts avec MACD / RSI / BB / EMA — connectés aux actifs
   ✅ Ticker Strip TradingView en haut — toutes les paires live
   ✅ Fear & Greed Index live via Alternative.me API
   ✅ Volumes & Market Cap live via CoinGecko API
   ✅ News IA générées sur les vrais prix actuels via Claude
   ✅ Signaux IA calculés sur vrais mouvements de prix Binance
   ✅ Ordres auto et P&L recalculés sur prix réels en temps réel
═══════════════════════════════════════════════════════════════════════════ */

const C = {
  bg:"#ffffff", bgSoft:"#f8fafc", bgCard:"#ffffff",
  bgLight:"#f1f5f9", bgMuted:"#e8eef5",
  border:"#e2e8f0", borderMed:"#cbd5e1",
  text:"#0f172a", textMed:"#334155", textMuted:"#64748b", textLight:"#94a3b8",
  blue:"#2563eb", green:"#059669", red:"#dc2626",
  gold:"#d97706", purple:"#7c3aed", teal:"#0891b2",
  shadow:"rgba(15,23,42,0.07)",
};

const PAIR_META = {
  "BTCUSDT":  { base:"BTC",  label:"BTC/USDT",  color:"#f7931a", liquidity:"HIGH" },
  "ETHUSDT":  { base:"ETH",  label:"ETH/USDT",  color:"#627eea", liquidity:"HIGH" },
  "SOLUSDT":  { base:"SOL",  label:"SOL/USDT",  color:"#9945ff", liquidity:"HIGH" },
  "BNBUSDT":  { base:"BNB",  label:"BNB/USDT",  color:"#f3ba2f", liquidity:"MED"  },
  "AVAXUSDT": { base:"AVAX", label:"AVAX/USDT", color:"#e84142", liquidity:"MED"  },
  "ARBUSDT":  { base:"ARB",  label:"ARB/USDT",  color:"#28a0f0", liquidity:"MED"  },
  "LINKUSDT": { base:"LINK", label:"LINK/USDT", color:"#2a5ada", liquidity:"LOW"  },
  "DOGEUSDT": { base:"DOGE", label:"DOGE/USDT", color:"#c3a634", liquidity:"MED"  },
};
const SYMBOLS = Object.keys(PAIR_META);

const fmt = (n, d=2) => Number(n||0).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtP = (sym, p) => {
  if(!p||p===0) return "—";
  if(sym==="BTCUSDT") return fmt(p,0);
  if(sym==="DOGEUSDT"||p<0.01) return fmt(p,5);
  if(p<1) return fmt(p,4);
  return fmt(p,2);
};

/* ── Atoms ─────────────────────────────────────────────────────────── */
const Tag=({label,color=C.blue})=>(
  <span style={{background:color+"14",border:`1px solid ${color}30`,color,
    padding:"2px 7px",borderRadius:5,fontSize:9,fontFamily:"'IBM Plex Mono',monospace",
    fontWeight:700,letterSpacing:.8,whiteSpace:"nowrap"}}>{label}</span>
