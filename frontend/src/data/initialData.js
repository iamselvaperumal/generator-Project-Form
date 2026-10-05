export const initialFormData = {
  // Page 1: Main Details
  startDateOfIC: '',
  endDateOfIC: '',
  soNo: '',
  projectCode: '',
  latitudeLongitude: '',
  systemCapacityKWp: '',
  systemType: 'Grid connect', // 'Grid connect' | 'Off grid'

  // Page 1: Customer Information
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  contactPersonName: '',
  contactPersonMobile: '',
  contactPersonEmail: '',

  // Page 1: Trained O&M Person
  trainedOMPersonYesNo: 'Yes', // 'Yes' | 'No'
  trainedPersonName: '',
  trainedPersonMobile: '',

  // Page 1: Handover Confirmation
  userManualDrawingYesNo: 'Yes', // 'Yes' | 'No'
  preventiveMaintenanceYesNo: 'Yes', // 'Yes' | 'No'

  // Page 1: Signatures & Verification
  customerOrgFor: '',
  customerSignatureName: '',
  customerSeal: '',
  customerDate: '',
  digitalSignature: '', // Data URL PNG
  digitalSignatureType: '',

  // Instant Geo-Tagged Selfie
  geoTaggedSelfie: '', // Data URL PNG
  selfieGpsCoords: '',
  selfieTimestamp: '',

  tataPowerSignatureName: '',
  tataPowerSeal: '',
  tataPowerDate: '',

  // Page 2: Annexure - 1
  annexure1: {
    customerName: '',
    location: '',
    projectCapacityKWp: '',

    solarModules: [
      { make: '', capacityWp: '', quantity: '' }
    ],

    solarPowerConditioningUnits: [
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    solarLogs: [
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    acdb: [
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    batteries: [
      { make: '', batteryVoltageAh: '', chargingVoltageCurrent: '', quantity: '' }
    ],

    batterySerialNumbers: Array(20).fill('')
  },

  // Page 3: Annexure – 2
  annexure2: {
    date: '',
    customerName: '',
    location: '',
    plantCapacityKwp: '',

    moduleOrientation: '',
    installedAsPerDrawing: 'Yes', // 'Yes' | 'No'

    gridParameters: {
      inputVoltageRN: '',
      inputVoltageYN: '',
      inputVoltageBN: ''
    },

    generationData: {
      outputVoltageRPhase: '',
      outputVoltageYPhase: '',
      outputVoltageBPhase: '',

      outputCurrentRPhase: '',
      outputCurrentYPhase: '',
      outputCurrentBPhase: '',

      outputInKW: '',
      monitoringDuration: ''
    },

    solarLogReadings: [
      { solarLogNos: '1', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' },
      { solarLogNos: '2', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' },
      { solarLogNos: '', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' },
      { solarLogNos: '', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' }
    ],

    remarks: '',

    contractorName: '',
    contractorAddress: '',
    contractorContactPerson: '',
    contractorContactNo: '',

    contractorSignSealDate: '',
    projectManagerSignDate: ''
  }
};

export const sampleFormData = {
  startDateOfIC: '2025-02-15',
  endDateOfIC: '2025-02-28',
  soNo: 'SO/TPRE/2025/44891',
  projectCode: 'TPRE-MH-PUN-084',
  latitudeLongitude: '18.5204° N, 73.8567° E',
  systemCapacityKWp: '150.50',
  systemType: 'Grid connect',

  customerName: 'Finolex Industries Limited',
  customerAddress: 'Plot No. 27, MIDC Chakan Phase II, Pune - 410501, Maharashtra',
  customerPhone: '+91 20 2740 8000',
  contactPersonName: 'Rajesh V. Sharma',
  contactPersonMobile: '+91 98230 45678',
  contactPersonEmail: 'r.sharma@finolexindustries.com',

  trainedOMPersonYesNo: 'Yes',
  trainedPersonName: 'Sanjay Deshmukh (Sr. Plant Engineer)',
  trainedPersonMobile: '+91 98221 88990',

  userManualDrawingYesNo: 'Yes',
  preventiveMaintenanceYesNo: 'Yes',

  customerOrgFor: 'Finolex Industries Limited',
  customerSignatureName: 'Rajesh V. Sharma (Authorized Signatory)',
  customerSeal: '[SEAL AFFIXED - FINOLEX INDUSTRIES LTD]',
  customerDate: '2025-03-01',

  // Site Commissioning Geo Selfie
  geoTaggedSelfie: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' width='500' height='500'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2338bdf8'/%3E%3Cstop offset='50%25' stop-color='%230284c7'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='500' fill='url(%23sky)'/%3E%3Cpolygon points='40,300 200,230 320,230 460,300' fill='%231e293b' stroke='%2338bdf8' stroke-width='2'/%3E%3Cline x1='120' y1='265' x2='260' y2='265' stroke='%2338bdf8' stroke-width='1.5'/%3E%3Cline x1='240' y1='230' x2='280' y2='300' stroke='%2338bdf8' stroke-width='1.5'/%3E%3Ccircle cx='250' cy='190' r='55' fill='%23fed7aa'/%3E%3Crect x='195' y='130' width='110' height='32' rx='6' fill='%23ffffff' stroke='%230f172a' stroke-width='2'/%3E%3Ctext x='250' y='152' font-family='sans-serif' font-size='12' font-weight='bold' fill='%230f4c81' text-anchor='middle'%3ETATA POWER%3C/text%3E%3Cpath d='M160 380 Q250 260 340 380 Z' fill='%23ea580c' stroke='%23ffffff' stroke-width='3'/%3E%3Crect x='20' y='410' width='460' height='70' rx='8' fill='rgba(15, 23, 42, 0.88)' stroke='%2338bdf8' stroke-width='1.5'/%3E%3Ctext x='35' y='435' font-family='monospace' font-size='14' font-weight='bold' fill='%2338bdf8'%3E📍 GPS: 18.5204° N, 73.8567° E | MIDC Chakan II%3C/text%3E%3Ctext x='35' y='465' font-family='monospace' font-size='12.5' fill='%23f8fafc'%3E🕒 01-Mar-2025 11:42 AM IST • 150.50 KWp Commissioned%3C/text%3E%3C/svg%3E",
  selfieGpsCoords: '18.5204° N, 73.8567° E (MIDC Chakan Phase II, Pune)',
  selfieTimestamp: '01 Mar 2025, 11:42 AM IST',

  tataPowerSignatureName: 'Amitabh Sen (Lead Commissioning Engineer)',
  tataPowerSeal: '[SEAL AFFIXED - TATA POWER RENEWABLE ENERGY LTD]',
  tataPowerDate: '2025-03-01',

  annexure1: {
    customerName: 'Finolex Industries Limited',
    location: 'Chakan MIDC Phase II, Pune',
    projectCapacityKWp: '150.50',

    solarModules: [
      { make: 'Tata Power Solar (Mono PERC)', capacityWp: '545', quantity: '276' }
    ],

    solarPowerConditioningUnits: [
      { make: 'Sungrow Power (SG110CX)', rating: '100 kW', quantity: '1', serialNos: 'SG25M11009842' },
      { make: 'Sungrow Power (SG50CX)', rating: '50 kW', quantity: '1', serialNos: 'SG25M05003314' },
      { make: '', rating: '', quantity: '', serialNos: '' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    solarLogs: [
      { make: 'Solar-Log Base 100', rating: '100 kWp', quantity: '1', serialNos: 'SLB-2025-9981' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    acdb: [
      { make: 'Schneider Electric LV ACDB', rating: '415V, 250A', quantity: '1', serialNos: 'SCH-ACDB-415-01' },
      { make: '', rating: '', quantity: '', serialNos: '' }
    ],

    batteries: [
      { make: 'Exide Solar Gel Tubullar (N/A Grid Tied)', batteryVoltageAh: 'N/A', chargingVoltageCurrent: 'N/A', quantity: '0' }
    ],

    batterySerialNumbers: [
      'N/A - Grid Connected', 'N/A', 'N/A', 'N/A',
      'N/A', 'N/A', 'N/A', 'N/A',
      'N/A', 'N/A', 'N/A', 'N/A',
      'N/A', 'N/A', 'N/A', 'N/A',
      'N/A', 'N/A', 'N/A', 'N/A'
    ]
  },

  annexure2: {
    date: '2025-03-01',
    customerName: 'Finolex Industries Limited',
    location: 'Plot No. 27, Chakan MIDC, Pune',
    plantCapacityKwp: '150.50',

    moduleOrientation: 'True South (Azimuth 180°), Tilt Angle 18°',
    installedAsPerDrawing: 'Yes',

    gridParameters: {
      inputVoltageRN: '239.5',
      inputVoltageYN: '241.0',
      inputVoltageBN: '238.2'
    },

    generationData: {
      outputVoltageRPhase: '415.2',
      outputVoltageYPhase: '416.8',
      outputVoltageBPhase: '414.5',

      outputCurrentRPhase: '208.5',
      outputCurrentYPhase: '210.1',
      outputCurrentBPhase: '209.4',

      outputInKW: '148.8 kW at 1020 W/m² Irradiance',
      monitoringDuration: '4 Hours (Continuous load & synchronization)'
    },

    solarLogReadings: [
      { solarLogNos: '1', date: '2025-02-27', timeFrom: '09:00', timeTo: '17:00', guaranteedKwh: '680', actualKwh: '715.4', percentage: '105.2' },
      { solarLogNos: '2', date: '2025-02-28', timeFrom: '09:00', timeTo: '17:00', guaranteedKwh: '680', actualKwh: '722.8', percentage: '106.3' },
      { solarLogNos: '', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' },
      { solarLogNos: '', date: '', timeFrom: '', timeTo: '', guaranteedKwh: '', actualKwh: '', percentage: '' }
    ],

    remarks: 'Installation & testing completed as per Tata Power renewable standard operating procedures. Earthing resistance measured at 1.8 Ohms (within acceptable limit < 2 Ohms). Net meter synchronization completed with MSEDCL.',

    contractorName: 'Mahalaxmi Solar EPC Projects Pvt Ltd',
    contractorAddress: 'Office 402, Trade Centre, Bund Garden Road, Pune - 411001',
    contractorContactPerson: 'Pravin Jadhav',
    contractorContactNo: '+91 97654 32109',

    contractorSignSealDate: 'Pravin Jadhav, Mahalaxmi Solar EPC | 01-Mar-2025',
    projectManagerSignDate: 'S. K. Kulkarni (Project Manager - TPREL) | 01-Mar-2025'
  }
};
