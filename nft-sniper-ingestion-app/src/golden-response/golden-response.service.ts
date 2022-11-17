import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as fs from 'fs';
import { isEmpty } from 'lodash';
import * as path from 'path';
import * as qs from 'qs';

console.log(`
You're using the GoldenResponseService. 
If there is no golden response file, one will be created.
If any of the responses are missing, you will need to delete the file
`);

/**
 * A service for creating golden tests by capturing and saving axios responses.
 * The method "createMock" will use Jest spys to mock the get method and return the
 * golden responses
 */
@Injectable()
export class GoldenResponseService {
  goldenDir = '/golden-responses/';

  data: Record<string, unknown> = {};

  filename!: string;

  responses!: Record<string, unknown>;

  /**
   *
   * @param axios AxiosInstance
   * @param filename The name of the file that will be created
   */
  constructor(private readonly axios: AxiosInstance, filename: string) {
    const basename = path.basename(filename);
    const filedir = path.dirname(filename);
    const dir = this.createDir(filedir);
    this.filename = dir + basename + '.json';
    try {
      this.responses = JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    } catch (e) {
      // console.log("Golden mock file doesn't exist. Will create on run..");
    }
  }

  createInterceptor() {
    // Add a response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        if (response.config.url) {
          this.data[createGetKey(response.config)] = response.data;
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
    // console.log('Reading from golden responses', this.filename);

    if (!isEmpty(this.responses)) {
      jest.spyOn(this.axios, 'get').mockImplementation((...params) => {
        const [url, config] = params;

        const key = createGetKey({ ...config, url });

        const response = this.responses[key];

        if (!response)
          throw new Error(
            "Response doesn't exist. Please delete golden file and run again",
          );

        return Promise.resolve({ data: response });
      });
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

function createGetKey(config?: AxiosRequestConfig<unknown>) {
  return config?.url + '?' + qs.stringify(config?.params);
}
