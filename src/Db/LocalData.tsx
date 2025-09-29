import {db} from './db';

type Project = {
  projectId: string;
  projectTitle: string;
  customerCompanyName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  cityName: string;
  stateName: string;
  zipCode: string;
  latestSignUpdate: string;
  totalSigns: number;
  signDataOptions: any[];
};

type SignOption = {
  signTableId: string;
  signId: string;
  signAliasName: string;
  signName: string;
  signType: string;
  reportEnable: boolean;
  adminId?: string | null;
  createdDate?: string | null;
  customerName?: string | null;
  isRestored?: boolean;
  surveyKit?: string | null;
};

type ExistingSignAudit = {
  Id: string; // same as signTableId
  projectId: string;
  signId: string;
  signAliasName: string;
  optionId: string;
  signType: string;
  sign_order: string;
  isThisReplacementSign: string;
  oldSignStillPresent: string;
  isTheSignIlluminated: string;
  existingSignAuditDocumentSignCondition?: string | null;
  existingSignAuditPhotoFromAdmin?: any[];
  existingSignAuditPhotos?: any[];
  existingSignAuditPhoto?: any[];
  existingSignAuditSummaryNotes?: string;
  existingSignAuditTodoPunchList?: string;
  existingSignspecialInstructions?: string;
  removalScheduled?: string;
  adminId?: string | null;
  adminName?: string;
  createdDate?: string;
  customerName?: string;
  isSynched: number;
};

type PermittingAssessment = {
  Id: string; // same as signTableId
  projectId: string;
  signId: string;
  optionId: string;
  signAliasName: string;
  signType: string;
  sign_order: string;
  permitRequired?: string | null;
  permitAppliedFor?: string | null;
  permitTimeframeFrom?: string | null;
  permitTimeframeTo?: string | null;
  permitEstimatedCost?: string | null;
  permitAcquisitionFee?: string | null;
  permitAcquisitionFeeText?: string | null;
  electricalSignsAllowed?: string | null;
  permittingAssessmentSummaryNotes?: string;
  permittingAssessmentTodoPunchList?: string;
  permittingAssessmentspecialInstructions?: string;
  adminId?: string | null;
  adminName?: string;
  createdDate?: string;
  customerName?: string;
};

type IndoorPhotosAndMeasurements = {
  id: string; // same as signTableId
  projectId: string;
  signId: string;
  optionId: string;
  signAliasName: string;
  signType: string;
  sign_order: string;
  createdDate?: string;
  adminId?: string | null;
  adminName?: string;
  customerName?: string;

  // Measurements & fields
  nameofMeasurement?: string | null;
  areMullionsPresent?: string | null;
  areThereAnyVisibleOpenings?: string | null;
  signDimensionsWidthFT?: string | null;
  signDimensionsWidthIN?: string | null;
  signDimensionsHeightFT?: string | null;
  signDimensionsHeightIN?: string | null;
  signDimensionsDepthFT?: string | null;
  signDimensionsDepthIN?: string | null;
  wallDimensionsLengthFT?: string | null;
  wallDimensionsLengthIN?: string | null;
  wallDimensionsWidthFT?: string | null;
  wallDimensionsWidthIN?: string | null;
  measureDistanceFromSignToFloorLengthFT?: string | null;
  measureDistanceFromSignToFloorLengthIN?: string | null;
  measureDistanceLength1FT?: string | null;
  measureDistanceLength1IN?: string | null;
  measureDistanceLength2FT?: string | null;
  measureDistanceLength2IN?: string | null;
  measureDistanceLength3FT?: string | null;
  measureDistanceLength3IN?: string | null;
  measureDistanceLength4FT?: string | null;
  measureDistanceLength4IN?: string | null;
  mullionsLengthFT?: string | null;
  mullionsLengthIN?: string | null;
  mullionsWidthFT?: string | null;
  mullionsWidthIN?: string | null;
  mullionsDepthFT?: string | null;
  mullionsDepthIN?: string | null;
  mullionsNotes?: string | null;
  squareFootage?: string | null;
  squareFootageCalculationRequired?: string | null;
  squareFootageFeet?: string | null;
  squareFootageWidthIN?: string | null;
  squareFootageLengthIN?: string | null;
  squareFootageNotes?: string | null;
  visibleOpeningsLengthFT?: string | null;
  visibleOpeningsLengthIN?: string | null;
  visibleOpeningsWidthFT?: string | null;
  visibleOpeningsWidthIN?: string | null;
  visibleOpeningsNotes?: string | null;
  otherPhotosAndMeasurementsLengthFT?: string | null;
  otherPhotosAndMeasurementsLengthIN?: string | null;
  otherPhotosAndMeasurementsWidthFT?: string | null;
  otherPhotosAndMeasurementsWidthIN?: string | null;
  otherPhotosAndMeasurementsDepthFT?: string | null;
  otherPhotosAndMeasurementsDepthIN?: string | null;
  photoOfWallOrFloor?: string | null;

  photosAndMeasurementsSummaryNotes?: string;
  photosAndMeasurementsTodoPunchList?: string;
};

type SignGeneralAudit = {
  Id: string; // same as signTableId
  projectId: string;
  signId: string;
  optionId: string;
  signAliasName: string;
  signType: string;
  sign_order: string;
  createdDate?: string;
  adminId?: string | null;
  adminName?: string;
  customerName?: string;

  // Nullable fields
  attachedOrHanging?: string | null;
  attachmentType?: string | null;
  bannerOrSignMaterial?: string | null;
  channelLetterMaterial?: string | null;
  colorOrExistingColorMatch?: string | null;
  communicationsType?: string | null;
  contentManagementSoftwareRequired?: string | null;
  contentManagementNotes?: string | null;
  copyTypeOrStyle?: string | null;
  documentSubstrateCondition?: string | null;
  extMaterialThickness?: string | null;
  faceMaterialsData?: string | null;
  facilityDiagramOrSketchProvided?: string | null;
  generalDescriptionOfPlacementOfSign?: string | null;
  interactiveDisplay?: string | null;
  ladderOrLiftRequired?: string | null;
  material?: string | null;
  materialThickness?: string | null;
  numberOfScreens?: string | null;
  panFlatCarvedOrSandblastedLetterData?: string | null;
  racewayOrFlush?: string | null;
  recentlyPainted?: string | null;
  replaceOrUseExisting?: string | null;
  resolution?: string | null;
  rgbOrMonochrome?: string | null;
  singleOrDoubleFaced?: string | null;
  siteCovered?: string | null;
  siteWeatherDependent?: string | null;
  sizeOfLadderOrLift?: string | null;
  surfaceQualityData?: string | null;
  typeOfAwning?: string | null;
  wallOrSubstrateType?: string | null;
  adhesionTestRequired?: string | null;
  adhesionTestResult?: string | null;
  anyAccessibilityObstructions?: string | null;
  anyPotentialSafetyIssues?: string | null;
  signGeneralAuditDocumentAccessibilityIssues?: string | null;
  signGeneralAuditdocumentPotentialSafetyIssues?: string | null;
  signGeneralAuditSummaryNotes?: string;
  signGeneralAuditTodoPunchList?: string;
  facilityDiagramOrSketchProvidedFile?: string;
  anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto?: any[];
  anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos?: any[];
  anyPotentialSafetyIssuesPhoto?: any[];
  anyPotentialSafetyIssuesPhotos?: any[];
  facilityDiagramOrSketchProvidedPhoto?: any[];
};

type ElectricalAudit = {
  Id: string;
  projectId: string;
  signId: string;
  optionId: string;
  signAliasName: string;
  signType: string;
  sign_order: string;
  projectTitle?: string;
  adminId?: string | null;
  adminName?: string | null;
  customerName?: string | null;
  teamId?: string | null; // from loginData.userId

  doesTheExistingSignIlluminate?: string | null;
  isElectricPresentAtTheSign?: string | null;
  isPowerLiveAtSignLocation?: string | null;
  typeOfIlluminationInside?: string | null;
  electric120Vor220V?: string | null;
  electricSubcontractorNeeded?: string | null;
  powerWithinNeededDistance?: string | null;
  electricTagsorCertificationsPresent?: string | null;
  anyKnownRepairorMaintenanceToElectricalEquipmentRequired?: string | null;
  anyAccessibilityIssues?: string | null;

  electricalAuditDocumentAccessibilityIssues?: string | null;
  electricalAuditPhotoFromAdmin?: any[] | null; // JSON or string path
  electricalAuditPhotos?: any[] | null;
  electricalAuditPhoto?: any[] | null;
  electricTagsPhotoFromAdmin?: any[] | null;
  electricTagsPhotos?: any[] | null;
  electricTagsPhoto?: any[] | null;

  electricalAuditSummaryNotes?: string;
  electricalAuditTodoPunchList?: string;
  electricalAuditspecialInstructions?: string;

  createdDate?: string;
  surveyModule?: string;
};

export const createLocalDB = () =>
  db.transaction((tx: any) => {
    tx.executeSql(
      `
        CREATE TABLE IF NOT EXISTS projects (
  projectId TEXT PRIMARY KEY,
  projectTitle TEXT,
  customerCompanyName TEXT,
  firstName TEXT,
  lastName TEXT,
  email TEXT,
  mobile TEXT,
  address TEXT,
  cityName TEXT,
  stateName TEXT,
  zipCode TEXT,
  latestSignUpdate TEXT,
  totalSigns INTEGER
)

    `,
      [],
      (_: any, result: any) => console.log('LOCAL DB CREATED:::'),
      (_: any, error: any) =>
        console.log('LOCAL DB CREATEING ERRORR:::', error),
    );
  });

export const createSignDataOptionsTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS sign_data_options (
        signTableId TEXT PRIMARY KEY,
        projectId TEXT,
        signId TEXT,
        signAliasName TEXT,
        signName TEXT,
        signType TEXT,
        reportEnable INTEGER,
        adminId TEXT,
        createdDate TEXT,
        customerName TEXT,
        isRestored INTEGER,
        surveyKit TEXT,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () => console.log('sign_data_options table created successfully'),
      (_: any, error: any) =>
        console.error('Error creating sign_data_options table:', error),
    );
  });
};

export const createExistingSignAuditTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS existing_sign_audit (
        Id TEXT PRIMARY KEY,              -- same as signTableId
        projectId TEXT,
        signId TEXT,
        optionId TEXT,
        signAliasName TEXT,
        signType TEXT,
        sign_order TEXT,
        isThisReplacementSign TEXT,
        oldSignStillPresent TEXT,
        isTheSignIlluminated TEXT,
        existingSignAuditDocumentSignCondition TEXT,
        existingSignAuditPhotoFromAdmin TEXT,   -- store JSON string if array
        existingSignAuditPhotos TEXT,           -- store JSON string if array
        existingSignAuditSummaryNotes TEXT,
        existingSignAuditTodoPunchList TEXT,
        existingSignspecialInstructions TEXT,
        removalScheduled TEXT,
        adminId TEXT,
        adminName TEXT,
        createdDate TEXT,
        customerName TEXT,
        isSynced INTEGER,
        existingSignAuditPhoto TEXT,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () => console.log('existing_sign_audit table created successfully'),
      (_: any, error: any) =>
        console.error('Error creating existing_sign_audit table:', error),
    );
  });
};

export const createElectricalAuditTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS electrical_audit (
        Id TEXT PRIMARY KEY,
        projectId TEXT,
        signId TEXT,
        optionId TEXT,
        signAliasName TEXT,
        signType TEXT,
        sign_order TEXT,

        -- ✅ Existing fields
        doesTheExistingSignIlluminate TEXT,
        isElectricPresentAtTheSign TEXT,
        isPowerLiveAtSignLocation TEXT,
        powerWithinNeededDistance TEXT,
        electric120Vor220V TEXT,
        anyAccessibilityIssues TEXT,
        anyKnownRepairorMaintenanceToElectricalEquipmentRequired TEXT,
        electricSubcontractorNeeded TEXT,
        electricTagsorCertificationsPresent TEXT,
        electricalAuditSummaryNotes TEXT,
        electricalAuditTodoPunchList TEXT,
        electricalAuditspecialInstructions TEXT,
        electricalAuditDocumentAccessibilityIssues TEXT,

        adminId TEXT,
        adminName TEXT,
        createdDate TEXT,
        customerName TEXT,
        isSynced INTEGER,

        -- ✅ Newly added fields
        projectTitle TEXT,
        teamId TEXT,
        typeOfIlluminationInside TEXT,
        electricalAuditPhotoFromAdmin TEXT,
        electricalAuditPhotos TEXT,
        electricalAuditPhoto TEXT,
        electricTagsPhotoFromAdmin TEXT,
        electricTagsPhotos TEXT,
        electricTagsPhoto TEXT,
        surveyModule TEXT,

        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () => console.log('electrical_audit table created/updated successfully'),
      (_: any, error: any) =>
        console.error('Error creating electrical_audit table:', error),
    );
  });
};

export const createPermittingAssessmentTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS permitting_assessment (
        Id TEXT PRIMARY KEY,              -- same as signTableId
        projectId TEXT,
        signId TEXT,
        optionId TEXT,
        signAliasName TEXT,
        signType TEXT,
        sign_order TEXT,
        permitRequired TEXT,
        permitAppliedFor TEXT,
        permitTimeframeFrom TEXT,
        permitTimeframeTo TEXT,
        permitEstimatedCost TEXT,
        permitAcquisitionFee TEXT,
        permitAcquisitionFeeText TEXT,
        electricalSignsAllowed TEXT,
        permittingAssessmentSummaryNotes TEXT,
        permittingAssessmentTodoPunchList TEXT,
        permittingAssessmentspecialInstructions TEXT,
        adminId TEXT,
        adminName TEXT,
        createdDate TEXT,
        customerName TEXT,
         isSynced INTEGER DEFAULT 0,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () => console.log('permitting_assessment table created successfully'),
      (_: any, error: any) =>
        console.error('Error creating permitting_assessment table:', error),
    );
  });
};

export const createIndoorPhotosAndMeasurementsTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS indoor_photos_and_measurements (
        id TEXT PRIMARY KEY,
        projectId TEXT,
        signId TEXT,
        optionId TEXT,
        signAliasName TEXT,
        signType TEXT,
        sign_order TEXT,
        createdDate TEXT,
        adminId TEXT,
        adminName TEXT,
        customerName TEXT,
        nameofMeasurement TEXT,
        areMullionsPresent TEXT,
        areThereAnyVisibleOpenings TEXT,
        signDimensionsWidthFT TEXT,
        signDimensionsWidthIN TEXT,
        signDimensionsHeightFT TEXT,
        signDimensionsHeightIN TEXT,
        signDimensionsDepthFT TEXT,
        signDimensionsDepthIN TEXT,
        wallDimensionsLengthFT TEXT,
        wallDimensionsLengthIN TEXT,
        wallDimensionsWidthFT TEXT,
        wallDimensionsWidthIN TEXT,
        measureDistanceFromSignToFloorLengthFT TEXT,
        measureDistanceFromSignToFloorLengthIN TEXT,
        measureDistanceLength1FT TEXT,
        measureDistanceLength1IN TEXT,
        measureDistanceLength2FT TEXT,
        measureDistanceLength2IN TEXT,
        measureDistanceLength3FT TEXT,
        measureDistanceLength3IN TEXT,
        measureDistanceLength4FT TEXT,
        measureDistanceLength4IN TEXT,
        mullionsLengthFT TEXT,
        mullionsLengthIN TEXT,
        mullionsWidthFT TEXT,
        mullionsWidthIN TEXT,
        mullionsDepthFT TEXT,
        mullionsDepthIN TEXT,
        mullionsNotes TEXT,
        squareFootage TEXT,
        squareFootageCalculationRequired TEXT,
        squareFootageFeet TEXT,
        squareFootageWidthIN TEXT,
        squareFootageLengthIN TEXT,
        squareFootageNotes TEXT,
        visibleOpeningsLengthFT TEXT,
        visibleOpeningsLengthIN TEXT,
        visibleOpeningsWidthFT TEXT,
        visibleOpeningsWidthIN TEXT,
        visibleOpeningsNotes TEXT,
        otherPhotosAndMeasurementsLengthFT TEXT,
        otherPhotosAndMeasurementsLengthIN TEXT,
        otherPhotosAndMeasurementsWidthFT TEXT,
        otherPhotosAndMeasurementsWidthIN TEXT,
        otherPhotosAndMeasurementsDepthFT TEXT,
        otherPhotosAndMeasurementsDepthIN TEXT,
        photoOfWallOrFloor TEXT,
        photosAndMeasurementsSummaryNotes TEXT,
        photosAndMeasurementsTodoPunchList TEXT,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () =>
        console.log(
          'indoor_photos_and_measurements table created successfully',
        ),
      (_: any, error: any) =>
        console.error(
          'Error creating indoor_photos_and_measurements table:',
          error,
        ),
    );
  });
};

export const createSignGeneralAuditTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS sign_general_audit (
        Id TEXT PRIMARY KEY,
        projectId TEXT,
        signId TEXT,
        optionId TEXT,
        signAliasName TEXT,
        signType TEXT,
        sign_order TEXT,
        createdDate TEXT,
        adminId TEXT,
        adminName TEXT,
        customerName TEXT,
        attachedOrHanging TEXT,
        attachmentType TEXT,
        bannerOrSignMaterial TEXT,
        channelLetterMaterial TEXT,
        colorOrExistingColorMatch TEXT,
        communicationsType TEXT,
        contentManagementSoftwareRequired TEXT,
        contentManagementNotes TEXT,
        copyTypeOrStyle TEXT,
        documentSubstrateCondition TEXT,
        extMaterialThickness TEXT,
        faceMaterialsData TEXT,
        facilityDiagramOrSketchProvided TEXT,
        generalDescriptionOfPlacementOfSign TEXT,
        interactiveDisplay TEXT,
        ladderOrLiftRequired TEXT,
        material TEXT,
        materialThickness TEXT,
        numberOfScreens TEXT,
        panFlatCarvedOrSandblastedLetterData TEXT,
        racewayOrFlush TEXT,
        recentlyPainted TEXT,
        replaceOrUseExisting TEXT,
        resolution TEXT,
        rgbOrMonochrome TEXT,
        singleOrDoubleFaced TEXT,
        siteCovered TEXT,
        siteWeatherDependent TEXT,
        sizeOfLadderOrLift TEXT,
        surfaceQualityData TEXT,
        typeOfAwning TEXT,
        wallOrSubstrateType TEXT,
        adhesionTestRequired TEXT,
        adhesionTestResult TEXT,
        anyAccessibilityObstructions TEXT,
        anyPotentialSafetyIssues TEXT,
        signGeneralAuditDocumentAccessibilityIssues TEXT,
        signGeneralAuditdocumentPotentialSafetyIssues TEXT,
        signGeneralAuditSummaryNotes TEXT,
        signGeneralAuditTodoPunchList TEXT,
        facilityDiagramOrSketchProvidedFile TEXT,
        anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto TEXT,
        anyPotentialSafetyIssuesPhoto TEXT,
        anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos TEXT,
        anyPotentialSafetyIssuesPhotos TEXT,
        facilityDiagramOrSketchProvidedPhoto TEXT,
        isSynced INTEGER,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () => console.log('sign_general_audit table created successfully'),
      (_: any, error: any) =>
        console.error('Error creating sign_general_audit table:', error),
    );
  });
};

export const insertProjectsData = (projects: Project[]) => {
  // console.log('PROJECTSSS DATAAAAA:::::::::::', projects);
  // return;
  db.transaction((tx: any) => {
    projects.forEach(project => {
      tx.executeSql(
        `
        INSERT OR REPLACE INTO projects (
          projectId, projectTitle, customerCompanyName, firstName, lastName,
          email, mobile, address, cityName, stateName, zipCode,
          latestSignUpdate, totalSigns
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          project.projectId,
          project.projectTitle,
          project.customerCompanyName,
          project.firstName,
          project.lastName,
          project.email,
          project.mobile,
          project.address,
          project.cityName,
          project.stateName,
          project.zipCode,
          project.latestSignUpdate,
          project.totalSigns,
        ],
        () => console.log(`Project ${project.projectId} inserted`),
        (_: any, error: any) =>
          console.error(`Error inserting project ${project.projectId}:`, error),
      );
      project.signDataOptions?.forEach((option: any) => {
        tx.executeSql(
          `
            INSERT OR REPLACE INTO sign_data_options (
              signTableId, projectId, signId, signAliasName, signName, signType,
              reportEnable, adminId, createdDate, customerName, isRestored, surveyKit
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
          [
            option.signTableId,
            project.projectId,
            option.signId,
            option.signAliasName,
            option.signName,
            option.signType,
            option.reportEnable ? 1 : 0,
            option.adminId || null,
            option.createdDate || null,
            option.customerName || null,
            option.isRestored ? 1 : 0,
            option.surveyKit || null,
          ],
          () =>
            console.log(
              `SignOption ${option.signTableId} for project ${project.projectId} inserted`,
            ),
          (_: any, error: any) =>
            console.error(
              `Error inserting SignOption ${option.signTableId}:`,
              error,
            ),
        );
      });
    });
  });
};

export const insertExistingSignAudit = (projects: any[], syched: number) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const audit: ExistingSignAudit = option.existing_sign_audit;
          console.log('AUDITTTT', audit);
          const id = option.existing_sign_audit.id;
          if (audit) {
            tx.executeSql(
              `
              INSERT OR REPLACE INTO existing_sign_audit (
                Id, projectId, signId, signAliasName, signType, sign_order,
                isThisReplacementSign, oldSignStillPresent, isTheSignIlluminated,
                existingSignAuditDocumentSignCondition,
                existingSignAuditPhotoFromAdmin,
                existingSignAuditPhotos,
                existingSignAuditSummaryNotes,
                existingSignAuditTodoPunchList,
                existingSignspecialInstructions,
                removalScheduled,
                adminId,
                adminName,
                createdDate,
                customerName,
                optionId,
                isSynced
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
              `,
              [
                id,
                audit.projectId,
                audit.signId,
                audit.signAliasName,
                audit.signType,
                audit.sign_order,
                audit.isThisReplacementSign,
                audit.oldSignStillPresent,
                audit.isTheSignIlluminated,
                audit.existingSignAuditDocumentSignCondition || null,
                JSON.stringify(audit.existingSignAuditPhotoFromAdmin || []),
                JSON.stringify(audit.existingSignAuditPhotos || []),
                audit.existingSignAuditSummaryNotes || '',
                audit.existingSignAuditTodoPunchList || '',
                audit.existingSignspecialInstructions || '',
                audit.removalScheduled || 'no',
                audit.adminId || null,
                audit.adminName || '',
                audit.createdDate || '',
                audit.customerName || '',
                audit.optionId || '',
                syched,
              ],
              () =>
                console.log(
                  `Inserted existing_sign_audit for sign ${audit.Id}`,
                ),
              (_: any, error: any) =>
                console.error(
                  `Error inserting existing_sign_audit ${audit.Id}:`,
                  error,
                ),
            );
          }
        });
      });
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () => console.log('All existing_sign_audit data inserted successfully'),
  );
};

export const insertElectricalAudit = (projects: any[], syched: number) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const audit: ElectricalAudit = option?.electrical_audit;
          if (option?.electrical_audit === undefined) return;
          console.log('ELECTRICALLL AUDITTTT', audit);
          const id = option?.electrical_audit?.id;
          console.log('IDDDDDD', id);
          if (audit) {
            tx.executeSql(
              `
                INSERT OR REPLACE INTO electrical_audit (
                Id, projectId, signId, optionId, signAliasName, signType, sign_order,
                doesTheExistingSignIlluminate,
                isElectricPresentAtTheSign,
                isPowerLiveAtSignLocation,
                powerWithinNeededDistance,
                electric120Vor220V,
                anyAccessibilityIssues,
                anyKnownRepairorMaintenanceToElectricalEquipmentRequired,
                electricSubcontractorNeeded,
                electricTagsorCertificationsPresent,
                electricalAuditSummaryNotes,
                electricalAuditTodoPunchList,
                electricalAuditspecialInstructions,
                electricalAuditDocumentAccessibilityIssues,
                adminId,
                adminName,
                createdDate,
                customerName,
                isSynced,
                typeOfIlluminationInside,
                electricalAuditPhotoFromAdmin,
                electricalAuditPhotos,
                electricalAuditPhoto,
                electricTagsPhotoFromAdmin,
                electricTagsPhotos,
                electricTagsPhoto,
                surveyModule
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                id,
                audit.projectId,
                audit.signId,
                audit.optionId,
                audit.signAliasName,
                audit.signType,
                audit.sign_order,
                audit.doesTheExistingSignIlluminate || null,
                audit.isElectricPresentAtTheSign || null,
                audit.isPowerLiveAtSignLocation || null,
                audit.powerWithinNeededDistance || null,
                audit.electric120Vor220V || null,
                audit.anyAccessibilityIssues || null,
                audit.anyKnownRepairorMaintenanceToElectricalEquipmentRequired ||
                  null,
                audit.electricSubcontractorNeeded || null,
                audit.electricTagsorCertificationsPresent || null,
                audit.electricalAuditSummaryNotes || '',
                audit.electricalAuditTodoPunchList || '',
                audit.electricalAuditspecialInstructions || '',
                audit.electricalAuditDocumentAccessibilityIssues || '',
                audit.adminId || null,
                audit.adminName || '',
                audit.createdDate || '',
                audit.customerName || '',
                syched,
                audit.typeOfIlluminationInside || null,
                JSON.stringify(audit.electricalAuditPhotoFromAdmin || []),
                JSON.stringify(audit.electricalAuditPhotos || []),
                JSON.stringify(audit.electricalAuditPhoto || []),
                JSON.stringify(audit.electricTagsPhotoFromAdmin || []),
                JSON.stringify(audit.electricTagsPhotos || []),
                JSON.stringify(audit.electricTagsPhoto || []),
                audit.surveyModule || null,
              ],
              () =>
                console.log(`Inserted electrical_audit for sign ${audit.Id}`),
              (_: any, error: any) =>
                console.error(
                  `Error inserting electrical_audit ${audit.Id}:`,
                  error,
                ),
            );
          }
        });
      });
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () => console.log('All electrical_audit data inserted successfully'),
  );
};

export const insertPermittingAssessment = (projects: any[], syched: number) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const audit: PermittingAssessment = option.permitting_assessment;
          console.log('AUDITTTTPERMITTTTTT:::::::::::::::', audit);
          const id = option.permitting_assessment.id;
          if (audit) {
            tx.executeSql(
              `
              INSERT OR REPLACE INTO permitting_assessment (
                Id, projectId, signId, optionId, signAliasName, signType, sign_order,
                permitRequired, permitAppliedFor, permitTimeframeFrom, permitTimeframeTo,
                permitEstimatedCost, permitAcquisitionFee, permitAcquisitionFeeText,
                electricalSignsAllowed, permittingAssessmentSummaryNotes,
                permittingAssessmentTodoPunchList, permittingAssessmentspecialInstructions,
                adminId, adminName, createdDate, customerName,isSynced
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
              `,
              [
                id,
                audit.projectId,
                audit.signId,
                audit.optionId,
                audit.signAliasName,
                audit.signType,
                audit.sign_order,
                audit.permitRequired || null,
                audit.permitAppliedFor || null,
                audit.permitTimeframeFrom || null,
                audit.permitTimeframeTo || null,
                audit.permitEstimatedCost || null,
                audit.permitAcquisitionFee || null,
                audit.permitAcquisitionFeeText || null,
                audit.electricalSignsAllowed || null,
                audit.permittingAssessmentSummaryNotes || '',
                audit.permittingAssessmentTodoPunchList || '',
                audit.permittingAssessmentspecialInstructions || '',
                audit.adminId || null,
                audit.adminName || '',
                audit.createdDate || '',
                audit.customerName || '',
                syched,
              ],
              () =>
                console.log(
                  `Inserted permitting_assessment for sign ${audit.Id}`,
                ),
              (_: any, error: any) =>
                console.error(
                  `Error inserting permitting_assessment ${audit.Id}:`,
                  error,
                ),
            );
          }
        });
      });
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () => console.log('All permitting_assessment data inserted successfully'),
  );
};

export const insertIndoorPhotosAndMeasurements = (projects: any[]) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const indoor = option.indoor_photos_and_measurements;
          if (indoor) {
            tx.executeSql(
              `
              INSERT OR REPLACE INTO indoor_photos_and_measurements (
                id, projectId, signId, optionId, signAliasName, signType, sign_order,
                createdDate, adminId, adminName, customerName,
                nameofMeasurement, areMullionsPresent, areThereAnyVisibleOpenings,
                signDimensionsWidthFT, signDimensionsWidthIN,
                signDimensionsHeightFT, signDimensionsHeightIN,
                signDimensionsDepthFT, signDimensionsDepthIN,
                wallDimensionsLengthFT, wallDimensionsLengthIN,
                wallDimensionsWidthFT, wallDimensionsWidthIN,
                measureDistanceFromSignToFloorLengthFT,
                measureDistanceFromSignToFloorLengthIN,
                measureDistanceLength1FT, measureDistanceLength1IN,
                measureDistanceLength2FT, measureDistanceLength2IN,
                measureDistanceLength3FT, measureDistanceLength3IN,
                measureDistanceLength4FT, measureDistanceLength4IN,
                mullionsLengthFT, mullionsLengthIN,
                mullionsWidthFT, mullionsWidthIN,
                mullionsDepthFT, mullionsDepthIN,
                mullionsNotes,
                squareFootage, squareFootageCalculationRequired,
                squareFootageFeet, squareFootageWidthIN,
                squareFootageLengthIN, squareFootageNotes,
                visibleOpeningsLengthFT, visibleOpeningsLengthIN,
                visibleOpeningsWidthFT, visibleOpeningsWidthIN,
                visibleOpeningsNotes,
                otherPhotosAndMeasurementsLengthFT,
                otherPhotosAndMeasurementsLengthIN,
                otherPhotosAndMeasurementsWidthFT,
                otherPhotosAndMeasurementsWidthIN,
                otherPhotosAndMeasurementsDepthFT,
                otherPhotosAndMeasurementsDepthIN,
                photoOfWallOrFloor,
                photosAndMeasurementsSummaryNotes,
                photosAndMeasurementsTodoPunchList
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                indoor.id,
                indoor.projectId,
                indoor.signId,
                indoor.optionId,
                indoor.signAliasName,
                indoor.signType,
                indoor.sign_order,
                indoor.createdDate || '',
                indoor.adminId || null,
                indoor.adminName || '',
                indoor.customerName || '',
                indoor.nameofMeasurement || null,
                indoor.areMullionsPresent || null,
                indoor.areThereAnyVisibleOpenings || null,
                indoor.signDimensionsWidthFT || null,
                indoor.signDimensionsWidthIN || null,
                indoor.signDimensionsHeightFT || null,
                indoor.signDimensionsHeightIN || null,
                indoor.signDimensionsDepthFT || null,
                indoor.signDimensionsDepthIN || null,
                indoor.wallDimensionsLengthFT || null,
                indoor.wallDimensionsLengthIN || null,
                indoor.wallDimensionsWidthFT || null,
                indoor.wallDimensionsWidthIN || null,
                indoor.measureDistanceFromSignToFloorLengthFT || null,
                indoor.measureDistanceFromSignToFloorLengthIN || null,
                indoor.measureDistanceLength1FT || null,
                indoor.measureDistanceLength1IN || null,
                indoor.measureDistanceLength2FT || null,
                indoor.measureDistanceLength2IN || null,
                indoor.measureDistanceLength3FT || null,
                indoor.measureDistanceLength3IN || null,
                indoor.measureDistanceLength4FT || null,
                indoor.measureDistanceLength4IN || null,
                indoor.mullionsLengthFT || null,
                indoor.mullionsLengthIN || null,
                indoor.mullionsWidthFT || null,
                indoor.mullionsWidthIN || null,
                indoor.mullionsDepthFT || null,
                indoor.mullionsDepthIN || null,
                indoor.mullionsNotes || null,
                indoor.squareFootage || null,
                indoor.squareFootageCalculationRequired || null,
                indoor.squareFootageFeet || null,
                indoor.squareFootageWidthIN || null,
                indoor.squareFootageLengthIN || null,
                indoor.squareFootageNotes || null,
                indoor.visibleOpeningsLengthFT || null,
                indoor.visibleOpeningsLengthIN || null,
                indoor.visibleOpeningsWidthFT || null,
                indoor.visibleOpeningsWidthIN || null,
                indoor.visibleOpeningsNotes || null,
                indoor.otherPhotosAndMeasurementsLengthFT || null,
                indoor.otherPhotosAndMeasurementsLengthIN || null,
                indoor.otherPhotosAndMeasurementsWidthFT || null,
                indoor.otherPhotosAndMeasurementsWidthIN || null,
                indoor.otherPhotosAndMeasurementsDepthFT || null,
                indoor.otherPhotosAndMeasurementsDepthIN || null,
                indoor.photoOfWallOrFloor || null,
                indoor.photosAndMeasurementsSummaryNotes || '',
                indoor.photosAndMeasurementsTodoPunchList || '',
              ],
              () =>
                console.log(
                  `Inserted indoor_photos_and_measurements for sign ${indoor.id}`,
                ),
              (_: any, error: any) =>
                console.error(
                  `Error inserting indoor_photos_and_measurements ${indoor.id}:`,
                  error,
                ),
            );
          }
        });
      });
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () =>
      console.log(
        'All indoor_photos_and_measurements data inserted successfully',
      ),
  );
};

export const insertSignGeneralAudit = (projects: any[], syched: number) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const audit: SignGeneralAudit = option.sign_general_audit;
          console.log('AUDITTTTPERMITTTTTT:::::::::::::::', audit);
          const id = option.sign_general_audit.id;
          if (audit) {
            tx.executeSql(
              `
              INSERT OR REPLACE INTO sign_general_audit (
                Id, projectId, signId, optionId, signAliasName, signType, sign_order,
                createdDate, adminId, adminName, customerName,
                attachedOrHanging, attachmentType, bannerOrSignMaterial,
                channelLetterMaterial, colorOrExistingColorMatch,
                communicationsType, contentManagementSoftwareRequired,
                contentManagementNotes, copyTypeOrStyle,
                documentSubstrateCondition, extMaterialThickness,
                faceMaterialsData, facilityDiagramOrSketchProvided,
                generalDescriptionOfPlacementOfSign, interactiveDisplay,
                ladderOrLiftRequired, material, materialThickness,
                numberOfScreens, panFlatCarvedOrSandblastedLetterData,
                racewayOrFlush, recentlyPainted, replaceOrUseExisting,
                resolution, rgbOrMonochrome, singleOrDoubleFaced,
                siteCovered, siteWeatherDependent, sizeOfLadderOrLift,
                surfaceQualityData, typeOfAwning, wallOrSubstrateType,
                adhesionTestRequired, adhesionTestResult,
                anyAccessibilityObstructions, anyPotentialSafetyIssues,
                signGeneralAuditDocumentAccessibilityIssues,
                signGeneralAuditdocumentPotentialSafetyIssues,
                signGeneralAuditSummaryNotes,
                 signGeneralAuditTodoPunchList,
                 facilityDiagramOrSketchProvidedFile,
                 anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto,
                 anyPotentialSafetyIssuesPhoto,
                 anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos,
                 anyPotentialSafetyIssuesPhotos,
                 facilityDiagramOrSketchProvidedPhoto,
                 isSynced
              ) VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                id,
                audit.projectId,
                audit.signId,
                audit.optionId,
                audit.signAliasName,
                audit.signType,
                audit.sign_order,
                audit.createdDate || '',
                audit.adminId || null,
                audit.adminName || '',
                audit.customerName || '',
                audit.attachedOrHanging || null,
                audit.attachmentType || null,
                audit.bannerOrSignMaterial || null,
                audit.channelLetterMaterial || null,
                audit.colorOrExistingColorMatch || null,
                audit.communicationsType || null,
                audit.contentManagementSoftwareRequired || null,
                audit.contentManagementNotes || null,
                audit.copyTypeOrStyle || null,
                audit.documentSubstrateCondition || null,
                audit.extMaterialThickness || null,
                audit.faceMaterialsData || null,
                audit.facilityDiagramOrSketchProvided || null,
                audit.generalDescriptionOfPlacementOfSign || null,
                audit.interactiveDisplay || null,
                audit.ladderOrLiftRequired || null,
                audit.material || null,
                audit.materialThickness || null,
                audit.numberOfScreens || null,
                audit.panFlatCarvedOrSandblastedLetterData || null,
                audit.racewayOrFlush || null,
                audit.recentlyPainted || null,
                audit.replaceOrUseExisting || null,
                audit.resolution || null,
                audit.rgbOrMonochrome || null,
                audit.singleOrDoubleFaced || null,
                audit.siteCovered || null,
                audit.siteWeatherDependent || null,
                audit.sizeOfLadderOrLift || null,
                audit.surfaceQualityData || null,
                audit.typeOfAwning || null,
                audit.wallOrSubstrateType || null,
                audit.adhesionTestRequired || null,
                audit.adhesionTestResult || null,
                audit.anyAccessibilityObstructions || null,
                audit.anyPotentialSafetyIssues || null,
                audit.signGeneralAuditDocumentAccessibilityIssues || null,
                audit.signGeneralAuditdocumentPotentialSafetyIssues || null,
                audit.signGeneralAuditSummaryNotes || '',
                audit.signGeneralAuditTodoPunchList || '',
                audit.facilityDiagramOrSketchProvidedFile || null,
                JSON.stringify(
                  audit?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
                    [],
                ),
                JSON.stringify(audit.anyPotentialSafetyIssuesPhoto || []),
                JSON.stringify(
                  audit?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos ||
                    [],
                ),
                JSON.stringify(audit.anyPotentialSafetyIssuesPhotos || []),
                JSON.stringify(
                  audit.facilityDiagramOrSketchProvidedPhoto || [],
                ),
                syched,
              ],
              () =>
                console.log(`Inserted sign_general_audit for sign ${audit.Id}`),
              (_: any, error: any) =>
                console.error(
                  `Error inserting sign_general_audit ${audit.Id}:`,
                  error,
                ),
            );
          }
        });
      });
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () => console.log('All sign_general_audit data inserted successfully'),
  );
};

export const fetchAllProjectsData = (callback: (projects: any[]) => void) => {
  db.transaction((tx: any) => {
    // Step 1: Get all projects
    tx.executeSql(
      `SELECT * FROM projects`,
      [],
      (_: any, projectsResult: any) => {
        const projects: any[] = [];
        const projectsRows = projectsResult.rows;
        for (let i = 0; i < projectsRows.length; i++) {
          projects.push({...projectsRows.item(i), signDataOptions: []});
        }

        if (projects.length === 0) {
          callback([]);
          return;
        }

        let completed = 0;

        // Step 2: For each project, fetch sign_data_options
        projects.forEach((project, projIndex) => {
          tx.executeSql(
            `SELECT * FROM sign_data_options WHERE projectId = ?`,
            [project.projectId],
            (_: any, signOptionsResult: any) => {
              const signDataOptions: any[] = [];
              for (let j = 0; j < signOptionsResult.rows.length; j++) {
                signDataOptions.push(signOptionsResult.rows.item(j));
              }

              if (signDataOptions.length === 0) {
                project.signDataOptions = [];
                completed++;
                if (completed === projects.length) callback(projects);
                return;
              }

              let optionsCompleted = 0;

              // Step 3: For each sign option, fetch related audits
              signDataOptions.forEach((option, optionIndex) => {
                const queries = [
                  {
                    table: 'existing_sign_audit',
                    key: 'Id',
                    prop: 'existing_sign_audit',
                  },
                  {
                    table: 'electrical_audit',
                    key: 'Id',
                    prop: 'electrical_audit',
                  },
                  {
                    table: 'permitting_assessment',
                    key: 'Id',
                    prop: 'permitting_assessment',
                  },
                  {
                    table: 'indoor_photos_and_measurements',
                    key: 'Id',
                    prop: 'indoor_photos_and_measurements',
                  },
                  {
                    table: 'sign_general_audit',
                    key: 'Id',
                    prop: 'sign_general_audit',
                  },
                ];

                let auditsCompleted = 0;

                queries.forEach(({table, key, prop}) => {
                  tx.executeSql(
                    `SELECT * FROM ${table} WHERE ${key} = ?`,
                    [option.signTableId],
                    (_: any, auditResult: any) => {
                      if (auditResult.rows.length > 0) {
                        const audit = auditResult.rows.item(0);
                        // Parse JSON fields if any
                        if (
                          prop === 'existing_sign_audit' &&
                          audit.existingSignAuditPhotoFromAdmin
                        )
                          audit.existingSignAuditPhotoFromAdmin = JSON.parse(
                            audit.existingSignAuditPhotoFromAdmin,
                          );
                        if (
                          prop === 'existing_sign_audit' &&
                          audit.existingSignAuditPhoto
                        )
                          audit.existingSignAuditPhoto = JSON.parse(
                            audit.existingSignAuditPhoto,
                          );
                        if (
                          prop === 'existing_sign_audit' &&
                          audit.existingSignAuditPhotos
                        )
                          audit.existingSignAuditPhotos = JSON.parse(
                            audit.existingSignAuditPhotos,
                          );
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricalAuditPhotoFromAdmin
                        ) {
                          audit.electricalAuditPhotoFromAdmin = JSON.parse(
                            audit.electricalAuditPhotoFromAdmin,
                          );
                        }
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricalAuditPhotos
                        ) {
                          audit.electricalAuditPhotos = JSON.parse(
                            audit.electricalAuditPhotos,
                          );
                        }
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricalAuditPhoto
                        ) {
                          audit.electricalAuditPhoto = JSON.parse(
                            audit.electricalAuditPhoto,
                          );
                        }
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricTagsPhotoFromAdmin
                        ) {
                          audit.electricTagsPhotoFromAdmin = JSON.parse(
                            audit.electricTagsPhotoFromAdmin,
                          );
                        }
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricTagsPhotos
                        ) {
                          audit.electricTagsPhotos = JSON.parse(
                            audit.electricTagsPhotos,
                          );
                        }
                        if (
                          prop === 'electrical_audit' &&
                          audit.electricTagsPhoto
                        ) {
                          audit.electricTagsPhoto = JSON.parse(
                            audit.electricTagsPhoto,
                          );
                        }
                        if (
                          prop === 'sign_general_audit' &&
                          audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto
                        ) {
                          audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto =
                            JSON.parse(
                              audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto,
                            );
                        }
                        if (
                          prop === 'sign_general_audit' &&
                          audit.anyPotentialSafetyIssuesPhoto
                        ) {
                          audit.anyPotentialSafetyIssuesPhoto = JSON.parse(
                            audit.anyPotentialSafetyIssuesPhoto,
                          );
                        }
                        if (
                          prop === 'sign_general_audit' &&
                          audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos
                        ) {
                          audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos =
                            JSON.parse(
                              audit.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos,
                            );
                        }
                        if (
                          prop === 'sign_general_audit' &&
                          audit.anyPotentialSafetyIssuesPhotos
                        ) {
                          audit.anyPotentialSafetyIssuesPhotos = JSON.parse(
                            audit.anyPotentialSafetyIssuesPhotos,
                          );
                        }
                        if (
                          prop === 'sign_general_audit' &&
                          audit.facilityDiagramOrSketchProvidedPhoto
                        ) {
                          audit.facilityDiagramOrSketchProvidedPhoto =
                            JSON.parse(
                              audit.facilityDiagramOrSketchProvidedPhoto,
                            );
                        }
                        option[prop] = audit;
                      } else {
                        option[prop] = null;
                      }

                      auditsCompleted++;
                      if (auditsCompleted === queries.length) {
                        signDataOptions[optionIndex] = option;
                        optionsCompleted++;
                        if (optionsCompleted === signDataOptions.length) {
                          project.signDataOptions = signDataOptions;
                          completed++;
                          if (completed === projects.length) callback(projects);
                        }
                      }
                    },
                    (_: any, error: any) => {
                      console.error(
                        `Error fetching ${table} for sign ${option.signTableId}:`,
                        error,
                      );
                      auditsCompleted++;
                      if (auditsCompleted === queries.length) {
                        signDataOptions[optionIndex] = option;
                        optionsCompleted++;
                        if (optionsCompleted === signDataOptions.length) {
                          project.signDataOptions = signDataOptions;
                          completed++;
                          if (completed === projects.length) callback(projects);
                        }
                      }
                    },
                  );
                });
              });
            },
            (_: any, error: any) =>
              console.error('Error fetching sign_data_options:', error),
          );
        });
      },
      (_: any, error: any) => console.error('Error fetching projects:', error),
    );
  });
};

export const updateExistingSignAudit = (
  auditData: ExistingSignAudit,
  synched: number,
) => {
  console.log('auditDataauditDataauditData', auditData);
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      UPDATE existing_sign_audit
      SET
        projectId = ?,
        signId = ?,
        signAliasName = ?,
        signType = ?,
        sign_order = ?,
        isThisReplacementSign = ?,
        oldSignStillPresent = ?,
        isTheSignIlluminated = ?,
        existingSignAuditDocumentSignCondition = ?,
        existingSignAuditPhotoFromAdmin = ?,
        existingSignAuditPhotos = ?,
        existingSignAuditSummaryNotes = ?,
        existingSignAuditTodoPunchList = ?,
        existingSignspecialInstructions = ?,
        removalScheduled = ?,
        adminId = ?,
        adminName = ?,
        createdDate = ?,
        customerName = ?,
        optionId = ?,
        isSynced = ?,
        existingSignAuditPhoto = ?
      WHERE Id = ?
      `,
      [
        auditData.projectId,
        auditData.signId,
        auditData.signAliasName,
        auditData.signType,
        auditData.sign_order,
        auditData.isThisReplacementSign,
        auditData.oldSignStillPresent,
        auditData.isTheSignIlluminated,
        auditData.existingSignAuditDocumentSignCondition || null,
        JSON.stringify(auditData.existingSignAuditPhotoFromAdmin || []),
        JSON.stringify(auditData.existingSignAuditPhotos || []),
        auditData.existingSignAuditSummaryNotes || '',
        auditData.existingSignAuditTodoPunchList || '',
        auditData.existingSignspecialInstructions || '',
        auditData.removalScheduled || 'no',
        auditData.adminId || null,
        auditData.adminName || '',
        auditData.createdDate || '',
        auditData.customerName || '',
        auditData.optionId || '',
        synched,
        JSON.stringify(auditData.existingSignAuditPhoto || []),
        auditData.Id,
      ],
      () => console.log(`Updated existing_sign_audit ${auditData.Id}`),
      (_: any, error: any) =>
        console.error(
          `Error updating existing_sign_audit ${auditData.Id}:`,
          error,
        ),
    );
  });
};

export const updateElectricalAudit = (
  auditData: ElectricalAudit,
  syncedValue: number,
) => {
  console.log('ELECTRICAL AUDITTT UPDATEEE::', auditData);
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      UPDATE electrical_audit
      SET
        projectId = ?,
        signId = ?,
        optionId = ?,
        signAliasName = ?,
        signType = ?,
        sign_order = ?,
        doesTheExistingSignIlluminate = ?,
        isElectricPresentAtTheSign = ?,
        isPowerLiveAtSignLocation = ?,
        powerWithinNeededDistance = ?,
        electric120Vor220V = ?,
        anyAccessibilityIssues = ?,
        anyKnownRepairorMaintenanceToElectricalEquipmentRequired = ?,
        electricSubcontractorNeeded = ?,
        electricTagsorCertificationsPresent = ?,
        electricalAuditSummaryNotes = ?,
        electricalAuditTodoPunchList = ?,
        electricalAuditspecialInstructions = ?,
        electricalAuditDocumentAccessibilityIssues = ?,
        adminId = ?,
        adminName = ?,
        createdDate = ?,
        customerName = ?,
        projectTitle = ?,
        teamId = ?,
        typeOfIlluminationInside = ?,
        electricalAuditPhotoFromAdmin = ?,
        electricalAuditPhotos = ?,
        electricalAuditPhoto = ?,
        electricTagsPhotoFromAdmin = ?,
        electricTagsPhotos = ?,
        electricTagsPhoto = ?,
        surveyModule = ?,
        isSynced = ?
      WHERE Id = ?
      `,
      [
        auditData.projectId,
        auditData.signId,
        auditData.optionId,
        auditData.signAliasName,
        auditData.signType,
        auditData.sign_order,
        auditData.doesTheExistingSignIlluminate || null,
        auditData.isElectricPresentAtTheSign || null,
        auditData.isPowerLiveAtSignLocation || null,
        auditData.powerWithinNeededDistance || null,
        auditData.electric120Vor220V || null,
        auditData.anyAccessibilityIssues || null,
        auditData.anyKnownRepairorMaintenanceToElectricalEquipmentRequired ||
          null,
        auditData.electricSubcontractorNeeded || null,
        auditData.electricTagsorCertificationsPresent || null,
        auditData.electricalAuditSummaryNotes || '',
        auditData.electricalAuditTodoPunchList || '',
        auditData.electricalAuditspecialInstructions || '',
        auditData.electricalAuditDocumentAccessibilityIssues || '',
        auditData.adminId || null,
        auditData.adminName || '',
        auditData.createdDate || '',
        auditData.customerName || '',

        // ✅ These were missing / out of order:
        auditData.projectTitle || '',
        auditData.teamId || null,
        auditData.typeOfIlluminationInside || null,
        JSON.stringify(auditData.electricalAuditPhotoFromAdmin || []),
        JSON.stringify(auditData.electricalAuditPhotos || []),
        JSON.stringify(auditData.electricalAuditPhoto || []),
        JSON.stringify(auditData.electricTagsPhotoFromAdmin || []),
        JSON.stringify(auditData.electricTagsPhotos || []),
        JSON.stringify(auditData.electricTagsPhoto || []),

        auditData.surveyModule || null,
        syncedValue,
        auditData.Id,
      ],
      () => console.log(`✅ Updated electrical_audit ${auditData.Id}`),
      (_: any, error: any) =>
        console.error(
          `❌ Error updating electrical_audit ${auditData.Id}:`,
          error,
        ),
    );
  });
};

export const updatePermittingAssessment = (
  audit: PermittingAssessment,
  syncedValue: number,
) => {
  console.log('UPDATINGGGG PERMITTTT:::', audit);
  db.transaction(
    (tx: any) => {
      tx.executeSql(
        `
        UPDATE permitting_assessment SET
          projectId = ?, 
          signId = ?, 
          optionId = ?, 
          signAliasName = ?, 
          signType = ?, 
          sign_order = ?, 
          permitRequired = ?, 
          permitAppliedFor = ?, 
          permitTimeframeFrom = ?, 
          permitTimeframeTo = ?, 
          permitEstimatedCost = ?, 
          permitAcquisitionFee = ?, 
          permitAcquisitionFeeText = ?, 
          electricalSignsAllowed = ?, 
          permittingAssessmentSummaryNotes = ?, 
          permittingAssessmentTodoPunchList = ?, 
          permittingAssessmentspecialInstructions = ?, 
          adminId = ?, 
          adminName = ?, 
          createdDate = ?, 
          customerName = ?,
          isSynced = ?
        WHERE Id = ?
        `,
        [
          audit.projectId,
          audit.signId,
          audit.optionId,
          audit.signAliasName,
          audit.signType,
          audit.sign_order,
          audit.permitRequired || null,
          audit.permitAppliedFor || null,
          audit.permitTimeframeFrom || null,
          audit.permitTimeframeTo || null,
          audit.permitEstimatedCost || null,
          audit.permitAcquisitionFee || null,
          audit.permitAcquisitionFeeText || null,
          audit.electricalSignsAllowed || null,
          audit.permittingAssessmentSummaryNotes || '',
          audit.permittingAssessmentTodoPunchList || '',
          audit.permittingAssessmentspecialInstructions || '',
          audit.adminId || null,
          audit.adminName || '',
          audit.createdDate || '',
          audit.customerName || '',
          syncedValue,
          audit.Id,
        ],
        () =>
          console.log(
            `Updated permitting_assessment ${audit.Id} (isSynced=${syncedValue})`,
          ),
        (_: any, error: any) =>
          console.error(
            `Error updating permitting_assessment ${audit.Id}:`,
            error,
          ),
      );
    },
    (txError: any) => console.error('Transaction ERROR:', txError),
    () => console.log('permitting_assessment update completed'),
  );
};

export const updateSignGeneralAudit = (
  auditData: SignGeneralAudit,
  syncedValue: number,
) => {
  console.log('UPDATINGGGG SIGNGENERAL:::', auditData);
  // return
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      UPDATE sign_general_audit
      SET
        projectId = ?,
        signId = ?,
        optionId = ?,
        signAliasName = ?,
        signType = ?,
        sign_order = ?,
        createdDate = ?,
        adminId = ?,
        adminName = ?,
        customerName = ?,
        attachedOrHanging = ?,
        attachmentType = ?,
        bannerOrSignMaterial = ?,
        channelLetterMaterial = ?,
        colorOrExistingColorMatch = ?,
        communicationsType = ?,
        contentManagementSoftwareRequired = ?,
        contentManagementNotes = ?,
        copyTypeOrStyle = ?,
        documentSubstrateCondition = ?,
        extMaterialThickness = ?,
        faceMaterialsData = ?,
        facilityDiagramOrSketchProvided = ?,
        generalDescriptionOfPlacementOfSign = ?,
        interactiveDisplay = ?,
        ladderOrLiftRequired = ?,
        material = ?,
        materialThickness = ?,
        numberOfScreens = ?,
        panFlatCarvedOrSandblastedLetterData = ?,
        racewayOrFlush = ?,
        recentlyPainted = ?,
        replaceOrUseExisting = ?,
        resolution = ?,
        rgbOrMonochrome = ?,
        singleOrDoubleFaced = ?,
        siteCovered = ?,
        siteWeatherDependent = ?,
        sizeOfLadderOrLift = ?,
        surfaceQualityData = ?,
        typeOfAwning = ?,
        wallOrSubstrateType = ?,
        adhesionTestRequired = ?,
        adhesionTestResult = ?,
        anyAccessibilityObstructions = ?,
        anyPotentialSafetyIssues = ?,
        signGeneralAuditDocumentAccessibilityIssues = ?,
        signGeneralAuditdocumentPotentialSafetyIssues = ?,
        signGeneralAuditSummaryNotes = ?,
        signGeneralAuditTodoPunchList = ?,
        facilityDiagramOrSketchProvidedFile = ?,
        anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto = ?,
        anyPotentialSafetyIssuesPhoto = ?,
        anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos = ?,
        anyPotentialSafetyIssuesPhotos = ?,
        facilityDiagramOrSketchProvidedPhoto = ?,
        isSynced = ?
      WHERE Id = ?
      `,
      [
        auditData.projectId,
        auditData.signId,
        auditData.optionId,
        auditData.signAliasName,
        auditData.signType,
        auditData.sign_order,
        auditData.createdDate || '',
        auditData.adminId || null,
        auditData.adminName || '',
        auditData.customerName || '',
        auditData.attachedOrHanging || null,
        auditData.attachmentType || null,
        auditData.bannerOrSignMaterial || null,
        auditData.channelLetterMaterial || null,
        auditData.colorOrExistingColorMatch || null,
        auditData.communicationsType || null,
        auditData.contentManagementSoftwareRequired || null,
        auditData.contentManagementNotes || null,
        auditData.copyTypeOrStyle || null,
        auditData.documentSubstrateCondition || null,
        auditData.extMaterialThickness || null,
        auditData.faceMaterialsData || null,
        auditData.facilityDiagramOrSketchProvided || null,
        auditData.generalDescriptionOfPlacementOfSign || null,
        auditData.interactiveDisplay || null,
        auditData.ladderOrLiftRequired || null,
        auditData.material || null,
        auditData.materialThickness || null,
        auditData.numberOfScreens || null,
        auditData.panFlatCarvedOrSandblastedLetterData || null,
        auditData.racewayOrFlush || null,
        auditData.recentlyPainted || null,
        auditData.replaceOrUseExisting || null,
        auditData.resolution || null,
        auditData.rgbOrMonochrome || null,
        auditData.singleOrDoubleFaced || null,
        auditData.siteCovered || null,
        auditData.siteWeatherDependent || null,
        auditData.sizeOfLadderOrLift || null,
        auditData.surfaceQualityData || null,
        auditData.typeOfAwning || null,
        auditData.wallOrSubstrateType || null,
        auditData.adhesionTestRequired || null,
        auditData.adhesionTestResult || null,
        auditData.anyAccessibilityObstructions || null,
        auditData.anyPotentialSafetyIssues || null,
        auditData.signGeneralAuditDocumentAccessibilityIssues || null,
        auditData.signGeneralAuditdocumentPotentialSafetyIssues || null,
        auditData.signGeneralAuditSummaryNotes || '',
        auditData.signGeneralAuditTodoPunchList || '',
        auditData.facilityDiagramOrSketchProvidedFile || null,
        JSON.stringify(
          auditData.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
            [],
        ),
        JSON.stringify(auditData.anyPotentialSafetyIssuesPhoto || []),
        JSON.stringify(
          auditData.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos ||
            [],
        ),
        JSON.stringify(auditData.anyPotentialSafetyIssuesPhotos || []),
        JSON.stringify(auditData.facilityDiagramOrSketchProvidedPhoto || []),
        syncedValue,
        auditData.Id,
      ],
      () => console.log(`Updated sign_general_audit ${auditData.Id}`),
      (_: any, error: any) =>
        console.error(
          `Error updating sign_general_audit ${auditData.Id}:`,
          error,
        ),
    );
  });
};

export const getUnsyncedExistingSignAudits = (
  callback: (data: ExistingSignAudit[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM existing_sign_audit WHERE isSynced = 0`,
      [],
      (_: any, results: any) => {
        const rows = results.rows;
        const audits: ExistingSignAudit[] = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows.item(i);
          audits.push({
            ...row,
            existingSignAuditPhotoFromAdmin: JSON.parse(
              row.existingSignAuditPhotoFromAdmin || '[]',
            ),
            existingSignAuditPhotos: JSON.parse(
              row.existingSignAuditPhotos || '[]',
            ),
            existingSignAuditPhoto: JSON.parse(
              row.existingSignAuditPhoto || '[]',
            ),
          });
        }
        callback(audits);
      },
      (_: any, error: any) => {
        console.error('Error fetching unsynced existing_sign_audit:', error);
        callback([]);
        return false; // stops further propagation of error
      },
    );
  });
};

export const getUnsyncedElectricalAudits = (
  callback: (rows: any[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      SELECT * FROM electrical_audit WHERE isSynced = 0
      `,
      [],
      (_: any, result: any) => {
        const rows = result.rows.raw().map((item: any) => {
          return {
            ...item,
            electricalAuditPhotos: item.electricalAuditPhotos
              ? JSON.parse(item.electricalAuditPhotos)
              : null,
            electricalAuditPhoto: item.electricalAuditPhoto
              ? JSON.parse(item.electricalAuditPhoto)
              : null,
            electricTagsPhotos: item.electricTagsPhotos
              ? JSON.parse(item.electricTagsPhotos)
              : null,
            electricTagsPhoto: item.electricTagsPhoto
              ? JSON.parse(item.electricTagsPhoto)
              : null,
            electricalAuditPhotoFromAdmin: item.electricalAuditPhotoFromAdmin
              ? JSON.parse(item.electricalAuditPhotoFromAdmin)
              : null,
            electricTagsPhotoFromAdmin: item.electricTagsPhotoFromAdmin
              ? JSON.parse(item.electricTagsPhotoFromAdmin)
              : null,
          };
        });

        callback(rows);
      },
      (_: any, error: any) => {
        console.error('Error fetching unsynced electrical_audit:', error);
      },
    );
  });
};

export const getUnsyncedPermittingAssessments = (
  callback: (rows: any[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      SELECT * FROM permitting_assessment WHERE isSynced = 0
      `,
      [],
      (_: any, {rows}: any) => {
        const results = rows.raw ? rows.raw() : rows._array;
        callback(results);
      },
      (_: any, error: any) => {
        console.error('Error fetching unsynced permitting assessments:', error);
      },
    );
  });
};

export const getUnsyncedSignGeneralAudits = (
  callback: (rows: SignGeneralAudit[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM sign_general_audit WHERE isSynced = 0`,
      [],
      (_: any, result: any) => {
        const rows = result.rows.raw().map((row: any) => {
          return {
            ...row,
            anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto:
              row.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto
                ? JSON.parse(
                    row.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto,
                  )
                : [],
            anyPotentialSafetyIssuesPhoto: row.anyPotentialSafetyIssuesPhoto
              ? JSON.parse(row.anyPotentialSafetyIssuesPhoto)
              : [],
            anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos:
              row.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos
                ? JSON.parse(
                    row.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos,
                  )
                : [],
            anyPotentialSafetyIssuesPhotos: row.anyPotentialSafetyIssuesPhotos
              ? JSON.parse(row.anyPotentialSafetyIssuesPhotos)
              : [],
            facilityDiagramOrSketchProvidedPhoto:
              row.facilityDiagramOrSketchProvidedPhoto
                ? JSON.parse(row.facilityDiagramOrSketchProvidedPhoto)
                : [],
          } as SignGeneralAudit;
        });
        callback(rows);
      },
      (_: any, error: any) => {
        console.error('Error fetching unsynced sign_general_audit:', error);
      },
    );
  });
};

export const dropAllTables = () => {
  db.transaction((tx: any) => {
    const tables = [
      'projects',
      'sign_data_options',
      'existing_sign_audit',
      'electrical_audit',
      'permitting_assessment',
      'indoor_photos_and_measurements',
      'sign_general_audit',
    ];

    tables.forEach(table => {
      tx.executeSql(
        `DROP TABLE IF EXISTS ${table}`,
        [],
        () => console.log(`Table ${table} dropped successfully`),
        (_: any, error: any) =>
          console.error(`Error dropping table ${table}:`, error),
      );
    });
  });
};
