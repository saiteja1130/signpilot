import axios from 'axios';
import SQLite from 'react-native-sqlite-storage';
import Toast from 'react-native-toast-message';
SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'projects.db', location: 'default'});
};

export const createProjectTable = async db => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId TEXT,
      projectTitle TEXT,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      mobile TEXT,
      address TEXT,
      stateName TEXT,
      cityName TEXT,
      zipCode TEXT,
      latestSignUpdate TEXT,
      totalSigns INTEGER,
      signDataOptions TEXT,
      isSynced INTEGER
    );`,
  );
};

export const getAllProjects = async db => {
  const results = await db.executeSql(`SELECT * FROM projects`);
  const projects = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      row.signDataOptions = JSON.parse(row.signDataOptions);
      projects.push(row);
    }
  });
  return projects;
};

export const insertProject = async (db, project) => {
  await db.executeSql(
    `INSERT INTO projects (
      projectId, projectTitle, firstName, lastName, email, mobile, address, 
      stateName, cityName, zipCode, latestSignUpdate, totalSigns, signDataOptions, isSynced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`,
    [
      project.projectId,
      project.projectTitle,
      project.firstName,
      project.lastName,
      project.email,
      project.mobile,
      project.address,
      project.stateName,
      project.cityName,
      project.zipCode,
      project.latestSignUpdate,
      project.totalSigns,
      JSON.stringify(project.signDataOptions),
    ],
  );
};

export const getUnsyncedProjects = async db => {
  const results = await db.executeSql(
    `SELECT * FROM projects WHERE isSynced = 0`,
  );
  const projects = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      row.signDataOptions = JSON.parse(row.signDataOptions);
      projects.push(row);
    }
  });
  return projects;
};

export const markProjectAsSynced = async (db, id) => {
  await db.executeSql(`UPDATE projects SET isSynced = 1 WHERE id = ?`, [id]);
};

export const updateProject = async (db, project) => {
  await db.executeSql(
    `UPDATE projects SET 
      projectTitle = ?, firstName = ?, lastName = ?, email = ?, mobile = ?, 
      address = ?, stateName = ?, cityName = ?, zipCode = ?, latestSignUpdate = ?, 
      totalSigns = ?, signDataOptions = ?, isSynced = 0 
    WHERE projectId = ?;`,
    [
      project.projectTitle,
      project.firstName,
      project.lastName,
      project.email,
      project.mobile,
      project.address,
      project.stateName,
      project.cityName,
      project.zipCode,
      project.latestSignUpdate,
      project.totalSigns,
      JSON.stringify(project.signDataOptions),
      project.projectId,
    ],
  );
};

export const insertOrUpdateProject = async (db, project) => {
  const existing = await db.executeSql(
    `SELECT * FROM projects WHERE projectId = ?`,
    [project.projectId],
  );
  if (existing[0].rows.length > 0) {
    await updateProject(db, project);
  } else {
    await insertProject(db, project);
  }
};
export const updateSignDataOptionInProject = async (
  projectId,
  signId,
  updates = {},
) => {
  const db = await getDBConnection();
  const [results] = await db.executeSql(
    'SELECT signDataOptions FROM projects WHERE projectId = ?',
    [projectId],
  );

  if (results.rows.length === 0) return;

  const signDataOptions = JSON.parse(results.rows.item(0).signDataOptions);

  const updatedOptions = signDataOptions.map(sign => {
    if (sign.signId === signId) {
      const updatedSign = {...sign};

      for (const key in updates) {
        if (key === 'offlineSync') {
          updatedSign.offlineSync = updates.offlineSync;
        } else {
          updatedSign[key] = {
            ...sign[key],
            ...updates[key],
          };
        }
      }

      return updatedSign;
    }

    return sign;
  });

  const updatedJson = JSON.stringify(updatedOptions);

  await db.executeSql(
    'UPDATE projects SET signDataOptions = ? WHERE projectId = ?',
    [updatedJson, projectId],
  );
};

const auditSyncEndpoints = {
  existing_sign_audit: 'https://www.beeberg.com/api/updateExistingSignAudit',
  electrical_audit: 'https://www.beeberg.com/api/updateElectricalAudit',
  sign_general_audit: 'https://www.beeberg.com/api/updateSignGeneralAudit',
  permitting_assessment:
    'https://www.beeberg.com/api/updatePermittingAssessmentAudit',
};
const syncSection = async (sectionKey, sectionData, token) => {
  console.log(sectionKey, sectionData, token);
  const endpoint = auditSyncEndpoints[sectionKey];
  if (!endpoint || !sectionData) return {success: true};
  try {
    const response = await axios.post(endpoint, sectionData, {
      headers: {Authorization: `Bearer ${token}`},
    });

    if (response.data.status) {
      console.log(` Synced ${sectionKey} for signId: ${sectionData.signId}`);
      return {success: true};
    } else {
      console.warn(` Failed to sync ${sectionKey}:`, response.data.message);
      return {success: false};
    }
  } catch (error) {
    console.error(` Error syncing ${sectionKey}:`, error.message);
    return {success: false};
  }
};
export const syncOfflineAudits = async loginData => {
  try {
    const db = await getDBConnection();
    const token = loginData?.tokenNumber;
    const [results] = await db.executeSql('SELECT * FROM projects');

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      const project = {
        ...row,
        signDataOptions: JSON.parse(row.signDataOptions),
      };

      let projectUpdated = false;

      for (let j = 0; j < project.signDataOptions.length; j++) {
        const sign = project.signDataOptions[j];

        if (sign.offlineSync === 0) {
          const sectionKeys = [
            'existing_sign_audit',
            'electrical_audit',
            'sign_general_audit',
            'permitting_assessment',
          ];

          const syncResults = await Promise.all(
            sectionKeys.map(async key => {
              if (sign[key]) {
                return await syncSection(key, sign[key], token);
              }
              return {success: true};
            }),
          );

          const allSynced = syncResults.every(result => result.success);

          if (allSynced) {
            project.signDataOptions[j].offlineSync = 1;
            projectUpdated = true;
            console.log(`✅ All sections synced for signId: ${sign.signId}`);
          } else {
            console.warn(
              `❌ Some sections failed to sync for signId: ${sign.signId}`,
            );
          }
        }
      }

      if (projectUpdated) {
        await updateProject(db, project);
        console.log(
          `📁 Updated local project (marked synced): ${project.projectId}`,
        );
      }
    }

    Toast.show({
      type: 'success',
      text1: 'Offline changes synced successfully!',
      visibilityTime: 3000,
      position: 'top',
    });
  } catch (err) {
    console.error(err);
    console.error('❌ syncOfflineAudits error:', err.message);
    Toast.show({
      type: 'error',
      text1: 'Sync failed!',
      text2: err.message,
      visibilityTime: 3000,
      position: 'top',
    });
  }
};
