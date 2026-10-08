/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ApplicationData, DocumentTypeId, CountyROI } from './types';
import { FORMS_CATALOG } from './data/formsCatalog';
import { COUNTY_VENUE_MAPPINGS } from './data/counties';
import {
  SAMPLE_SAFETY_ORDER,
  SAMPLE_MAINTENANCE,
  SAMPLE_CUSTODY_ACCESS,
  SAMPLE_DIVORCE,
} from './data/sampleData';
import { TopBar } from './components/TopBar';
import { JurisdictionBanner } from './components/JurisdictionBanner';
import { FormSelector } from './components/FormSelector';
import { ApplicationWizard } from './components/ApplicationWizard';
import { DocumentViewer } from './components/DocumentViewer';
import { PricingModal } from './components/PricingModal';
import { NorthernIrelandWarningModal } from './components/NorthernIrelandWarningModal';
import { FilingGuideModal } from './components/FilingGuideModal';
import { ChecklistModal } from './components/ChecklistModal';
import { CourtPrepGuideModal } from './components/CourtPrepGuideModal';
import { ApplicationGuidesModal } from './components/ApplicationGuidesModal';
import { ContactUsModal } from './components/ContactUsModal';
import { PhoneCall, Mail, BookOpen } from 'lucide-react';

const INITIAL_EMPTY_DATA: ApplicationData = {
  documentType: 'dv_safety_order',
  year: 2026,
  recordNumber: '',
  county: 'Dublin',
  courtArea: 'Dublin Metropolitan District',
  districtNumber: 'Dublin Metropolitan District',
  circuitName: 'Dublin Circuit',
  courtTier: 'District Court',
  courtVenueAddress: 'Dolphin House, East Essex Street, Dublin 2, D02 RR76',

  applicantName: '',
  applicantAddress: '',
  applicantAddressWithheld: false,
  applicantPhone: '',
  applicantEmail: '',
  applicantOccupation: '',
  applicantRelationshipToRespondent: '',

  respondentName: '',
  respondentAddress: '',
  respondentPhone: '',
  respondentOccupation: '',

  relationshipStartDate: '',
  children: [],

  groundsSummary: '',
  incidentDatesAndDetails: '',
  gardaInvolvement: false,
  medicalAttentionSought: false,

  interimProtectionSought: false,
  weaponsSurrenderClause: false,

  requestedWeeklyAmountPerChild: 0,
  requestedSpousalWeeklyAmount: 0,
  applicantNetWeeklyIncome: 0,
  applicantWeeklyRentMortgage: 0,
  applicantWeeklyUtilitiesFood: 0,
  applicantWeeklyChildCosts: 0,
  applicantChildBenefit: 0,
  respondentEstimatedIncome: 0,
  bankIbanForPayment: '',

  custodyTypeSought: 'Joint Custody',
  proposedAccessSchedule: '',
  holidayArrangements: '',
  handoverLocation: '',

  livingApartTwoYearsConfirmed: false,
  noProspectOfReconciliation: false,
  pensionAdjustmentSought: false,
  successionRightsExtinguished: false,

  applicantDeclarationAgreed: false,
  roiJurisdictionAgreed: false,
  nonSolicitorNoticeAgreed: false,
  creationTimestamp: new Date().toISOString(),
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>(INITIAL_EMPTY_DATA);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Modal States
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isFilingGuideOpen, setIsFilingGuideOpen] = useState(false);
  const [isNiWarningOpen, setIsNiWarningOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isPrepGuideOpen, setIsPrepGuideOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [activeGuideId, setActiveGuideId] = useState<string>('maintenance');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleOpenGuides = (guideId?: string) => {
    if (guideId) setActiveGuideId(guideId);
    setIsGuidesOpen(true);
  };

  const handleCountyChange = (county: CountyROI) => {
    const venueInfo = COUNTY_VENUE_MAPPINGS[county] || COUNTY_VENUE_MAPPINGS.Dublin;
    const meta = FORMS_CATALOG.find((f) => f.id === applicationData.documentType);
    const isDivorce = meta?.category === 'diy_divorce';

    setApplicationData((prev) => ({
      ...prev,
      county,
      courtArea: venueInfo.courtArea,
      districtNumber: venueInfo.districtNumber,
      circuitName: venueInfo.circuitName,
      courtTier: isDivorce ? 'Circuit Court' : 'District Court',
      courtVenueAddress: isDivorce ? venueInfo.circuitVenue : venueInfo.courtVenueAddress,
    }));
  };

  const handleSelectForm = (id: DocumentTypeId) => {
    const meta = FORMS_CATALOG.find((f) => f.id === id);
    const venueInfo = COUNTY_VENUE_MAPPINGS[applicationData.county] || COUNTY_VENUE_MAPPINGS.Dublin;

    const isDivorce = meta?.category === 'diy_divorce';
    const isDV = meta?.category === 'domestic_violence';

    setApplicationData((prev) => ({
      ...prev,
      documentType: id,
      courtTier: meta?.courtTier || (isDivorce ? 'Circuit Court' : 'District Court'),
      circuitName: venueInfo.circuitName,
      courtArea: venueInfo.courtArea,
      districtNumber: venueInfo.districtNumber,
      courtVenueAddress: isDivorce ? venueInfo.circuitVenue : venueInfo.courtVenueAddress,
      interimProtectionSought: isDV ? true : false,
      groundsSummary: prev.groundsSummary || '',
    }));
  };

  const handleLoadSample = (sampleType: 'safety' | 'maintenance' | 'custody' | 'divorce') => {
    if (sampleType === 'safety') setApplicationData(SAMPLE_SAFETY_ORDER);
    else if (sampleType === 'maintenance') setApplicationData(SAMPLE_MAINTENANCE);
    else if (sampleType === 'custody') setApplicationData(SAMPLE_CUSTODY_ACCESS);
    else if (sampleType === 'divorce') setApplicationData(SAMPLE_DIVORCE);
  };

  const handleSelectDivorceDirect = () => {
    const venueInfo = COUNTY_VENUE_MAPPINGS[applicationData.county] || COUNTY_VENUE_MAPPINGS.Dublin;
    setApplicationData((prev) => ({
      ...prev,
      documentType: 'divorce_civil_bill_2n',
      courtTier: 'Circuit Court',
      circuitName: venueInfo.circuitName,
      courtArea: venueInfo.courtArea,
      districtNumber: venueInfo.districtNumber,
      courtVenueAddress: venueInfo.circuitVenue,
      livingApartTwoYearsConfirmed: true,
      noProspectOfReconciliation: true,
      pensionAdjustmentSought: true,
      successionRightsExtinguished: true,
    }));
    setCurrentStep(2);
  };

  const handleResetNew = () => {
    setApplicationData({
      ...INITIAL_EMPTY_DATA,
      creationTimestamp: new Date().toISOString(),
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between text-stone-900 font-sans selection:bg-emerald-800 selection:text-white">
      <div>
        <TopBar
          currentStep={currentStep}
          selectedCounty={applicationData.county}
          onSelectCounty={handleCountyChange}
          onSelectStep={(step) => setCurrentStep(step)}
          onOpenPricing={() => setIsPricingOpen(true)}
          onOpenFilingGuide={() => setIsFilingGuideOpen(true)}
          onOpenNiWarning={() => setIsNiWarningOpen(true)}
          onOpenChecklist={() => setIsChecklistOpen(true)}
          onOpenPrepGuide={() => setIsPrepGuideOpen(true)}
          onOpenGuides={handleOpenGuides}
          onOpenContact={() => setIsContactOpen(true)}
          onResetNew={handleResetNew}
        />

        <JurisdictionBanner onOpenNiModal={() => setIsNiWarningOpen(true)} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {currentStep === 1 && (
            <FormSelector
              selectedFormId={applicationData.documentType}
              selectedCounty={applicationData.county}
              onSelectCounty={handleCountyChange}
              onSelectForm={handleSelectForm}
              onLoadSample={handleLoadSample}
              onProceed={() => setCurrentStep(2)}
              onOpenChecklist={() => setIsChecklistOpen(true)}
              onOpenPrepGuide={() => setIsPrepGuideOpen(true)}
              onSelectDivorceDirect={handleSelectDivorceDirect}
              onOpenGuides={handleOpenGuides}
              onOpenContact={() => setIsContactOpen(true)}
            />
          )}

          {currentStep === 2 && (
            <ApplicationWizard
              data={applicationData}
              onChange={(updated) => setApplicationData(updated)}
              onProceedToDocument={() => setCurrentStep(3)}
              onBackToSelector={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <DocumentViewer
              data={applicationData}
              onEdit={() => setCurrentStep(2)}
              onUpdateCounty={handleCountyChange}
              onOpenPricing={() => setIsPricingOpen(true)}
              onOpenFilingGuide={() => setIsFilingGuideOpen(true)}
            />
          )}
        </main>
      </div>

      <footer className="no-print bg-stone-900 text-stone-300 border-t border-stone-800 py-10 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-xs bg-emerald-700 text-amber-300 flex items-center justify-center font-cinzel font-bold text-xs">
                  FS
                </div>
                <span className="font-semibold text-white tracking-tight">
                  Family Support Ireland
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Automated legal document preparation supporting citizens in Irish District and Circuit Court family proceedings.
              </p>
              <div className="text-[11px] text-stone-500 font-mono">
                familysupportireland.ie
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Main Offerings
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <button onClick={() => handleOpenGuides()} className="hover:text-emerald-300 transition-colors cursor-pointer text-left font-semibold text-emerald-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Application Guides (€12.50+)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsChecklistOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    District Court Checklist (€5)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPrepGuideOpen(true)} className="hover:text-white transition-colors cursor-pointer text-left">
                    Court Preparation Guide (€10)
                  </button>
                </li>
                <li>
                  <button onClick={handleSelectDivorceDirect} className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-amber-300">
                    DIY Divorce Pack (€199)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPricingOpen(true)} className="hover:text-stone-300 transition-colors cursor-pointer text-left">
                    Fee Schedule & Free DV (€0)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
                Court Forms Supported
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <button onClick={() => { handleSelectForm('divorce_civil_bill_2n'); setCurrentStep(2); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Circuit Court Form 2A / 2N Civil Bill
                  </button>
                </li>
                <li>
                  <button onClick={() => { handleSelectForm('divorce_civil_bill_2n'); setCurrentStep(2); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Form 51 Appearance & Form 52 Notice
                  </button>
                </li>
                <li>
                  <button onClick={() => { handleSelectForm('maint_form_54_1'); setCurrentStep(2); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Child Maintenance Form 54.1 & 54.3 (€49)
                  </button>
                </li>
                <li>
                  <button onClick={() => { handleSelectForm('dv_safety_order'); setCurrentStep(2); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Domestic Violence Safety Order (Free €0)
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Support & Contact
              </h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Direct questions regarding applications or court procedures can be sent directly to our team:
              </p>
              <button
                onClick={() => setIsContactOpen(true)}
                className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>Contact Us: familysupportireland@gmail.com</span>
              </button>
              <div className="flex items-center gap-1.5 text-red-300 font-medium text-[11px] pt-1">
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Urgent Emergency: Call 999 or 112</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              © 2026 Family Support Ireland (familysupportireland.ie). All rights reserved.
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button onClick={() => setIsContactOpen(true)} className="hover:text-emerald-400 text-stone-400 font-medium transition-colors cursor-pointer flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400" />
                <span>Contact Us</span>
              </button>
              <span>·</span>
              <button onClick={() => handleOpenGuides()} className="hover:text-stone-300 transition-colors cursor-pointer">
                Application Guides
              </button>
              <span>·</span>
              <button onClick={() => setIsNiWarningOpen(true)} className="hover:text-stone-300 transition-colors cursor-pointer">
                Northern Ireland Exclusion
              </button>
              <span>·</span>
              <button onClick={() => setIsPricingOpen(true)} className="hover:text-stone-300 transition-colors cursor-pointer">
                Pricing Terms
              </button>
              <span>·</span>
              <button onClick={() => setIsFilingGuideOpen(true)} className="hover:text-stone-300 transition-colors cursor-pointer">
                Court Rules
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChecklistModal isOpen={isChecklistOpen} onClose={() => setIsChecklistOpen(false)} />
      <CourtPrepGuideModal isOpen={isPrepGuideOpen} onClose={() => setIsPrepGuideOpen(false)} />
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        onOpenGuides={handleOpenGuides}
        onOpenContact={() => setIsContactOpen(true)}
      />
      <NorthernIrelandWarningModal isOpen={isNiWarningOpen} onClose={() => setIsNiWarningOpen(false)} />
      <FilingGuideModal isOpen={isFilingGuideOpen} onClose={() => setIsFilingGuideOpen(false)} />
      <ApplicationGuidesModal 
        isOpen={isGuidesOpen} 
        initialGuideId={activeGuideId} 
        onClose={() => setIsGuidesOpen(false)} 
        onContactSupport={() => {
          setIsGuidesOpen(false);
          setIsContactOpen(true);
        }}
      />
      <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
