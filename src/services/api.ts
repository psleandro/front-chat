import axios, { AxiosDefaults, AxiosInstance, HeadersDefaults } from 'axios';
import { parseCookies } from 'nookies';

const { '@audio-meet.token': accessToken } = parseCookies();

interface HeadersProps extends HeadersDefaults {
  Authorization?: string;
  Permissions?: string;
}
interface DefaultsProps extends AxiosDefaults {
  headers: HeadersProps;
}
interface AxiosProps extends AxiosInstance {
  defaults: DefaultsProps;
}

export const api: AxiosProps = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
