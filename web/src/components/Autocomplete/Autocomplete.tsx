import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Account, AccountType } from '../../../../typings/accounts';

const Base = styled('div')({
  position: 'relative',
});

const Input = styled('input')({
  outline: 'none',
  borderRadius: 7,
  paddingBottom: 10,
  paddingTop: 10,
  width: '100%',
  fontSize: 15,
  fontWeight: 500,
  textIndent: 5,
  background: '#42464A',
  border: 'none',
  color: '#fff',
  '&::placeholder': {
    color: '#B5B5B5',
  },
});

const AutocompleteContainer = styled('div')({
  marginTop: 2,
  overflowY: 'auto',
  zIndex: 1,
  background: '#42464A',
  borderRadius: 7,
});

const AutocompleteItem = styled('div')({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 0',
  paddingLeft: 10,
  cursor: 'pointer',
  '&:hover': {
    background: '#2C3036',
  },
});

export const AutocompleteGroup = styled('div')({
  fontWeight: 600,
  color: '#B5B5B5',
  paddingTop: 10,
  paddingLeft: 10,
  marginBottom: 5,
});

interface AutocompleteProps {
  data: Account[];
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ data }) => {
  const [t] = useTranslation();

  const [search, setSearch] = useState<{ text: string; options: Account[] }>({
    text: '',
    options: [],
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value) {
      const regExp = new RegExp(value, 'gi');

      const suggestions = data.filter((option) => option.accountName.match(regExp));

      console.log(suggestions);

      setSearch({ options: suggestions, text: value });
    } else {
      setSearch({ options: [], text: '' });
    }
  };

  const handleOnSelect = (value: Account) => {
    setSearch({
      text: value.accountName,
      options: [],
    });
  };

  const { options } = search;

  return (
    <Base>
      <div>
        <Input
          value={search.text}
          onChange={handleOnChange}
          placeholder={t('accounts.searchAccountsPlaceholder')}
        />
      </div>
      {options.length > 0 && (
        <AutocompleteContainer>
          <div>
            <AutocompleteGroup>Personal</AutocompleteGroup>
            {options
              .filter((acc) => acc.type === AccountType.Personal)
              .map((item: Account) => (
                <AutocompleteItem onClick={() => handleOnSelect(item)} key={item.id}>
                  {item.accountName}
                </AutocompleteItem>
              ))}
          </div>
          <div>
            <AutocompleteGroup>Shared</AutocompleteGroup>
            {options
              .filter((acc) => acc.type === AccountType.Shared)
              .map((item: Account) => (
                <AutocompleteItem onClick={() => handleOnSelect(item)} key={item.id}>
                  {item.accountName}
                </AutocompleteItem>
              ))}
          </div>
        </AutocompleteContainer>
      )}
    </Base>
  );
};
