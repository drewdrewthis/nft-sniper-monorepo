import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

console.log(`
You're using the GoldenResponseService. 
If there is no golden response file, one will be created.
If any of the responses are missing, you will need to delete the file
`);

@Injectable()
export class GoldenResponseService {
  goldenDir = '/golden-responses/';

  data: Record<string, unknown> = {};

  filename!: string;

  constructor(private readonly axios: AxiosInstance, filename: string) {
    const basename = path.basename(filename);
    const filedir = path.dirname(filename);
    const dir = this.createDir(filedir);
    this.filename = dir + basename + '.json';
  }

  createInterceptor() {
    // Add a response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        if (response.config.url) {
          this.data[response.config.url] = response.data;
        }

        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      },
    );
  }

  createMock() {
    console.log('Reading from golden responses', this.filename);
    // eslint-disable-next-line @typescript-eslint/no-var-requires

    try {
      const responses = JSON.parse(fs.readFileSync(this.filename, 'utf-8'));

      if (responses) {
        jest.spyOn(this.axios, 'get').mockImplementation((...params) => {
          const [url] = params;

          const response = responses[url];

          if (!response)
            throw new Error(
              "Response doesn't exist. Please delete golden file and run again",
            );

          return Promise.resolve(response);
        });

        jest.spyOn(this.axios, 'post').mockImplementation((...params) => {
          const [url] = params;

          const response = responses[url];

          if (!response)
            throw new Error(
              "Response doesn't exist. Please delete golden file and run again",
            );

          return Promise.resolve(response);
        });
      }
    } catch (e) {
      console.log("Golden mock file doesn't exist. Will create on run..");
    }
  }

  tearDown() {
    try {
      JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    } catch (e) {
      console.log('Printing to file', this.filename, this.data);

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
