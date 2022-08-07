import React, { useContext } from 'react';
const GlobalSettingsContext = React.createContext<{ isMobile: boolean }>({ isMobile: false });

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);

  return context;
};

interface GlobalSettingsProviderProps {
  isMobile: boolean;
  children: React.ReactNode;
}
export const GlobalSettingsProvider = (props: GlobalSettingsProviderProps) => {
  const { children, ...rest } = props;
  return (
    <GlobalSettingsContext.Provider value={{ ...rest }}>{children}</GlobalSettingsContext.Provider>
  );
};
