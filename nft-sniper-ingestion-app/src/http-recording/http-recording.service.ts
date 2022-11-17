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
        nock.load(this.filename);
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
