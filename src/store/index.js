import { createStore as createReduxStore } from 'redux';

export const COUNTER_IDS = ['primary', 'secondary', 'tertiary'];

const createInitialCounters = () =>
  COUNTER_IDS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {});

const initialState = {
  counters: createInitialCounters(),
  app: {
    loading: true,
    data: null,
    pages: []
  },
  pageCache: {},
  ui: {
    navCollapsed: false
  }
};

function updateCounters(state, action) {
  const id = action.payload?.id;
  if (!id || !(id in state.counters)) return state;

  const nextValue = (() => {
    switch (action.type) {
      case 'counter/set':
        return action.payload.value;
      case 'counter/inc':
        return state.counters[id] + 1;
      case 'counter/dec':
        return state.counters[id] - 1;
      case 'counter/reset':
        return 0;
      default:
        return state.counters[id];
    }
  })();

  if (nextValue === state.counters[id]) return state;

  return {
    ...state,
    counters: {
      ...state.counters,
      [id]: nextValue
    }
  };
}

function rootReducer(state = initialState, action) {
  if (action.type.startsWith('counter/')) {
    return updateCounters(state, action);
  }

  switch (action.type) {
    case 'app/loading':
      return {
        ...state,
        app: { ...state.app, loading: true }
      };
    case 'app/loaded':
      return {
        ...state,
        app: { loading: false, data: action.payload, pages: action.payload?.pages || [] }
      };
    case 'page/loading':
      return {
        ...state,
        pageCache: {
          ...state.pageCache,
          [action.payload.id]: { loading: true, spec: null }
        }
      };
    case 'page/loaded':
      return {
        ...state,
        pageCache: {
          ...state.pageCache,
          [action.payload.id]: { loading: false, spec: action.payload.spec }
        }
      };
    case 'ui/toggle-nav':
      return {
        ...state,
        ui: {
          ...state.ui,
          navCollapsed: !state.ui.navCollapsed
        }
      };
    default:
      return state;
  }
}

export const store = createReduxStore(rootReducer);
