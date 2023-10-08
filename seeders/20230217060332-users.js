'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'user',
        email: 'user@user.com',
        password:
          '$2b$05$/qn4CW/wYU1F/F.JTDMyZeEY3eJMkTmVMKGJdhYfUX5y0e.m9l1tS', //123456
        phone: '081234567890',
        status: 'active',
        role: 'user',
      },
      {
        id: 2,
        name: 'admin',
        email: 'admin@admin.com',
        password:
          '$2b$05$/qn4CW/wYU1F/F.JTDMyZeEY3eJMkTmVMKGJdhYfUX5y0e.m9l1tS', //123456
        phone: '081234567890',
        status: 'active',
        role: 'admin',
      },
    ])
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', {
      id: [1, 2],
    })
  },
}
