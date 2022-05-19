import { Room as RoomComponent } from '../../src/components/Room';

function Room() {
  return <RoomComponent />;
}

export default Room;

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session) {
//     context.res.writeHead(302, { Location: '/' });
//     context.res.end();
//     return {};
//   }

//   return {
//     props: {
//       user: session.user,
//     },
//   };
// }
