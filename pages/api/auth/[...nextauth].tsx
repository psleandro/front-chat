import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: 'nCRwxie92eorXxVRSJ81GRLkyVkSTKvQ',
      clientSecret:
        'B__WxMwG2fFCVE7WxsPYSOTl_SYi7BzzcxZPlqi1DQtcsWHH7eulRiahSUlWxHMd',
      issuer: 'https://dev-zmy6trko.us.auth0.com',
    }),
  ],
});
