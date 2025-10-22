import {downloadImagesArray} from '../Functions/FSfunctions';
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
        existingSignAuditPhotos TEXT,        -- store JSON string if array
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

export const createPhotosAndMeasurementsTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS photos_and_measurements (
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
        teamId TEXT,
        nameOfMeasurement TEXT,
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
        squareFootageLengthFT TEXT,
        squareFootageWidthFT TEXT,
        squareFootageDepthIN TEXT,
        squareFootageDepthFT TEXT,
        squareFootageNotes TEXT,
        visibleOpeningsLengthFT TEXT,
        visibleOpeningsLengthIN TEXT,
        visibleOpeningsWidthFT TEXT,
        visibleOpeningsWidthIN TEXT,
        visibleOpeningsHeightFT TEXT,
        visibleOpeningsHeightIN TEXT,
        visibleOpeningsNotes TEXT,
        visibleOpeningsSpike TEXT,
        otherPhotosAndMeasurementsLengthFT TEXT,
        otherPhotosAndMeasurementsLengthIN TEXT,
        otherPhotosAndMeasurementsWidthFT TEXT,
        otherPhotosAndMeasurementsWidthIN TEXT,
        otherPhotosAndMeasurementsDepthFT TEXT,
        otherPhotosAndMeasurementsDepthIN TEXT,
        photoOfWallOrFloor TEXT,
        photosAndMeasurementsSummaryNotes TEXT,
        photosAndMeasurementsTodoPunchList TEXT,
        signOrientation TEXT,
        surveyModule TEXT,
        measureGroundToSignHeightFT TEXT,
        measureGroundToSignHeightIN TEXT,
        measureChannelLettersWidthFT TEXT,
        measureChannelLettersWidthIN TEXT,
        measureChannelLettersHeightFT TEXT,
        measureChannelLettersHeightIN TEXT,
        measureChannelLettersDepthFT TEXT,
        measureChannelLettersDepthIN TEXT,
        measureCutSizeWidthFT TEXT,
        measureCutSizeWidthIN TEXT,
        measureCutSizeHeightFT TEXT,
        measureCutSizeHeightIN TEXT,
        measureCutSizeDepthFT TEXT,
        measureCutSizeDepthIN TEXT,
        measureRetainerSizeWidthFT TEXT,
        measureRetainerSizeWidthIN TEXT,
        measureRetainerSizeHeightFT TEXT,
        measureRetainerSizeHeightIN TEXT,
        measureRetainerSizeDepthFT TEXT,
        measureRetainerSizeDepthIN TEXT,
        ifPanMeasurePanDimensionWidthFT TEXT,
        ifPanMeasurePanDimensionWidthIN TEXT,
        ifPanMeasurePanDimensionHeightFT TEXT,
        ifPanMeasurePanDimensionHeightIN TEXT,
        ifPanMeasurePanDimensionDepthFT TEXT,
        ifPanMeasurePanDimensionDepthIN TEXT,
        measureCellingWallSurfaceAreaWidthFT TEXT,
        measureCellingWallSurfaceAreaWidthIN TEXT,
        measureCellingWallSurfaceAreaHeightFT TEXT,
        measureCellingWallSurfaceAreaHeightIN TEXT,
        measureCellingWallSurfaceAreaDepthFT TEXT,
        measureCellingWallSurfaceAreaDepthIN TEXT,
        heightOfPoleLengthFT TEXT,
        heightOfPoleLengthIN TEXT,
        circumferenceOfPoleLengthFT TEXT,
        circumferenceOfPoleLengthIN TEXT,
        distanceBetweenPolesLengthFT TEXT,
        distanceBetweenPolesLengthIN TEXT,
        otherPhotosMeasurementsMarkupsWidthFT TEXT,
        otherPhotosMeasurementsMarkupsWidthIN TEXT,
        otherPhotosMeasurementsMarkupsHeightFT TEXT,
        otherPhotosMeasurementsMarkupsHeightIN TEXT,
        otherPhotosMeasurementsMarkupsDepthFT TEXT,
        otherPhotosMeasurementsMarkupsDepthIN TEXT,
        indoorWallHeightFT TEXT,
        indoorWallHeightIN TEXT,
        indoorWallWidthFT TEXT,
        indoorWallWidthIN TEXT,
        ceilingHeightFT TEXT,
        ceilingHeightIN TEXT,
        indoorMeasurement TEXT,
        indoorMeasurementNotes TEXT,
        indoorSummaryNotes TEXT,
        indoorTodoPunchList TEXT,
        signDimensionsPhoto TEXT,
        signDimensionsSpikePhoto TEXT,
        measureChannelLettersPhoto TEXT,
        measureChannelLettersPhotos TEXT,
        squareFootagePhoto TEXT,
        squareFootageSpikePhoto TEXT,
        photoCloseUpOfSign TEXT,
        visibleOpeningsPhoto TEXT,
        mullionsPhoto TEXT,
        mullionsSpike TEXT,
        otherPhotosMeasurementsMarkupsPhoto TEXT,
        otherPhotosMeasurementsMarkupsSpike TEXT,
        photoFullFrontalOfWholeSignStructurePhoto TEXT,
        measureCellingWallSurfaceAreaPhoto TEXT,
        measureRetainerSizePhoto TEXT,
        measureCutSizePhoto TEXT,
        ifPanMeasurePanDimensionPhoto TEXT,
        wallDimensionsPhoto TEXT,
        otherPhotosImage TEXT,
        wallDimensionsSpikePhoto TEXT,
        photoOfWallOrFloorPhoto TEXT,
        otherPhotosSpike TEXT,
        ifPanMeasurePanDimensionPhotos TEXT,
        measureRetainerSizePhotos TEXT,
        photoCloseUpOfSigns TEXT,
        photoFullFrontalOfWholeSignStructurePhotos TEXT,
        signDimensionsPhotos TEXT,
        squareFootageSpikePhotos TEXT,
        visibleOpeningsPhotos TEXT,
        otherPhotosImages TEXT,
        otherPhotosMeasurementsMarkupsPhotos TEXT,
        indoorWallPhoto TEXT,
        ceilingSurfacePhoto TEXT,
        isSynched BOOLEAN DEFAULT 0,
        FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE
      )
      `,
      [],
      () =>
        console.log('✅ photos_and_measurements table created successfully'),
      (_: any, error: any) => {
        console.error('❌ Error creating photos_and_measurements table');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error code:', error?.code);
      },
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
        () =>
          console.log(
            `Project ${(project.projectId, project.projectTitle)} inserted`,
          ),
        (_: any, error: any) =>
          console.error(
            `Error inserting project ${
              (project.projectId, project.projectTitle)
            }:`,
            error,
          ),
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

export const insertExistingSignAudit = async (
  projects: any[],
  syched: number,
) => {
  for (const project of projects) {
    for (const option of project.signDataOptions || []) {
      const audit: ExistingSignAudit = option.existing_sign_audit;
      if (!audit) continue;
      const id = option.existing_sign_audit?.id;
      const loadedImages = await downloadImagesArray(
        audit.existingSignAuditPhotos || [],
        'existingSignAuditPhotos',
      );
      console.log('loadedImages', loadedImages);
      db.transaction(
        (tx: any) => {
          tx.executeSql(
            `
            INSERT OR REPLACE INTO existing_sign_audit (
              Id, projectId, signId, signAliasName, signType, sign_order,
              isThisReplacementSign, oldSignStillPresent, isTheSignIlluminated,
              existingSignAuditDocumentSignCondition,
              existingSignAuditPhotoFromAdmin,
              existingSignAuditPhotos,
              existingSignAuditPhoto,
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              JSON.stringify(loadedImages || []), // ✅ Use downloaded images
              JSON.stringify(audit.existingSignAuditPhoto || []),
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
            () => console.log(`Inserted existing_sign_audit for sign ${id}`),
            (_: any, error: any) =>
              console.error(
                `Error inserting existing_sign_audit ${id}:`,
                error,
              ),
          );
        },
        (txError: any) => console.error('Transaction ERROR:', txError),
        () => console.log('All existing_sign_audit data inserted successfully'),
      );
    }
  }
};

export const insertExistingSignAuditImagesOnly = async (
  id: string | number,
  key: string,
  images: any[] = [],
  synced: number, // 1 = online synced, 0 = offline
) => {
  if (!id || !key) {
    console.warn('⚠️ Missing ID or key for existing_sign_audit update');
    return;
  }

  console.log(
    `🟡 Updating Existing Sign Audit ID: ${id}, Key: ${key}, Synced: ${synced}`,
  );

  try {
    let finalImages = images;

    if (synced === 1) {
      finalImages = await downloadImagesArray(images || [], key);
      console.log(
        `✅ Downloaded ${finalImages?.length || 0} images for ${key}`,
      );
    } else {
      console.log(
        `📴 Offline mode — skipping download for ${key}, using local paths`,
      );
    }
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `
            UPDATE existing_sign_audit
            SET ${key} = ?, isSynced = ?
            WHERE Id = ?
          `,
          [JSON.stringify(finalImages || []), synced, id],
          () => console.log(`✅ Updated ${key} for existing_sign_audit ${id}`),
          (_: any, error: any) =>
            console.error(
              `❌ SQL error updating ${key} for existing_sign_audit ${id}:`,
              error,
            ),
        );
      },
      (txError: any) => console.error('❌ Transaction ERROR:', txError),
      () =>
        console.log(`✅ existing_sign_audit image update complete for ${key}`),
    );
  } catch (error) {
    console.error(`❌ Failed to insert/update images for ${key}:`, error);
  }
};

export const getExistingSignAuditImagesByKey = async (
  id: string | number,
  key: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!id || !key) {
      console.warn('⚠️ Missing audit ID or key');
      resolve([]);
      return;
    }

    console.log(
      `📦 Fetching images for Existing Sign Audit ID: ${id}, Key: ${key}`,
    );

    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `SELECT ${key} FROM existing_sign_audit WHERE Id = ?`,
          [id],
          (_: any, results: any) => {
            if (results.rows.length > 0) {
              const row = results.rows.item(0);
              try {
                const images = JSON.parse(row[key] || '[]');
                console.log(`✅ Retrieved ${images.length} images for ${key}`);
                resolve(images);
              } catch (err) {
                console.error(`❌ JSON parse error for ${key}:`, err);
                resolve([]);
              }
            } else {
              console.warn(`⚠️ No record found for ID ${id}`);
              resolve([]);
            }
          },
          (_: any, error: any) => {
            console.error(`❌ SQL error fetching ${key}:`, error);
            reject(error);
          },
        );
      },
      (txError: any) => {
        console.error('Transaction ERROR:', txError);
        reject(txError);
      },
    );
  });
};

export const insertElectricalAudit = async (
  projects: any[],
  syched: number,
) => {
  for (const project of projects) {
    for (const option of project.signDataOptions || []) {
      const audit: ElectricalAudit = option?.electrical_audit;
      if (!audit) continue;

      const id = option.electrical_audit?.id;
      console.log('Processing ELECTRICAL AUDIT ID:', id);

      const loadedElectricalPhotos = await downloadImagesArray(
        audit.electricalAuditPhotos || [],
        'electricalAuditPhotos',
      );

      const loadedElectricalAdminPhotos = await downloadImagesArray(
        audit.electricalAuditPhotoFromAdmin || [],
        'electricalAuditPhotoFromAdmin',
      );

      const loadedTagsPhotos = await downloadImagesArray(
        audit.electricTagsPhotos || [],
        'electricTagsPhotos',
      );

      const loadedTagsPhoto = await downloadImagesArray(
        audit.electricTagsPhoto || [],
        'electricTagsPhoto',
      );

      const loadedTagsAdminPhotos = await downloadImagesArray(
        audit.electricTagsPhotoFromAdmin || [],
        'electricTagsPhotoFromAdmin',
      );

      console.log('✅ Downloaded Electrical Audit Images for', id, {
        loadedElectricalPhotos,
        loadedTagsPhotos,
      });

      db.transaction(
        (tx: any) => {
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
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              JSON.stringify(loadedElectricalAdminPhotos || []),
              JSON.stringify(loadedElectricalPhotos || []),
              JSON.stringify(audit.electricalAuditPhoto || []),
              JSON.stringify(loadedTagsAdminPhotos || []),
              JSON.stringify(loadedTagsPhotos || []),
              JSON.stringify(loadedTagsPhoto || []),
              audit.surveyModule || null,
            ],
            () => console.log(`✅ Inserted electrical_audit for sign ${id}`),
            (_: any, error: any) =>
              console.error(
                `❌ Error inserting electrical_audit ${id}:`,
                error,
              ),
          );
        },
        (txError: any) => console.error('Transaction ERROR:', txError),
        () => console.log('All electrical_audit data inserted successfully'),
      );
    }
  }
};

export const insertElectricalAuditImagesOnly = async (
  id: string | number,
  key: string,
  images: any[] = [],
  synced: number, // 1 = online synced, 0 = offline
) => {
  if (!id || !key) {
    console.warn('⚠️ Missing audit ID or key');
    return;
  }

  console.log(
    `🟡 Processing Electrical Audit ID: ${id}, Key: ${key}, Synced: ${synced}`,
  );

  try {
    let finalImages = images;

    // 🟢 If online, download images
    if (synced === 1) {
      finalImages = await downloadImagesArray(images || [], key);
      console.log(
        `✅ Downloaded ${finalImages?.length || 0} images for ${key}`,
      );
    } else {
      // 🟠 Offline, skip download
      console.log(`📴 Offline mode — using local paths for ${key}`);
    }

    // 🧱 Update local SQLite table
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `
            UPDATE electrical_audit
            SET ${key} = ?, isSynced = ?
            WHERE Id = ?
          `,
          [JSON.stringify(finalImages || []), synced, id],
          () => console.log(`✅ Updated ${key} for audit ${id}`),
          (_: any, error: any) =>
            console.error(
              `❌ SQL error updating ${key} for audit ${id}:`,
              error,
            ),
        );
      },
      (txError: any) => console.error('❌ Transaction ERROR:', txError),
      () => console.log(`✅ Electrical audit image update complete for ${key}`),
    );
  } catch (error) {
    console.error(`❌ Failed to insert/update images for ${key}:`, error);
  }
};

export const getElectricalAuditImagesByKey = async (
  id: string | number,
  key: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!id || !key) {
      console.warn('⚠️ Missing audit ID or key');
      resolve([]);
      return;
    }

    console.log(`📦 Fetching images for Audit ID: ${id}, Key: ${key}`);

    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `SELECT ${key} FROM electrical_audit WHERE Id = ?`,
          [id],
          (_: any, results: any) => {
            if (results.rows.length > 0) {
              const row = results.rows.item(0);
              try {
                const images = JSON.parse(row[key] || '[]');
                console.log(`✅ Retrieved ${images.length} images for ${key}`);
                resolve(images);
              } catch (err) {
                console.error(`❌ Failed to parse images for ${key}:`, err);
                resolve([]);
              }
            } else {
              console.warn(`⚠️ No record found for ID ${id}`);
              resolve([]);
            }
          },
          (_: any, error: any) => {
            console.error(`❌ Error fetching images for ${key}:`, error);
            reject(error);
          },
        );
      },
      (txError: any) => {
        console.error('Transaction ERROR:', txError);
        reject(txError);
      },
    );
  });
};

export const insertPermittingAssessment = (projects: any[], syched: number) => {
  db.transaction(
    (tx: any) => {
      projects.forEach(project => {
        project.signDataOptions?.forEach((option: any) => {
          const audit: PermittingAssessment = option.permitting_assessment;
          // console.log('AUDITTTTPERMITTTTTT:::::::::::::::', audit);
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

export const insertPhotosAndMeasurements = async (
  projects: any[],
  synched: number,
) => {
  for (const project of projects) {
    for (const option of project.signDataOptions || []) {
      const measurements: any =
        option.indoor_photos_and_measurements ||
        option.outdoor_photos_and_measurements;
      if (!measurements) continue;

      const id = measurements?.id;
      console.log('Processing Measurement ID:', id);

      // Download all image arrays first
      const loadedSignDimensionsPhotos = await downloadImagesArray(
        measurements.signDimensionsPhotos || [],
        'signDimensionsPhotos',
      );
      const loadedSignDimensionsSpikePhoto = await downloadImagesArray(
        measurements.signDimensionsSpikePhoto || [],
        'signDimensionsSpikePhoto',
      );
      const loadedMeasureChannelLettersPhotos = await downloadImagesArray(
        measurements.measureChannelLettersPhotos || [],
        'measureChannelLettersPhotos',
      );
      const loadedMeasureChannelLettersPhoto = await downloadImagesArray(
        measurements.measureChannelLettersPhoto || [],
        'measureChannelLettersPhoto',
      );
      const loadedSquareFootagePhotos = await downloadImagesArray(
        measurements.squareFootagePhoto || [],
        'squareFootagePhoto',
      );
      const loadedSquareFootageSpikePhotos = await downloadImagesArray(
        measurements.squareFootageSpikePhotos || [],
        'squareFootageSpikePhotos',
      );
      const loadedPhotoCloseUpOfSign = await downloadImagesArray(
        measurements.photoCloseUpOfSign || [],
        'photoCloseUpOfSign',
      );
      const loadedVisibleOpeningsPhotos = await downloadImagesArray(
        measurements.visibleOpeningsPhotos || [],
        'visibleOpeningsPhotos',
      );
      const loadedMullionsPhotos = await downloadImagesArray(
        measurements.mullionsPhoto || [],
        'mullionsPhoto',
      );
      const loadedMullionsSpike = await downloadImagesArray(
        measurements.mullionsSpike || [],
        'mullionsSpike',
      );
      const loadedOtherPhotosMarkups = await downloadImagesArray(
        measurements.otherPhotosMeasurementsMarkupsPhotos || [],
        'otherPhotosMeasurementsMarkupsPhotos',
      );
      const loadedOtherPhotosMarkupsSpike = await downloadImagesArray(
        measurements.otherPhotosMeasurementsMarkupsSpike || [],
        'otherPhotosMeasurementsMarkupsSpike',
      );
      const loadedPhotoFullFrontal = await downloadImagesArray(
        measurements.photoFullFrontalOfWholeSignStructurePhotos || [],
        'photoFullFrontalOfWholeSignStructurePhotos',
      );
      const loadedMeasureCellingWall = await downloadImagesArray(
        measurements.measureCellingWallSurfaceAreaPhoto || [],
        'measureCellingWallSurfaceAreaPhoto',
      );
      const loadedMeasureRetainerSize = await downloadImagesArray(
        measurements.measureRetainerSizePhoto || [],
        'measureRetainerSizePhoto',
      );
      const loadedMeasureCutSize = await downloadImagesArray(
        measurements.measureCutSizePhoto || [],
        'measureCutSizePhoto',
      );
      const loadedIfPanMeasurePanDimension = await downloadImagesArray(
        measurements.ifPanMeasurePanDimensionPhoto || [],
        'ifPanMeasurePanDimensionPhoto',
      );
      const loadedWallDimensionsPhoto = await downloadImagesArray(
        measurements.wallDimensionsPhoto || [],
        'wallDimensionsPhoto',
      );
      const loadedOtherPhotosImage = await downloadImagesArray(
        measurements.otherPhotosImage || [],
        'otherPhotosImage',
      );
      const loadedWallDimensionsSpikePhoto = await downloadImagesArray(
        measurements.wallDimensionsSpikePhoto || [],
        'wallDimensionsSpikePhoto',
      );
      const loadedPhotoOfWallOrFloorPhoto = await downloadImagesArray(
        measurements.photoOfWallOrFloorPhoto || [],
        'photoOfWallOrFloorPhoto',
      );
      const loadedOtherPhotosSpike = await downloadImagesArray(
        measurements.otherPhotosSpike || [],
        'otherPhotosSpike',
      );
      const loadedIfPanMeasurePanDimensionPhotos = await downloadImagesArray(
        measurements.ifPanMeasurePanDimensionPhotos || [],
        'ifPanMeasurePanDimensionPhotos',
      );
      const loadedMeasureRetainerSizePhotos = await downloadImagesArray(
        measurements.measureRetainerSizePhotos || [],
        'measureRetainerSizePhotos',
      );
      const loadedPhotoCloseUpOfSigns = await downloadImagesArray(
        measurements.photoCloseUpOfSigns || [],
        'photoCloseUpOfSigns',
      );
      const loadedIndoorWallPhoto = await downloadImagesArray(
        measurements.indoorWallPhoto || [],
        'indoorWallPhoto',
      );
      const loadedCeilingSurfacePhoto = await downloadImagesArray(
        measurements.ceilingSurfacePhoto || [],
        'ceilingSurfacePhoto',
      );

      console.log(`✅ Downloaded all images for Measurement ID: ${id}`);

      // Insert into SQLite
      db.transaction(
        (tx: any) => {
          tx.executeSql(
            `
            INSERT OR REPLACE INTO photos_and_measurements (
              id, projectId, signId, optionId, signAliasName, signType, sign_order,
              createdDate, adminId, adminName, customerName, teamId, nameOfMeasurement,
              areMullionsPresent, areThereAnyVisibleOpenings,
              signDimensionsWidthFT, signDimensionsWidthIN, signDimensionsHeightFT, 
              signDimensionsHeightIN, signDimensionsDepthFT, signDimensionsDepthIN,
              wallDimensionsLengthFT, wallDimensionsLengthIN, wallDimensionsWidthFT, 
              wallDimensionsWidthIN, measureDistanceFromSignToFloorLengthFT,
              measureDistanceFromSignToFloorLengthIN, measureDistanceLength1FT,
              measureDistanceLength1IN, measureDistanceLength2FT, measureDistanceLength2IN,
              measureDistanceLength3FT, measureDistanceLength3IN, measureDistanceLength4FT,
              measureDistanceLength4IN, mullionsLengthFT, mullionsLengthIN, mullionsWidthFT,
              mullionsWidthIN, mullionsDepthFT, mullionsDepthIN, mullionsNotes,
              squareFootage, squareFootageCalculationRequired, squareFootageFeet,
              squareFootageWidthIN, squareFootageLengthIN, squareFootageLengthFT,
              squareFootageWidthFT, squareFootageDepthIN, squareFootageDepthFT,
              squareFootageNotes, visibleOpeningsLengthFT, visibleOpeningsLengthIN, 
              visibleOpeningsWidthFT, visibleOpeningsWidthIN, visibleOpeningsHeightFT,
              visibleOpeningsHeightIN, visibleOpeningsNotes, visibleOpeningsSpike,
              otherPhotosAndMeasurementsLengthFT, otherPhotosAndMeasurementsLengthIN, 
              otherPhotosAndMeasurementsWidthFT, otherPhotosAndMeasurementsWidthIN, 
              otherPhotosAndMeasurementsDepthFT, otherPhotosAndMeasurementsDepthIN, 
              photoOfWallOrFloor, photosAndMeasurementsSummaryNotes, 
              photosAndMeasurementsTodoPunchList, signOrientation, surveyModule,
              measureGroundToSignHeightFT, measureGroundToSignHeightIN,
              measureChannelLettersWidthFT, measureChannelLettersWidthIN,
              measureChannelLettersHeightFT, measureChannelLettersHeightIN,
              measureChannelLettersDepthFT, measureChannelLettersDepthIN,
              measureCutSizeWidthFT, measureCutSizeWidthIN, measureCutSizeHeightFT,
              measureCutSizeHeightIN, measureCutSizeDepthFT, measureCutSizeDepthIN,
              measureRetainerSizeWidthFT, measureRetainerSizeWidthIN,
              measureRetainerSizeHeightFT, measureRetainerSizeHeightIN,
              measureRetainerSizeDepthFT, measureRetainerSizeDepthIN,
              ifPanMeasurePanDimensionWidthFT, ifPanMeasurePanDimensionWidthIN,
              ifPanMeasurePanDimensionHeightFT, ifPanMeasurePanDimensionHeightIN,
              ifPanMeasurePanDimensionDepthFT, ifPanMeasurePanDimensionDepthIN,
              measureCellingWallSurfaceAreaWidthFT, measureCellingWallSurfaceAreaWidthIN,
              measureCellingWallSurfaceAreaHeightFT, measureCellingWallSurfaceAreaHeightIN,
              measureCellingWallSurfaceAreaDepthFT, measureCellingWallSurfaceAreaDepthIN,
              heightOfPoleLengthFT, heightOfPoleLengthIN, circumferenceOfPoleLengthFT,
              circumferenceOfPoleLengthIN, distanceBetweenPolesLengthFT,
              distanceBetweenPolesLengthIN, otherPhotosMeasurementsMarkupsWidthFT,
              otherPhotosMeasurementsMarkupsWidthIN, otherPhotosMeasurementsMarkupsHeightFT,
              otherPhotosMeasurementsMarkupsHeightIN, otherPhotosMeasurementsMarkupsDepthFT,
              otherPhotosMeasurementsMarkupsDepthIN, indoorWallHeightFT, indoorWallHeightIN,
              indoorWallWidthFT, indoorWallWidthIN, ceilingHeightFT, ceilingHeightIN,
              indoorMeasurement, indoorMeasurementNotes, indoorSummaryNotes, 
              indoorTodoPunchList, signDimensionsPhoto, signDimensionsSpikePhoto,
              measureChannelLettersPhoto, measureChannelLettersPhotos, squareFootagePhoto,
              squareFootageSpikePhoto, photoCloseUpOfSign, visibleOpeningsPhoto,
              mullionsPhoto, mullionsSpike, otherPhotosMeasurementsMarkupsPhoto,
              otherPhotosMeasurementsMarkupsSpike, photoFullFrontalOfWholeSignStructurePhoto,
              measureCellingWallSurfaceAreaPhoto, measureRetainerSizePhoto,
              measureCutSizePhoto, ifPanMeasurePanDimensionPhoto, wallDimensionsPhoto,
              otherPhotosImage, wallDimensionsSpikePhoto, photoOfWallOrFloorPhoto,
              otherPhotosSpike, ifPanMeasurePanDimensionPhotos, measureRetainerSizePhotos,
              photoCloseUpOfSigns, photoFullFrontalOfWholeSignStructurePhotos,
              signDimensionsPhotos, squareFootageSpikePhotos, visibleOpeningsPhotos,
              otherPhotosImages, otherPhotosMeasurementsMarkupsPhotos, indoorWallPhoto,
              ceilingSurfacePhoto, isSynched
            ) VALUES (
              ${Array(159).fill('?').join(', ')}
            )
            `,
            [
              id || null,
              measurements.projectId || null,
              measurements.signId || null,
              measurements.optionId || null,
              measurements.signAliasName || null,
              measurements.signType || null,
              measurements.sign_order || null,
              measurements.createdDate || null,
              measurements.adminId || null,
              measurements.adminName || null,
              measurements.customerName || null,
              measurements.teamId || null,
              measurements.nameOfMeasurement || null,
              measurements.areMullionsPresent || null,
              measurements.areThereAnyVisibleOpenings || null,
              measurements.signDimensionsWidthFT || null,
              measurements.signDimensionsWidthIN || null,
              measurements.signDimensionsHeightFT || null,
              measurements.signDimensionsHeightIN || null,
              measurements.signDimensionsDepthFT || null,
              measurements.signDimensionsDepthIN || null,
              measurements.wallDimensionsLengthFT || null,
              measurements.wallDimensionsLengthIN || null,
              measurements.wallDimensionsWidthFT || null,
              measurements.wallDimensionsWidthIN || null,
              measurements.measureDistanceFromSignToFloorLengthFT || null,
              measurements.measureDistanceFromSignToFloorLengthIN || null,
              measurements.measureDistanceLength1FT || null,
              measurements.measureDistanceLength1IN || null,
              measurements.measureDistanceLength2FT || null,
              measurements.measureDistanceLength2IN || null,
              measurements.measureDistanceLength3FT || null,
              measurements.measureDistanceLength3IN || null,
              measurements.measureDistanceLength4FT || null,
              measurements.measureDistanceLength4IN || null,
              measurements.mullionsLengthFT || null,
              measurements.mullionsLengthIN || null,
              measurements.mullionsWidthFT || null,
              measurements.mullionsWidthIN || null,
              measurements.mullionsDepthFT || null,
              measurements.mullionsDepthIN || null,
              measurements.mullionsNotes || null,
              measurements.squareFootage || null,
              measurements.squareFootageCalculationRequired || null,
              measurements.squareFootageFeet || null,
              measurements.squareFootageWidthIN || null,
              measurements.squareFootageLengthIN || null,
              measurements.squareFootageLengthFT || null,
              measurements.squareFootageWidthFT || null,
              measurements.squareFootageDepthIN || null,
              measurements.squareFootageDepthFT || null,
              measurements.squareFootageNotes || null,
              measurements.visibleOpeningsLengthFT || null,
              measurements.visibleOpeningsLengthIN || null,
              measurements.visibleOpeningsWidthFT || null,
              measurements.visibleOpeningsWidthIN || null,
              measurements.visibleOpeningsHeightFT || null,
              measurements.visibleOpeningsHeightIN || null,
              measurements.visibleOpeningsNotes || null,
              measurements.visibleOpeningsSpike || null,
              measurements.otherPhotosAndMeasurementsLengthFT || null,
              measurements.otherPhotosAndMeasurementsLengthIN || null,
              measurements.otherPhotosAndMeasurementsWidthFT || null,
              measurements.otherPhotosAndMeasurementsWidthIN || null,
              measurements.otherPhotosAndMeasurementsDepthFT || null,
              measurements.otherPhotosAndMeasurementsDepthIN || null,
              JSON.stringify(measurements.photoOfWallOrFloor || null),
              measurements.photosAndMeasurementsSummaryNotes || null,
              measurements.photosAndMeasurementsTodoPunchList || null,
              measurements.signOrientation || null,
              measurements.surveyModule || null,
              measurements.measureGroundToSignHeightFT || null,
              measurements.measureGroundToSignHeightIN || null,
              measurements.measureChannelLettersWidthFT || null,
              measurements.measureChannelLettersWidthIN || null,
              measurements.measureChannelLettersHeightFT || null,
              measurements.measureChannelLettersHeightIN || null,
              measurements.measureChannelLettersDepthFT || null,
              measurements.measureChannelLettersDepthIN || null,
              measurements.measureCutSizeWidthFT || null,
              measurements.measureCutSizeWidthIN || null,
              measurements.measureCutSizeHeightFT || null,
              measurements.measureCutSizeHeightIN || null,
              measurements.measureCutSizeDepthFT || null,
              measurements.measureCutSizeDepthIN || null,
              measurements.measureRetainerSizeWidthFT || null,
              measurements.measureRetainerSizeWidthIN || null,
              measurements.measureRetainerSizeHeightFT || null,
              measurements.measureRetainerSizeHeightIN || null,
              measurements.measureRetainerSizeDepthFT || null,
              measurements.measureRetainerSizeDepthIN || null,
              measurements.ifPanMeasurePanDimensionWidthFT || null,
              measurements.ifPanMeasurePanDimensionWidthIN || null,
              measurements.ifPanMeasurePanDimensionHeightFT || null,
              measurements.ifPanMeasurePanDimensionHeightIN || null,
              measurements.ifPanMeasurePanDimensionDepthFT || null,
              measurements.ifPanMeasurePanDimensionDepthIN || null,
              measurements.measureCellingWallSurfaceAreaWidthFT || null,
              measurements.measureCellingWallSurfaceAreaWidthIN || null,
              measurements.measureCellingWallSurfaceAreaHeightFT || null,
              measurements.measureCellingWallSurfaceAreaHeightIN || null,
              measurements.measureCellingWallSurfaceAreaDepthFT || null,
              measurements.measureCellingWallSurfaceAreaDepthIN || null,
              measurements.heightOfPoleLengthFT || null,
              measurements.heightOfPoleLengthIN || null,
              measurements.circumferenceOfPoleLengthFT || null,
              measurements.circumferenceOfPoleLengthIN || null,
              measurements.distanceBetweenPolesLengthFT || null,
              measurements.distanceBetweenPolesLengthIN || null,
              measurements.otherPhotosMeasurementsMarkupsWidthFT || null,
              measurements.otherPhotosMeasurementsMarkupsWidthIN || null,
              measurements.otherPhotosMeasurementsMarkupsHeightFT || null,
              measurements.otherPhotosMeasurementsMarkupsHeightIN || null,
              measurements.otherPhotosMeasurementsMarkupsDepthFT || null,
              measurements.otherPhotosMeasurementsMarkupsDepthIN || null,
              measurements.indoorWallHeightFT || null,
              measurements.indoorWallHeightIN || null,
              measurements.indoorWallWidthFT || null,
              measurements.indoorWallWidthIN || null,
              measurements.ceilingHeightFT || null,
              measurements.ceilingHeightIN || null,
              measurements.indoorMeasurement || null,
              measurements.indoorMeasurementNotes || null,
              measurements.indoorSummaryNotes || null,
              measurements.indoorTodoPunchList || null,
              JSON.stringify(measurements.signDimensionsPhoto || []),
              JSON.stringify(loadedSignDimensionsSpikePhoto),
              JSON.stringify(loadedMeasureChannelLettersPhoto),
              JSON.stringify(loadedMeasureChannelLettersPhotos),
              JSON.stringify(loadedSquareFootagePhotos),
              JSON.stringify(measurements.squareFootageSpikePhoto || []),
              JSON.stringify(loadedPhotoCloseUpOfSign),
              JSON.stringify(loadedVisibleOpeningsPhotos),
              JSON.stringify(loadedMullionsPhotos),
              JSON.stringify(loadedMullionsSpike),
              JSON.stringify(measurements.otherPhotosMeasurementsMarkupsPhoto || []),
              JSON.stringify(loadedOtherPhotosMarkupsSpike),
              JSON.stringify(measurements.photoFullFrontalOfWholeSignStructurePhoto || []),
              JSON.stringify(loadedMeasureCellingWall),
              JSON.stringify(loadedMeasureRetainerSize),
              JSON.stringify(loadedMeasureCutSize),
              JSON.stringify(loadedIfPanMeasurePanDimension),
              JSON.stringify(loadedWallDimensionsPhoto),
              JSON.stringify(loadedOtherPhotosImage),
              JSON.stringify(loadedWallDimensionsSpikePhoto),
              JSON.stringify(loadedPhotoOfWallOrFloorPhoto),
              JSON.stringify(loadedOtherPhotosSpike),
              JSON.stringify(loadedIfPanMeasurePanDimensionPhotos),
              JSON.stringify(loadedMeasureRetainerSizePhotos),
              JSON.stringify(loadedPhotoCloseUpOfSigns),
              JSON.stringify(loadedPhotoFullFrontal),
              JSON.stringify(loadedSignDimensionsPhotos),
              JSON.stringify(loadedSquareFootageSpikePhotos),
              JSON.stringify(loadedVisibleOpeningsPhotos),
              JSON.stringify(loadedOtherPhotosMarkups),
              JSON.stringify(loadedOtherPhotosMarkups),
              JSON.stringify(loadedIndoorWallPhoto),
              JSON.stringify(loadedCeilingSurfacePhoto),
              synched,
            ],
            () =>
              console.log(
                `✅ Inserted photos_and_measurements for Measurement ID: ${id}`,
              ),
            (_: any, error: any) => {
              console.error(
                `❌ Error inserting photos_and_measurements ${id}:`,
                error,
              );
            },
          );
        },
        (txError: any) => console.error('Transaction ERROR:', txError),
        () =>
          console.log(
            '✅ All photos_and_measurements data inserted successfully',
          ),
      );
    }
  }
};

export const insertPhotosAndMeasurementsImagesOnly = async (
  id: string | number,
  key: string,
  images: any[] = [],
  synced: number, // 1 = online synced, 0 = offline
) => {
  if (!id || !key) {
    console.warn('⚠️ Missing ID or key for photos_and_measurements update');
    return;
  }

  console.log(
    `🟡 Updating Photos & Measurements ID: ${id}, Key: ${key}, Synced: ${synced}`,
  );

  try {
    let finalImages = images;

    // Download images if online
    if (synced === 1) {
      finalImages = await downloadImagesArray(images || [], key);
      console.log(
        `✅ Downloaded ${finalImages?.length || 0} images for ${key}`,
      );
    } else {
      console.log(
        `📴 Offline mode — skipping download for ${key}, using local paths`,
      );
    }

    // Update the SQLite table
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `
          UPDATE photos_and_measurements
          SET ${key} = ?, isSynched = ?
          WHERE id = ?
          `,
          [JSON.stringify(finalImages || []), synced, id],
          () =>
            console.log(`✅ Updated ${key} for photos_and_measurements ${id}`),
          (_: any, error: any) =>
            console.error(
              `❌ SQL error updating ${key} for photos_and_measurements ${id}:`,
              error,
            ),
        );
      },
      (txError: any) => console.error('❌ Transaction ERROR:', txError),
      () =>
        console.log(
          `✅ photos_and_measurements image update complete for ${key}`,
        ),
    );
  } catch (error) {
    console.error(`❌ Failed to insert/update images for ${key}:`, error);
  }
};

export const getPhotosAndMeasurementsImagesByKey = async (
  id: string | number,
  key: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!id || !key) {
      console.warn('⚠️ Missing ID or key for photos_and_measurements');
      resolve([]);
      return;
    }

    console.log(
      `📦 Fetching images for Photos & Measurements ID: ${id}, Key: ${key}`,
    );

    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `SELECT ${key} FROM photos_and_measurements WHERE id = ?`,
          [id],
          (_: any, results: any) => {
            if (results.rows.length > 0) {
              const row = results.rows.item(0);
              try {
                const images = JSON.parse(row[key] || '[]');
                console.log(`✅ Retrieved ${images.length} images for ${key}`);
                resolve(images);
              } catch (err) {
                console.error(`❌ Failed to parse images for ${key}:`, err);
                resolve([]);
              }
            } else {
              console.warn(`⚠️ No record found for ID ${id}`);
              resolve([]);
            }
          },
          (_: any, error: any) => {
            console.error(`❌ Error fetching images for ${key}:`, error);
            reject(error);
          },
        );
      },
      (txError: any) => {
        console.error('Transaction ERROR:', txError);
        reject(txError);
      },
    );
  });
};

export const insertSignGeneralAudit = async (
  projects: any[],
  syched: number,
) => {
  for (const project of projects) {
    for (const option of project.signDataOptions || []) {
      const audit: SignGeneralAudit = option?.sign_general_audit;
      if (!audit) continue;

      const id = option?.sign_general_audit.id;
      console.log('Processing SIGN GENERAL AUDIT ID:', id);

      const loadedAccIssueSingle = await downloadImagesArray(
        audit?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto ||
          [],
        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhoto',
      );

      const loadedSafetyIssueSingle = await downloadImagesArray(
        audit?.anyPotentialSafetyIssuesPhoto || [],
        'anyPotentialSafetyIssuesPhoto',
      );

      const loadedAccIssueMultiple = await downloadImagesArray(
        audit?.anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos ||
          [],
        'anyAccessibilityObstructionsDocumentAccessibilityIssuesPhotos',
      );

      const loadedSafetyIssueMultiple = await downloadImagesArray(
        audit?.anyPotentialSafetyIssuesPhotos || [],
        'anyPotentialSafetyIssuesPhotos',
      );

      const loadedFacilityPhotos = await downloadImagesArray(
        audit?.facilityDiagramOrSketchProvidedPhoto || [],
        'facilityDiagramOrSketchProvidedPhoto',
      );

      db.transaction(
        (tx: any) => {
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
            )
            VALUES (?, ?, ?, ?, ?,?,?,?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              JSON.stringify(loadedAccIssueSingle || []),
              JSON.stringify(loadedSafetyIssueSingle || []),
              JSON.stringify(loadedAccIssueMultiple || []),
              JSON.stringify(loadedSafetyIssueMultiple || []),
              JSON.stringify(loadedFacilityPhotos || []),
              syched,
            ],
            () => console.log(`✅ Inserted sign_general_audit for sign ${id}`),
            (_: any, error: any) =>
              console.error(
                `❌ Error inserting sign_general_audit ${id}:`,
                error,
              ),
          );
        },
        (txError: any) => console.error('Transaction ERROR:', txError),
        () =>
          console.log('✅ All sign_general_audit data inserted successfully'),
      );
    }
  }
};

export const getSignGeneralAuditImagesByKey = async (
  id: string | number,
  key: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!id || !key) {
      console.warn('⚠️ Missing sign_general_audit ID or key');
      resolve([]);
      return;
    }

    console.log(
      `📦 Fetching images for General Sign Audit ID: ${id}, Key: ${key}`,
    );

    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `SELECT ${key} FROM sign_general_audit WHERE Id = ?`,
          [id],
          (_: any, results: any) => {
            if (results.rows.length > 0) {
              const row = results.rows.item(0);
              try {
                const images = JSON.parse(row[key] || '[]');
                console.log(`✅ Retrieved ${images.length} images for ${key}`);
                resolve(images);
              } catch (err) {
                console.error(`❌ JSON parse error for ${key}:`, err);
                resolve([]);
              }
            } else {
              console.warn(`⚠️ No record found for ID ${id}`);
              resolve([]);
            }
          },
          (_: any, error: any) => {
            console.error(`❌ SQL error fetching ${key}:`, error);
            reject(error);
          },
        );
      },
      (txError: any) => {
        console.error('Transaction ERROR:', txError);
        reject(txError);
      },
    );
  });
};

export const insertSignGeneralAuditImagesOnly = async (
  id: string | number,
  key: string,
  images: any[] = [],
  synced: number,
) => {
  if (!id || !key) {
    console.warn('⚠️ Missing ID or key for sign_general_audit update');
    return;
  }

  console.log(
    `🟡 Updating Sign General Audit ID: ${id}, Key: ${key}, Synced: ${synced}`,
  );

  try {
    let finalImages = images;

    if (synced === 1) {
      finalImages = await downloadImagesArray(images || [], key);
      console.log(
        `✅ Downloaded ${finalImages?.length || 0} images for ${key}`,
      );
    } else {
      console.log(
        `📴 Offline mode — skipping download for ${key}, using local paths`,
      );
    }

    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `
            UPDATE sign_general_audit
            SET ${key} = ?, isSynced = ?
            WHERE Id = ?
          `,
          [JSON.stringify(finalImages || []), synced, id],
          () => console.log(`✅ Updated ${key} for sign_general_audit ${id}`),
          (_: any, error: any) =>
            console.error(
              `❌ SQL error updating ${key} for sign_general_audit ${id}:`,
              error,
            ),
        );
      },
      (txError: any) => console.error('❌ Transaction ERROR:', txError),
      () =>
        console.log(`✅ sign_general_audit image update complete for ${key}`),
    );
  } catch (error) {
    console.error(`❌ Failed to insert/update images for ${key}:`, error);
  }
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
                    table: 'photos_and_measurements',
                    key: 'id',
                    prop: 'photos_and_measurements',
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

                        // Parse photos_and_measurements JSON fields
                        if (prop === 'photos_and_measurements') {
                          // Parse ALL photo fields for photos_and_measurements
                          const photoFields = [
                            'photoOfWallOrFloor',
                            'signDimensionsPhoto',
                            'signDimensionsSpikePhoto',
                            'measureChannelLettersPhoto',
                            'measureChannelLettersPhotos',
                            'squareFootagePhoto',
                            'squareFootageSpikePhoto',
                            'photoCloseUpOfSign',
                            'visibleOpeningsPhoto',
                            'mullionsPhoto',
                            'mullionsSpike',
                            'otherPhotosMeasurementsMarkupsPhoto',
                            'otherPhotosMeasurementsMarkupsSpike',
                            'photoFullFrontalOfWholeSignStructurePhoto',
                            'measureCellingWallSurfaceAreaPhoto',
                            'measureRetainerSizePhoto',
                            'measureCutSizePhoto',
                            'ifPanMeasurePanDimensionPhoto',
                            'wallDimensionsPhoto',
                            'otherPhotosImage',
                            'wallDimensionsSpikePhoto',
                            'photoOfWallOrFloorPhoto',
                            'otherPhotosSpike',
                            'ifPanMeasurePanDimensionPhotos',
                            'measureRetainerSizePhotos',
                            'photoCloseUpOfSigns',
                            'photoFullFrontalOfWholeSignStructurePhotos',
                            'signDimensionsPhotos',
                            'squareFootageSpikePhotos',
                            'visibleOpeningsPhotos',
                            'otherPhotosImages',
                            'otherPhotosMeasurementsMarkupsPhotos',
                            'indoorWallPhoto',
                            'ceilingSurfacePhoto',
                          ];

                          photoFields.forEach(field => {
                            if (audit[field]) {
                              try {
                                audit[field] = JSON.parse(audit[field]);
                              } catch (e) {
                                console.error(`Error parsing ${field}:`, e);
                                audit[field] = [];
                              }
                            } else {
                              audit[field] = [];
                            }
                          });
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

export const updatePhotosAndMeasurements = (
  measurementsData: any,
  synched: number,
) => {
  console.log('measurementsData', measurementsData);
  db.transaction((tx: any) => {
    tx.executeSql(
      `
      UPDATE photos_and_measurements
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
        teamId = ?,
        nameOfMeasurement = ?,
        nameofMeasurement = ?,
        areMullionsPresent = ?,
        areThereAnyVisibleOpenings = ?,
        signDimensionsWidthFT = ?,
        signDimensionsWidthIN = ?,
        signDimensionsHeightFT = ?,
        signDimensionsHeightIN = ?,
        signDimensionsDepthFT = ?,
        signDimensionsDepthIN = ?,
        wallDimensionsLengthFT = ?,
        wallDimensionsLengthIN = ?,
        wallDimensionsWidthFT = ?,
        wallDimensionsWidthIN = ?,
        measureDistanceFromSignToFloorLengthFT = ?,
        measureDistanceFromSignToFloorLengthIN = ?,
        measureDistanceLength1FT = ?,
        measureDistanceLength1IN = ?,
        measureDistanceLength2FT = ?,
        measureDistanceLength2IN = ?,
        measureDistanceLength3FT = ?,
        measureDistanceLength3IN = ?,
        measureDistanceLength4FT = ?,
        measureDistanceLength4IN = ?,
        mullionsLengthFT = ?,
        mullionsLengthIN = ?,
        mullionsWidthFT = ?,
        mullionsWidthIN = ?,
        mullionsDepthFT = ?,
        mullionsDepthIN = ?,
        mullionsNotes = ?,
        squareFootage = ?,
        squareFootageCalculationRequired = ?,
        squareFootageFeet = ?,
        squareFootageWidthIN = ?,
        squareFootageLengthIN = ?,
        squareFootageLengthFT = ?,
        squareFootageWidthFT = ?,
        squareFootageDepthIN = ?,
        squareFootageDepthFT = ?,
        squareFootageNotes = ?,
        visibleOpeningsLengthFT = ?,
        visibleOpeningsLengthIN = ?,
        visibleOpeningsWidthFT = ?,
        visibleOpeningsWidthIN = ?,
        visibleOpeningsHeightFT = ?,
        visibleOpeningsHeightIN = ?,
        visibleOpeningsNotes = ?,
        visibleOpeningsSpike = ?,
        otherPhotosAndMeasurementsLengthFT = ?,
        otherPhotosAndMeasurementsLengthIN = ?,
        otherPhotosAndMeasurementsWidthFT = ?,
        otherPhotosAndMeasurementsWidthIN = ?,
        otherPhotosAndMeasurementsDepthFT = ?,
        otherPhotosAndMeasurementsDepthIN = ?,
        photoOfWallOrFloor = ?,
        photosAndMeasurementsSummaryNotes = ?,
        photosAndMeasurementsTodoPunchList = ?,
        signOrientation = ?,
        surveyModule = ?,
        measureGroundToSignHeightFT = ?,
        measureGroundToSignHeightIN = ?,
        measureChannelLettersWidthFT = ?,
        measureChannelLettersWidthIN = ?,
        measureChannelLettersHeightFT = ?,
        measureChannelLettersHeightIN = ?,
        measureChannelLettersDepthFT = ?,
        measureChannelLettersDepthIN = ?,
        measureCutSizeWidthFT = ?,
        measureCutSizeWidthIN = ?,
        measureCutSizeHeightFT = ?,
        measureCutSizeHeightIN = ?,
        measureCutSizeDepthFT = ?,
        measureCutSizeDepthIN = ?,
        measureRetainerSizeWidthFT = ?,
        measureRetainerSizeWidthIN = ?,
        measureRetainerSizeHeightFT = ?,
        measureRetainerSizeHeightIN = ?,
        measureRetainerSizeDepthFT = ?,
        measureRetainerSizeDepthIN = ?,
        ifPanMeasurePanDimensionWidthFT = ?,
        ifPanMeasurePanDimensionWidthIN = ?,
        ifPanMeasurePanDimensionHeightFT = ?,
        ifPanMeasurePanDimensionHeightIN = ?,
        ifPanMeasurePanDimensionDepthFT = ?,
        ifPanMeasurePanDimensionDepthIN = ?,
        measureCellingWallSurfaceAreaWidthFT = ?,
        measureCellingWallSurfaceAreaWidthIN = ?,
        measureCellingWallSurfaceAreaHeightFT = ?,
        measureCellingWallSurfaceAreaHeightIN = ?,
        measureCellingWallSurfaceAreaDepthFT = ?,
        measureCellingWallSurfaceAreaDepthIN = ?,
        heightOfPoleLengthFT = ?,
        heightOfPoleLengthIN = ?,
        circumferenceOfPoleLengthFT = ?,
        circumferenceOfPoleLengthIN = ?,
        distanceBetweenPolesLengthFT = ?,
        distanceBetweenPolesLengthIN = ?,
        otherPhotosMeasurementsMarkupsWidthFT = ?,
        otherPhotosMeasurementsMarkupsWidthIN = ?,
        otherPhotosMeasurementsMarkupsHeightFT = ?,
        otherPhotosMeasurementsMarkupsHeightIN = ?,
        otherPhotosMeasurementsMarkupsDepthFT = ?,
        otherPhotosMeasurementsMarkupsDepthIN = ?,
        indoorWallHeightFT = ?,
        indoorWallHeightIN = ?,
        indoorWallWidthFT = ?,
        indoorWallWidthIN = ?,
        ceilingHeightFT = ?,
        ceilingHeightIN = ?,
        indoorMeasurement = ?,
        indoorMeasurementNotes = ?,
        indoorSummaryNotes = ?,
        indoorTodoPunchList = ?,
        signDimensionsPhoto = ?,
        signDimensionsSpikePhoto = ?,
        measureChannelLettersPhoto = ?,
        measureChannelLettersPhotos = ?,
        squareFootagePhoto = ?,
        squareFootageSpikePhoto = ?,
        photoCloseUpOfSign = ?,
        visibleOpeningsPhoto = ?,
        mullionsPhoto = ?,
        mullionsSpike = ?,
        otherPhotosMeasurementsMarkupsPhoto = ?,
        otherPhotosMeasurementsMarkupsSpike = ?,
        photoFullFrontalOfWholeSignStructurePhoto = ?,
        measureCellingWallSurfaceAreaPhoto = ?,
        measureRetainerSizePhoto = ?,
        measureCutSizePhoto = ?,
        ifPanMeasurePanDimensionPhoto = ?,
        wallDimensionsPhoto = ?,
        otherPhotosImage = ?,
        wallDimensionsSpikePhoto = ?,
        photoOfWallOrFloorPhoto = ?,
        otherPhotosSpike = ?,
        ifPanMeasurePanDimensionPhotos = ?,
        measureRetainerSizePhotos = ?,
        photoCloseUpOfSigns = ?,
        photoFullFrontalOfWholeSignStructurePhotos = ?,
        signDimensionsPhotos = ?,
        squareFootageSpikePhotos = ?,
        visibleOpeningsPhotos = ?,
        otherPhotosImages = ?,
        otherPhotosMeasurementsMarkupsPhotos = ?,
        indoorWallPhoto = ?,
        ceilingSurfacePhoto = ?,
        isSynched = ?
      WHERE id = ?
      `,
      [
        // Basic Info
        measurementsData.projectId || null,
        measurementsData.signId || null,
        measurementsData.optionId || null,
        measurementsData.signAliasName || null,
        measurementsData.signType || null,
        measurementsData.sign_order || null,
        measurementsData.createdDate || null,
        measurementsData.adminId || null,
        measurementsData.adminName || null,
        measurementsData.customerName || null,
        measurementsData.teamId || null,
        measurementsData.nameOfMeasurement || null,
        measurementsData.nameofMeasurement || null,

        // Flags
        measurementsData.areMullionsPresent || null,
        measurementsData.areThereAnyVisibleOpenings || null,

        // Sign Dimensions
        measurementsData.signDimensionsWidthFT || null,
        measurementsData.signDimensionsWidthIN || null,
        measurementsData.signDimensionsHeightFT || null,
        measurementsData.signDimensionsHeightIN || null,
        measurementsData.signDimensionsDepthFT || null,
        measurementsData.signDimensionsDepthIN || null,

        // Wall Dimensions
        measurementsData.wallDimensionsLengthFT || null,
        measurementsData.wallDimensionsLengthIN || null,
        measurementsData.wallDimensionsWidthFT || null,
        measurementsData.wallDimensionsWidthIN || null,

        // Distance Measurements
        measurementsData.measureDistanceFromSignToFloorLengthFT || null,
        measurementsData.measureDistanceFromSignToFloorLengthIN || null,
        measurementsData.measureDistanceLength1FT || null,
        measurementsData.measureDistanceLength1IN || null,
        measurementsData.measureDistanceLength2FT || null,
        measurementsData.measureDistanceLength2IN || null,
        measurementsData.measureDistanceLength3FT || null,
        measurementsData.measureDistanceLength3IN || null,
        measurementsData.measureDistanceLength4FT || null,
        measurementsData.measureDistanceLength4IN || null,

        // Mullions
        measurementsData.mullionsLengthFT || null,
        measurementsData.mullionsLengthIN || null,
        measurementsData.mullionsWidthFT || null,
        measurementsData.mullionsWidthIN || null,
        measurementsData.mullionsDepthFT || null,
        measurementsData.mullionsDepthIN || null,
        measurementsData.mullionsNotes || null,

        // Square Footage
        measurementsData.squareFootage || null,
        measurementsData.squareFootageCalculationRequired || null,
        measurementsData.squareFootageFeet || null,
        measurementsData.squareFootageWidthIN || null,
        measurementsData.squareFootageLengthIN || null,
        measurementsData.squareFootageLengthFT || null,
        measurementsData.squareFootageWidthFT || null,
        measurementsData.squareFootageDepthIN || null,
        measurementsData.squareFootageDepthFT || null,
        measurementsData.squareFootageNotes || null,

        // Visible Openings
        measurementsData.visibleOpeningsLengthFT || null,
        measurementsData.visibleOpeningsLengthIN || null,
        measurementsData.visibleOpeningsWidthFT || null,
        measurementsData.visibleOpeningsWidthIN || null,
        measurementsData.visibleOpeningsHeightFT || null,
        measurementsData.visibleOpeningsHeightIN || null,
        measurementsData.visibleOpeningsNotes || null,
        measurementsData.visibleOpeningsSpike || null,

        // Other Measurements (Indoor)
        measurementsData.otherPhotosAndMeasurementsLengthFT || null,
        measurementsData.otherPhotosAndMeasurementsLengthIN || null,
        measurementsData.otherPhotosAndMeasurementsWidthFT || null,
        measurementsData.otherPhotosAndMeasurementsWidthIN || null,
        measurementsData.otherPhotosAndMeasurementsDepthFT || null,
        measurementsData.otherPhotosAndMeasurementsDepthIN || null,

        // Photos
        measurementsData.photoOfWallOrFloor
          ? JSON.stringify(measurementsData.photoOfWallOrFloor)
          : null,

        // Notes & Todo
        measurementsData.photosAndMeasurementsSummaryNotes || null,
        measurementsData.photosAndMeasurementsTodoPunchList || null,

        // Outdoor Specific
        measurementsData.signOrientation || null,
        measurementsData.surveyModule || null,

        // Ground to Sign Height
        measurementsData.measureGroundToSignHeightFT || null,
        measurementsData.measureGroundToSignHeightIN || null,

        // Channel Letters
        measurementsData.measureChannelLettersWidthFT || null,
        measurementsData.measureChannelLettersWidthIN || null,
        measurementsData.measureChannelLettersHeightFT || null,
        measurementsData.measureChannelLettersHeightIN || null,
        measurementsData.measureChannelLettersDepthFT || null,
        measurementsData.measureChannelLettersDepthIN || null,

        // Cut Size
        measurementsData.measureCutSizeWidthFT || null,
        measurementsData.measureCutSizeWidthIN || null,
        measurementsData.measureCutSizeHeightFT || null,
        measurementsData.measureCutSizeHeightIN || null,
        measurementsData.measureCutSizeDepthFT || null,
        measurementsData.measureCutSizeDepthIN || null,

        // Retainer Size
        measurementsData.measureRetainerSizeWidthFT || null,
        measurementsData.measureRetainerSizeWidthIN || null,
        measurementsData.measureRetainerSizeHeightFT || null,
        measurementsData.measureRetainerSizeHeightIN || null,
        measurementsData.measureRetainerSizeDepthFT || null,
        measurementsData.measureRetainerSizeDepthIN || null,

        // Pan Measurements
        measurementsData.ifPanMeasurePanDimensionWidthFT || null,
        measurementsData.ifPanMeasurePanDimensionWidthIN || null,
        measurementsData.ifPanMeasurePanDimensionHeightFT || null,
        measurementsData.ifPanMeasurePanDimensionHeightIN || null,
        measurementsData.ifPanMeasurePanDimensionDepthFT || null,
        measurementsData.ifPanMeasurePanDimensionDepthIN || null,

        // Ceiling/Wall Surface Area
        measurementsData.measureCellingWallSurfaceAreaWidthFT || null,
        measurementsData.measureCellingWallSurfaceAreaWidthIN || null,
        measurementsData.measureCellingWallSurfaceAreaHeightFT || null,
        measurementsData.measureCellingWallSurfaceAreaHeightIN || null,
        measurementsData.measureCellingWallSurfaceAreaDepthFT || null,
        measurementsData.measureCellingWallSurfaceAreaDepthIN || null,

        // Pole Measurements
        measurementsData.heightOfPoleLengthFT || null,
        measurementsData.heightOfPoleLengthIN || null,
        measurementsData.circumferenceOfPoleLengthFT || null,
        measurementsData.circumferenceOfPoleLengthIN || null,
        measurementsData.distanceBetweenPolesLengthFT || null,
        measurementsData.distanceBetweenPolesLengthIN || null,

        // Other Measurements (Outdoor)
        measurementsData.otherPhotosMeasurementsMarkupsWidthFT || null,
        measurementsData.otherPhotosMeasurementsMarkupsWidthIN || null,
        measurementsData.otherPhotosMeasurementsMarkupsHeightFT || null,
        measurementsData.otherPhotosMeasurementsMarkupsHeightIN || null,
        measurementsData.otherPhotosMeasurementsMarkupsDepthFT || null,
        measurementsData.otherPhotosMeasurementsMarkupsDepthIN || null,

        // Indoor Specific
        measurementsData.indoorWallHeightFT || null,
        measurementsData.indoorWallHeightIN || null,
        measurementsData.indoorWallWidthFT || null,
        measurementsData.indoorWallWidthIN || null,
        measurementsData.ceilingHeightFT || null,
        measurementsData.ceilingHeightIN || null,
        measurementsData.indoorMeasurement || null,
        measurementsData.indoorMeasurementNotes || null,
        measurementsData.indoorSummaryNotes || null,
        measurementsData.indoorTodoPunchList || null,

        // Photo Fields (stringify arrays)
        measurementsData.signDimensionsPhoto
          ? JSON.stringify(measurementsData.signDimensionsPhoto)
          : null,
        measurementsData.signDimensionsSpikePhoto
          ? JSON.stringify(measurementsData.signDimensionsSpikePhoto)
          : null,
        measurementsData.measureChannelLettersPhoto
          ? JSON.stringify(measurementsData.measureChannelLettersPhoto)
          : null,
        measurementsData.measureChannelLettersPhotos
          ? JSON.stringify(measurementsData.measureChannelLettersPhotos)
          : null,
        measurementsData.squareFootagePhoto
          ? JSON.stringify(measurementsData.squareFootagePhoto)
          : null,
        measurementsData.squareFootageSpikePhoto
          ? JSON.stringify(measurementsData.squareFootageSpikePhoto)
          : null,
        measurementsData.photoCloseUpOfSign
          ? JSON.stringify(measurementsData.photoCloseUpOfSign)
          : null,
        measurementsData.visibleOpeningsPhoto
          ? JSON.stringify(measurementsData.visibleOpeningsPhoto)
          : null,
        measurementsData.mullionsPhoto
          ? JSON.stringify(measurementsData.mullionsPhoto)
          : null,
        measurementsData.mullionsSpike
          ? JSON.stringify(measurementsData.mullionsSpike)
          : null,
        measurementsData.otherPhotosMeasurementsMarkupsPhoto
          ? JSON.stringify(measurementsData.otherPhotosMeasurementsMarkupsPhoto)
          : null,
        measurementsData.otherPhotosMeasurementsMarkupsSpike
          ? JSON.stringify(measurementsData.otherPhotosMeasurementsMarkupsSpike)
          : null,
        measurementsData.photoFullFrontalOfWholeSignStructurePhoto
          ? JSON.stringify(
              measurementsData.photoFullFrontalOfWholeSignStructurePhoto,
            )
          : null,
        measurementsData.measureCellingWallSurfaceAreaPhoto
          ? JSON.stringify(measurementsData.measureCellingWallSurfaceAreaPhoto)
          : null,
        measurementsData.measureRetainerSizePhoto
          ? JSON.stringify(measurementsData.measureRetainerSizePhoto)
          : null,
        measurementsData.measureCutSizePhoto
          ? JSON.stringify(measurementsData.measureCutSizePhoto)
          : null,
        measurementsData.ifPanMeasurePanDimensionPhoto
          ? JSON.stringify(measurementsData.ifPanMeasurePanDimensionPhoto)
          : null,
        measurementsData.wallDimensionsPhoto
          ? JSON.stringify(measurementsData.wallDimensionsPhoto)
          : null,
        measurementsData.otherPhotosImage
          ? JSON.stringify(measurementsData.otherPhotosImage)
          : null,
        measurementsData.wallDimensionsSpikePhoto
          ? JSON.stringify(measurementsData.wallDimensionsSpikePhoto)
          : null,
        measurementsData.photoOfWallOrFloorPhoto
          ? JSON.stringify(measurementsData.photoOfWallOrFloorPhoto)
          : null,
        measurementsData.otherPhotosSpike
          ? JSON.stringify(measurementsData.otherPhotosSpike)
          : null,
        measurementsData.ifPanMeasurePanDimensionPhotos
          ? JSON.stringify(measurementsData.ifPanMeasurePanDimensionPhotos)
          : null,
        measurementsData.measureRetainerSizePhotos
          ? JSON.stringify(measurementsData.measureRetainerSizePhotos)
          : null,
        measurementsData.photoCloseUpOfSigns
          ? JSON.stringify(measurementsData.photoCloseUpOfSigns)
          : null,
        measurementsData.photoFullFrontalOfWholeSignStructurePhotos
          ? JSON.stringify(
              measurementsData.photoFullFrontalOfWholeSignStructurePhotos,
            )
          : null,
        measurementsData.signDimensionsPhotos
          ? JSON.stringify(measurementsData.signDimensionsPhotos)
          : null,
        measurementsData.squareFootageSpikePhotos
          ? JSON.stringify(measurementsData.squareFootageSpikePhotos)
          : null,
        measurementsData.visibleOpeningsPhotos
          ? JSON.stringify(measurementsData.visibleOpeningsPhotos)
          : null,
        measurementsData.otherPhotosImages
          ? JSON.stringify(measurementsData.otherPhotosImages)
          : null,
        measurementsData.otherPhotosMeasurementsMarkupsPhotos
          ? JSON.stringify(
              measurementsData.otherPhotosMeasurementsMarkupsPhotos,
            )
          : null,
        measurementsData.indoorWallPhoto
          ? JSON.stringify(measurementsData.indoorWallPhoto)
          : null,
        measurementsData.ceilingSurfacePhoto
          ? JSON.stringify(measurementsData.ceilingSurfacePhoto)
          : null,

        // Sync field
        synched,

        // WHERE clause
        measurementsData.id || measurementsData?.Id,
      ],
      () =>
        console.log(
          `Updated photos_and_measurements ${
            measurementsData.id || measurementsData?.Id
          }`,
        ),
      (_: any, error: any) =>
        console.error(
          `Error updating photos_and_measurements ${
            measurementsData.id || measurementsData?.Id
          }:`,
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

export const getUnsyncedPhotosAndMeasurements = (
  callback: (data: any[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM photos_and_measurements WHERE isSynched = 0`,
      [],
      (_: any, results: any) => {
        const rows = results.rows;
        const measurements: any[] = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows.item(i);
          measurements.push({
            ...row,
            // Parse ALL photo fields that were stored as JSON strings
            photoOfWallOrFloor: JSON.parse(row.photoOfWallOrFloor || '[]'),
            signDimensionsPhoto: JSON.parse(row.signDimensionsPhoto || '[]'),
            signDimensionsSpikePhoto: JSON.parse(
              row.signDimensionsSpikePhoto || '[]',
            ),
            measureChannelLettersPhoto: JSON.parse(
              row.measureChannelLettersPhoto || '[]',
            ),
            measureChannelLettersPhotos: JSON.parse(
              row.measureChannelLettersPhotos || '[]',
            ),
            squareFootagePhoto: JSON.parse(row.squareFootagePhoto || '[]'),
            squareFootageSpikePhoto: JSON.parse(
              row.squareFootageSpikePhoto || '[]',
            ),
            photoCloseUpOfSign: JSON.parse(row.photoCloseUpOfSign || '[]'),
            visibleOpeningsPhoto: JSON.parse(row.visibleOpeningsPhoto || '[]'),
            mullionsPhoto: JSON.parse(row.mullionsPhoto || '[]'),
            mullionsSpike: JSON.parse(row.mullionsSpike || '[]'),
            otherPhotosMeasurementsMarkupsPhoto: JSON.parse(
              row.otherPhotosMeasurementsMarkupsPhoto || '[]',
            ),
            otherPhotosMeasurementsMarkupsSpike: JSON.parse(
              row.otherPhotosMeasurementsMarkupsSpike || '[]',
            ),
            photoFullFrontalOfWholeSignStructurePhoto: JSON.parse(
              row.photoFullFrontalOfWholeSignStructurePhoto || '[]',
            ),
            measureCellingWallSurfaceAreaPhoto: JSON.parse(
              row.measureCellingWallSurfaceAreaPhoto || '[]',
            ),
            measureRetainerSizePhoto: JSON.parse(
              row.measureRetainerSizePhoto || '[]',
            ),
            measureCutSizePhoto: JSON.parse(row.measureCutSizePhoto || '[]'),
            ifPanMeasurePanDimensionPhoto: JSON.parse(
              row.ifPanMeasurePanDimensionPhoto || '[]',
            ),
            wallDimensionsPhoto: JSON.parse(row.wallDimensionsPhoto || '[]'),
            otherPhotosImage: JSON.parse(row.otherPhotosImage || '[]'),
            wallDimensionsSpikePhoto: JSON.parse(
              row.wallDimensionsSpikePhoto || '[]',
            ),
            photoOfWallOrFloorPhoto: JSON.parse(
              row.photoOfWallOrFloorPhoto || '[]',
            ),
            otherPhotosSpike: JSON.parse(row.otherPhotosSpike || '[]'),
            ifPanMeasurePanDimensionPhotos: JSON.parse(
              row.ifPanMeasurePanDimensionPhotos || '[]',
            ),
            measureRetainerSizePhotos: JSON.parse(
              row.measureRetainerSizePhotos || '[]',
            ),
            photoCloseUpOfSigns: JSON.parse(row.photoCloseUpOfSigns || '[]'),
            photoFullFrontalOfWholeSignStructurePhotos: JSON.parse(
              row.photoFullFrontalOfWholeSignStructurePhotos || '[]',
            ),
            signDimensionsPhotos: JSON.parse(row.signDimensionsPhotos || '[]'),
            squareFootageSpikePhotos: JSON.parse(
              row.squareFootageSpikePhotos || '[]',
            ),
            visibleOpeningsPhotos: JSON.parse(
              row.visibleOpeningsPhotos || '[]',
            ),
            otherPhotosImages: JSON.parse(row.otherPhotosImages || '[]'),
            otherPhotosMeasurementsMarkupsPhotos: JSON.parse(
              row.otherPhotosMeasurementsMarkupsPhotos || '[]',
            ),
            indoorWallPhoto: JSON.parse(row.indoorWallPhoto || '[]'),
            ceilingSurfacePhoto: JSON.parse(row.ceilingSurfacePhoto || '[]'),
          });
        }
        callback(measurements);
      },
      (_: any, error: any) => {
        console.error(
          'Error fetching unsynced photos_and_measurements:',
          error,
        );
        callback([]);
        return false; // stops further propagation of error
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
      'photos_and_measurements',
      'sign_general_audit',
      'offline_images',
      'offline_remove_images',
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

export const clearAllTables = () => {
  db.transaction((tx: any) => {
    const tables = [
      'projects',
      'sign_data_options',
      'existing_sign_audit',
      'electrical_audit',
      'permitting_assessment',
      'sign_general_audit',
      'offline_images',
      'offline_remove_images',
      'photos_and_measurements',
    ];

    tables.forEach(table => {
      tx.executeSql(
        `DELETE FROM ${table}`,
        [],
        () => console.log(`All records cleared from ${table}`),
        (_: any, error: any) =>
          console.error(`Error clearing table ${table}:`, error),
      );
    });
  });
};

export const createOfflineImagesTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS offline_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imageId TEXT,
        image TEXT,
        module TEXT,
        field TEXT,
        moduleId INTEGER,
        synced INTEGER DEFAULT 0
      );`,
      [],
      () => console.log('offline_images table created'),
      (error: any) =>
        console.log('Error creating offline_images table:', error),
    );
  });
};

type UpdateImageData = {
  imageId: number;
  image: string;
  field: string;
  moduleId: number;
  module: string;
};

export const insertOfflineImage = (imageData: UpdateImageData) => {
  const {imageId, image, module, field, moduleId} = imageData;

  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM offline_images WHERE imageId = ?;`,
      [imageId],
      (tx: any, results: any) => {
        if (results.rows.length > 0) {
          tx.executeSql(
            `UPDATE offline_images 
             SET image = ?, synced = 0 
             WHERE imageId = ?;`,
            [image, imageId],
            () => console.log('Offline image updated'),
            (error: any) => console.log('Error updating offline image:', error),
          );
        } else {
          tx.executeSql(
            `INSERT INTO offline_images (imageId, image, module, field, moduleId, synced)
             VALUES (?, ?, ?, ?, ?, 0);`,
            [imageId, image, module, field, moduleId],
            () => console.log('Offline image inserted'),
            (error: any) =>
              console.log('Error inserting offline image:', error),
          );
        }
      },
      (error: any) => console.log('Error checking image existence:', error),
    );
  });
};

export const getAllOfflineImages = (callback: (data: any[]) => void) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM offline_images;`,
      [],
      (_: any, results: any) => {
        const rows = results.rows;
        const data = [];
        for (let i = 0; i < rows.length; i++) {
          data.push(rows.item(i));
        }
        callback(data);
      },
      (error: any) => console.log('Error fetching all offline images:', error),
    );
  });
};

export const createOfflineRemoveTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS offline_remove_images (
        offlineId INTEGER PRIMARY KEY AUTOINCREMENT,
        imageId TEXT,
        fieldName TEXT,
        surveyModule TEXT,
        moduleId TEXT,
        Id INTEGER,
        synced INTEGER DEFAULT 0
      );`,
      [],
      () => console.log('offline_remove_images table created'),
      (error: any) =>
        console.log('Error creating offline_remove_images table:', error),
    );
  });
};

export const dropOfflineRemoveTable = () => {
  db.transaction(
    (tx: any) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS offline_remove_images;`,
        [],
        () => console.log('✅ offline_remove_images table dropped'),
        (tx: any, error: any) =>
          console.error('❌ Error dropping table:', error),
      );
    },
    (txError: any) =>
      console.error('❌ Transaction error while dropping table:', txError),
  );
};

export const insertOfflineRemove = (data: any) => {
  const {imageId, fieldName, surveyModule, moduleId, Id} = data;
  db.transaction((tx: any) => {
    tx.executeSql(
      `INSERT INTO offline_remove_images (imageId, fieldName, surveyModule, moduleId, Id, synced) VALUES (?, ?, ?, ?, ?, 0);`,
      [imageId, fieldName, surveyModule, moduleId, Id],
      () => console.log('Offline remove request stored'),
      (error: any) =>
        console.log('Error storing offline remove request:', error),
    );
  });
};

type OfflineRemoveImage = {
  id: number;
  imageId: string;
  module: string;
  field: string;
  moduleId: number;
};

export const getAllRemovedImages = (
  callback: (data: OfflineRemoveImage[]) => void,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `SELECT * FROM offline_remove_images;`,
      [],
      (_: any, results: any) => {
        const rows = results.rows;
        const data: OfflineRemoveImage[] = [];
        for (let i = 0; i < rows.length; i++) {
          const item = rows.item(i);
          data.push(item);
        }
        callback(data);
      },
      (error: any) => console.log('Error fetching removed images:', error),
    );
  });
};

export const deleteOfflineRemoveByImageId = async (
  imageId: number | string,
) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          `DELETE FROM offline_remove_images WHERE imageId = ?`,
          [imageId],
          () => {
            resolve();
            console.log(`Deleted offline remove entry for imageId ${imageId}`);
          },
          (_: any, error: any) => reject(error),
        );
      },
      (error: any) => reject(error),
    );
  });
};
