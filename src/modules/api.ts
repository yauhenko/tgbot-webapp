import RestAPI from './rest';

const isDev = !!window.location.host.match(/(localhost|127\.|192\.|dev)/);

const backendUrl = isDev ? 'https://app-dev.copywriterbot.io' : 'https://app.copywriterbot.io';

const api = new RestAPI(backendUrl, isDev);
const botId = 1;
const botTelegramId = isDev ? 6495023612 : 1;

api.setHeadersHandler((headers) => (headers['Accept-Language'] = 'ru'));

export { api, isDev, backendUrl, botTelegramId, botId };
