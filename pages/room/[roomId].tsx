import { parseCookies, setCookie } from 'nookies';
import { Room as RoomComponent } from '../../src/components/Room';
import { firebaseAdmin } from '../../src/services/firebaseAdmin';

function Room() {
  return <RoomComponent />;
}

export default Room;

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const accessToken = cookies['@audio-meet/accessToken'];

  if (accessToken) {
    const token = await firebaseAdmin.auth().verifyIdToken(accessToken);

    if (!token) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
      return {};
    }
  } else {
    setCookie(ctx, '@audio-meet/previousPath', ctx.req.url, {
      path: '/',
      maxAge: 60 * 60, // 1h,
    });

    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();
  }

  return {
    props: {},
  };
}
