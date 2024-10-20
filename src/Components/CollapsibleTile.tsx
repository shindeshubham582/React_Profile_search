import React, { useCallback, useState } from "react";
import styled from 'styled-components';
import { formatDateToYYYYMMDD, getAge } from "../utils";
import deleteIcon from '../images/delete.png';
import editIcon from '../images/edit.jpeg';
import noIcon from '../images/no.png';
import yesIcon from '../images/yes.png';
import DeleteModal from "./DeleteModal";

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: #fff;
`;

const DescriptionContainer = styled.div`
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  width: 92%;
`;

const StyledDiv = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 300px;
  border: 1px solid grey;
  height: max-content;
  padding: 10px;
  margin: 10px;
  border-radius: 12px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
`;

const StyledInput = styled.input<{ isEditing: boolean; fontWeight?: number }>`
  border: ${({ isEditing }) => (isEditing ? 1 : 0)}px solid grey;
  border-radius: 6px;
  font-size: 10px;
  font-weight: ${({ fontWeight = 700 }) => fontWeight};
`;

const DescriptionInput = styled.textarea<{ isEditing: boolean }>`
  border: ${({ isEditing }) => (isEditing ? 1 : 0)}px solid grey;
  border-radius: 6px;
  height: 100px;
  font-size: 10px;
  resize: none;
`;

const StyledImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
`;

const StyledSelect = styled.select<{ isEditing: boolean }>`
  border: ${({ isEditing }) => (isEditing ? 1 : 0)}px solid grey;
  border-radius: 6px;
  font-size: 10px;
`;

const StyledOptions = styled.option`
  border: 1px solid grey;
  background: white;
`;

const StyledLabel = styled.span`
  color: grey;
  font-size: 12px;
`;

const StyledCollapsedButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 20px;
  gap: 6px;
`;

const StyledButton = styled.button`
  background-color: transparent;
  width: 20px;
  border: none;
  cursor: pointer;
  padding: 5px;
  
  &:disabled {
    opacity: 0.5; // Reduced opacity when disabled
    cursor: not-allowed; // Change cursor to indicate the button is not clickable
  }
`;

const StyledButtonImage = styled.img`
  width: 20px;
  height: 20px;
`;

// Define the props for the CollapsibleTile component
interface UserData {
  id: number;
  picture: string;
  first: string;
  last: string;
  dob: string;
  gender: string;
  country: string;
  description: string;
  email: string;
}

interface CollapsibleTileProps {
  userData: UserData;
  isOpen: boolean;
  setOpenTildeId: (id: number | null) => void;
  updateTileData: (id: number, action: string, data?: any) => void;
}

export const CollapsibleTile: React.FC<CollapsibleTileProps> = ({ userData, isOpen, setOpenTildeId, updateTileData }) => {
  const {
    id,
    picture,
    first,
    last,
    dob,
    email,
  } = userData;

  const [name, setName] = useState<string>(`${first} ${last}`);
  const [age, setAge] = useState<number>(getAge(dob));
  const [gender, setGender] = useState<string>(userData.gender);
  const [country, setCountry] = useState<string>(userData.country);
  const [description, setDescription] = useState<string>(userData.description);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAnyThingChanged, setIsAnyThingChanged] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onCancelClick = () => {
    setIsAnyThingChanged(false);
    setIsEditing(false);
    setName(`${first} ${last}`);
    setAge(getAge(dob));
    setGender(userData.gender);
    setCountry(userData.country);
    setDescription(userData.description);
  };

  const onSaveClicked = () => {
    const index = name.indexOf(' ');

    const beforeSpace = name.substring(0, index);
    const afterSpace = name.substring(index + 1);
    const updatedYear = new Date().getFullYear() - age;
    const updatedDob = `${updatedYear}-${dob.split('-')[1]}-${dob.split('-')[2]}`;
    const updatedData = {
      first: beforeSpace,
      last: afterSpace,
      dob: formatDateToYYYYMMDD(updatedDob),
      gender,
      country,
      description,
    };
    updateTileData(id, 'edit', updatedData);
    setIsAnyThingChanged(false);
    setIsEditing(false);
  };
  const onCollapsedClick = useCallback(() => {
    isOpen ? setOpenTildeId(null) : setOpenTildeId(id);
}, [isOpen, id]);

  return (
    <StyledDiv>
      <HeaderContainer>
        <StyledImage src={picture} alt="Profile" className="profile-image" />
        <StyledInput
          isEditing={isEditing}
          id='nameInput'
          type="text"
          placeholder="name"
          fontWeight={700}
          value={name}
          onChange={(e) => {
            setIsAnyThingChanged(true);
            setName(e.target.value);
          }}
          disabled={!isEditing}
        />
        <StyledCollapsedButton onClick={onCollapsedClick}>
          {isOpen ? '▼' : '▲'}
        </StyledCollapsedButton>
      </HeaderContainer>
      {isOpen && (
        <>
          <Container>
            <OptionsContainer>
              <StyledLabel>Age</StyledLabel>
              <StyledInput
                isEditing={isEditing}
                id='ageInput'
                type="text"
                inputMode="numeric"
                max="120"
                placeholder="age"
                value={age}
                disabled={!isEditing}
                onChange={(e) => {
                  setIsAnyThingChanged(true);
                  setAge(Number(e.target.value)); // Ensure age is a number
                }}
              />
            </OptionsContainer>
            <OptionsContainer>
              <StyledLabel>Gender</StyledLabel>
              <StyledSelect
                isEditing={isEditing}
                name="gender"
                id="gender"
                value={gender}
                disabled={!isEditing}
                onChange={(e) => {
                  setIsAnyThingChanged(true);
                  setGender(e.target.value);
                }}
              >
                <StyledOptions value="male">Male</StyledOptions>
                <StyledOptions value="female">Female</StyledOptions>
                <StyledOptions value="other">Other</StyledOptions>
              </StyledSelect>
            </OptionsContainer>
            <OptionsContainer>
              <StyledLabel>Country</StyledLabel>
              <StyledInput
                isEditing={isEditing}
                id='countryInput'
                type="text"
                max="120"
                placeholder="country"
                value={country}
                disabled={!isEditing}
                onChange={(e) => {
                  setIsAnyThingChanged(true);
                  setCountry(e.target.value);
                }}
              />
            </OptionsContainer>
          </Container>
          <DescriptionContainer>
            <StyledLabel>Description</StyledLabel>
            <DescriptionInput
              isEditing={isEditing}
              id='descriptionInput'
              value={description}
              disabled={!isEditing}
              onChange={(e) => {
                setIsAnyThingChanged(true);
                setDescription(e.target.value);
              }}
            />
          </DescriptionContainer>
          {isEditing ? (
            <ButtonContainer>
              <StyledButton onClick={onSaveClicked} disabled={!isAnyThingChanged}>
                <StyledButtonImage src={yesIcon} alt="save" />
              </StyledButton>
              <StyledButton onClick={onCancelClick}>
                <StyledButtonImage src={noIcon} alt="cancel" />
              </StyledButton>
            </ButtonContainer>
          ) : (
            <ButtonContainer>
              <StyledButton onClick={() => setIsModalOpen(true)}>
                <StyledButtonImage src={deleteIcon} alt="delete" />
              </StyledButton>
              <StyledButton onClick={() => setIsEditing(true)}>
                <StyledButtonImage src={editIcon} alt="edit" />
              </StyledButton>
            </ButtonContainer>
          )}
          <DeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={() => updateTileData(id, 'delete')}
          />
        </>
      )}
    </StyledDiv>
  );
};
