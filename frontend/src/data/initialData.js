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
