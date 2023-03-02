const products = [
  {
    code: '001A',
    description: 'Neumático estándar',
    price: 12.65,
  },
  {
    code: '001B',
    description: 'Llanta de neumático',
    price: 10.5,
  },
  {
    code: '001C',
    description: 'Filtro antipolución',
    price: 11.45,
  },
  {
    code: '001D',
    description: 'Bugía',
    price: 5.35,
  },
  {
    code: '001E',
    description: 'Kit luces de recambio',
    price: 24.99,
  },
];

const employees = [
  {
    name: 'Eustaquio',
    surnames: 'Paredes',
    identificationNumber: '45632118L',
    birthdate: new Date('01-02-1996'),
  },
  {
    name: 'Pedro',
    surnames: 'Porro',
    identificationNumber: '47582118J',
    birthdate: new Date('11-04-1989'),
  },
  {
    name: 'Paco',
    surnames: 'Porras',
    identificationNumber: '45893218L',
    birthdate: new Date('11-21-1975'),
  },
];

const vehicles = [
  {
    model: 'Citroen C4',
    carplate: '1453JHK',
    revisions: [],
  },
  {
    model: 'Peugeot 206',
    carplate: '6970BFX',
    revisions: [],
  },
  {
    model: 'Renault Austral',
    carplate: '1234ABC',
    revisions: [],
  },
  {
    model: 'Audi A3',
    carplate: '4321CBA',
    revisions: [],
  },
  {
    model: 'Tesla Model 3',
    carplate: '9876LKJ',
    revisions: [],
  },
];

module.exports = { products, employees, vehicles };
