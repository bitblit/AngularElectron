import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@bitblit/ratchet/dist/common/logger';
import { StringRatchet } from '@bitblit/ratchet/dist/common/string-ratchet';

export class ApplicationConstants {
  public static readonly VERSION_SPEC: number = 1;

  public static readonly GUID: string = StringRatchet.createType4Guid(); // Not really useful, but consistent
  private static BUILD_INFO: any;

  private constructor() {}

  public static getBuildInfo(): any {
    if (!ApplicationConstants.BUILD_INFO) {
      const pathToRead: string = path.join(__static, 'build-properties.json');
      Logger.info('Reading build info from %s (static was %s)', pathToRead, __static);
      ApplicationConstants.BUILD_INFO = JSON.parse(fs.readFileSync(pathToRead).toString());
    }
    return ApplicationConstants.BUILD_INFO;
  }

  public static isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}
