/* eslint-disable no-console */

import { HEALTH_CHECK_URL } from '@/config/server-config';

/**
 * This file contains server logs that are visible only to the Dev/DevOps teams.
 * These logs are useful for identifying issues or improving the existing implementation.
 *
 * Note: Please do not add/remove the console logs used in this file.
 */
let domainMap: Record<string, number> | null = null;
let lastCached = 0;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cacheDuration = 1000 * 60 * 10; // 10 MIN.
  const now = new Date().getTime();
  const isCacheExpired = now - lastCached > cacheDuration;
  const isHealthCheckCall = event.node.req.url === HEALTH_CHECK_URL;

  if (!isHealthCheckCall) {
    if (domainMap === null || isCacheExpired) {
      lastCached = now; // Resetting the time before fetching the content
      domainMap = await $fetch<Record<string, number>>(config.DOMAIN_MAP_FILE);
      console.log('Fetched domainMap', domainMap);
    }
    domainMap = domainMap || {};
    const domain = event.node.req.headers.host || 'www.premiummotor.se';
    const id = domainMap[domain] || 1007;
    event.context.appIdentity = { domain, id };
    console.log('AppIdentity DM', event.context.appIdentity);
    addDomainCookie(domain);
  }

  function addDomainCookie(domain: string) {
    const date = new Date(new Date().getTime() + 1000 * 60 * 60);
    setCookie(event, 'host', domain, {
      secure: false,
      httpOnly: false,
      path: '/',
      expires: date,
    });
  }
});
