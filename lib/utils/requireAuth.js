import { store } from '../Root';
import { pingAuth } from '../actions/application';
export function requireAuth(nextState, replaceState) {
  const state = store.getState();
  const isLoggedIn = !!state.application.token;
  const isChecked = !state.application.pinged;
  if (!isLoggedIn) {
    replaceState({ nextPathname: nextState.location.pathname,pathname:'/login' });
  }
  if (isLoggedIn && isChecked)
    store.dispatch(pingAuth(state));
}
