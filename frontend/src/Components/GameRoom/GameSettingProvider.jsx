import React, {createContext, useContext,useState} from 'react';
const GameSettingContext = createContext(null);

export const GameSettingProvider = ({children}) => {
    /*
        {
            title: '',
            description: ''
        }
    */
    const [gameSetting, setGameSetting] = useState(null);
    const [showSetting, setShowSetting] = useState(false)

    return (
        <GameSettingContext.Provider value={{showSetting, setShowSetting, gameSetting, setGameSetting}}>
            {children}
        </GameSettingContext.Provider>
    );
};

export const useGameSetting = () => {
    return useContext(GameSettingContext);
};
