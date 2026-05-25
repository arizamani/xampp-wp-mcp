import fs from "fs-extra";
import { appConfig } from "../config.js";

export async function getEnvironmentInfo() {
  const [xamppRootExists, htdocsExists, backupsPathExists] = await Promise.all([
    fs.pathExists(appConfig.xamppRoot),
    fs.pathExists(appConfig.htdocsPath),
    fs.pathExists(appConfig.backupsPath),
  ]);

  return {
    platform: process.platform,
    nodeVersion: process.version,
    xamppRoot: appConfig.xamppRoot,
    htdocsPath: appConfig.htdocsPath,
    backupsPath: appConfig.backupsPath,
    paths: {
      xamppRootExists,
      htdocsExists,
      backupsPathExists,
    },
  };
}