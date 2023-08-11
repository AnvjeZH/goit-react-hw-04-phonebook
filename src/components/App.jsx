import { useState, useEffect } from 'react';
import css from './App.module.css';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm/ContactForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './Filter/Filter';

export default function App() {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('contacts')) ?? []
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addNewContact = (name, number) => {
    const duplicateName = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicateName) {
      alert(`${name} is already in contacts.`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    setContacts(prevState => [newContact, ...prevState]);
  };

  const changeFilter = e => {
    setFilter(e.target.value);
  };

  const getFilteredContact = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  const deleteContact = filteredId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== filteredId)
    );
  };

  return (
    <div className={css.container}>
      <h1 className={css.main_title}>Phonebook</h1>
      <ContactForm onSubmit={addNewContact} />
      {contacts.length > 0 && (
        <div>
          <h2 className={css.subtitle}>Contacts</h2>
          <Filter value={filter} onChange={changeFilter} />
          <ContactsList
            contacts={getFilteredContact()}
            onDelete={deleteContact}
          />
        </div>
      )}
    </div>
  );
}
