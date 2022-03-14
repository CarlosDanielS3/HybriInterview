import { createContext } from 'react';

import {login,logout
} from '../services/auth.service';

const Context = createContext();

function AuthProvider({ children }) {
  return (
    <Context.Provider value={{ login, logout }}>
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
