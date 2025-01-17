/* --------------------------------------------------------------------------------------------
 *  Licensed to the .NET Foundation under one or more agreements.
*  The .NET Foundation licenses this file to you under the MIT license.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { ICommandExecutor } from '../Utils/ICommandExecutor';
import { IUtilityContext } from '../Utils/IUtilityContext';
import { GenericDistroSDKProvider } from './GenericDistroSDKProvider';
import { IAcquisitionWorkerContext } from './IAcquisitionWorkerContext';
import { LinuxInstallType } from './LinuxInstallType';
import { DistroVersionPair } from './LinuxVersionResolver';
/* tslint:disable:no-any */

export class RedHatDistroSDKProvider extends GenericDistroSDKProvider
{
    constructor(distroVersion : DistroVersionPair, context : IAcquisitionWorkerContext, utilContext : IUtilityContext, executor : ICommandExecutor | null = null)
    {
        super(distroVersion, context, utilContext, executor);
        this.resolvePathAsSymlink = false;
    }

    protected myVersionDetails() : any
    {
        const distroVersions = this.distroJson[this.distroVersion.distro][this.distroVersionsKey];
        const targetVersion = Math.floor(parseFloat(this.distroVersion.version[0])).toFixed(1);
        const versionData = distroVersions.filter((x: { [x: string]: string; }) => x[this.versionKey] === String(targetVersion));
        return versionData;
    }

    public async getInstalledGlobalDotnetPathIfExists(installType : LinuxInstallType) : Promise<string | null>
    {
        this.commandRunner.returnStatus = true;
        const commandResult = await this.commandRunner.executeMultipleCommands(this.myDistroCommands(this.currentInstallPathCommandKey));
        this.commandRunner.returnStatus = false;

        if (commandResult[0] !== '0'){
            return '';
        }
        const verboseCommandResult = await this.commandRunner.executeMultipleCommands(this.myDistroCommands(this.currentInstallPathCommandKey));
        return verboseCommandResult[0];
    }
}