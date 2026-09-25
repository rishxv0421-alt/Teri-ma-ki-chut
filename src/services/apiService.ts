import { GameMarket, HistoryRecord, OutcomeType, OutcomeColor, ParityType } from '../types';
import { getColor, getType, getParity } from './analyticsEngine';

const API_ENDPOINTS: Record<GameMarket, string> = {
  '30S': 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json',
  '1M': 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  '3M': 'https://draw.ar-lottery01.com/WinGo/WinGo_3M/GetHistoryIssuePage.json'
};

/**
 * Calculates current market issue number based on universal time standards
 */
export function calculateCurrentIssue(market: GameMarket): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const sec = d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  const step = market === '1M' ? 60 : market === '3M' ? 180 : 30;
  const issueSeq = Math.floor(sec / step) + 1;
  return `${y}${m}${day}${String(issueSeq).padStart(4, '0')}`;
}

/**
 * Calculates remaining seconds in the active cycle
 */
export function getRemainingSeconds(market: GameMarket): number {
  const d = new Date();
  const s = d.getSeconds();
  if (market === '1M') return 60 - s;
  if (market === '3M') return 180 - ((d.getMinutes() * 60 + s) % 180);
  return 30 - (s % 30);
}

export function getCycleTotalSeconds(market: GameMarket): number {
  if (market === '1M') return 60;
  if (market === '3M') return 180;
  return 30;
}

export interface ApiFetchResult {
  records: HistoryRecord[];
  isVerified: boolean;
  error?: string;
}

interface RawApiRecord {
  issue?: string | number;
  issueNumber?: string | number;
  period?: string | number;
  IssueNumber?: string | number;
  issueNo?: string | number;
  number?: string | number;
  openNumber?: string | number;
  result?: string | number;
  Number?: string | number;
  time?: string;
  createTime?: string;
}

let inFlight = false;
let consecutiveFails = 0;

/**
 * Robust fetch with timeout, deduplication, JSON validation, and error recovery
 */
export async function fetchMarketHistory(market: GameMarket): Promise<ApiFetchResult> {
  if (inFlight) {
    return { records: [], isVerified: false, error: 'BUSY' };
  }

  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return { records: [], isVerified: false, error: 'OFFLINE' };
  }

  inFlight = true;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const url = `${API_ENDPOINTS[market]}?_t=${Date.now()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP_${res.status}`);
    }

    const data = await res.json();
    const rawList: RawApiRecord[] = data?.data?.list || data?.data?.data || data?.list || data?.data || [];

    if (!Array.isArray(rawList) || rawList.length === 0) {
      throw new Error('MALFORMED_OR_EMPTY_PAYLOAD');
    }

    const seenIssues = new Set<string>();
    const sanitized: HistoryRecord[] = [];

    for (const item of rawList) {
      const issueRaw = item.issue ?? item.issueNumber ?? item.period ?? item.IssueNumber ?? item.issueNo;
      const numRaw = item.number ?? item.openNumber ?? item.result ?? item.Number;

      if (issueRaw == null || numRaw == null) continue;

      const issueStr = String(issueRaw).trim();
      const numVal = Number(numRaw);

      // Strict validation rules: 0-9 number range, valid issue length, deduplication
      if (isNaN(numVal) || numVal < 0 || numVal > 9) continue;
      if (issueStr.length < 5 || seenIssues.has(issueStr)) continue;

      seenIssues.add(issueStr);

      const type: OutcomeType = getType(numVal);
      const parity: ParityType = getParity(numVal);
      const color: OutcomeColor = getColor(numVal);
      const timeStr = item.time || item.createTime || new Date().toLocaleTimeString();

      sanitized.push({
        issue: issueStr,
        number: numVal,
        type,
        parity,
        color,
        time: timeStr,
        verified: true, // Only genuine verified API records enter
        status: 'PENDING'
      });
    }

    consecutiveFails = 0;
    return {
      records: sanitized,
      isVerified: sanitized.length > 0
    };
  } catch (err: unknown) {
    consecutiveFails++;
    const errMsg = err instanceof Error ? err.message : 'NETWORK_ERROR';
    return {
      records: [],
      isVerified: false,
      error: errMsg
    };
  } finally {
    clearTimeout(timeoutId);
    inFlight = false;
  }
}
