export function toast(config: {
  title: string;
  content: string;
  animation?: boolean;
  autohide?: boolean;
  delay?: number;
}) {
  config.title = config.title || '';
  config.content = config.content || '';
  config.animation = config.animation ?? true;
  config.autohide = config.autohide ?? true;
  config.delay = config.delay ?? 3000;
  const nuxtApp = useNuxtApp();
  nuxtApp.$bus.$emit('toast', config);
}
