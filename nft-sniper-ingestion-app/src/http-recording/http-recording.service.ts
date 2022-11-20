import * as fs from 'fs';
import * as path from 'path';
import * as nock from 'nock';

/**
 * A service for creating golden tests by capturing and saving axios responses.
 * The method "createMock" will use Jest spys to mock the get method and return the
 * golden responses
 */
export class HttpRecordingService {
  goldenDir = '/golden-responses/';

  data: string[] | nock.Definition[];

  filename!: string;

  recording!: string;

  /**
   *
   * @param filename The name of the file that will be created
   */
  constructor(filename: string) {
    const basename = path.basename(filename);
    const filedir = path.dirname(filename);
    const dir = this.createDir(filedir);
    this.filename = dir + basename + '.json';

    try {
      if (fs.existsSync(this.filename)) {
        console.log('Using recordings..');
        const nocks = nock.load(this.filename);

        // Handle REDACTED API KEY
        nocks.forEach(addAlchemyFilteringPath);
      } else {
        console.log('Recording..');

        nock.recorder.rec({ output_objects: true, dont_print: true });
      }
    } catch (e) {
      console.error(e);
    }
  }

  tearDown() {
    if (!fs.existsSync(this.filename)) {
      nock.restore();

      this.data = nock.recorder.play();

      // REDACT API KEY
      this.data = redactAlchemyApiKey(this.data);

      console.log('Printing to file', this.filename);

      fs.writeFileSync(this.filename, JSON.stringify(this.data), {
        encoding: 'utf8',
        flag: 'w',
      });
    }
  }

  private createDir(filedir: string) {
    const dir = filedir + this.goldenDir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    return dir;
  }
}

function addAlchemyFilteringPath(scope: nock.Scope) {
  const regex = new RegExp('/nft/v2/.*/');
  scope.filteringPath(regex, '/nft/v2/REDACTED_API_KEY/');
  return scope;
}

function redactAlchemyApiKey(data: string[] | nock.Definition[]) {
  return data.map((obj) => {
    if (typeof obj === 'string') return obj;

    if (obj.scope === 'https://eth-mainnet.g.alchemy.com:443') {
      if (typeof obj.path === 'string') {
        if (obj.path.includes('/nft/v2/')) {
          const regex = new RegExp('/nft/v2/.*/');
          console.log(obj.path.match(regex));
          obj.path = obj.path.replace(regex, '/nft/v2/REDACTED_API_KEY/');
          return obj;
        }
      }
    }

    return obj;
  }) as string[] | nock.Definition[];
}
