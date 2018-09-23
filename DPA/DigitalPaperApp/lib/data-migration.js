'use strict';

(() => {
    const FIRST_DATA_VERSION = '1.2.1';

    const APP = require('electron').app
    const PATH = require('path');
    const FS = require('fs-extra');
    const SEMVER = require('semver');
    const UUID4 = require('uuid/v4');

    const logD = require('debug')('data-migration:debug');
    const logE = require('debug')('data-migration:debug');

    // アプリケーション データ フォルダのパスを取得します。
    let getAppDataFolderPath = function () {
        let appDataFolderPath = PATH.join(APP.getPath('appData'), '/Sony Corporation/Digital Paper App');

        return appDataFolderPath;
    };

    // データ移行元フォルダのパスを取得します。
    let getSrcFolderPath = function () {
        let srcFolderPath = getAppDataFolderPath();

        return srcFolderPath;
    };

    // データ移行先フォルダのパスを取得します。
    let getDestFolderPath = function (workspaceId) {
        let destFolderPath = PATH.join(getAppDataFolderPath(), '/DigitalPaperApp', workspaceId);

        return destFolderPath;
    };

    // アプリケーション バージョン ファイルのパスを取得します。
    let getAppVersionFilePath = function (dirName) {
        let appVersionFilePath = PATH.join(dirName, '/version.txt');
        logD('AppVersionFilePath: ' + appVersionFilePath);

        return appVersionFilePath;
    };

    // データ バージョン ファイルのパスを取得します。
    let getDataVersionFilePath = function () {
        let dataVersionFilePath = PATH.join(getAppDataFolderPath(), '/DigitalPaperApp/dataversion.dat');
        logD('DataVersionFilePath: ' + dataVersionFilePath);

        return dataVersionFilePath;
    };

    // アプリケーション バージョンを取得します。
    let getAppVersion = function (dirName) {
        try {
            let appVersionFilePath = getAppVersionFilePath(dirName);
            let appVersion = FS.readFileSync(appVersionFilePath, 'utf-8');
            return appVersion;
        } catch (err) {
            //logE(err);
        }

        return undefined;
    };

    // データ バージョンを取得します。
    let getDataVersion = function () {
        try {
            let dataVersionFilePath = getDataVersionFilePath();
            let dataVersion = FS.readFileSync(dataVersionFilePath, 'utf-8');
            return dataVersion;
        } catch (err) {
            //logE(err);
        }

        return FIRST_DATA_VERSION;
    };

    // データ バージョンを正規化します。
    let normalizeDataVersion = function (dataVersion) {
        if (typeof dataVersion === 'string') {
            let matches = dataVersion.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
            if (matches) {
                let normalizedDataVersion =  matches[1] + '.' + matches[2] + '.' + matches[3];
                return normalizedDataVersion;
            }
        }

        return FIRST_DATA_VERSION;
    };

    // データ移行先（ワークスペース）の Workdpsace ID を取得します。
    let getWorkspaceId = function () {
        let dataMigrationWorkspaceId = 'ws' + UUID4().replace(/\-/g, '');

        return dataMigrationWorkspaceId;
    };

    // データ移行対象のリストを取得します。
    let getTargetList = function () {
        try {
            let targetList = [];

            let appDataFolderPath = getAppDataFolderPath();
            let entryNames = FS.readdirSync(appDataFolderPath);
            for (let entryName of entryNames) {
                if ((entryName !== 'DigitalPaperApp')
                    && (entryName !== 'ProfileManager')
                    && (entryName !== 'dataversion')) {
                        targetList.push(entryName);
                }
            }

            return targetList;
        } catch (err) {
            //logE(err);
        }
    
        return [];
    };

    // データ移行対象をデータ移行元からデータ移行先にコピーします。
    let copyTargetFromSrcToDest = function (srcFolderPath, destFolderPath, targetList) {
        try {
            for (let target of targetList) {
                let srcTargetPath = PATH.join(srcFolderPath, target);
                let destTargetPath = PATH.join(destFolderPath, target);
                FS.copySync(srcTargetPath, destTargetPath);
            }

            return true;
        } catch (err) {
            //logE(err);
        } 

        return false;
    }

    // データ移行対象をデータ移行元から削除します。
    let removeTargetFromSrc = function (srcFolderPath, targetList) {
        try {
            for (let target of targetList) {
                let srcTargetPath = PATH.join(srcFolderPath, target);
                FS.removeSync(srcTargetPath);
            }
        } catch (err) {
            //logE(err);
        }
    };

    // データ移行対象をデータ移行先から削除します。
    let removeTargetFromDest = function (destFolderPath) {
        try {
            FS.removeSync(destFolderPath);
        } catch (err) {
            //logE(err);
        }
    };

    // データ バージョンを更新します。
    let updateDataVersionFile = function (requiredDataVersion) {
        try {
            let dataVersionFilePath = getDataVersionFilePath();
            FS.writeFileSync(dataVersionFilePath, requiredDataVersion); 
        } catch (err) {
            //logE(err);
        }
    };
    
    // 必要であればデータ移行を行います。
    // データ移行が実施され成功した場合には Workspace ID が、
    // それ以外の場合には undefined が返されます。
    let migrateIfNeeded = function (dirName) {
        let appVersion = getAppVersion(dirName);
        logD('AppVersion: ' + appVersion);

        let dataVersion = getDataVersion();
        logD('DataVersion: ' + dataVersion);

        let requiredDataVersion = normalizeDataVersion(appVersion);
        logD('RequiredDataVersion: ' + requiredDataVersion);

        let currentDataVersion = normalizeDataVersion(dataVersion);
        logD('CurrentDataVersion: ' + currentDataVersion);

        if (SEMVER.valid(requiredDataVersion) && SEMVER.valid(currentDataVersion) && SEMVER.gt(requiredDataVersion, currentDataVersion)) {
            let workspaceId = getWorkspaceId();
            logD('WorkspaceId: ' + workspaceId);

            let srcFolderPath = getSrcFolderPath();
            logD('SrcFolderPath: ' + srcFolderPath);

            let destFolderPath = getDestFolderPath(workspaceId);
            logD('DestFolderPath: ' + destFolderPath);

            let targetList = getTargetList();
            logD('TargetList: %o', targetList);

            if ((targetList) && (targetList.length > 0)) {
                logD('---- Data Migration: Start ----');
                
                let copyResult = copyTargetFromSrcToDest(srcFolderPath, destFolderPath, targetList);
                if (copyResult) {
                    // workspace.dat が移行対象に存在しない場合、
                    // workspace.dat は ExplorerBaseView.ts の initialize() で作成されます。

                    removeTargetFromSrc(srcFolderPath, targetList);
                    updateDataVersionFile(requiredDataVersion);

                    logD('---- Data Migration: Success ----');

                    return workspaceId;  // データ移行成功!!
                } else {
                    removeTargetFromDest(destFolderPath);

                    logD('---- Data Migration: Failure ----');
                }
            }
        }

        return undefined;
    };

    module.exports.migrateIfNeeded = migrateIfNeeded;

})();