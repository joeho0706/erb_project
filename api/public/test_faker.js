const { faker } = require('@faker-js/faker');
// or, if desiring a different locale
// const { fakerDE: faker } = require('@faker-js/faker');

const randomAvatar = faker.image.avatar();
console.log('🚀 ~ randomAvatar:', randomAvatar);
const randomName = faker.person.fullName(); // Rowan Nikolaus
console.log('🚀 ~ randomName:', randomName);
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
console.log('🚀 ~ randomEmail:', randomEmail);
