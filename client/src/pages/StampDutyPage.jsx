import { useState, useMemo } from 'react';
import { Calculator, ExternalLink, ShieldCheck, AlertCircle, Scale, Building2, CheckCircle2 } from 'lucide-react';
import { indianStates, documentCategories, stateRules } from '../data/stampDutyData';
import LegalNotice from '../components/LegalNotice';

export default function StampDutyPage() {
  const [selectedState, setSelectedState] = useState('Delhi');
  const [selectedDocType, setSelectedDocType] = useState('rent-11-months');
  const [rent, setRent] = useState(25000);
  const [deposit, setDeposit] = useState(50000);
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [tenureMonths, setTenureMonths] = useState(11);
  const [capital, setCapital] = useState(100000);

  const stateData = stateRules[selectedState] || stateRules['Delhi'];
  const rule = stateData.rates[selectedDocType] || stateData.rates['rent-11-months'];

  const calculation = useMemo(() => {
    if (!rule || !rule.calculate) return { duty: 0, registration: 0, total: 0 };
    if (selectedDocType === 'rent-11-months') {
      return rule.calculate(Number(rent) || 0, Number(deposit) || 0, Number(tenureMonths) || 11);
    } else if (selectedDocType === 'rent-long-term' || selectedDocType === 'commercial-lease') {
      return rule.calculate(Number(rent) || 0, Number(deposit) || 0, Number(tenureMonths) || 12);
    } else if (selectedDocType === 'partnership-deed') {
      return rule.calculate(Number(capital) || 100000);
    } else {
      return rule.calculate(Number(propertyValue) || 0);
    }
  }, [rule, selectedDocType, rent, deposit, propertyValue, tenureMonths, capital]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <div className="text-sm font-black text-indigo-500">LEGAL COMPLIANCE TOOL</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Indian Stamp Duty & Registration Estimator</h1>
        <p className="mt-2 text-sm text-slate-500">
          Calculate estimated stamp duty, sub-registrar registration charges, and e-stamping rules across Indian states.
        </p>
      </div>

      <LegalNotice />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        {/* Controls Panel */}
        <section className="panel p-6 space-y-5">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
            <Calculator size={18} className="text-indigo-500" /> Transaction Parameters
          </div>

          <div>
            <label className="label">Select State / Union Territory</label>
            <select
              className="input"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
            >
              {indianStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Document / Instrument Type</label>
            <select
              className="input"
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value)}
            >
              {documentCategories.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Dynamic input fields depending on document type */}
          {(selectedDocType === 'rent-11-months' || selectedDocType === 'rent-long-term' || selectedDocType === 'commercial-lease') && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="label">Monthly Rent (INR)</label>
                <input
                  type="number"
                  className="input"
                  value={rent}
                  onChange={e => setRent(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Security Deposit (INR)</label>
                <input
                  type="number"
                  className="input"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                />
              </div>
              {selectedDocType !== 'rent-11-months' && (
                <div className="col-span-2">
                  <label className="label">Tenure (Months)</label>
                  <input
                    type="number"
                    className="input"
                    value={tenureMonths}
                    onChange={e => setTenureMonths(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}

          {(selectedDocType === 'sale-deed' || selectedDocType === 'gift-deed' || selectedDocType === 'mortgage-loan' || selectedDocType === 'relinquishment-deed') && (
            <div className="pt-2">
              <label className="label">
                {selectedDocType === 'mortgage-loan'
                  ? 'Loan / Mortgage Consideration (INR)'
                  : selectedDocType === 'relinquishment-deed'
                  ? 'Relinquished Share Market Value (INR)'
                  : selectedDocType === 'gift-deed'
                  ? 'Gift Property Market / Circle Rate Value (INR)'
                  : 'Market Value / Circle Rate Consideration (INR)'}
              </label>
              <input
                type="number"
                className="input"
                value={propertyValue}
                onChange={e => setPropertyValue(Number(e.target.value))}
              />
            </div>
          )}

          {selectedDocType === 'partnership-deed' && (
            <div className="pt-2">
              <label className="label">Total Partnership Capital Contribution (INR)</label>
              <input
                type="number"
                className="input"
                value={capital}
                onChange={e => setCapital(Number(e.target.value))}
              />
            </div>
          )}

          {(selectedDocType === 'affidavit' || selectedDocType === 'power-of-attorney' || selectedDocType === 'promissory-note' || selectedDocType === 'nda-service-contract' || selectedDocType === 'will-testament') && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300">
              <span className="font-bold">Standard Statutory Scale:</span> This legal instrument follows fixed non-judicial e-stamp paper & notary rates under the State Stamp Schedule.
            </div>
          )}

          {/* Official e-Stamping Portal Link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase">Official State e-Stamping Portal</div>
            <a
              href={stateData.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {stateData.portal} <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Results & Legal Guidance Panel */}
        <section className="space-y-4">
          <div className="panel p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Estimated Government Dues</h2>
              <span className={`badge ${rule.mandatoryRegistration ? 'badge-amber' : 'badge-green'}`}>
                {rule.mandatoryRegistration ? 'Mandatory Registration (Sec 17)' : 'Registration Optional'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wide">Stamp Duty</div>
                <div className="mt-1 text-xl font-black text-indigo-950 dark:text-indigo-200">
                  ₹{calculation.duty.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Registration Fee</div>
                <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                  ₹{calculation.registration.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Total Estimate</div>
                <div className="mt-1 text-xl font-black text-emerald-950 dark:text-emerald-200">
                  ₹{calculation.total.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Statutory Details */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Applicable Formula:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{rule.dutyText}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Registration Fee Rate:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{rule.regFeeText}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Attestation Required:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {rule.notaryRequired ? 'Notary Public Attestation Recommended' : 'Sub-Registrar Biometric Recording'}
                </span>
              </div>
            </div>

            {/* Humanized Practical Guidance */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-700 dark:text-slate-300">
                <Scale size={15} className="text-indigo-500" /> State Law Guidance ({selectedState}):
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {rule.guidance}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
