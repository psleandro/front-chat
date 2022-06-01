import { gql } from 'graphql-request';

export const REVALIDATE_SIGNIN = gql`
  query revalidateSignIn {
    revalidateSignIn {
      id
      account_id
      email
      name
      functionalities
      permissions
      menus {
        id
        name
        display_name
        route
        icon
      }
      menus_account {
        id
        name
        route
        icon
      }
      menu_groups {
        id
        name
        icon
        menus {
          id
          name
          display_name
          route
          icon
        }
      }
      is_temp_pass
      profiles_names
    }
  }
`;
