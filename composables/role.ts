import type { IListResponse } from '~/interfaces/api';
import type { IUserRole, UserRole } from '~/interfaces/user';

export const useRole = defineStore('useRole', () => {
  // uses
  const api = useApi();
  const auth = useAuth();

  // states
  const roles = ref<UserRole[] | null>(null);

  // functions
  const initialize = async () => {
    return new Promise((resolve) => {
      console.debug('useRole', 'initialize');

      if (!auth.isSignedIn) {
        roles.value = null;
        resolve(true);
        return;
      }

      refreshRoles().finally(() => resolve(true));
    });
  };

  // functions
  const refreshRoles = async (refresh?: boolean) => {
    return new Promise((resolve) => {
      api
        .get<IListResponse<IUserRole> | null>('users/me/roles', {
          params: {
            refresh,
          },
        })
        .then((result) => {
          if (result.data === null) {
            roles.value = null;
            return;
          }

          roles.value = result.data.items
            .filter((e) => {
              return e.status === true;
            })
            .map((e) => {
              return e.role;
            });
        })
        .catch(console.error)
        .finally(() => resolve(true));
    });
  };

  // computed
  const verified = computed(() => {
    return roles.value != null;
  });

  const hasRoles = (_roles: UserRole[], type: 'all' | 'any' = 'any') => {
    if (roles.value) {
      if (type == 'any') {
        return (
          _roles.findIndex((e) => {
            return roles.value?.includes(e);
          }) >= 0
        );
      }

      return _roles.every((e) => {
        return roles.value?.includes(e);
      });
    }
    return false;
  };

  // changes
  watch(
    () => auth.isSignedIn,
    () => initialize(),
  );

  // lifecycle
  onMounted(() => initialize());

  // exports
  return { roles, verified, hasRoles, refreshRoles };
});
