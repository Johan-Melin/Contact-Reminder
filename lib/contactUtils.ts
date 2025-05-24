import { Contact } from '~/store/contactStore';

export interface ContactSection {
  title: string;
  data: Contact[];
}

export const groupContactsByRecency = (contacts: Contact[]): ContactSection[] => {
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const oneMonth = 30 * 24 * 60 * 60 * 1000;

  // Sort contacts by lastContact date (newest first)
  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.lastContact && b.lastContact) {
      return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
    }
    if (a.lastContact) return -1;
    if (b.lastContact) return 1;
    return 0;
  });

  // Group contacts by time periods
  const weekContacts = sortedContacts.filter(c =>
    c.lastContact && (now.getTime() - new Date(c.lastContact).getTime()) < oneWeek
  );
  
  const monthContacts = sortedContacts.filter(c =>
    c.lastContact &&
    (now.getTime() - new Date(c.lastContact).getTime()) >= oneWeek &&
    (now.getTime() - new Date(c.lastContact).getTime()) < oneMonth
  );
  
  const olderContacts = sortedContacts.filter(c =>
    c.lastContact && (now.getTime() - new Date(c.lastContact).getTime()) >= oneMonth
  );
  
  const neverContacts = sortedContacts.filter(c => !c.lastContact);

  // Create sections with non-empty groups
  return [
    { title: "Contacted last 7 days", data: weekContacts },
    { title: "Contacted last 30 days", data: monthContacts },
    { title: "Older than 30 days", data: olderContacts },
    { title: "No Last Contact Date", data: neverContacts },
  ].filter(section => section.data.length > 0);
};
