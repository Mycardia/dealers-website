/* eslint-disable no-console */
/**
 * This file contains server logs that are visible only to the Dev/DevOps teams.
 * These logs are useful for identifying issues or improving the existing implementation.
 *
 * Note: Please do not add/remove the console logs used in this file.
 */

import auth from 'basic-auth';
import compare from 'tsscmp';
import { HEALTH_CHECK_URL } from '@/config/server-config';

export default defineEventHandler((event) => {
  const credentials = auth(event.node.req);
  const config = useRuntimeConfig();
  const isHealthCheckCall = event.node.req.url === HEALTH_CHECK_URL;
  if (config.BASIC_AUTH && !isHealthCheckCall) {
    console.log('BASIC_AUTH_PROMPT', credentials);
    if (!credentials || !check(credentials.name, credentials.pass)) {
      event.context.basicAuthPass = false;
      event.node.res.statusCode = 401;
      event.node.res.setHeader('WWW-Authenticate', 'Basic realm="CarDealer"');
      event.node.res.setHeader('Refresh', '1');
      event.node.res.end('Access blocked!');
    } else {
      console.log('BASIC_AUTH_PROMPT_PASS', credentials);
      event.context.basicAuthPass = true;
    }
  } else {
    event.context.basicAuthPass = true;
  }

  function check(name: string, pass: string) {
    let valid = true;
    valid = compare(name, config.BASIC_AUTH_USERNAME) && valid;
    valid = compare(pass, config.BASIC_AUTH_PASSWORD) && valid;
    return valid;
  }
});
