import './App.css';
import data from './mock.json';
import { CollapsibleTile } from './Components/CollapsibleTile';
import { useState } from 'react';
import SearchComponent from './Components/Search';
import styled from 'styled-components';
import React from 'react';

interface UserData {
    id: number;
    first: string;
    last: string;
    dob: string;
    country: string;
    description: string;
    picture: string;  // Add this property
    gender: string;   // Add this property
    email: string;    // Add this property
    [key: string]: any; // Allows for additional properties
}


const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`;

const App: React.FC<{}> = () => {
  const [openTileId, setOpenTileId] = useState<number | null>(null);
  const [clientData, setClientData] = useState<UserData[]>(data as UserData[]);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const updateTileData = (userId: number, operation: string, data?: Partial<UserData>) => {
    if (operation === 'delete') {
      setClientData((prevClientData) => prevClientData.filter(({ id }) => id !== userId));
    } else if (data) {
      setClientData((previousTileData) => {
        const index = previousTileData.findIndex(({ id }) => id === userId);
        if (index !== -1) {
          previousTileData[index] = { ...previousTileData[index], ...data };
        }
        return [...previousTileData];
      });
    }
  };

  const changeOpenTileId = (id: number | null) => {
    setOpenTileId(id);
  };

  return (
    <Container>
      <SearchComponent onSearch={handleSearch} />
      <div>
        {clientData.map((userData) => {
          const { id } = userData;
          return (
            Object.values(userData).some((value) =>
              String(value).toLowerCase().includes(searchValue.toLowerCase())
            ) && (
              <CollapsibleTile
                key={id}
                userData={userData}
                isOpen={id === openTileId}
                updateTileData={updateTileData}
                setOpenTildeId={changeOpenTileId}
              />
            )
          );
        })}
      </div>
    </Container>
  );
};

export default App;
