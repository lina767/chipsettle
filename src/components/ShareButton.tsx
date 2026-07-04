import { useEffect, useRef, useState } from 'react';
import type { CompanyProfile } from '../lib/types';
import { buildResultsUrl, profileToParams } from '../lib/profile';
import { hasEstimateInputs } from '../lib/analysis';

/**
 * Share button with a redact toggle. The complete link (query + URL
 * fragment) reproduces the full result for whoever opens it — including
 * the support estimate — without those figures ever reaching a server
 * (see profile.ts). This toggle lets the user additionally choose NOT to
 * include the estimate at all for a given link, e.g. before forwarding to
 * an external party who shouldn't see payroll-level figures.
 */
export default function ShareButton({ profile }: { profile: CompanyProfile }) {
  const [open, setOpen] = useState(false);
  const [includeEstimate, setIncludeEstimate] = useState(true);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const estimateAvailable = hasEstimateInputs(profile);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl =
    includeEstimate && estimateAvailable
      ? origin + buildResultsUrl(profile)
      : `${origin}/results?${profileToParams(profile).toString()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the field is selectable as a fallback.
    }
  };

  return (
    <div className="relative no-print">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border hairline bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        aria-expanded={open}
      >
        🔗 Share
      </button>
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-[22rem] max-w-[90vw] rounded-lg border hairline bg-white shadow-lg p-4 z-50"
        >
          {estimateAvailable && (
            <label className="flex items-start gap-2 text-sm mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEstimate}
                onChange={(e) => {
                  setIncludeEstimate(e.target.checked);
                  setCopied(false);
                }}
                className="mt-0.5"
              />
              <span>
                Include support estimate
                <span className="block text-xs text-slate-500">
                  Your € figures — encoded client-side only, never sent to any server.
                </span>
              </span>
            </label>
          )}
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="mono flex-1 min-w-0 rounded border hairline px-2 py-1.5 text-[11px] text-slate-600 bg-slate-50"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {estimateAvailable
              ? includeEstimate
                ? '🔒 Estimate figures ride along in the link but never touch a server or log.'
                : 'ℹ This link omits your estimate — the recipient sees everything else and can add their own numbers.'
              : 'ℹ No estimate inputs to include — add R&D numbers in the wizard first if you want them in the link.'}
          </p>
        </div>
      )}
    </div>
  );
}
