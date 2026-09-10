export const indianStates = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other States & UTs (Central Schedule)'
];

export const documentCategories = [
  { id: 'sale-deed', name: 'Property Sale Deed / Conveyance' },
  { id: 'rent-11-months', name: 'Residential Rent (Up to 11 Months)' },
  { id: 'rent-long-term', name: 'Residential Lease (> 11 Months)' },
  { id: 'commercial-lease', name: 'Commercial Lease Agreement' },
  { id: 'gift-deed', name: 'Gift Deed (Family Transfer)' },
  { id: 'power-of-attorney', name: 'General Power of Attorney (GPA)' },
  { id: 'promissory-note', name: 'Promissory Note (On Demand)' },
  { id: 'affidavit', name: 'Affidavit / Sworn Declaration' },
  { id: 'partnership-deed', name: 'Partnership Deed / LLP Agreement' },
  { id: 'nda-service-contract', name: 'Non-Disclosure Agreement (NDA) & Service Contract' },
  { id: 'mortgage-loan', name: 'Mortgage Deed / Loan Agreement' },
  { id: 'relinquishment-deed', name: 'Relinquishment / Release Deed' },
  { id: 'will-testament', name: 'Will / Testamentary Instrument' }
];

export const defaultCentralRule = {
  portal: 'Stock Holding Corporation (SHCIL) / National e-Stamping',
  portalUrl: 'https://www.shcilestamp.com/',
  rates: {
    'sale-deed': {
      dutyText: '6% of Property Market / Circle Rate Value',
      regFeeText: '1% of Market Value',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (value = 0) => {
        const duty = Math.round(value * 0.06);
        const registration = Math.round(value * 0.01);
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Conveyance/Sale Deeds require registration with two witnesses at the local Sub-Registrar Office (SRO).'
    },
    'rent-11-months': {
      dutyText: '₹100 (Non-Judicial Stamp Paper / e-Stamp)',
      regFeeText: 'Nil (Not required for <= 11 months)',
      mandatoryRegistration: false,
      notaryRequired: true,
      calculate: () => ({ duty: 100, registration: 0, total: 100 }),
      guidance: 'Standard 11-month tenancy agreements across Central jurisdiction require ₹100 non-judicial stamp paper attested by a Notary Public.'
    },
    'rent-long-term': {
      dutyText: '2% of Average Annual Rent',
      regFeeText: '1% of Average Annual Rent',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (rent = 0) => {
        const annual = rent * 12;
        const duty = Math.round(annual * 0.02);
        const registration = Math.round(annual * 0.01);
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Leases exceeding 11 months attract compulsory registration under Section 17 of the Registration Act, 1908 at the local Sub-Registrar Office.'
    },
    'commercial-lease': {
      dutyText: '3% of Average Annual Rent + 1% Security Deposit',
      regFeeText: '1% of Transaction Value',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (rent = 0, deposit = 0) => {
        const annual = rent * 12;
        const duty = Math.round(annual * 0.03 + (deposit || 0) * 0.01);
        const registration = Math.round(annual * 0.01);
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Commercial leases require mandatory registration and e-stamping under the respective State Stamp Schedule with applicable GST provisions.'
    },
    'gift-deed': {
      dutyText: '4% of Circle Rate Value',
      regFeeText: '1% of Property Value',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (value = 0) => {
        const duty = Math.round(value * 0.04);
        const registration = Math.round(value * 0.01);
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Gift of immovable property requires mandatory registration under Section 123 of the Transfer of Property Act, 1882.'
    },
    'power-of-attorney': {
      dutyText: '₹100 (General) / 2% - 5% if conferring power to sell',
      regFeeText: '₹50 - ₹100',
      mandatoryRegistration: false,
      notaryRequired: true,
      calculate: () => ({ duty: 100, registration: 50, total: 150 }),
      guidance: 'General Power of Attorney to a trusted family member without power of sale requires ₹100 stamp and notary attestation.'
    },
    'promissory-note': {
      dutyText: '₹5 to ₹10 Revenue Stamp (Indian Stamp Act Art 49)',
      regFeeText: 'Nil',
      mandatoryRegistration: false,
      notaryRequired: false,
      calculate: () => ({ duty: 5, registration: 0, total: 5 }),
      guidance: 'Under Indian Stamp Act (Article 49), affix adhesive revenue stamps across which the borrower signs.'
    },
    'affidavit': {
      dutyText: '₹50 (Non-Judicial e-Stamp Paper)',
      regFeeText: 'Nil',
      mandatoryRegistration: false,
      notaryRequired: true,
      calculate: () => ({ duty: 50, registration: 0, total: 50 }),
      guidance: 'Affidavits and sworn declarations must be sworn before an Executive Magistrate, Oath Commissioner, or Notary Public under the Oaths Act, 1969.'
    },
    'partnership-deed': {
      dutyText: '₹500 to ₹1,000 (Based on capital contribution)',
      regFeeText: '₹200 to ₹500 (Registrar of Firms)',
      mandatoryRegistration: false,
      notaryRequired: true,
      calculate: (capital = 100000) => ({ duty: 500, registration: 200, total: 700 }),
      guidance: 'Partnership deed executed on non-judicial stamp paper. Registration under the Indian Partnership Act 1932 is strongly recommended.'
    },
    'nda-service-contract': {
      dutyText: '₹200 (Article 5 Commercial Agreement Stamp)',
      regFeeText: 'Nil',
      mandatoryRegistration: false,
      notaryRequired: false,
      calculate: () => ({ duty: 200, registration: 0, total: 200 }),
      guidance: 'Commercial agreements and NDAs attract stamp duty under Article 5 (Agreements) of the Indian Stamp Act to be admissible in court.'
    },
    'mortgage-loan': {
      dutyText: '0.3% of Loan Consideration (Capped at ₹25,000)',
      regFeeText: '0.5% of Loan Value (Capped at ₹10,000)',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (value = 0) => {
        const duty = Math.min(25000, Math.round(value * 0.003));
        const registration = Math.min(10000, Math.round(value * 0.005));
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Equitable or simple mortgage deeds require registration and stamp duty payment for legal lien perfection.'
    },
    'relinquishment-deed': {
      dutyText: '1.5% of Share Value',
      regFeeText: '1% of Share Value',
      mandatoryRegistration: true,
      notaryRequired: false,
      calculate: (value = 0) => {
        const duty = Math.round(value * 0.015);
        const registration = Math.round(value * 0.01);
        return { duty, registration, total: duty + registration };
      },
      guidance: 'Release or relinquishment deed amongst legal heirs requires compulsory registration at the local Sub-Registrar under Section 17.'
    },
    'will-testament': {
      dutyText: 'Nil (₹0 - Exempt under Indian Stamp Act)',
      regFeeText: '₹150 (Registration fee)',
      mandatoryRegistration: false,
      notaryRequired: true,
      calculate: () => ({ duty: 0, registration: 150, total: 150 }),
      guidance: 'Wills are completely exempt from stamp duty across India. Registration under Section 18 of the Registration Act is optional but strongly recommended.'
    }
  }
};

/**
 * Universal State Rule Builder:
 * Ensures all 13 documents have exact statutory figures, calculation routines, and guidance for each state.
 */
function buildStateRule(p) {
  return {
    portal: p.portal,
    portalUrl: p.portalUrl,
    rates: {
      'sale-deed': {
        dutyText: p.sale.dutyText,
        regFeeText: p.sale.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (value = 0) => {
          const duty = Math.round(value * p.sale.dutyRate);
          const registration = p.sale.fixedReg
            ? p.sale.fixedReg
            : p.sale.regCap
            ? Math.min(p.sale.regCap, Math.round(value * p.sale.regRate))
            : Math.round(value * p.sale.regRate);
          return { duty, registration, total: duty + registration };
        },
        guidance: `${p.name} statutory conveyance rules apply under the ${p.act}. Immovable property sales require mandatory registration at the local SRO.`
      },
      'rent-11-months': {
        dutyText: p.rent11.dutyText,
        regFeeText: p.rent11.regText,
        mandatoryRegistration: p.rent11.mandatoryRegistration ?? false,
        notaryRequired: true,
        calculate: (rent = 0, deposit = 0, months = 11) => {
          if (p.rent11.isMh) {
            const consideration = rent * months + (deposit || 0) * 0.10 * (months / 12);
            const duty = Math.max(100, Math.round(consideration * 0.0025));
            return { duty, registration: 1000, total: duty + 1000 };
          }
          if (p.rent11.rate) {
            const consideration = rent * months + (p.rent11.depositFactor ? (deposit || 0) * p.rent11.depositFactor : 0);
            const duty = Math.max(p.rent11.min || 100, Math.round(consideration * p.rent11.rate));
            const registration = p.rent11.fixedReg || 0;
            return { duty, registration, total: duty + registration };
          }
          const duty = p.rent11.duty || 100;
          const registration = p.rent11.reg || 0;
          return { duty, registration, total: duty + registration };
        },
        guidance: `${p.name} tenancy rules under the ${p.act}. Non-judicial stamp paper execution with proper notary attestation.`
      },
      'rent-long-term': {
        dutyText: p.rentLong.dutyText,
        regFeeText: p.rentLong.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (rent = 0, deposit = 0, months = 36) => {
          if (p.rentLong.isMh) {
            const consideration = rent * months + (deposit || 0) * 0.10 * (months / 12);
            const duty = Math.max(100, Math.round(consideration * 0.0025));
            return { duty, registration: 1000, total: duty + 1000 };
          }
          if (p.rentLong.isTotalRent) {
            const totalRent = rent * months;
            const duty = Math.round(totalRent * p.rentLong.dutyRate);
            const registration = Math.round(totalRent * p.rentLong.regRate);
            return { duty, registration, total: duty + registration };
          }
          const annual = rent * 12;
          const duty = Math.round(annual * (p.rentLong.dutyRentAnnual || 0.02));
          const registration = p.rentLong.fixedReg
            ? p.rentLong.fixedReg
            : Math.round(annual * (p.rentLong.regRentAnnual || 0.01) + (p.rentLong.extraReg || 0));
          return { duty, registration, total: duty + registration };
        },
        guidance: `Residential leases exceeding 11 months attract compulsory registration under Section 17 of the Registration Act in ${p.name}.`
      },
      'commercial-lease': {
        dutyText: p.commLease.dutyText,
        regFeeText: p.commLease.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (rent = 0, deposit = 0, months = 36) => {
          if (p.commLease.isMh) {
            const consideration = rent * months + (deposit || 0) * 0.10 * (months / 12);
            const duty = Math.max(100, Math.round(consideration * 0.0025));
            return { duty, registration: 1000, total: duty + 1000 };
          }
          if (p.commLease.isTotalRent) {
            const totalRent = rent * months;
            const duty = Math.round(totalRent * p.commLease.dutyRate);
            const registration = Math.round(totalRent * p.commLease.regRate);
            return { duty, registration, total: duty + registration };
          }
          const annual = rent * 12;
          const duty = Math.round(annual * (p.commLease.dutyRent || 0.03) + (deposit || 0) * (p.commLease.dutyDep || 0));
          const registration = p.commLease.fixedReg
            ? p.commLease.fixedReg
            : Math.round(annual * (p.commLease.regRent || 0.01));
          return { duty, registration, total: duty + registration };
        },
        guidance: `Commercial leases in ${p.name} require mandatory registration, biometric identification, and applicable GST compliance.`
      },
      'gift-deed': {
        dutyText: p.gift.dutyText,
        regFeeText: p.gift.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (value = 0) => {
          const duty = p.gift.fixedDuty !== undefined
            ? p.gift.fixedDuty
            : p.gift.dutyCap
            ? Math.min(p.gift.dutyCap, Math.round(value * p.gift.dutyRate))
            : Math.round(value * p.gift.dutyRate);

          let registration = 0;
          if (p.gift.fixedReg !== undefined) {
            registration = p.gift.fixedReg;
          } else if (p.gift.regCap) {
            registration = Math.min(p.gift.regCap, Math.round(value * p.gift.regRate));
          } else {
            registration = Math.round(value * (p.gift.regRate || 0.01));
            if (p.gift.regMin) registration = Math.max(p.gift.regMin, registration);
          }
          return { duty, registration, total: duty + registration };
        },
        guidance: `Family gift deeds in ${p.name} are executed under the ${p.act} and Section 123 of Transfer of Property Act with mandatory SRO registration.`
      },
      'power-of-attorney': {
        dutyText: p.poa.dutyText,
        regFeeText: p.poa.regText,
        mandatoryRegistration: false,
        notaryRequired: true,
        calculate: () => ({ duty: p.poa.duty, registration: p.poa.reg, total: p.poa.duty + p.poa.reg }),
        guidance: `General Power of Attorney (GPA) for family property management under ${p.act}. Power of sale to third parties attracts conveyance stamp duty.`
      },
      'promissory-note': {
        dutyText: p.promissory.dutyText,
        regFeeText: p.promissory.regText,
        mandatoryRegistration: false,
        notaryRequired: false,
        calculate: () => ({ duty: p.promissory.duty, registration: p.promissory.reg, total: p.promissory.duty + p.promissory.reg }),
        guidance: `Promissory notes are governed by Article 49 of the Indian Stamp Act. Adhesive revenue stamps must be affixed and cancelled.`
      },
      'affidavit': {
        dutyText: p.affidavit.dutyText,
        regFeeText: p.affidavit.regText,
        mandatoryRegistration: false,
        notaryRequired: true,
        calculate: () => ({ duty: p.affidavit.duty, registration: p.affidavit.reg, total: p.affidavit.duty + p.affidavit.reg }),
        guidance: `Affidavits in ${p.name} require non-judicial e-stamp paper sworn before a Notary Public or Executive Magistrate under the Oaths Act, 1969.`
      },
      'partnership-deed': {
        dutyText: p.partnership.dutyText,
        regFeeText: p.partnership.regText,
        mandatoryRegistration: false,
        notaryRequired: true,
        calculate: (capital = 100000) => {
          if (p.partnership.dutyRate) {
            const dutyVal = Math.min(
              p.partnership.dutyCap || 50000,
              Math.max(p.partnership.dutyMin || 1000, Math.round(capital * p.partnership.dutyRate))
            );
            return { duty: dutyVal, registration: p.partnership.reg, total: dutyVal + p.partnership.reg };
          }
          return { duty: p.partnership.duty, registration: p.partnership.reg, total: p.partnership.duty + p.partnership.reg };
        },
        guidance: `Partnership Deed in ${p.name} under ${p.act}. Registration with the State Registrar of Firms is strongly advised for legal enforcement.`
      },
      'nda-service-contract': {
        dutyText: p.nda.dutyText,
        regFeeText: p.nda.regText,
        mandatoryRegistration: false,
        notaryRequired: false,
        calculate: () => ({ duty: p.nda.duty, registration: p.nda.reg, total: p.nda.duty + p.nda.reg }),
        guidance: `Commercial contracts, services agreements, and NDAs in ${p.name} must be stamped under Article 5 of the State Stamp Schedule to be admissible in court.`
      },
      'mortgage-loan': {
        dutyText: p.mortgage.dutyText,
        regFeeText: p.mortgage.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (value = 0) => {
          const duty = p.mortgage.dutyCap
            ? Math.min(p.mortgage.dutyCap, Math.round(value * p.mortgage.dutyRate))
            : Math.round(value * p.mortgage.dutyRate);

          const registration = p.mortgage.fixedReg
            ? p.mortgage.fixedReg
            : p.mortgage.regCap
            ? Math.min(p.mortgage.regCap, Math.round(value * (p.mortgage.regRate || 0.01)))
            : Math.round(value * (p.mortgage.regRate || 0.01));

          return { duty, registration, total: duty + registration };
        },
        guidance: `Mortgage deed in ${p.name} requires registration and stamp duty payment for legal lien perfection under the Transfer of Property Act.`
      },
      'relinquishment-deed': {
        dutyText: p.relinquish.dutyText,
        regFeeText: p.relinquish.regText,
        mandatoryRegistration: true,
        notaryRequired: false,
        calculate: (value = 0) => {
          const duty = p.relinquish.fixedDuty !== undefined
            ? p.relinquish.fixedDuty
            : p.relinquish.dutyCap
            ? Math.min(p.relinquish.dutyCap, Math.round(value * p.relinquish.dutyRate))
            : Math.round(value * p.relinquish.dutyRate);

          const registration = p.relinquish.fixedReg !== undefined
            ? p.relinquish.fixedReg
            : p.relinquish.regCap
            ? Math.min(p.relinquish.regCap, Math.round(value * (p.relinquish.regRate || 0.01)))
            : Math.round(value * (p.relinquish.regRate || 0.01));

          return { duty, registration, total: duty + registration };
        },
        guidance: `Relinquishment / Release deed among family co-heirs in ${p.name} requires compulsory registration under Section 17 of the Registration Act.`
      },
      'will-testament': {
        dutyText: p.will.dutyText,
        regFeeText: p.will.regText,
        mandatoryRegistration: false,
        notaryRequired: true,
        calculate: () => ({ duty: 0, registration: p.will.reg, total: p.will.reg }),
        guidance: `Wills are 100% exempt from stamp duty across ${p.name} and India. Registration at the local Sub-Registrar under Section 18 is optional but provides evidentiary protection.`
      }
    }
  };
}

// Full 25-State statutory definitions
export const stateRules = {
  'Andhra Pradesh': buildStateRule({
    name: 'Andhra Pradesh',
    portal: 'IGRS Andhra Pradesh Registration Portal',
    portalUrl: 'https://registration.ap.gov.in/',
    act: 'Andhra Pradesh Stamp Schedule & Registration Rules',
    sale: { dutyText: '5% Stamp Duty + 1.5% Transfer Duty = 6.5%', regText: '1% of Market Value', dutyRate: 0.065, regRate: 0.01 },
    rent11: { dutyText: '0.4% of Total Rent (Min ₹100)', regText: '₹100 Registration Fee', rate: 0.004, min: 100, fixedReg: 100, depositFactor: 0.05 },
    rentLong: { dutyText: '0.8% of Total Rent Consideration', regText: '0.5% Registration Fee', isTotalRent: true, dutyRate: 0.008, regRate: 0.005 },
    commLease: { dutyText: '2% of Annual Rent + 0.5% Deposit', regText: '0.5% Registration Fee', dutyRent: 0.02, dutyDep: 0.005, regRent: 0.005 },
    gift: { dutyText: '1% of Market Value (Capped at ₹10,000 for family)', regText: '0.5% Registration Fee (Capped at ₹2,000)', dutyRate: 0.01, dutyCap: 10000, regRate: 0.005, regCap: 2000 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (Article 42 family GPA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Article 4 AP Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Article 40 AP Stamp Schedule)', regText: '₹500 (Registrar of Firms fee)' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5 Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, dutyCap: 50000, regRate: 0.005, regCap: 10000, dutyText: '0.5% of Loan (Capped at ₹50,000)', regText: '0.5% of Loan (Capped at ₹10,000)' },
    relinquish: { dutyRate: 0.01, dutyCap: 10000, regRate: 0.005, dutyText: '1% of Share (Capped at ₹10,000 for family)', regText: '0.5% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt nationwide)', regText: '₹100 (Sub-Registrar fee)' }
  }),

  'Assam': buildStateRule({
    name: 'Assam',
    portal: 'Panjeeyan Assam Revenue Portal',
    portalUrl: 'https://igr.assam.gov.in/',
    act: 'Assam Stamp Act & Registration Rules',
    sale: { dutyText: '5% (Panchayat) / 6% (Guwahati Municipal)', regText: '3.5% Registration Fee', dutyRate: 0.05, regRate: 0.035 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '3.5% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.035 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '3.5% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.035 },
    gift: { dutyText: '3% of Market Value for family members', regText: '3.5% Registration Fee', dutyRate: 0.03, regRate: 0.035 },
    poa: { duty: 200, reg: 100, dutyText: '₹200 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Non-Judicial e-Stamp Paper)', regText: 'Nil' },
    partnership: { duty: 500, reg: 250, dutyText: '₹500 (Assam Stamp Rules)', regText: '₹250 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5 Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.02, dutyText: '0.5% of Loan Consideration', regText: '2% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.02, dutyText: '1% of Share Value', regText: '2% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Bihar': buildStateRule({
    name: 'Bihar',
    portal: 'e-Nibandhan Bihar Portal',
    portalUrl: 'https://bhumijankari.bihar.gov.in/',
    act: 'Bihar Stamp Act & e-Nibandhan Rules',
    sale: { dutyText: '6% (Men) / 5.7% (Women)', regText: '2% of Market Value', dutyRate: 0.06, regRate: 0.02 },
    rent11: { duty: 1000, reg: 0, dutyText: '₹1,000 (Bihar Stamp Amendment Schedule)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Total Rent Consideration', regText: '2% Registration Fee', isTotalRent: true, dutyRate: 0.02, regRate: 0.02 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyText: '3% of Circle Rate for family members', regText: '2% of Property Value', dutyRate: 0.03, regRate: 0.02 },
    poa: { duty: 500, reg: 250, dutyText: '₹500 (General family POA)', regText: '₹250 Registration Fee' },
    promissory: { duty: 20, reg: 0, dutyText: '₹20 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 100, reg: 0, dutyText: '₹100 (Bihar Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 500, dutyText: '₹1,000 (Article 46 Bihar Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 1000, reg: 0, dutyText: '₹1,000 (Article 5 Bihar Stamp Rules)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.02, dutyText: '0.5% of Loan Consideration', regText: '2% Registration Fee' },
    relinquish: { dutyRate: 0.015, regRate: 0.02, dutyText: '1.5% of Share Value', regText: '2% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Chandigarh': buildStateRule({
    name: 'Chandigarh',
    portal: 'SHCIL Chandigarh e-Stamping Portal',
    portalUrl: 'https://www.shcilestamp.com/',
    act: 'Chandigarh Administration Stamp Schedule',
    sale: { dutyText: '6% Stamp Duty (3% for Women)', regText: 'Fixed slab (₹5,000 standard)', dutyRate: 0.06, fixedReg: 5000 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '₹2,000 Registration Fee', dutyRentAnnual: 0.02, fixedReg: 2000 },
    commLease: { dutyText: '3% of Average Annual Rent + 1% Deposit', regText: '₹5,000 Registration Fee', dutyRent: 0.03, dutyDep: 0.01, fixedReg: 5000 },
    gift: { dutyText: '3% of Circle Value for family members', regText: '₹5,000 Registration Fee', dutyRate: 0.03, fixedReg: 5000 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Non-Judicial e-Stamp Paper)', regText: 'Nil' },
    partnership: { duty: 500, reg: 200, dutyText: '₹500 (Chandigarh Stamp Schedule)', regText: '₹200 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, fixedReg: 5000, dutyText: '0.5% of Loan Consideration', regText: '₹5,000 Registration Fee' },
    relinquish: { fixedDuty: 500, fixedReg: 1000, dutyText: '₹500 (Family release deed)', regText: '₹1,000 Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Chhattisgarh': buildStateRule({
    name: 'Chhattisgarh',
    portal: 'e-Panjiyan Chhattisgarh Portal',
    portalUrl: 'https://epanjiyan.cg.gov.in/',
    act: 'Chhattisgarh Stamp Act & e-Panjiyan Rules',
    sale: { dutyText: '5% Stamp Duty', regText: '4% Registration Fee', dutyRate: 0.05, regRate: 0.04 },
    rent11: { dutyText: '0.5% of Total Rent (Min ₹200)', regText: 'Nil', rate: 0.005, min: 200 },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '2% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.02 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyText: '3% for family members', regText: '2% Registration Fee', dutyRate: 0.03, regRate: 0.02 },
    poa: { duty: 200, reg: 100, dutyText: '₹200 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Non-Judicial e-Stamp Paper)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 500, dutyText: '₹1,000 (Chhattisgarh Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 200, reg: 0, dutyText: '₹200 (Article 5 Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.02, dutyText: '0.5% of Loan Consideration', regText: '2% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.02, dutyText: '1% of Share Value', regText: '2% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Delhi': buildStateRule({
    name: 'Delhi',
    portal: 'Stock Holding Corporation (SHCIL) Delhi e-Stamping',
    portalUrl: 'https://www.shcilestamp.com/',
    act: 'Indian Stamp (Delhi Amendment) Act & Delhi Stamp Rules',
    sale: { dutyText: '6% for Men / 4% for Women / 5% Joint', regText: '1% of Market Value', dutyRate: 0.06, regRate: 0.01 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper / e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1% of Annual Rent + ₹100 pasting', dutyRentAnnual: 0.02, regRentAnnual: 0.01, extraReg: 100 },
    commLease: { dutyText: '3% of Average Annual Rent + 1% Deposit', regText: '1% of Transaction Value', dutyRent: 0.03, dutyDep: 0.01, regRent: 0.01 },
    gift: { dutyText: '4% (Women) / 6% (Men) of Circle Rate', regText: '1% of Value', dutyRate: 0.05, regRate: 0.01 },
    poa: { duty: 100, reg: 50, dutyText: '₹100 (General family POA / Article 48)', regText: '₹50 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Article 4 Delhi Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 200, dutyText: '₹200 (<= ₹50k capital) / ₹500 (> ₹50k capital)', regText: '₹200 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5(c) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.005, regCap: 25000, dutyText: '0.5% of Loan Consideration', regText: '0.5% of Loan (Capped at ₹25,000)' },
    relinquish: { fixedDuty: 100, regRate: 0.01, dutyText: '₹100 (Non-Judicial e-Stamp)', regText: '1% of Share Value' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt nationwide)', regText: '₹100 (Sub-Registrar fee)' }
  }),

  'Goa': buildStateRule({
    name: 'Goa',
    portal: 'Goa Registration and e-Stamping Portal',
    portalUrl: 'https://goaonline.gov.in/',
    act: 'Goa Stamp Act & Registration Rules',
    sale: { dutyText: '3.5% up to ₹50L / 4% up to ₹1Cr / 5% above', regText: '1% of Consideration Value', dutyRate: 0.04, regRate: 0.01 },
    rent11: { dutyText: '0.5% of Total Rent (Min ₹500)', regText: '₹500 (Sub-Registrar)', rate: 0.005, min: 500, fixedReg: 500 },
    rentLong: { dutyText: '1.5% of Total Rent Consideration', regText: '1% Registration Fee', isTotalRent: true, dutyRate: 0.015, regRate: 0.01 },
    commLease: { dutyText: '2% of Total Rent + Deposit', regText: '1% Registration Fee', isTotalRent: true, dutyRate: 0.02, regRate: 0.01 },
    gift: { dutyText: '2% of Market Value for family members', regText: '1% Registration Fee', dutyRate: 0.02, regRate: 0.01 },
    poa: { duty: 500, reg: 200, dutyText: '₹500 (General family POA)', regText: '₹200 Registration Fee' },
    promissory: { duty: 20, reg: 0, dutyText: '₹20 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Goa Stamp Act)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 500, dutyText: '₹1,000 (Goa Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 500, reg: 0, dutyText: '₹500 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 200, dutyText: 'Nil (₹0 - Exempt)', regText: '₹200 Registration Fee' }
  }),

  'Gujarat': buildStateRule({
    name: 'Gujarat',
    portal: 'Garvi Gujarat / Cyber Treasury Portal',
    portalUrl: 'https://garvi.gujarat.gov.in/',
    act: 'Gujarat Stamp Act, 1958 & Garvi Gujarat Rules',
    sale: { dutyText: '4.9% (Men) / 3.9% (Women - 1% rebate)', regText: '1% of Consideration (Exempt for women)', dutyRate: 0.049, regRate: 0.01 },
    rent11: { duty: 300, reg: 0, dutyText: '₹300 (Gujarat Stamp Act Article 45)', regText: 'Nil' },
    rentLong: { dutyText: '1% of Total Consideration', regText: '1% Registration Fee', isTotalRent: true, dutyRate: 0.01, regRate: 0.01 },
    commLease: { dutyText: '3.5% of Annual Rent + 1% Deposit', regText: '1% Registration Fee', dutyRent: 0.035, dutyDep: 0.01, regRent: 0.01 },
    gift: { dutyText: '3.5% of Market Value for family members', regText: '1% of Property Value', dutyRate: 0.035, regRate: 0.01 },
    poa: { duty: 300, reg: 100, dutyText: '₹300 (Article 45 family GPA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Article 4 Gujarat Stamp Act)', regText: 'Nil' },
    partnership: { dutyRate: 0.01, dutyMin: 1000, dutyCap: 10000, reg: 500, dutyText: '1% of Capital (Min ₹1,000, Max ₹10,000)', regText: '₹500 Registration Fee' },
    nda: { duty: 300, reg: 0, dutyText: '₹300 (Article 5(h) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.0025, dutyCap: 20000, regRate: 0.01, regCap: 10000, dutyText: '0.25% of Loan (Capped at ₹20,000)', regText: '1% of Loan (Capped at ₹10,000)' },
    relinquish: { fixedDuty: 300, regRate: 0.01, dutyText: '₹300 flat or 1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Haryana': buildStateRule({
    name: 'Haryana',
    portal: 'Jamabandi e-GRAS Haryana Portal',
    portalUrl: 'https://jamabandi.nic.in/',
    act: 'Haryana Stamp Schedule & Registration Manual',
    sale: { dutyText: '7% Urban / 5% Rural (5% for Women)', regText: 'Fixed slab (₹25,000 for > ₹25 Lakhs)', dutyRate: 0.07, fixedReg: 25000 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '1.5% of Average Annual Rent', regText: 'Fixed slab (₹5,000 standard)', dutyRentAnnual: 0.015, fixedReg: 5000 },
    commLease: { dutyText: '2% of Average Annual Rent + 1% Deposit', regText: 'Fixed slab (₹10,000 standard)', dutyRent: 0.02, dutyDep: 0.01, fixedReg: 10000 },
    gift: { dutyText: '1.5% for family members', regText: '₹2,000 slab fee', dutyRate: 0.015, fixedReg: 2000 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Haryana Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Haryana Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5 Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.0025, fixedReg: 2000, dutyText: '0.25% of Loan Consideration', regText: '₹2,000 slab fee' },
    relinquish: { fixedDuty: 1000, fixedReg: 500, dutyText: '₹1,000 flat (Family release deed)', regText: '₹500 Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Himachal Pradesh': buildStateRule({
    name: 'Himachal Pradesh',
    portal: 'HP e-HIMKOSH / Revenue Portal',
    portalUrl: 'https://himkosh.nic.in/',
    act: 'Himachal Pradesh Stamp Act & Tenancy Land Reforms',
    sale: { dutyText: '5% Stamp Duty (3% for Women)', regText: '2% of Consideration Value', dutyRate: 0.05, regRate: 0.02 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '2% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.02 },
    commLease: { dutyText: '2.5% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.025, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyText: '3% for family members', regText: '2% Registration Fee', dutyRate: 0.03, regRate: 0.02 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (HP Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 250, dutyText: '₹500 (HP Stamp Rules)', regText: '₹250 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Jammu & Kashmir': buildStateRule({
    name: 'Jammu & Kashmir',
    portal: 'JK NGDRS Portal',
    portalUrl: 'https://ngdrs.jk.gov.in/',
    act: 'Jammu & Kashmir Stamp Act & Registration Manual',
    sale: { dutyText: '5% Stamp Duty (3% for Women)', regText: '1.2% Registration Fee', dutyRate: 0.05, regRate: 0.012 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '1.2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.012 },
    gift: { dutyText: '3% for family members', regText: '1.2% Registration Fee', dutyRate: 0.03, regRate: 0.012 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (JK Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 250, dutyText: '₹500 (JK Stamp Rules)', regText: '₹250 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.012, dutyText: '0.5% of Loan Consideration', regText: '1.2% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.012, dutyText: '1% of Share Value', regText: '1.2% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Jharkhand': buildStateRule({
    name: 'Jharkhand',
    portal: 'Jharbhoomi NGDRS Portal',
    portalUrl: 'https://jharbhoomi.jharkhand.gov.in/',
    act: 'Jharkhand Stamp Act & Registration Rules',
    sale: { dutyText: '4% Stamp Duty', regText: '3% Registration Fee', dutyRate: 0.04, regRate: 0.03 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1.5% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.015 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyText: '2.5% for family members', regText: '2% Registration Fee', dutyRate: 0.025, regRate: 0.02 },
    poa: { duty: 200, reg: 100, dutyText: '₹200 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Jharkhand Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Jharkhand Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 200, reg: 0, dutyText: '₹200 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Karnataka': buildStateRule({
    name: 'Karnataka',
    portal: 'Kaveri 2.0 Karnataka Portal',
    portalUrl: 'https://kaveri.karnataka.gov.in/',
    act: 'Karnataka Stamp Act, 1957 & Kaveri 2.0 Rules',
    sale: { dutyText: '5% Stamp + 10% Cess + 2% Surcharge = 5.6%', regText: '1% of Consideration Value', dutyRate: 0.056, regRate: 0.01 },
    rent11: { duty: 700, reg: 0, dutyText: '₹700 (Karnataka Stamp Act Article 30)', regText: 'Nil' },
    rentLong: { dutyText: '1% of Average Annual Rent + Deposit', regText: '1% of Consideration Value', dutyRentAnnual: 0.01, regRentAnnual: 0.01 },
    commLease: { dutyText: '2% of Average Annual Rent + 0.5% Deposit', regText: '1% of Consideration Value', dutyRent: 0.02, dutyDep: 0.005, regRent: 0.01 },
    gift: { fixedDuty: 1500, fixedReg: 1000, dutyText: 'Flat ₹1,000 for family gifts (+ Cesses = ~₹1,500)', regText: 'Flat ₹1,000 Registration Fee' },
    poa: { duty: 200, reg: 200, dutyText: '₹200 (Article 41 family GPA)', regText: '₹200 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Article 4 Karnataka Stamp Act)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 1000, dutyText: '₹1,000 flat (Article 40 up to ₹5L capital)', regText: '₹1,000 (Registrar of Firms fee)' },
    nda: { duty: 200, reg: 0, dutyText: '₹200 (Article 5(j) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, dutyCap: 50000, regRate: 0.005, regCap: 10000, dutyText: '0.5% of Loan (Capped at ₹50,000)', regText: '0.5% of Loan (Capped at ₹10,000)' },
    relinquish: { fixedDuty: 1000, fixedReg: 500, dutyText: 'Flat ₹1,000 (Article 45 family release)', regText: '₹500 Registration Fee' },
    will: { reg: 200, dutyText: 'Nil (₹0 - Exempt)', regText: '₹200 Registration Fee' }
  }),

  'Kerala': buildStateRule({
    name: 'Kerala',
    portal: 'PEARL Kerala Registration Portal',
    portalUrl: 'https://keralaregistration.gov.in/',
    act: 'Kerala Stamp Act, 1959 & Registration Manual',
    sale: { dutyText: '8% Stamp Duty', regText: '2% Registration Fee', dutyRate: 0.08, regRate: 0.02 },
    rent11: { dutyText: '0.5% of Total Rent Consideration (Article 33)', regText: 'Nil', rate: 0.005, min: 250 },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '2% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.02 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyRate: 0.02, dutyCap: 25000, regRate: 0.02, regCap: 25000, dutyText: '2% of Fair Value for family (Capped at ₹25,000)', regText: '2% of Value (Capped at ₹25,000)' },
    poa: { duty: 300, reg: 200, dutyText: '₹300 (General family POA)', regText: '₹200 Registration Fee' },
    promissory: { duty: 20, reg: 0, dutyText: '₹20 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Kerala Stamp Act)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 500, dutyText: '₹1,000 (Kerala Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 200, reg: 0, dutyText: '₹200 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.02, dutyText: '0.5% of Loan Consideration', regText: '2% Registration Fee' },
    relinquish: { dutyRate: 0.01, dutyCap: 25000, regRate: 0.02, regCap: 25000, dutyText: '1% of Share Value (Capped at ₹25,000)', regText: '2% Registration Fee' },
    will: { reg: 200, dutyText: 'Nil (₹0 - Exempt)', regText: '₹200 Registration Fee' }
  }),

  'Madhya Pradesh': buildStateRule({
    name: 'Madhya Pradesh',
    portal: 'Sampada 2.0 MP Registration Portal',
    portalUrl: 'https://www.mpigr.gov.in/',
    act: 'Madhya Pradesh Stamp Act & Sampada Rules',
    sale: { dutyText: '5% Stamp + 1.5% Upkar + 1% Nagar Nigam = 7.5%', regText: '3% of Market Value', dutyRate: 0.075, regRate: 0.03 },
    rent11: { duty: 500, reg: 0, dutyText: '₹500 (Non-Judicial e-Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2.5% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.025, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '1.5% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.015 },
    gift: { dutyText: '2.5% of Collector Value for family', regText: '1% Registration Fee', dutyRate: 0.025, regRate: 0.01 },
    poa: { duty: 1000, reg: 250, dutyText: '₹1,000 (General family POA)', regText: '₹250 Registration Fee' },
    promissory: { duty: 20, reg: 0, dutyText: '₹20 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (MP Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 2000, reg: 500, dutyText: '₹2,000 (MP Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 500, reg: 0, dutyText: '₹500 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Maharashtra': buildStateRule({
    name: 'Maharashtra',
    portal: 'IGRS Maharashtra / Sarita Portal',
    portalUrl: 'https://igrmaharashtra.gov.in/',
    act: 'Bombay Stamp Act, 1958 & Maharashtra Rent Control Act 1999',
    sale: { dutyText: '5% to 7% (6% urban MMR/Pune with Metro Cess)', regText: '1% of Market Value (Capped at ₹30,000)', dutyRate: 0.06, regRate: 0.01, regCap: 30000 },
    rent11: { dutyText: '0.25% of Total Rent + 10% Deposit (Article 36A)', regText: '₹1,000 (Urban Municipal)', isMh: true, mandatoryRegistration: true },
    rentLong: { dutyText: '0.25% of Total Rent + 10% Deposit (Article 36A)', regText: '₹1,000 (Urban)', isMh: true },
    commLease: { dutyText: '0.25% of Total Consideration + 10% Deposit', regText: '₹1,000 Registration Fee', isMh: true },
    gift: { fixedDuty: 200, fixedReg: 200, dutyText: 'Flat ₹200 (Residential/Agri to blood relations)', regText: 'Flat ₹200 Registration Fee' },
    poa: { duty: 500, reg: 100, dutyText: '₹500 (Article 48 Bombay Stamp Act)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp (Article 49)', regText: 'Nil' },
    affidavit: { duty: 100, reg: 0, dutyText: '₹100 (Article 4 Bombay Stamp Act)', regText: 'Nil' },
    partnership: { dutyRate: 0.01, dutyMin: 1000, dutyCap: 50000, reg: 1000, dutyText: '1% of Capital (Min ₹1,000, Max ₹50,000)', regText: '₹1,000 Registration Fee' },
    nda: { duty: 500, reg: 0, dutyText: '₹500 (Article 5(h) Bombay Stamp Act)', regText: 'Nil' },
    mortgage: { dutyRate: 0.003, dutyCap: 1000000, fixedReg: 1000, dutyText: '0.3% of Loan (Capped at ₹10,00,000)', regText: '₹1,000 Registration Fee' },
    relinquish: { fixedDuty: 200, fixedReg: 200, dutyText: 'Flat ₹200 (Article 52 family release)', regText: 'Flat ₹200 Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt nationwide)', regText: '₹100 (Sub-Registrar fee)' }
  }),

  'Odisha': buildStateRule({
    name: 'Odisha',
    portal: 'IGR Odisha Portal',
    portalUrl: 'https://www.igrodisha.gov.in/',
    act: 'Odisha Stamp Rules & Registration Manual',
    sale: { dutyText: '5% Stamp Duty (4% for female buyers)', regText: '2% of Consideration Value', dutyRate: 0.05, regRate: 0.02 },
    rent11: { dutyText: '1% of Total Rent (Min ₹100)', regText: 'Nil', rate: 0.01, min: 100 },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '2% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.02 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '2% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.02 },
    gift: { dutyText: '2% for family members', regText: '2% Registration Fee', dutyRate: 0.02, regRate: 0.02 },
    poa: { duty: 250, reg: 150, dutyText: '₹250 (General family POA)', regText: '₹150 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Odisha Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 250, dutyText: '₹500 (Odisha Stamp Rules)', regText: '₹250 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Punjab': buildStateRule({
    name: 'Punjab',
    portal: 'Punjab National Generic Document Portal (NGDRS)',
    portalUrl: 'https://igr.punjab.gov.in/',
    act: 'Punjab Stamp Act, 1958 & Registration Rules',
    sale: { dutyText: '5% Stamp + 1% SIC + 1% PRDF = 7%', regText: '1% of Consideration Value', dutyRate: 0.07, regRate: 0.01 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '1% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.01 },
    gift: { fixedDuty: 0, fixedReg: 1000, dutyText: '0% (Nil Stamp Duty for blood relations)', regText: '₹1,000 Registration Fee' },
    poa: { duty: 1000, reg: 500, dutyText: '₹1,000 (General family POA)', regText: '₹500 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Punjab Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 1000, reg: 500, dutyText: '₹1,000 (Punjab Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 200, reg: 0, dutyText: '₹200 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, fixedReg: 5000, dutyText: '0.5% of Loan Consideration', regText: 'Fixed slab (₹5,000 standard)' },
    relinquish: { fixedDuty: 1000, fixedReg: 500, dutyText: 'Flat ₹1,000 (Family release deed)', regText: '₹500 Registration Fee' },
    will: { reg: 200, dutyText: 'Nil (₹0 - Exempt)', regText: '₹200 Registration Fee' }
  }),

  'Rajasthan': buildStateRule({
    name: 'Rajasthan',
    portal: 'e-Panjiyan Rajasthan Portal',
    portalUrl: 'https://epanjiyan.nic.in/',
    act: 'Rajasthan Stamp Act, 1998 & e-Panjiyan Rules',
    sale: { dutyText: '5% Stamp + 1% Surcharge = 6% (4% Women)', regText: '1% of DLC Value (Capped at ₹50,000)', dutyRate: 0.06, regRate: 0.01, regCap: 50000 },
    rent11: { duty: 500, reg: 0, dutyText: '₹500 (Rajasthan Stamp Rules Article 35)', regText: 'Nil' },
    rentLong: { dutyText: '1.5% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.015, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent + 1% Deposit', regText: '1% Registration Fee', dutyRent: 0.03, dutyDep: 0.01, regRent: 0.01 },
    gift: { dutyText: '2.5% of DLC Value for family (1% for child)', regText: '1% Registration Fee', dutyRate: 0.025, regRate: 0.01 },
    poa: { duty: 500, reg: 500, dutyText: '₹500 (Article 48 family GPA)', regText: '₹500 Registration Fee' },
    promissory: { duty: 20, reg: 0, dutyText: '₹20 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 50, reg: 0, dutyText: '₹50 (Article 4 Rajasthan Stamp Rules)', regText: 'Nil' },
    partnership: { duty: 2000, reg: 500, dutyText: '₹2,000 (Article 46 Rajasthan Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 500, reg: 0, dutyText: '₹500 (Article 5(c) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.0025, regRate: 0.01, dutyText: '0.25% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Tamil Nadu': buildStateRule({
    name: 'Tamil Nadu',
    portal: 'TNREGINET Portal',
    portalUrl: 'https://tnreginet.gov.in/',
    act: 'Tamil Nadu Stamp Act & Registration Rules',
    sale: { dutyText: '7% Stamp Duty + 4% Registration = 11%', regText: '4% of Market Value', dutyRate: 0.07, regRate: 0.04 },
    rent11: { dutyText: '1% of Total Rent (Min ₹100)', regText: '₹100 Registration Fee', rate: 0.01, min: 100, fixedReg: 100 },
    rentLong: { dutyText: '1% of Total Rent Consideration (1-5 yrs)', regText: '1% Registration Fee', isTotalRent: true, dutyRate: 0.01, regRate: 0.01 },
    commLease: { dutyText: '4% of Total Consideration', regText: '1% Registration Fee', isTotalRent: true, dutyRate: 0.04, regRate: 0.01 },
    gift: { dutyRate: 0.01, dutyCap: 25000, regRate: 0.01, regCap: 4000, dutyText: '1% of Value (Capped at ₹25,000 for family)', regText: '1% Registration Fee (Capped at ₹4,000)' },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Article 4 Tamil Nadu Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Article 46 TN Stamp Schedule)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5(j) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, regCap: 25000, dutyText: '0.5% of Loan Consideration', regText: '1% of Loan (Capped at ₹25,000)' },
    relinquish: { dutyRate: 0.01, dutyCap: 25000, regRate: 0.01, regCap: 4000, dutyText: '1% of Share (Capped at ₹25,000 for family)', regText: '1% of Share (Capped at ₹4,000)' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Telangana': buildStateRule({
    name: 'Telangana',
    portal: 'Registration & Stamps Department Telangana (Dharani)',
    portalUrl: 'https://registration.telangana.gov.in/',
    act: 'Telangana Stamp Schedule & Dharani Registration Rules',
    sale: { dutyText: '4% Stamp + 1.5% Transfer + 0.5% Surcharge = 6%', regText: '0.5% of Market Value', dutyRate: 0.06, regRate: 0.005 },
    rent11: { dutyText: '0.4% of Total Rent Consideration (Min ₹100)', regText: '₹100 Registration Fee', rate: 0.004, min: 100, fixedReg: 100, depositFactor: 0.05 },
    rentLong: { dutyText: '0.8% of Total Rent Consideration', regText: '0.5% Registration Fee', isTotalRent: true, dutyRate: 0.008, regRate: 0.005 },
    commLease: { dutyText: '2% of Annual Rent + 0.5% Deposit', regText: '0.5% Registration Fee', dutyRent: 0.02, dutyDep: 0.005, regRent: 0.005 },
    gift: { dutyRate: 0.01, dutyCap: 10000, regRate: 0.005, regCap: 2000, dutyText: '1% of Market Value (Capped at ₹10,000 for family)', regText: '0.5% Registration Fee (Capped at ₹2,000)' },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (Article 42 family GPA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 20, reg: 0, dutyText: '₹20 (Article 4 Telangana Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Article 40 Telangana Stamp Schedule)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5 Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.005, dutyText: '0.5% of Loan Consideration', regText: '0.5% Registration Fee' },
    relinquish: { dutyRate: 0.01, dutyCap: 10000, regRate: 0.005, dutyText: '1% of Share (Capped at ₹10,000 for family)', regText: '0.5% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'Uttar Pradesh': buildStateRule({
    name: 'Uttar Pradesh',
    portal: 'IGRSUP Prerna Portal',
    portalUrl: 'https://igrsup.gov.in/',
    act: 'UP Stamp Act, 1899 & IGRSUP Rules',
    sale: { dutyText: '5% Stamp + 2% Cess = 7% (6% for Women)', regText: '1% of Consideration (Capped at ₹20,000)', dutyRate: 0.07, regRate: 0.01, regCap: 20000 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper / e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent + 1% Deposit', regText: '1% Registration Fee', dutyRent: 0.03, dutyDep: 0.01, regRent: 0.01 },
    gift: { fixedDuty: 5000, regRate: 0.01, regMin: 1000, dutyText: 'Flat ₹5,000 (Blood relation transfer - UP Govt reform)', regText: '1% of Property Value (Min ₹1,000)' },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA / Article 48)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Article 4 UP Stamp Act)', regText: 'Nil' },
    partnership: { duty: 750, reg: 500, dutyText: '₹750 (Article 46 UP Stamp Act)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5(c) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, regCap: 20000, dutyText: '0.5% of Loan Consideration', regText: '1% of Loan (Capped at ₹20,000)' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Circle Rate Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt nationwide)', regText: '₹100 Registration Fee' }
  }),

  'Uttarakhand': buildStateRule({
    name: 'Uttarakhand',
    portal: 'e-Kosh Uttarakhand Revenue Portal',
    portalUrl: 'https://ekosh.uk.gov.in/',
    act: 'Uttarakhand Stamp Schedule & Revenue Rules',
    sale: { dutyText: '5% Stamp Duty (3.75% for Women)', regText: '2% of Consideration Value', dutyRate: 0.05, regRate: 0.02 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper)', regText: 'Nil' },
    rentLong: { dutyText: '2% of Average Annual Rent', regText: '1% Registration Fee', dutyRentAnnual: 0.02, regRentAnnual: 0.01 },
    commLease: { dutyText: '3% of Average Annual Rent', regText: '1.5% Registration Fee', dutyRent: 0.03, dutyDep: 0.0, regRent: 0.015 },
    gift: { dutyText: '3% for family members', regText: '1% Registration Fee', dutyRate: 0.03, regRate: 0.01 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Uttarakhand Stamp Schedule)', regText: 'Nil' },
    partnership: { duty: 750, reg: 500, dutyText: '₹750 (Uttarakhand Stamp Rules)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Commercial Agreement Stamp)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.01, dutyText: '0.5% of Loan Consideration', regText: '1% Registration Fee' },
    relinquish: { dutyRate: 0.01, regRate: 0.01, dutyText: '1% of Share Value', regText: '1% Registration Fee' },
    will: { reg: 100, dutyText: 'Nil (₹0 - Exempt)', regText: '₹100 Registration Fee' }
  }),

  'West Bengal': buildStateRule({
    name: 'West Bengal',
    portal: 'Directorate of Registration & Stamp Revenue WB',
    portalUrl: 'https://wbregistration.gov.in/',
    act: 'Indian Stamp (West Bengal Amendment) Act',
    sale: { dutyText: '6% (Municipal) / 5% (Panchayat areas)', regText: '1.1% of Market Value', dutyRate: 0.06, regRate: 0.011 },
    rent11: { duty: 100, reg: 0, dutyText: '₹100 (Non-Judicial Stamp Paper / e-Stamp)', regText: 'Nil' },
    rentLong: { dutyText: '1.5% of Average Annual Rent', regText: '1.1% Registration Fee', dutyRentAnnual: 0.015, regRentAnnual: 0.011 },
    commLease: { dutyText: '2% of Average Annual Rent', regText: '1.1% Registration Fee', dutyRent: 0.02, dutyDep: 0.0, regRent: 0.011 },
    gift: { dutyText: '0.5% of Market Value for family (WB Finance Act)', regText: '1.1% Registration Fee', dutyRate: 0.005, regRate: 0.011 },
    poa: { duty: 100, reg: 100, dutyText: '₹100 (General family POA / Article 48)', regText: '₹100 Registration Fee' },
    promissory: { duty: 10, reg: 0, dutyText: '₹10 Revenue Stamp', regText: 'Nil' },
    affidavit: { duty: 10, reg: 0, dutyText: '₹10 (Article 4 Bengal Stamp Act)', regText: 'Nil' },
    partnership: { duty: 500, reg: 500, dutyText: '₹500 (Article 46 Bengal Stamp Act)', regText: '₹500 Registration Fee' },
    nda: { duty: 100, reg: 0, dutyText: '₹100 (Article 5(c) Commercial Agreement)', regText: 'Nil' },
    mortgage: { dutyRate: 0.005, regRate: 0.011, dutyText: '0.5% of Loan Consideration', regText: '1.1% Registration Fee' },
    relinquish: { dutyRate: 0.005, regRate: 0.011, dutyText: '0.5% of Share Value for family members', regText: '1.1% Registration Fee' },
    will: { reg: 150, dutyText: 'Nil (₹0 - Exempt nationwide)', regText: '₹150 Registration Fee' }
  }),

  'Other States & UTs (Central Schedule)': defaultCentralRule
};
