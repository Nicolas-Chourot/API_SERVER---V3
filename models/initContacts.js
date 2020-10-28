exports.initContacts = function (){
    const ContactsRepository = require('./Repository.js');
    const Contact = require('./Contact');
    const contactsRepository = new ContactsRepository("contacts");
    contactsRepository.add(new Contact('Nicolas Chourot','Nicolas.Chourot@clg.qc.ca','450 430-3120'));
    contactsRepository.add(new Contact('Joel Dusablon','Joel.Dusablon@clg.qc.ca','450 430-3120'));
    contactsRepository.add(new Contact('Patrice Roy','Patrice.Roy@clg.qc.ca','450 430-3120')); 
    contactsRepository.add({
        Id : 0,
        Name: 'Warda Moussadak',
        Email: 'Warda.Moussadak@clg.qc.ca',
        Phone: '450 430-3120'
      });
      contactsRepository.add({
        Id : 0,
        Name: 'Stéphane Chassé',
        Email: 'Stephane.Chasse@clg.qc.ca',
        Phone: '450 430-3120'
    });
}