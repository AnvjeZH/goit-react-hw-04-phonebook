import { Component } from 'react';
import css from './App.module.css';
import { nanoid } from 'nanoid';
import ContactForm from './ContactForm/ContactForm';
import ContactsList from './ContactsList/ContactsList';
import Filter from './Filter/Filter';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(savedContacts)

    if(parsedContacts) {
      this.setState(({contacts: parsedContacts}))
    }

  }

  componentDidUpdate(prevProps, prevState) {
    const {contacts} = this.state
    if(prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts))
    }
  }

  addNewContact = (name, number) => {
    const duplicateName = this.state.contacts.find(
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

    this.setState(({ contacts }) => ({
      contacts: [newContact, ...contacts],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  getFilteredContact = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  deleteContact = filteredId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== filteredId),
    }));
  };

  render() {
    const filteredContact = this.getFilteredContact();

    return (
      <div className={css.container}>
        <h1 className={css.main_title}>Phonebook</h1>
        <ContactForm onSubmit={this.addNewContact} />
        {this.state.contacts.length > 0 && (
          <div>
            <h2 className={css.subtitle}>Contacts</h2>
            <Filter value={this.state.filter} onChange={this.changeFilter} />
            <ContactsList
              contacts={filteredContact}
              onDelete={this.deleteContact}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
